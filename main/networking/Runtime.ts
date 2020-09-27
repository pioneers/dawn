import { createSocket, Socket as UDPSocket } from 'dgram';
import { createServer, Socket as TCPSocket, Server, createConnection } from 'net';
import { ipcMain } from 'electron';
import * as protos from '../../protos/protos';

import RendererBridge from '../RendererBridge';
import { updateConsole } from '../../renderer/actions/ConsoleActions';
import { runtimeDisconnect, infoPerMessage } from '../../renderer/actions/InfoActions';
import { updatePeripherals } from '../../renderer/actions/PeripheralActions';
import { Logger, defaults } from '../../renderer/utils/utils';

/**
 * Define port constants, which must match with Runtime
 */
const SEND_PORT = 9000;
const TCP_PORT = 8101;

let runtimeIP = defaults.IPADDRESS;

/**
 * Define message ID constants, which must match with Runtime
 */
enum MsgType {
  RUN_MODE,
  START_POS,
  CHALLENGE_DATA,
  LOG,
  DEVICE_DATA,
}

interface TCPPacket {
  messageType: MsgType;
  messageLength: number;
  payload: Buffer;
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
  let encodedPayload: Uint8Array;
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
      console.log("ERROR: trying to create TCP Packet with type LOG")
      encodedPayload = new Uint8Array();
      break;
  }
  const msgLength = Buffer.byteLength(encodedPayload);

  const msgTypeArr = new Uint8Array([messageType]);
  const msgLengthArr = new Uint8Array([msgLength & 0x00FF, msgLength & 0xFF00]); // Assuming little-endian byte order, since runs on x64
  const encodedPayloadArr = new Uint8Array(encodedPayload);
  return Buffer.concat([msgTypeArr, msgLengthArr, encodedPayloadArr], msgLength + 3);
}


class TCPConn {
  logger: Logger;
  socket: TCPSocket;

  constructor(logger: Logger) {
    this.logger = logger;
    this.socket = new TCPSocket();

    this.ipAddressListener = this.ipAddressListener.bind(this);
    this.sendRunMode = this.sendRunMode.bind(this);
    this.sendDevicePreferences = this.sendDevicePreferences.bind(this);
    this.sendChallengeInputs = this.sendChallengeInputs.bind(this);
    this.sendRobotStartPos = this.sendRobotStartPos.bind(this);
    this.close = this.close.bind(this);

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
    ipcMain.on('ipAddress', this.ipAddressListener);
  }

    /**
   * IPC Connection with ConfigBox.ts' saveChanges()
   * Receives new IP Address to send messages to.
   */
  ipAddressListener(_event: any, ipAddress: string) {
    console.log(`Set runtime address in ipcMain ${ipAddress}`);
    runtimeIP = ipAddress; // Update IP address for both TCP and UDP connections
    this.socket.connect(TCP_PORT, runtimeIP, () => {
      this.logger.log('Runtime connected');
      this.socket.write(new Uint8Array([1])); // Runtime needs first byte to be 1 to recognize client as Dawn (instead of Shepherd)
    });
  }

  /**
   * IPC Connection with sagas.js' exportRunMode()
   * Receives new run mode to send to Runtime
   */
  sendRunMode(_event: any, data: any) {
    if (this.socket.pending) {
      return;
    }
    const mode = data.studentCodeStatus;
    const message = createPacket(mode, MsgType.RUN_MODE);
    this.socket.write(message, () => {
      this.logger.debug(`Run Mode message sent: ${mode}`);
    });
  }

  sendDevicePreferences(_event: any, data: any) {
    // TODO: Get device preference filter from UI components, then sagas
    if (this.socket.pending) {
      return;
    }
    const message = createPacket(data, MsgType.DEVICE_DATA);
    this.socket.write(message, () => {
      this.logger.debug(`Device preferences sent: ${data}`);
    });
  }

  sendChallengeInputs(_event: any, data: any) {
    // TODO: Get challenge inputs from UI components, then sagas
    if (this.socket.pending) {
      return;
    }
    const message = createPacket(data, MsgType.CHALLENGE_DATA);
    this.socket.write(message, () => {
      this.logger.debug(`Challenge inputs sent: ${data}`);
    });
  }

  sendRobotStartPos(_event: any, data: any) {
    // TODO: Get start pos from sagas
    if (this.socket.pending) {
      return;
    }
    const message = createPacket(data, MsgType.START_POS);
    this.socket.write(message, () => {
      this.logger.debug(`Start position sent: ${data}`);
    });
  }

  close() {
    this.socket.end();
    ipcMain.removeListener('runModeUpdate', this.sendRunMode);
    ipcMain.removeListener('ipAddress', this.ipAddressListener);
  }
}

class UDPConn {
  logger: Logger;
  socket: UDPSocket;

  constructor(logger: Logger) {
    this.logger = logger;
    this.socket = createSocket({ type: 'udp4', reuseAddr: true });

    this.sendGamepadMessages = this.sendGamepadMessages.bind(this);
    this.close = this.close.bind(this);

    this.socket.on('error', (err: string) => {
      this.logger.log('UDP connection error');
      this.logger.log(err);
    });

    this.socket.on('close', () => {
      RendererBridge.reduxDispatch(runtimeDisconnect());
      this.logger.log('UDP connection closed');
    });

    /**
     * Runtime UDP Message Handler.
     * Sets runtime connection, decodes device message,
     * cleans UIDs from uint64, and sends to sensor
     * array to reducer.
     */
    this.socket.on('message', (msg: Uint8Array) => {
      try {
        RendererBridge.reduxDispatch(infoPerMessage());
        const sensorData: protos.Device[] = protos.DevData.decode(msg).devices;
        RendererBridge.reduxDispatch(updatePeripherals(sensorData));
      } catch (err) {
        this.logger.log('Error decoding UDP');
        this.logger.debug(err);
      }
    });

    this.socket.bind(() => {
      this.logger.log(`UDP connection bound`);
    });

    /**
     * UDP Send Socket IPC Connections
     */
    ipcMain.on('stateUpdate', this.sendGamepadMessages);
  }

  /**
   * IPC Connection with sagas.ts' runtimeGamepads()
   * Sends messages when Gamepad information changes
   * or when 100 ms has passed (with 50 ms cooldown)
   */
  sendGamepadMessages(_event: any, data: protos.GpState[]) {
    if (data.length === 0) {
      data.push(protos.GpState.create({
        connected: false,
      }));
    }
    const message = protos.GpState.encode(data[0]).finish();
    this.logger.debug(`Dawn sent UDP to ${runtimeIP}`);
    this.socket.send(message, SEND_PORT, runtimeIP);
  }

  close() {
    this.socket.close();
    ipcMain.removeListener('stateUpdate', this.sendGamepadMessages);
  }
}

const RuntimeConnections: Array<UDPConn | TCPConn> = [];

export const Runtime = {
  conns: RuntimeConnections,
  logger: new Logger('runtime', 'Runtime Debug'),

  setup() {
    this.conns = [new UDPConn(this.logger), new TCPConn(this.logger)];
  },

  close() {
    this.conns.forEach((conn) => conn.close()); // Logger's fs closes automatically
  },
};
