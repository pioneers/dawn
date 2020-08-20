import { createSocket, Socket as UDPSocket } from 'dgram';
import { createServer, Socket as TCPSocket, Server } from 'net';
import { ipcMain } from 'electron';
import * as protos from '../../protos/protos';

import RendererBridge from '../RendererBridge';
import { updateConsole } from '../../renderer/actions/ConsoleActions';
import { runtimeDisconnect, infoPerMessage } from '../../renderer/actions/InfoActions';
import { updatePeripherals } from '../../renderer/actions/PeripheralActions';
import { Logger, defaults } from '../../renderer/utils/utils';

/**
 * Define port constants.
 */
const LISTEN_PORT = 1235;
const SEND_PORT = 9000;
const TCP_PORT = 1234;

/**
 * Define message ID constants, which must match with Runtime
 */
enum MsgType {
  RUN_MODE, START_POS, CHALLENGE_DATA, LOG, DEVICE_DATA
}

interface TCPPacket {
  messageType: MsgType,
  messageLength: number,
  payload: Buffer,
}

/**
 * Unpack TCP packet header from payload
 * as sent from Runtime.
 */
function readPacket(data: any): TCPPacket {
  const buf = Buffer.from(data);
  const header = buf.slice(0, 3);
  const msgType = header[0];
  const msgLength = new Uint16Array(header.slice(1))[0];
  const load = buf.slice(3);

  return {
    messageType: msgType,
    messageLength: msgLength,
    payload: load,
  };
}

/**
 * Create TCP packet header and prepend to
 * payload to send to Runtime.
 */
function createPacket(payload: any, messageType: MsgType): Buffer {
  let encodedPayload: any;
  switch (messageType) {
    case MsgType.DEVICE_DATA:
      encodedPayload = protos.DevData.encode(payload).finish();
      break;
    case MsgType.RUN_MODE:
      encodedPayload = protos.RunMode.encode(payload).finish();
      break;
    case MsgType.START_POS:
      encodedPayload = protos.StartPos.encode(payload).finish();
      break;
    case MsgType.CHALLENGE_DATA:
      encodedPayload = protos.Text.encode(payload).finish();
      break;
    default:
      encodedPayload = null;
      break;
  }
  const msgLength = Buffer.byteLength(encodedPayload);

  const msgTypeArr = new Uint8Array([messageType]);
  const msgLengthArr = new Uint8Array([msgLength & 0x00FF, msgLength & 0xFF00]); // Assuming little-endian byte order, since runs on x64
  const encodedPayloadArr = new Uint8Array(encodedPayload);
  return Buffer.concat([msgTypeArr, msgLengthArr, encodedPayloadArr], msgLength);
}

/**
 * Takes uid Long object (uint64) and
 * converts to String.
 */
function cleanUIDs(sensorData: any) {
  for (const index in sensorData) {
    if (sensorData[index]) {
      const uintLow = sensorData[index].uid.low;
      if (uintLow) {
        sensorData[index].uid = String(uintLow);
      } else {
        sensorData[index].uid = String(-1);
      }
    }
  }
}

class ListenSocket {
  logger: Logger;
  socket: UDPSocket;
  statusUpdateTimeout: number;

  constructor(logger: Logger) {
    this.logger = logger;
    this.statusUpdateTimeout = 0;
    this.socket = createSocket({ type: 'udp4', reuseAddr: true });

    this.close = this.close.bind(this);

    /**
     * Runtime UDP Message Handler.
     * Sets runtime connection, decodes device message,
     * cleans UIDs from uint64, and sends to sensor
     * array to reducer.
     */
    this.socket.on('message', (msg) => {
      try {
        RendererBridge.reduxDispatch(infoPerMessage());
        const sensorData: any = protos.DevData.decode(msg).devices;
        cleanUIDs(sensorData);
        this.logger.debug('Dawn received UDP sensor data');
        RendererBridge.reduxDispatch(updatePeripherals(sensorData));
      } catch (err) {
        this.logger.log('Error decoding UDP');
        this.logger.debug(err);
      }
    });

    this.socket.on('error', (err: Error) => {
      this.logger.log('UDP listening error');
      this.logger.debug(err);
    });

    this.socket.on('close', () => {
      RendererBridge.reduxDispatch(runtimeDisconnect());
      this.logger.log('UDP listening closed');
    });

    this.socket.bind(LISTEN_PORT, () => {
      this.logger.log(`UDP Bound to ${LISTEN_PORT}`);
    });
  }

  close() {
    this.socket.close();
  }
}

class SendSocket {
  logger: Logger;
  socket: UDPSocket;
  runtimeIP: string;

  constructor(logger: Logger) {
    this.logger = logger;
    this.runtimeIP = defaults.IPADDRESS;
    this.socket = createSocket({ type: 'udp4', reuseAddr: true });

    this.sendGamepadMessages = this.sendGamepadMessages.bind(this);
    this.ipAddressListener = this.ipAddressListener.bind(this);
    this.close = this.close.bind(this);

    this.socket.on('error', (err: Error) => {
      this.logger.log('UDP sending error');
      this.logger.log(err);
    });

    this.socket.on('close', () => {
      this.logger.log('UDP sending closed');
    });

    /**
     * UDP Send Socket IPC Connections
     */
    ipcMain.on('stateUpdate', this.sendGamepadMessages);
    ipcMain.on('ipAddress', this.ipAddressListener);
  }

  /**
   * IPC Connection with sagas.ts' runtimeGamepads()
   * Sends messages when Gamepad information changes
   * or when 100 ms has passed (with 50 ms cooldown)
   */
  sendGamepadMessages(event: any, data: protos.IGpState[]) {
    const message = protos.GpState.encode(data[0]).finish();
    this.logger.debug(`Dawn sent UDP to ${this.runtimeIP}`);
    this.socket.send(message, SEND_PORT, this.runtimeIP);
  }

  /**
   * IPC Connection with ConfigBox.ts' saveChanges()
   * Receives new IP Address to send messages to.
   */
  ipAddressListener(event: any, ipAddress: string) {
    this.runtimeIP = ipAddress;
  }

  close() {
    this.socket.close();
    ipcMain.removeListener('stateUpdate', this.sendGamepadMessages);
    ipcMain.removeListener('ipAddress', this.ipAddressListener);
  }
}

class TCPConn {
  logger: Logger;
  socket: TCPSocket;

  constructor(socket: TCPSocket, logger: Logger) {
    this.logger = logger;
    this.socket = socket;

    this.sendRunMode = this.sendRunMode.bind(this);
    this.sendDevicePreferences = this.sendDevicePreferences.bind(this);
    this.sendChallengeInputs = this.sendChallengeInputs.bind(this);
    this.sendRobotStartPos = this.sendRobotStartPos.bind(this);
    this.close = this.close.bind(this);

    this.logger.log('Runtime connected');
    this.socket.on('end', () => {
      this.logger.log('Runtime disconnected');
    });

    /**
     * Runtime TCP Message Handler.
     * TODO: Distinguish between challenge outputs and console logs
     * when using payload to update console
     */
    this.socket.on('data', (data) => {
      const message = readPacket(data);
      this.logger.log(`Dawn received TCP Packet ${message.messageType}`);
      let decoded: protos.Text;

      switch (message.messageType) {
        case MsgType.LOG:
          decoded = protos.Text.decode(message.payload);
          RendererBridge.reduxDispatch(updateConsole(decoded.payload));
          break;
        case MsgType.CHALLENGE_DATA:
          decoded = protos.Text.decode(message.payload);
          // TODO: Dispatch challenge outputs to redux
          break;
      }
    });
    /**
     * TCP Socket IPC Connections
     */
    ipcMain.on('runModeUpdate', this.sendRunMode);
  }

  /**
   * IPC Connection with sagas.js' exportRunMode()
   * Receives new run mode to send to Runtime
   */
  sendRunMode(event: any, data: any) {
    const mode = data.studentCodeStatus;
    const message = createPacket(mode, MsgType.RUN_MODE);
    this.socket.write(message, () => {
      this.logger.debug(`Run Mode message sent: ${mode}`);
    });
  }

  sendDevicePreferences(event: any, data: any) {
    // TODO: Get device preference filter from UI components, then sagas
    const message = createPacket(data, MsgType.DEVICE_DATA);
    this.socket.write(message, () => {
      this.logger.debug(`Device preferences sent: ${data}`);
    });
  }

  sendChallengeInputs(event: any, data: any) {
    // TODO: Get challenge inputs from UI components, then sagas
    const message = createPacket(data, MsgType.CHALLENGE_DATA);
    this.socket.write(message, () => {
      this.logger.debug(`Challenge inputs sent: ${data}`);
    });
  }

  sendRobotStartPos(event: any, data: any) {
    // TODO: Get start pos from sagas
    const message = createPacket(data, MsgType.START_POS);
    this.socket.write(message, () => {
      this.logger.debug(`Start position sent: ${data}`);
    });
  }

  close() {
    this.socket.end();
    ipcMain.removeListener('runModeUpdate', this.sendRunMode);
  }
}

class TCPServer {
  logger: Logger;
  tcp: Server;
  conn: TCPConn;

  constructor(logger: Logger) {
    this.close = this.close.bind(this);
    this.tcp = createServer((socket) => {
      this.conn = new TCPConn(socket, logger);
    });

    this.logger = logger;

    this.tcp.on('error', (err) => {
      this.logger.log('TCP error');
      this.logger.log(err);
    });

    this.tcp.listen(TCP_PORT, () => {
      this.logger.log(`Dawn listening on port ${TCP_PORT}`);
    });
  }

  close() {
    if (this.conn) {
      this.conn.close();
    }
    this.tcp.close();
  }
}

const ConnsInit: (ListenSocket|SendSocket|TCPServer)[] = [];

const Runtime = {
  conns: ConnsInit,
  logger: new Logger('runtime', 'Runtime Debug'),
  setup() {
    this.conns = [
      new ListenSocket(this.logger),
      new SendSocket(this.logger),
      new TCPServer(this.logger),
    ];
  },
  close() {
    this.conns.forEach(conn => conn.close()); // Logger's fs closes automatically
  },
};

export default Runtime;
