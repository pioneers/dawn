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
const sensor = (name, type, params, uid) => ({
  name,
  type,
  params,
  uid,
});

const param = (name, type, value) => ({ // eslint-disable-line no-shadow
  name,
  fval: type === 'float' ? value : undefined,
  ival: type === 'int' ? value : undefined,
  bval: type === 'bool' ? value : undefined,
});
const print = (output) => {
  console.log(`Fake Runtime: ${output}`);
};


class FakeRuntime {
  constructor() {
    this.sendSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    this.listenSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    this.fakeState = null;
    this.listenSocket.on('message', (msg) => {
      // TODO: Handle UDP gamepad recv
    });
    this.listenSocket.bind(LISTENPORT);

    // TODO: Create TCP sockets

    setInterval(this.onInterval.bind(this), MSGINTERVAL);
    this.generateFakeData = this.generateFakeData.bind(this);
  }

  generateFakeData() {
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
    const udpData = SendDeviceProto.create(fakeData);
    this.sendSocket.send(SendDeviceProto.encode(udpData).finish(), SENDPORT, 'localhost');
    // TODO: Handle TCP writes to console
  }
}

new FakeRuntime(); // eslint-disable-line no-new
