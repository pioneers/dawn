import { app, remote } from 'electron';
import fs from 'fs';

export const TIMEOUT_MSEC = 5000;

export const pathToName = (filepath: string) => {
  if (filepath !== null && filepath !== '') {
    if (process.platform === 'win32') {
      return filepath.split('\\').pop();
    }
    return filepath.split('/').pop();
  }
  return false;
};

const IPV4_REGEX = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/;
export const getValidationState = (testIPAddress: string) => {
  if (IPV4_REGEX.test(testIPAddress)) {
    return 'success';
  }
  if (testIPAddress === 'localhost') {
    return 'warning';
  }
  return 'error';
};

export const uploadStatus = {
  RECEIVED: 0,
  SENT: 1,
  ERROR: 2
};

export const robotState = {
  IDLE: 0,
  SIMSTR: 'Simulation',
  AUTONOMOUS: 1,
  AUTOSTR: 'Autonomous',
  TELEOP: 2,
  TELEOPSTR: 'Tele-Operated',
  ESTOP: 3,
  ESTOPSTR: 'ESTOP'
};

// TODO: Synchronize this and the above state
export const runtimeState = {
  STUDENT_CRASHED: 0,
  0: 'Crashed',
  STUDENT_RUNNING: 1,
  1: 'Running',
  STUDENT_STOPPED: 2,
  2: 'Stopped',
  TELEOP: 3,
  3: 'Tele-Operated',
  AUTONOMOUS: 4,
  4: 'Autonomous',
  ESTOP: 5,
  5: 'E-Stop'
};

export const defaults = {
  PORT: 22,
  USERNAME: 'pi',
  PASSWORD: 'raspberry',
  IPADDRESS: '192.168.0.0',
  STUDENTCODELOC: '/home/pi/runtime/executor/studentcode.py'
};

export const timings = {
  AUTO: 30,
  IDLE: 5,
  TELEOP: 120,
  SEC: 1000
};

export const windowInfo = {
  UNIT: 10,
  NONEDITOR: 180,
  CONSOLEPAD: 40,
  CONSOLESTART: 250,
  CONSOLEMAX: 350,
  CONSOLEMIN: 100
};

export class Logger {
  log_file: fs.WriteStream;
  lastStr: string;

  constructor(processname: string, firstline: string) {
    let path;
    if (processname === 'dawn') {
      path = remote.app.getPath('desktop');
    } else {
      path = app.getPath('desktop');
    }
    try {
      fs.statSync(`${path}/Dawn`);
    } catch (err) {
      fs.mkdirSync(`${path}/Dawn`);
    }
    this.log_file = fs.createWriteStream(`${path}/Dawn/${processname}.log`, { flags: 'a' });
    this.log_file.write(`\n${firstline}`);
    this.lastStr = '';
  }

  log = (output: string) => {
    console.log(output);
    this._write(output, `\n[${new Date().toString()}]`);
  };
  debug = (output: string) => {
    this._write(output, `\n[${new Date().toString()} DEBUG]`);
  };

  _write = (output: string, prefix: string) => {
    output = String(output);
    if (output !== this.lastStr) {
      this.log_file.write(`${prefix} ${output}`);
      this.lastStr = output;
    } else {
      // this.log_file.write('*');
    }
  };
}

export let logging: Logger; // eslint-disable-line import/no-mutable-exports

export const startLog = () => {
  logging = new Logger('dawn', 'Renderer Debug');
};
