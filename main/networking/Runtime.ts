import { Socket as TCPSocket } from 'net';
import { ipcMain, IpcMainEvent } from 'electron';
import * as protos from '../../protos-main';

import RendererBridge from '../RendererBridge';
import { updateConsole } from '../../renderer/actions/ConsoleActions';
import { infoPerMessage } from '../../renderer/actions/InfoActions';
import { updatePeripherals } from '../../renderer/actions/PeripheralActions';
import { Logger, defaults } from '../../renderer/utils/utils';
import { Peripheral } from '../../renderer/types';
import { setLatencyValue } from '../../renderer/actions/EditorActions';

/**
 * Define port constants, which must match with Runtime
 */
const DEFAULT_TCP_PORT = 8101;

/**
 * Runtime IP Address used for TCP and UDP connections
 */
let runtimeIP = defaults.IPADDRESS;

/**
 * Define message ID constants, which must match with Runtime
 */
enum MsgType {
  RUN_MODE = 0,
  START_POS = 1,
  LOG = 2,
  DEVICE_DATA = 3,
  // 4 reserved for some Shepherd msg type
  INPUTS = 5,
  TIME_STAMPS = 6
}

interface TCPPacket {
  type: MsgType;
  length: number;
  payload: Buffer;
}

/** Given a data buffer, read as many TCP Packets as possible.
 *  If there are leftover bytes, return them so that they can be used in the next cycle of data.
 */
function readPackets(data: Buffer, previousLeftoverBytes?: Buffer): { leftoverBytes?: Buffer; processedTCPPackets: TCPPacket[] } {
  const HEADER_NUM_BYTES = 3;

  const bytesToRead = Buffer.concat([previousLeftoverBytes ?? new Uint8Array(), data]);
  const processedTCPPackets: TCPPacket[] = [];

  let leftoverBytes;
  let currentPos = 0;

  while (currentPos < bytesToRead.length) {
    let header: Buffer;
    let msgType: number;
    let msgLength: number;
    let payload: Buffer;

    if (currentPos + HEADER_NUM_BYTES <= bytesToRead.length) {
      // Have enough bytes to read in 3 byte header
      header = bytesToRead.slice(currentPos, currentPos + HEADER_NUM_BYTES);
      msgType = header[0];
      msgLength = (header[2] << 8) | header[1];
    } else {
      // Don't have enough bytes to read 3 byte header so we save the bytes for the next data cycle
      leftoverBytes = bytesToRead.slice(currentPos);

      return {
        leftoverBytes,
        processedTCPPackets
      };
    }

    currentPos += HEADER_NUM_BYTES;

    if (currentPos + msgLength <= bytesToRead.length) {
      // Have enough bytes to read entire payload from 1 TCP packet
      payload = bytesToRead.slice(currentPos, currentPos + msgLength);
    } else {
      // Don't have enough bytes to read entire payload
      leftoverBytes = bytesToRead.slice(currentPos);

      return {
        // Note: Need to save header so we know how many bytes to read for this packet in the next data cycle
        leftoverBytes: Buffer.concat([header, leftoverBytes]),
        processedTCPPackets
      };
    }

    const newTCPPacket = { type: msgType, length: msgLength, payload };
    processedTCPPackets.push(newTCPPacket);

    currentPos += msgLength;
  }

  return {
    leftoverBytes,
    processedTCPPackets
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
    case MsgType.TIME_STAMPS:
      encodedPayload = protos.TimeStamps.encode(payload as protos.ITimeStamps).finish();
      break;
    case MsgType.INPUTS:
      encodedPayload = protos.UserInputs.encode({ inputs: payload as protos.Input[] }).finish();
      break;
    default:
      console.log('ERROR: trying to create TCP Packet with unknown message type');
      encodedPayload = new Uint8Array();
      break;
  }

  const msgLength = Buffer.byteLength(encodedPayload);
  const msgLengthArr = new Uint8Array([msgLength & 0x00ff, msgLength & 0xff00]); // Assuming little-endian byte order, since runs on x64
  const msgTypeArr = new Uint8Array([messageType]);

  return Buffer.concat([msgTypeArr, msgLengthArr, encodedPayload], msgLength + 3);
}

class RuntimeConnection {
  logger: Logger;
  socket: TCPSocket;
  leftoverBytes: Buffer | undefined;

  constructor(logger: Logger) {
    this.logger = logger;
    this.socket = new TCPSocket();

    // Connect to most recent IP
    setInterval(() => {
      if (!this.socket.connecting && this.socket.pending) {
        if (runtimeIP !== defaults.IPADDRESS) {
          let port = DEFAULT_TCP_PORT;
          let ip = runtimeIP;
          if (runtimeIP.includes(':')) {
            const split = runtimeIP.split(':');
            ip = split[0];
            port = Number(split[1]);
          }
          console.log(`RuntimeConnection: Trying to TCP connect to ${ip}:${port}`);
          this.socket.connect(port, ip);
        }
      }
    }, 1000);

    this.socket.on('connect', () => {
      this.logger.log('Runtime connected');
      this.socket.write(new Uint8Array([1])); // Runtime needs first byte to be 1 to recognize client as Dawn (instead of Shepherd)
    });

    this.socket.on('end', () => {
      // RendererBridge.reduxDispatch(runtimeDisconnect());
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
      const { leftoverBytes, processedTCPPackets } = readPackets(data, this.leftoverBytes);

      for (const packet of processedTCPPackets) {
        let decoded;

        switch (packet.type) {
          case MsgType.LOG:
            decoded = protos.Text.decode(packet.payload);
            RendererBridge.reduxDispatch(updateConsole(decoded.payload));
            break;

          case MsgType.TIME_STAMPS:
            decoded = protos.TimeStamps.decode(packet.payload);
            const oneWayLatency = (Date.now() - Number(decoded.dawnTimestamp)) / 2;

            // TODO: we can probably do an average of n timestamps so the display doesn't change too frequently
            RendererBridge.reduxDispatch(setLatencyValue(oneWayLatency));
            break;

          case MsgType.DEVICE_DATA:
            try {
              RendererBridge.reduxDispatch(infoPerMessage());
              const sensorData: protos.Device[] = protos.DevData.decode(packet.payload).devices;
              const peripherals: Peripheral[] = [];

              // Need to convert protos.Device to Peripheral here because when dispatching to the renderer over IPC,
              // some of the inner properties (i.e. device.uid which is a Long) loses its prototype, which means any
              // data we are sending over through IPC should be serializable.
              // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
              sensorData.forEach((device) => {
                // There is a weird bug that happens with the protobufs decoding when device.type is specifically 0
                // where the property can be accessed but when trying to view object contents, the property doesn't exist.
                // Below is a way to get around this problem.
                if (device.type.toString() === '0') {
                  device.type = 0;
                }
                peripherals.push({ ...device, uid: device.uid.toString() });
              });
              RendererBridge.reduxDispatch(updatePeripherals(peripherals));
            } catch (err) {
              this.logger.log(err);
            }
            break;

          default:
            this.logger.log(`Unsupported received message type: ${packet.type}`)
        }
      }

      this.leftoverBytes = leftoverBytes;
    });

    /**
     * TCP Socket IPC Connections
     */
    ipcMain.on('runModeUpdate', (event: IpcMainEvent, ...args: any[]) => this.whenConnectionEstablished(this.sendRunMode, event, ...args));
    ipcMain.on('initiateLatencyCheck', (event: IpcMainEvent, ...args: any[]) =>
      this.whenConnectionEstablished(this.initiateLatencyCheck, event, ...args)
    );
    ipcMain.on('stateUpdate', (event: IpcMainEvent, ...args: any[]) => this.whenConnectionEstablished(this.sendInputs, event, ...args));

    ipcMain.on('ipAddress', this.ipAddressListener);
  }

  whenConnectionEstablished = (cb: (event: IpcMainEvent, ...args: any[]) => void, event: IpcMainEvent, ...args: any[]) => {
    if (this.socket.pending) {
      return;
    }

    return cb(event, ...args);
  };

  /**
   * Initiates latency check by sending first packet to Runtime
   */
  initiateLatencyCheck = (_event: IpcMainEvent, data: protos.ITimeStamps) => {
    const message = createPacket(data, MsgType.TIME_STAMPS);
    this.socket.write(message, () => {
      this.logger.log(`Sent timestamp data to runtime: ${JSON.stringify(data)}`);
    });
  };

  /**
   * IPC Connection with ConfigBox.ts' saveChanges()
   * Receives new IP Address to send messages to.
   */
  ipAddressListener = (_event: IpcMainEvent, ipAddress: string) => {
    if (ipAddress != runtimeIP) {
      console.log(`RuntimeConnection - Switching IP from ${runtimeIP} to ${ipAddress}`);
      if (this.socket.connecting || !this.socket.pending) {
        this.socket.end();
      }
      runtimeIP = ipAddress;
    }
  };

  // TODO: We can possibly combine below methods into single handler.

  /**
   * IPC Connection with sagas.js' exportRunMode()
   * Receives new run mode to send to Runtime
   */
  sendRunMode = (_event: IpcMainEvent, runModeData: protos.IRunMode) => {
    const message = createPacket(runModeData, MsgType.RUN_MODE);
    this.socket.write(message, () => {
      this.logger.log(`Run Mode message sent: ${JSON.stringify(runModeData)}`);
    });
  };

  sendDevicePreferences = (_event: IpcMainEvent, deviceData: protos.IDevData) => {
    // TODO: Serialize uid from string -> Long type
    const message = createPacket(deviceData, MsgType.DEVICE_DATA);
    this.socket.write(message, () => {
      this.logger.log(`Device preferences sent: ${deviceData.toString()}`);
    });
  };

  sendRobotStartPos = (_event: IpcMainEvent, startPosData: protos.IStartPos) => {
    // TODO: Get start pos from sagas
    const message = createPacket(startPosData, MsgType.START_POS);
    this.socket.write(message, () => {
      this.logger.log(`Start position sent: ${startPosData.toString()}`);
    });
  };

  sendInputs = (_event: IpcMainEvent, data: protos.Input[], source: protos.Source) => {
    if (data.length === 0) {
      data.push(
        protos.Input.create({
          connected: false,
          source
        })
      );
    }
    const message = createPacket(data, MsgType.INPUTS);
    this.socket.write(message, (err?: Error) => {
      if (err !== undefined) {
        this.logger.log(`Error when sending inputs: ${JSON.stringify(err)}`);
      }
    });
  };

  close = () => {
    this.socket.end();
    ipcMain.removeListener('runModeUpdate', this.sendRunMode);
    ipcMain.removeListener('ipAddress', this.ipAddressListener);
    ipcMain.removeListener('initiateLatencyCheck', this.initiateLatencyCheck);
    ipcMain.removeListener('stateUpdate', this.sendInputs);
  };
}

const RuntimeConnections: Array<RuntimeConnection> = [];

export const Runtime = {
  conns: RuntimeConnections,
  logger: new Logger('runtime', 'Runtime Debug'),

  setup() {
    this.conns = [new RuntimeConnection(this.logger)];
  },

  close() {
    this.conns.forEach((conn) => conn.close()); // Logger's fs closes automatically
  }
};
