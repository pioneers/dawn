import { createSocket, Socket as UDPSocket } from 'dgram';
import { Socket as TCPSocket } from 'net';
import { ipcMain, IpcMainEvent } from 'electron';
import * as protos from '../../protos/protos';

import RendererBridge from '../RendererBridge';
import { updateConsole } from '../../renderer/actions/ConsoleActions';
import { runtimeDisconnect, infoPerMessage } from '../../renderer/actions/InfoActions';
import { updatePeripherals } from '../../renderer/actions/PeripheralActions';
import { Logger, defaults } from '../../renderer/utils/utils';
import { Peripheral } from '../../renderer/types';

/**
 * Define port constants, which must match with Runtime
 */
const UDP_SEND_PORT = 9000;
const UDP_LISTEN_PORT = 9001;
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
  CHALLENGE_DATA = 2,
  LOG = 3,
  DEVICE_DATA = 4,
  // 5 reserved for some Shepherd msg type
  INPUTS = 6
}

interface TCPPacket {
  type: MsgType;
  length: number;
  payload: Buffer;
}

/** Given a data buffer, read as many TCP Packets as possible.
 *  If there are leftover bytes, return them so that they can be used in the next cycle of data.
 */
function readPackets(
  data: Buffer,
  previousLeftoverBytes?: Buffer
): {
  leftoverBytes: Buffer | undefined;
  processedTCPPackets: TCPPacket[];
} {
  const bytesToRead = Buffer.concat([previousLeftoverBytes ?? new Uint8Array(), data]);
  let leftoverBytes;
  let i = 0;
  const processedTCPPackets: TCPPacket[] = [];

  while (i < bytesToRead.length) {
    let header;
    let msgType;
    let msgLength;
    let payload: Buffer;

    if (i + 3 <= bytesToRead.length) {
      // Have enough bytes to read in 3 byte header
      header = bytesToRead.slice(i, i + 3);
      msgType = header[0];
      msgLength = new Uint16Array(header.slice(1))[0];
    } else {
      // Don't have enough bytes to read 3 byte header so we save the bytes for the next data cycle
      leftoverBytes = bytesToRead.slice(i);

      return {
        leftoverBytes,
        processedTCPPackets
      };
    }

    i += 3;

    if (i + msgLength <= bytesToRead.length) {
      // Have enough bytes to read entire payload from 1 TCP packet
      payload = bytesToRead.slice(i, i + msgLength);
    } else {
      // Don't have enough bytes to read entire payload
      leftoverBytes = bytesToRead.slice(i);

      return {
        // Note: Need to save header so we know how many bytes to read for this packet in the next data cycle
        leftoverBytes: Buffer.concat([header, leftoverBytes]),
        processedTCPPackets
      };
    }

    const newTCPPacket = { type: msgType, length: msgLength, payload: payload! };
    processedTCPPackets.push(newTCPPacket);

    i += msgLength;
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
    case MsgType.CHALLENGE_DATA:
      encodedPayload = protos.Text.encode(payload as protos.IText).finish();
      break;
    case MsgType.INPUTS:
      encodedPayload = payload as Uint8Array;
      break;
    default:
      console.log('ERROR: trying to create TCP Packet with type LOG');
      encodedPayload = new Uint8Array();
      break;
  }

  const msgLength = Buffer.byteLength(encodedPayload);
  const msgLengthArr = new Uint8Array([msgLength & 0x00ff, msgLength & 0xff00]); // Assuming little-endian byte order, since runs on x64
  const msgTypeArr = new Uint8Array([messageType]);

  return Buffer.concat([msgTypeArr, msgLengthArr, encodedPayload], msgLength + 3);
}

class BaseTCPConn {
  connectionName: string;
  ipAddressChangeListenerName: string;
  logger: Logger;
  tcpSocket: TCPSocket;
  ip: string;
  port: number;
  onConnect?: () => void;
  onConnectionClose?: () => void;
  onDataReceived: (data: Buffer) => void;
  onReadable: () => void;

  constructor({
    connectionName,
    ipAddressChangeListenerName,
    logger,
    onDataReceived,
    onConnect,
    onConnectionClose,
    ip = defaults.IPADDRESS,
    port = DEFAULT_TCP_PORT
  }: {
    connectionName: string;
    ipAddressChangeListenerName: string;
    logger: Logger;
    onDataReceived: (data: Buffer) => void;
    onConnect?: () => void;
    onConnectionClose?: () => void;
    ip?: string;
    port?: number;
  }) {
    this.connectionName = connectionName;
    this.ipAddressChangeListenerName = ipAddressChangeListenerName;
    this.logger = logger;
    this.tcpSocket = new TCPSocket();
    this.ip = ip;
    this.port = port;
    this.onConnect = onConnect;
    this.onConnectionClose = onConnectionClose;
    this.onDataReceived = onDataReceived;

    // this.tcpSocket.setTimeout(3000);

    setInterval(() => {
      if (!this.tcpSocket.connecting && this.tcpSocket.pending) {
        if (this.ip !== defaults.IPADDRESS) {
          if (this.ip.includes(':')) {
            const split = this.ip.split(':');
            this.ip = split[0];
            this.port = Number(split[1]);
          }
          console.log(`${this.connectionName}: Trying to TCP connect to ${this.ip}:${this.port}`);
          this.tcpSocket.connect(this.port, this.ip);
        }
      }
    }, 1000);

    this.tcpSocket.on('connect', () => {
      this.logger.log(`${this.connectionName} connected`);

      if (this.onConnect !== undefined) {
        this.onConnect();
      }
    });

    // this.tcpSocket.on('timeout', () => {
    //   this.logger.log(`${this.connectionName} TCP socket timeout'`);
    //   this.tcpSocket.end();
    // });

    this.tcpSocket.on('end', () => {
      this.logger.log(`${this.connectionName} disconnected`);
    });

    this.tcpSocket.on('error', (err: string) => {
      this.logger.log(err);
    });

    this.tcpSocket.on('data', (data) => this.onDataReceived(data));

    const ipAddressListener = (_event: IpcMainEvent, ipAddress: string) => {
      if (ipAddress != this.ip) {
        console.log(`${this.connectionName} - Switching IP from ${this.ip} to ${ipAddress}`);
        if (this.tcpSocket.connecting || !this.tcpSocket.pending) {
          this.tcpSocket.end();
        }
        this.ip = ipAddress;
      }
    };

    ipcMain.on(this.ipAddressChangeListenerName, ipAddressListener);
  }

  // TODO: add ip address listener for ip change

  close = () => {
    this.tcpSocket.end();

    if (this.onConnectionClose !== undefined) {
      this.onConnectionClose();
    }
  };
}

/** Uses TCP connection to tunnel UDP messages. */
class UDPTunneledConn extends BaseTCPConn {
  udpForwarder: UDPSocket;
  ipAddressListener: (event: IpcMainEvent, ipAddress: string) => void;
  /** Leftover bytes from reading 1 cycle of the TCP data buffer. */
  leftoverBytes: Buffer | undefined;

  constructor({
    connectionName,
    ipAddressChangeListenerName,
    logger,
    ip,
    port
  }: {
    connectionName: string;
    ipAddressChangeListenerName: string;
    logger: Logger;
    ip?: string;
    port?: number;
  }) {
    /** Bidirectional - Can send to and receive from UDP connection. */
    const udpForwarder = createSocket({ type: 'udp4', reuseAddr: true });

    /** Data received from TCP connection uses a middleman UDP socket to forward to the actual UDP socket. */
    const dataForwarder = (udpForwarder: UDPSocket) => (data: Buffer) => {
      const { leftoverBytes, processedTCPPackets } = readPackets(data, this.leftoverBytes);

      for (const packet of processedTCPPackets) {
        // For debugging purposes only: will remove later
        this.logger.log(`${this.connectionName}: packet payload length ${packet.length}`);
        udpForwarder.send(packet.payload, UDP_LISTEN_PORT, 'localhost');
      }

      this.leftoverBytes = leftoverBytes;
    };

    const closeConnection = (udpForwarder: UDPSocket) => () => {
      udpForwarder.close();
    };

    super({
      connectionName,
      ipAddressChangeListenerName,
      logger,
      ip,
      port,
      onConnectionClose: closeConnection(udpForwarder),
      onDataReceived: dataForwarder(udpForwarder)
    });

    udpForwarder.bind(UDP_SEND_PORT, () => {
      console.log(`UDP forwarder receives from port ${UDP_SEND_PORT}`);
    });

    // Received a new message from UDP connection
    udpForwarder.on('message', (msg: Uint8Array) => {
      const message = createPacket(msg, MsgType.INPUTS);
      this.tcpSocket.write(message, () => {
        this.logger.log(`Tunneled UDP data using TCP to ${this.ip}:${this.port} with length ${message.length}`);
      });
    });

    this.udpForwarder = udpForwarder;
  }
}

// TODO: Use BaseTCPConn defined above for TCPConn below to remove duplicated logic
class TCPConn {
  logger: Logger;
  socket: TCPSocket;
  leftoverBytes: Buffer | undefined;

  constructor(logger: Logger) {
    this.logger = logger;
    this.socket = new TCPSocket();
    // this.socket.setTimeout(3000);

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
          console.log(`Trying to TCP connect to ${ip}:${port}`);
          this.socket.connect(port, ip);
        }
      }
    }, 1000);

    this.socket.on('connect', () => {
      this.logger.log('Runtime connected');
      this.socket.write(new Uint8Array([1])); // Runtime needs first byte to be 1 to recognize client as Dawn (instead of Shepherd)
    });

    // this.socket.on('timeout', () => {
    //   this.logger.log('TCP socket timeout');
    //   this.socket.end();
    // });

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
      const { leftoverBytes, processedTCPPackets } = readPackets(data, this.leftoverBytes);

      for (const packet of processedTCPPackets) {
        let decoded: protos.Text;

        switch (packet.type) {
          case MsgType.LOG:
            decoded = protos.Text.decode(packet.payload);
            console.log('logs', decoded.payload);
            RendererBridge.reduxDispatch(updateConsole(decoded.payload));
            break;
          case MsgType.CHALLENGE_DATA:
            decoded = protos.Text.decode(packet.payload);
            // TODO: Dispatch challenge outputs to redux
            break;
        }
      }

      this.leftoverBytes = leftoverBytes;
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
    if (ipAddress != runtimeIP) {
      console.log(`Switching IP from ${runtimeIP} to ${ipAddress}`);
      console.log(`Current socket status - Connecting: ${String(this.socket.connecting)} - Pending: ${String(this.socket.pending)}`);
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
    if (this.socket.pending) {
      return;
    }

    const message = createPacket(runModeData, MsgType.RUN_MODE);
    this.socket.write(message, () => {
      this.logger.log(`Run Mode message sent: ${JSON.stringify(runModeData)}`);
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
      this.logger.log(`Device preferences sent: ${deviceData.toString()}`);
    });
  };

  sendChallengeInputs = (_event: IpcMainEvent, textData: protos.IText) => {
    // TODO: Get challenge inputs from UI components, then sagas
    if (this.socket.pending) {
      return;
    }

    const message = createPacket(textData, MsgType.CHALLENGE_DATA);
    this.socket.write(message, () => {
      this.logger.log(`Challenge inputs sent: ${textData.toString()}`);
    });
  }

  sendRobotStartPos = (_event: IpcMainEvent, startPosData: protos.IStartPos) => {
    // TODO: Get start pos from sagas
    if (this.socket.pending) {
      return;
    }

    const message = createPacket(startPosData, MsgType.START_POS);
    this.socket.write(message, () => {
      this.logger.log(`Start position sent: ${startPosData.toString()}`);
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
        // Need to convert protos.Device to Peripheral here because when dispatching to the renderer over IPC,
        // some of the inner properties (i.e. device.uid which is a Long) loses its prototype, which means any
        // data we are sending over through IPC should be serializable.
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
        const peripherals: Peripheral[] = [];

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
        this.logger.log('Error decoding UDP');
        this.logger.log(err);
      }
    });

    this.socket.bind(UDP_LISTEN_PORT, 'localhost', () => {
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
  sendGamepadMessages = (_event: IpcMainEvent, data: protos.Input[]) => {
    if (data.length === 0) {
      data.push(
        protos.Input.create({
          connected: false,
        })
      );
    }

    const message = protos.UserInputs.encode({ inputs: data }).finish();
    // let port = UDP_SEND_PORT;
    // let ip = runtimeIP;
    // // This is temporary. This will need to be changed once Runtime figures out how to send UDP data over TCP ngrok connection
    // if (defaults.NGROK && runtimeIP.includes(':')) {
    //   const split = runtimeIP.split(':');
    //   ip = split[0];
    //   port = Number(split[1]);
    // }
    this.socket.send(message, UDP_SEND_PORT, 'localhost');
  };

  close() {
    this.socket.close();
    ipcMain.removeListener('stateUpdate', this.sendGamepadMessages);
  }
}

const RuntimeConnections: Array<UDPConn | TCPConn | UDPTunneledConn> = [];

export const Runtime = {
  conns: RuntimeConnections,
  logger: new Logger('runtime', 'Runtime Debug'),

  setup() {
    this.conns = [
      new UDPConn(this.logger),
      new TCPConn(this.logger),
      new UDPTunneledConn({ connectionName: 'UDP Tunneler', ipAddressChangeListenerName: 'udpTunnelIpAddress', logger: this.logger })
    ];
  },

  close() {
    this.conns.forEach((conn) => conn.close()); // Logger's fs closes automatically
  }
};
