/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/*
 * Fake Runtime is run as a child-process of the rest of the application.
 * See DebugMenu.js for handling FakeRuntime within Dawn.
 */

/* eslint-disable camelcase */
import { DevData, IParam, IDevice, IDevData } from '../protos-main';
import { createServer, Server as TCPServer, Socket as TCPSocket } from 'net';

const TCP_PORT = 8101;
const MSG_INTERVAL_MSEC = 50;

const randomFloat = (min: number, max: number) => (max - min) * Math.random() + min;
const sensor = (name: string, type: number, params: IParam[], uid: number): IDevice => ({
  name,
  type,
  params,
  uid
});

const param = (name: string, type: string, value: any): IParam => ({
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
  tcpServer: TCPServer;

  constructor() {
    this.tcpServer = createServer((_c: any) => {
      print('client connected');
    });
    this.tcpServer.listen(TCP_PORT, () => {
      print('server bound');
    });
    this.tcpServer.on('connection', (socket: TCPSocket) => {
      setInterval(() => this.sendDeviceData(socket), MSG_INTERVAL_MSEC);
    });
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
            param('Val 3', 'float', randomFloat(-100, 100))
          ],
          104
        ),
        sensor('SENSOR_BOOLEAN', 1, [param('Val', 'bool', Math.random() < 0.5)], 105),

        // Special Cases handled in dawn/renderer/reducers/peripherals.js
        // sensor('Ignored', 5, [param('major', 'int', 1), param('minor', 'int', 2), param('patch', 'int', 3)], -1),
        // sensor('Ignored', 5, [param('is_unsafe', 'bool', Math.random() < 0.5), param('v_batt', 'float', randomFloat(0, 15))], 0),
      ]
    };
  };

  sendDeviceData = (socket: TCPSocket) => {
    const fakeData: IDevData = this.generateFakeData();
    const encodedPayload = DevData.encode(fakeData).finish();

    const msgLength = Buffer.byteLength(encodedPayload);
    const msgLengthArr = new Uint8Array([msgLength & 0x00ff, msgLength & 0xff00]); // Assuming little-endian byte order, since runs on x64
    const msgTypeArr = new Uint8Array([3]); // msg type 3 for DevData
    const packet = Buffer.concat([msgTypeArr, msgLengthArr, encodedPayload], msgLength + 3);

    socket.write(packet, (err?: Error) => {
      if (err !== undefined) {
        console.log('Err', err);
      }
    });
    // TODO: Handle TCP writes to console
  };
}

new FakeRuntime();
