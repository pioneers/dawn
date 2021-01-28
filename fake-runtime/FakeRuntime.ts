/*
 * Fake Runtime is not handled by webpack like most of the other JS code but instead
 * will be run "as is" as a child-process of the rest of the application.
 * See DebugMenu.js for handling FakeRuntime within Dawn
 */

/* eslint-disable camelcase */
import { Param, DevData, Device } from '../protos/protos';
import { createSocket, Socket as UDPSocket } from 'dgram';
import { createServer, Server as TCPServer } from 'net';

const TCP_PORT = 8101;
const UDP_SEND_PORT = 9001;
const UDP_LISTEN_PORT = 9000;
const MSG_INTERVAL_MSEC = 50;

const randomFloat = (min: number, max: number) => (max - min) * Math.random() + min;
const sensor = (name: string, type: number, params: Param[], uid: number): Device => ({
  name,
  type,
  params,
  uid,
});

const param = (name: string, type: string, value: any) => ({
  // eslint-disable-line no-shadow
  name,
  fval: type === 'float' ? value : undefined,
  ival: type === 'int' ? value : undefined,
  bval: type === 'bool' ? value : undefined,
});

const print = (output: string) => {
  console.log(`Fake Runtime: ${output}`);
};

class FakeRuntime {
  sendSocket: UDPSocket;
  listenSocket: UDPSocket;
  tcpServer: TCPServer;

  constructor() {
    this.sendSocket = createSocket({ type: 'udp4', reuseAddr: true });
    this.listenSocket = createSocket({ type: 'udp4', reuseAddr: true });

    this.listenSocket.on('message', (_msg: any) => {
      // TODO: Handle UDP gamepad recv
    });
    this.listenSocket.bind(UDP_LISTEN_PORT);

    this.tcpServer = createServer((_c: any) => {
      print('client connected');
    });
    this.tcpServer.listen(TCP_PORT, () => {
      print('server bound');
    })

    setInterval(this.onInterval, MSG_INTERVAL_MSEC);
  }

  generateFakeData = () => {
    return {
      devices: [
        sensor('MOTOR_SCALAR', 0, [param('Val', 'float', randomFloat(-100, 100))], 100),
        sensor('MOTOR_SCALAR', 0, [param('Val', 'float', randomFloat(-100, 100))], 101),
        sensor('LimitSwitch', 3, [param('Val', 'int', Math.round(randomFloat(0, 1)))], 102),
        sensor('SENSOR_SCALAR', 2, [param('Val', 'float', randomFloat(-100, 100))], 103),
        sensor(
          'SENSOR_SCALAR',
          2,
          [
            param('Val 1', 'float', randomFloat(-100, 100)),
            param('Val 2', 'float', randomFloat(-100, 100)),
            param('Val 3', 'float', randomFloat(-100, 100)),
          ],
          104
        ),
        sensor('SENSOR_BOOLEAN', 1, [param('Val', 'bool', Math.random() < 0.5)], 105),

        // Special Cases handled in dawn/renderer/reducers/peripherals.js
        // sensor('Ignored', 5, [param('major', 'int', 1), param('minor', 'int', 2), param('patch', 'int', 3)], -1),
        // sensor('Ignored', 5, [param('is_unsafe', 'bool', Math.random() < 0.5), param('v_batt', 'float', randomFloat(0, 15))], 0),
      ],
    };
  }

  onInterval = () => {
    const fakeData: DevData = this.generateFakeData();
    this.sendSocket.send(DevData.encode(fakeData).finish(), UDP_SEND_PORT, 'localhost');
    // TODO: Handle TCP writes to console
  }
}

new FakeRuntime(); // eslint-disable-line no-new
