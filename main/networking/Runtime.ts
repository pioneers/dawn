import { createSocket, Socket as UDPSocket } from 'dgram';
import { Socket as TCPSocket } from 'net';
import { ipcMain, IpcMainEvent } from 'electron';
import * as protos from '../../protos/protos';

import RendererBridge from '../RendererBridge';
import { updateConsole } from '../../renderer/actions/ConsoleActions';
import { runtimeDisconnect, infoPerMessage } from '../../renderer/actions/InfoActions';
import { updatePeripherals } from '../../renderer/actions/PeripheralActions';
import { Logger, defaults } from '../../renderer/utils/utils';

/**
 * Define port constants, which must match with Runtime
 */
const UDP_SEND_PORT = 9000;
const UDP_LISTEN_PORT = 9001;
const TCP_PORT = 8101;

/**
 * Runtime IP Address used for TCP and UDP connections
 */
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
function createPacket(payload: unknown, messageType: MsgType): Buffer {
  let encodedPayload: Uint8Array;
  switch (messageType) {
    case MsgType.DEVICE_DATA:
      encodedPayload = protos.DevData.encode(payload as protos.IDevData).finish();
      break;
    case MsgType.RUN_MODE:
      encodedPayload = protos.RunMode.encode(payload as protos.IRunMode).finish();
      break;
    case MsgType.START_POS:
      encodedPayload = protos.StartPos.encode(payload as protos.IStartPos).finish();
      break;
    case MsgType.CHALLENGE_DATA:
      encodedPayload = protos.Text.encode(payload as protos.IText).finish();
      break;
    default:
      console.log('ERROR: trying to create TCP Packet with type LOG');
      encodedPayload = new Uint8Array();
      break;
  }
  const msgLength = Buffer.byteLength(encodedPayload);

  const msgTypeArr = new Uint8Array([messageType]);
  const msgLengthArr = new Uint8Array([msgLength & 0x00ff, msgLength & 0xff00]); // Assuming little-endian byte order, since runs on x64
  const encodedPayloadArr = new Uint8Array(encodedPayload);

  return Buffer.concat([msgTypeArr, msgLengthArr, encodedPayloadArr], msgLength + 3);
}

class TCPConn {
  logger: Logger;
  socket: TCPSocket;

  constructor(logger: Logger) {
    this.logger = logger;
    this.socket = new TCPSocket();

    this.socket.setTimeout(5000);

    setInterval(() => {
      if (!this.socket.connecting && this.socket.pending) {
        console.log('Trying to TCP connect to ', runtimeIP);
        if (runtimeIP !== defaults.IPADDRESS) {
          this.socket.connect(TCP_PORT, runtimeIP, () => {
            this.logger.log('Runtime connected');
            this.socket.write(new Uint8Array([1])); // Runtime needs first byte to be 1 to recognize client as Dawn (instead of Shepherd)
          });
        }
      }
    }, 1000);

    this.socket.on('end', () => {
      this.logger.log('Runtime disconnected');
    });

    this.socket.on('error', (err: string) => {
      this.logger.log(err);
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
  ipAddressListener = (_event: IpcMainEvent, ipAddress: string) => {
    runtimeIP = ipAddress;
  };

  // TODO: We can possibly combine below methods into single handler.

  /**
   * IPC Connection with sagas.js' exportRunMode()
   * Receives new run mode to send to Runtime
   */
  sendRunMode = (_event: IpcMainEvent, runModeData: protos.IRunMode) => {
    if (this.socket.pending) {
      return;
    }

    const message = createPacket(runModeData, MsgType.RUN_MODE);
    this.socket.write(message, () => {
      this.logger.debug(`Run Mode message sent: ${runModeData.toString()}`);
    });
  };

  sendDevicePreferences = (_event: IpcMainEvent, deviceData: protos.IDevData) => {
    // TODO: Get device preference filter from UI components, then sagas
    if (this.socket.pending) {
      return;
    }

    // TODO: Serialize uid from string -> Long type
    const message = createPacket(deviceData, MsgType.DEVICE_DATA);
    this.socket.write(message, () => {
      this.logger.debug(`Device preferences sent: ${deviceData.toString()}`);
    });
  };

  sendChallengeInputs = (_event: IpcMainEvent, textData: protos.IText) => {
    // TODO: Get challenge inputs from UI components, then sagas
    if (this.socket.pending) {
      return;
    }

    const message = createPacket(textData, MsgType.CHALLENGE_DATA);
    this.socket.write(message, () => {
      this.logger.debug(`Challenge inputs sent: ${textData.toString()}`);
    });
  };

  sendRobotStartPos = (_event: IpcMainEvent, startPosData: protos.IStartPos) => {
    // TODO: Get start pos from sagas
    if (this.socket.pending) {
      return;
    }

    const message = createPacket(startPosData, MsgType.START_POS);
    this.socket.write(message, () => {
      this.logger.debug(`Start position sent: ${startPosData.toString()}`);
    });
  };

  close = () => {
    this.socket.end();
    ipcMain.removeListener('runModeUpdate', this.sendRunMode);
    ipcMain.removeListener('ipAddress', this.ipAddressListener);
  };
}

/**
 * UDPConn contains socket methods for both sending to and receiving from Runtime.
 */
class UDPConn {
  logger: Logger;
  socket: UDPSocket;

  constructor(logger: Logger) {
    this.logger = logger;

    this.socket = createSocket({ type: 'udp4', reuseAddr: true });

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
     * In other words, this is where we handle data that we receive from Runtime.
     * Sets runtime connection, decodes device message, cleans UIDs from uint64, and sends sensor data array to reducer.
     */
    this.socket.on('message', (msg: Uint8Array) => {
      try {
        RendererBridge.reduxDispatch(infoPerMessage());
        const sensorData: protos.Device[] = protos.DevData.decode(msg).devices;

        sensorData.forEach((device) => {
          if (device.uid.toString() === '0') {
            device.uid = 0;
          }
        });

        RendererBridge.reduxDispatch(updatePeripherals(sensorData));
      } catch (err) {
        this.logger.log('Error decoding UDP');
        this.logger.log(err);
      }
    });

    this.socket.bind(UDP_LISTEN_PORT, () => {
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
  sendGamepadMessages = (_event: IpcMainEvent, data: protos.GpState[]) => {
    if (data.length === 0) {
      data.push(
        protos.GpState.create({
          connected: false,
        })
      );
    }

    const message = protos.GpState.encode(data[0]).finish();
    this.logger.debug(`Dawn sent UDP to ${runtimeIP}`);
    this.socket.send(message, UDP_SEND_PORT, runtimeIP);
  };

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
