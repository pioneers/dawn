/*
 * Fake Runtime is not handled by webpack like most of the other JS code but instead
 * will be run "as is" as a child-process of the rest of the application.
 * See DebugMenu.js for handling FakeRuntime within Dawn
 */

/* eslint-disable camelcase */

const dgram = require('dgram');
const net = require('net');
const protobuf = require('protobufjs');

/**
 * TODO: Fake Runtime is currently broken because it still relies on the old protobufs and
 * Ansible now uses the new protobufs. Fix by porting Fake Runtime over to new protos.
 */
const DawnData = (new protobuf.Root()).loadSync('old-protos/ansible.proto', { keepCase: true }).lookupType('DawnData');
const RuntimeData = (new protobuf.Root()).loadSync('old-protos/runtime.proto', { keepCase: true }).lookupType('RuntimeData');
const Notification = (new protobuf.Root()).loadSync('old-protos/notification.proto', { keepCase: true }).lookupType('Notification');

/**
 * UDP Send (Runtime perspective, Runtime -> Dawn)
 * Device Data Array (sensors), device.proto
 */
const SendDeviceProto = (new protobuf.Root()).loadSync('protos/device.proto', { keepCase: true }).lookupType('DevData');

/**
 * UDP Recv (Runtime perspective, Dawn -> Runtime)
 * Gamepad Data, gamepad.proto
 */
const RecvGamepadProto = (new protobuf.Root()).loadSync('protos/gamepad.proto', { keepCase: true }).lookupType('GpState');

const TCPPORT = 1234;
const SENDPORT = 1235;
const LISTENPORT = 1236;
const MSGINTERVAL = 1000; // in ms

const randomFloat = (min, max) => (((max - min) * Math.random()) + min);
// const sensor = (device_type, device_name, param_value, uid) => ({
//   device_type,
//   device_name,
//   param_value,
//   uid,
// });

// const sensor = (type, name, params, uid) => ({
//   name,
//   uid,
//   type,
//   params,
// });

const sensor = (name, type, params, uid) => ({
  name,
  type,
  params,
  uid,
});

const param = (name, type, value) => ({ // eslint-disable-line no-shadow
  name,
  float_value: type === 'float' ? value : undefined,
  int_value: type === 'int' ? value : undefined,
  bool_value: type === 'bool' ? value : undefined,
});
const print = (output) => {
  console.log(`Fake Runtime: ${output}`);
};


class FakeRuntime {
  constructor() {
    this.sendSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    this.listenSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    this.fakeState = RuntimeData.State.STUDENT_STOPPED;
    this.listenSocket.on('message', (msg) => {
      const data = DawnData.decode(msg);
      switch (data.student_code_status) {
        case DawnData.StudentCodeStatus.TELEOP:
          print('Tele-Op');
          this.fakeState = RuntimeData.State.TELEOP;
          break;
        case DawnData.StudentCodeStatus.ESTOP:
          print('E-Stop');
          this.fakeState = RuntimeData.State.ESTOP;
          break;
        case DawnData.StudentCodeStatus.AUTONOMOUS:
          print('Autonomous');
          this.fakeState = RuntimeData.State.AUTO;
          break;
        default:
          print('Idle');
          this.fakeState = RuntimeData.State.STUDENT_STOPPED;
      }
    });
    this.listenSocket.bind(LISTENPORT);

    // this.tcpSocket = new net.Socket();
    // this.tcpSocket.connect({ host: 'localhost', port: TCPPORT }, () => {
    //   print('TCP Up');
    // });
    // this.tcpSocket.on('close', () => {
    //   print('TCP Down');
    // });

    setInterval(this.onInterval.bind(this), MSGINTERVAL);
    this.generateFakeData = this.generateFakeData.bind(this);
  }

  generateFakeData() {
    console.log('Generate data');
    return {
      devices: [
        sensor('MOTOR_SCALAR', 0, [param('Val', 'float', randomFloat(-100, 100))], 100),
        sensor('MOTOR_SCALAR', 0, [param('Val', 'float', randomFloat(-100, 100))], 101),
        sensor('LimitSwitch', 3, [param('Val', 'int', Math.round(randomFloat(0, 1)))], 102),
        sensor('SENSOR_SCALAR', 2, [param('Val', 'float', randomFloat(-100, 100))], 103),
        sensor('SENSOR_SCALAR', 2, [
          param('Val 1', 'float', randomFloat(-100, 100)),
          param('Val 2', 'float', randomFloat(-100, 100)),
          param('Val 3', 'float', randomFloat(-100, 100))], 104),
        sensor('SENSOR_BOOLEAN', 1, [param('Val', 'bool', Math.random() < 0.5)], 105),

        // Special Cases handled in dawn/renderer/reducers/peripherals.js
        sensor('Ignored', 5, [
          param('major', 'int', 1),
          param('minor', 'int', 2),
          param('patch', 'int', 3),
        ], -1),
        sensor('Ignored', 5, [
          param('is_unsafe', 'bool', Math.random() < 0.5),
          param('v_batt', 'float', randomFloat(0, 15)),
        ], 0),
      ],
    };
  }

  onInterval() {
    const fakeData = this.generateFakeData();
    // const udpData = RuntimeData.create(fakeData);
    // console.log(fakeData.devices[0].params);
    const udpData = SendDeviceProto.create(fakeData);
    // console.log(udpData);
    // console.log('Before send');
    // this.sendSocket.send(RuntimeData.encode(udpData).finish(), SENDPORT, 'localhost');
    this.sendSocket.send(SendDeviceProto.encode(udpData).finish(), SENDPORT, 'localhost');
    // console.log('After send');
    // if (this.fakeState !== RuntimeData.State.ESTOP
    //   && this.fakeState !== RuntimeData.State.STUDENT_STOPPED) {
    //   const tcpData = Notification.create({
    //     header: Notification.Type.CONSOLE_LOGGING,
    //     console_output: `${randomFloat(-100, 100)}\n`,
    //   });
    //   this.tcpSocket.write(Notification.encode(tcpData).finish());
    // }
  }
}

new FakeRuntime(); // eslint-disable-line no-new
