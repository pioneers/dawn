import dgram from 'dgram';
import net from 'net';
import { ipcMain } from 'electron';
import protobuf from 'protobufjs';
import _ from 'lodash';

import RendererBridge from '../RendererBridge';
import { updateConsole } from '../../renderer/actions/ConsoleActions';
import { ansibleDisconnect } from '../../renderer/actions/InfoActions';
import { updatePeripherals } from '../../renderer/actions/PeripheralActions';
import { Logger, defaults } from '../../renderer/utils/utils';

/**
 * UDP Recv (Runtime -> Dawn)
 * Device Data Array (sensors), device.proto
 */
const RecvDeviceProto = (new protobuf.Root()).loadSync('protos/device.proto', { keepCase: true }).lookupType('DevData');

/**
 * UDP Send (Dawn -> Runtime)
 * Gamepad Data, gamepad.proto
 */
const SendGamepadProto = (new protobuf.Root()).loadSync('protos/gamepad.proto', { keepCase: true }).lookupType('GpState');

/**
 * TCP Recv (Runtime -> Dawn)
 * Challenge Data (output values), text.proto
 * Log Data (console), text.proto
 */
const RecvChallengeProto = (new protobuf.Root()).loadSync('protos/text.proto', { keepCase: true }).lookupType('Text');
const { RecvLogProto } = RecvChallengeProto;

/**
 * TCP Send (Dawn -> Runtime)
 * Run Mode Data (TELEOP, ESTOP), run_mode.proto
 * Device Data Array (preference filter), device.proto
 * Challenge Data (input values), text.proto
 * Position Data, start_pos.proto
 */
const SendModeProto = (new protobuf.Root()).loadSync('protos/run_mode.proto', { keepCase: true }).lookupType('RunMode');
const { SendDeviceProto } = RecvDeviceProto;
const { SendChallengeProto } = RecvChallengeProto;
const SendPosProto = (new protobuf.Root()).loadSync('protos/start_pos.proto', { keepCase: true }).lookupType('StartPos');

const LISTEN_PORT = 1235;
const SEND_PORT = 1236;
const TCP_PORT = 1234;

function buildGamepadProto(data) {
  const gamepads = _.map(_.toArray(data.gamepads), (gamepad) => {
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
  constructor(logger) {
    this.logger = logger;
    this.statusUpdateTimeout = 0;
    this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    this.close = this.close.bind(this);

    /**
     * Runtime UDP Message Handler.
     * Sends raw sensor array to peripheral reducer.
     */
    this.socket.on('message', (msg) => {
      try {
        console.log(msg);
        const sensorData = RecvDeviceProto.decode(msg).devices;
        this.logger.debug(`Dawn received UDP with data ${JSON.stringify(sensorData)}`);
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

    ipcMain.on('stateUpdate', this.sendGamepadMessages);

    /*
     * IPC Connection with ConfigBox.js' saveChanges()
     * Receives new IP Address to send messages to.
     */
    ipcMain.on('ipAddress', this.ipAddressListener);
  }

  /*
   * IPC Connection with sagas.js' ansibleGamepads()
   * Sends messages when Gamepad information changes
   * or when 100 ms has passed (with 50 ms cooldown)
   */
  sendGamepadMessages(event, data) {
    const message = SendGamepadProto.encode(buildGamepadProto(data)).finish();
    this.logger.debug(`Dawn sent UDP to ${this.runtimeIP}`);
    this.socket.send(message, SEND_PORT, this.runtimeIP);
  }

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
      const decoded = RecvLogProto.decode(data);
      this.logger.log('Dawn received TCP Packet');

      // TODO: Challenge vs console logs
      RendererBridge.reduxDispatch(updateConsole(decoded.payload));
    });

    /**
     * IPC Connection with sagas.js' exportRunMode()
     * TODO: Figure out cadence of sending run mode to Runtime
     */
    ipcMain.on('EXPORT_RUN_MODE', this.sendRunMode);
  }

  sendRunMode(event, data) {
    const mode = data.studentCodeStatus;
    const message = SendModeProto.encode(mode).finish();
    this.socket.write(message, () => {
      this.logger.log(`Run Mode message sent: ${mode}`);
    });
  }

  sendDevicePreferences(event, data) {
    // TODO: Get device preference filter from UI components, then sagas
    const message = SendDeviceProto.encode(data).finish();
    this.socket.write(message, () => {
      this.logger.log(`Device preferences sent: ${data}`);
    });
  }

  sendChallengeInputs(event, data) {
    // TODO: Get challenge inputs from UI components, then sagas
    const message = SendChallengeProto.encode(data).finish();
    this.socket.write(message, () => {
      this.logger.log(`Challenge inputs sent: ${data}`);
    });
  }

  sendRobotStartPos(event, data) {
    // TODO: Get start pos from sagas
    const message = SendPosProto.encode(data).finish();
    this.socket.write(message, () => {
      this.logger.log(`Start position sent: ${data}`);
    });
  }

  close() {
    this.socket.end();
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
