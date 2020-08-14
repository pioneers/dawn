import dgram from 'dgram';
import net from 'net';
import { ipcMain } from 'electron';
import protobuf from 'protobufjs';
import _ from 'lodash';

import RendererBridge from '../RendererBridge';
import { updateConsole } from '../../renderer/actions/ConsoleActions';
import { ansibleDisconnect, infoPerMessage } from '../../renderer/actions/InfoActions';
import { updatePeripherals } from '../../renderer/actions/PeripheralActions';
import { Logger, defaults } from '../../renderer/utils/utils';

const protoRoot = new protobuf.Root();
/**
 * UDP Recv (Runtime -> Dawn)
 * Device Data Array (sensors), device.proto
 */
const RecvDeviceProto = protoRoot.loadSync('protos/device.proto', { keepCase: true }).lookupType('DevData');

/**
 * UDP Send (Dawn -> Runtime)
 * Gamepad Data, gamepad.proto
 */
const SendGamepadProto = protoRoot.loadSync('protos/gamepad.proto', { keepCase: true }).lookupType('GpState');

/**
 * TCP Recv (Runtime -> Dawn)
 * Challenge Data (output values), text.proto
 * Log Data (console), text.proto
 */
const RecvChallengeProto = protoRoot.loadSync('protos/text.proto', { keepCase: true }).lookupType('Text');
const RecvLogProto = RecvChallengeProto;

/**
 * TCP Send (Dawn -> Runtime)
 * Run Mode Data (TELEOP, ESTOP), run_mode.proto
 * Device Data Array (preference filter), device.proto
 * Challenge Data (input values), text.proto
 * Position Data, start_pos.proto
 */
const SendModeProto = protoRoot.loadSync('protos/run_mode.proto', { keepCase: true }).lookupType('RunMode');
const SendDeviceProto = RecvDeviceProto;
const SendChallengeProto = RecvChallengeProto;
const SendPosProto = protoRoot.loadSync('protos/start_pos.proto', { keepCase: true }).lookupType('StartPos');

/**
 * Define port constants.
 */
const LISTEN_PORT = 1235;
const SEND_PORT = 1236;
const TCP_PORT = 1234;

/**
 * Define message ID constants,
 * each of which are 8 bit.
 */
const DEVICE_DATA_TYPE = new Uint8Array([1])[0];
const RUN_MODE_TYPE = new Uint8Array([2])[0];
const START_POS_TYPE = new Uint8Array([3])[0];
const CHALLENGE_DATA_TYPE = new Uint8Array([4])[0];
const LOG_TYPE = new Uint8Array([5])[0];

/**
 * Unpack TCP packet header from payload
 * as sent from Runtime.
 */
function readPacket(data: any) {
  const buf = Buffer.from(data);
  const header = buf.slice(0, 3);
  const msgType = new Uint8Array(header)[0];
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
function createPacket(payload: any, messageType: number) {
  let encodedPayload: any;
  switch (messageType) {
    case DEVICE_DATA_TYPE:
      encodedPayload = SendDeviceProto.encode(payload).finish();
      break;
    case RUN_MODE_TYPE:
      encodedPayload = SendModeProto.encode(payload).finish();
      break;
    case START_POS_TYPE:
      encodedPayload = SendPosProto.encode(payload).finish();
      break;
    case CHALLENGE_DATA_TYPE:
      encodedPayload = SendChallengeProto.encode(payload).finish();
      break;
  }
  const msgLength = new Uint16Array([Buffer.byteLength(encodedPayload)])[0];

  const msgTypeArr = new Uint8Array([messageType]);
  const msgLengthArr = new Uint8Array([msgLength]);
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

/**
 * Create gamepad data according to protobuf.
 */
function buildGamepadProto(data: any) {
  const gamepads = _.map(_.toArray(data.gamepads), (gamepad: any) => {
    const axes = _.toArray(gamepad.axes);
    const buttons = _.map(_.toArray(gamepad.buttons), Boolean);
    return SendGamepadProto.create({
      connected: gamepad.index,
      axes,
      buttons,
    });
  });

  return SendGamepadProto.create({ gamepads });
}

class ListenSocket {
  constructor(logger: any) {
    this.logger = logger;
    this.statusUpdateTimeout = 0;
    this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
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
        const sensorData = RecvDeviceProto.decode(msg).devices;
        cleanUIDs(sensorData);
        this.logger.debug('Dawn received UDP sensor data');
        RendererBridge.reduxDispatch(updatePeripherals(sensorData));
      } catch (err) {
        this.logger.log('Error decoding UDP');
        this.logger.debug(err);
      }
    });

    this.socket.on('error', (err) => {
      this.logger.log('UDP listening error');
      this.logger.debug(err);
    });

    this.socket.on('close', () => {
      RendererBridge.reduxDispatch(ansibleDisconnect());
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
  constructor(logger) {
    this.logger = logger;
    this.runtimeIP = defaults.IPADDRESS;
    this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    this.sendGamepadMessages = this.sendGamepadMessages.bind(this);
    this.ipAddressListener = this.ipAddressListener.bind(this);
    this.close = this.close.bind(this);

    this.socket.on('error', (err) => {
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
   * IPC Connection with sagas.js' ansibleGamepads()
   * Sends messages when Gamepad information changes
   * or when 100 ms has passed (with 50 ms cooldown)
   */
  sendGamepadMessages(event, data) {
    const message = SendGamepadProto.encode(buildGamepadProto(data)).finish();
    this.logger.debug(`Dawn sent UDP to ${this.runtimeIP}`);
    this.socket.send(message, SEND_PORT, this.runtimeIP);
  }

  /**
   * IPC Connection with ConfigBox.js' saveChanges()
   * Receives new IP Address to send messages to.
   */
  ipAddressListener(event, { ipAddress }) {
    this.runtimeIP = ipAddress;
  }

  close() {
    this.socket.close();
    ipcMain.removeListener('stateUpdate', this.sendGamepadMessages);
    ipcMain.removeListener('ipAddress', this.ipAddressListener);
  }
}

class TCPSocket {
  constructor(socket, logger) {
    this.sendRunMode = this.sendRunMode.bind(this);
    this.sendDevicePreferences = this.sendDevicePreferences.bind(this);
    this.sendChallengeInputs = this.sendChallengeInputs.bind(this);
    this.sendRobotStartPos = this.sendRobotStartPos.bind(this);
    this.close = this.close.bind(this);

    this.logger = logger;
    this.socket = socket;

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
      let decoded;

      switch (message.messageType) {
        case LOG_TYPE:
          decoded = RecvLogProto.decode(message.payload);
          RendererBridge.reduxDispatch(updateConsole(decoded.payload));
          break;
        case CHALLENGE_DATA_TYPE:
          decoded = RecvChallengeProto.decode(message.payload);
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
  sendRunMode(event, data) {
    const mode = data.studentCodeStatus;
    const message = createPacket(mode, RUN_MODE_TYPE);
    this.socket.write(message, () => {
      this.logger.debug(`Run Mode message sent: ${mode}`);
    });
  }

  sendDevicePreferences(event, data) {
    // TODO: Get device preference filter from UI components, then sagas
    const message = createPacket(data, DEVICE_DATA_TYPE);
    this.socket.write(message, () => {
      this.logger.debug(`Device preferences sent: ${data}`);
    });
  }

  sendChallengeInputs(event, data) {
    // TODO: Get challenge inputs from UI components, then sagas
    const message = createPacket(data, CHALLENGE_DATA_TYPE);
    this.socket.write(message, () => {
      this.logger.debug(`Challenge inputs sent: ${data}`);
    });
  }

  sendRobotStartPos(event, data) {
    // TODO: Get start pos from sagas
    const message = createPacket(data, START_POS_TYPE);
    this.socket.write(message, () => {
      this.logger.debug(`Start position sent: ${data}`);
    });
  }

  close() {
    this.socket.end();
    this.ipcMain.removeListener('runModeUpdate', this.sendRunMode);
  }
}

class TCPServer {
  constructor(logger) {
    this.socket = null;
    this.close = this.close.bind(this);
    this.tcp = net.createServer((socket) => {
      this.socket = new TCPSocket(socket, logger);
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
    if (this.socket) {
      this.socket.close();
    }

    this.tcp.close();
  }
}

const Ansible = {
  conns: [],
  logger: new Logger('ansible', 'Ansible Debug'),
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

export default Ansible;
