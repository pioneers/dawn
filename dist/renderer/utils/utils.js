"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
exports.TIMEOUT = 5000;
exports.pathToName = function (filepath) {
    if (filepath !== null && filepath !== '') {
        if (process.platform === 'win32') {
            return filepath.split('\\').pop();
        }
        return filepath.split('/').pop();
    }
    return false;
};
var IPV4_REGEX = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/;
exports.getValidationState = function (testIPAddress) {
    if (IPV4_REGEX.test(testIPAddress)) {
        return 'success';
    }
    if (testIPAddress === 'localhost') {
        return 'warning';
    }
    return 'error';
};
exports.uploadStatus = {
    RECEIVED: 0,
    SENT: 1,
    ERROR: 2,
};
exports.robotState = {
    IDLE: 0,
    SIMSTR: 'Simulation',
    TELEOP: 1,
    TELEOPSTR: 'Tele-Operated',
    AUTONOMOUS: 2,
    AUTOSTR: 'Autonomous',
    ESTOP: 3,
    ESTOPSTR: 'ESTOP',
};
// TODO: Synchronize this and the above state
exports.runtimeState = {
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
    5: 'E-Stop',
};
exports.defaults = {
    PORT: 22,
    USERNAME: 'pi',
    PASSWORD: 'raspberry',
    IPADDRESS: '192.168.0.2',
    STUDENTCODELOC: './storage/studentcode.py',
};
exports.timings = {
    AUTO: 30,
    IDLE: 5,
    TELEOP: 120,
    SEC: 1000,
};
exports.windowInfo = {
    UNIT: 10,
    NONEDITOR: 180,
    CONSOLEPAD: 40,
    CONSOLESTART: 250,
    CONSOLEMAX: 350,
    CONSOLEMIN: 100,
};
var Logger = /** @class */ (function () {
    function Logger(processname, firstline) {
        var path;
        if (processname === 'dawn') {
            path = require('electron').remote.app.getPath('desktop'); // eslint-disable-line global-require
        }
        else {
            var app = require('electron').app; // eslint-disable-line global-require
            path = app.getPath('desktop');
        }
        try {
            fs_1.default.statSync(path + "/Dawn");
        }
        catch (err) {
            fs_1.default.mkdirSync(path + "/Dawn");
        }
        this.log_file = fs_1.default.createWriteStream(path + "/Dawn/" + processname + ".log", { flags: 'a' });
        this.log_file.write("\n" + firstline);
        this.lastStr = '';
        this._write = this._write.bind(this);
    }
    Logger.prototype.log = function (output) {
        console.log(output);
        this._write(output, "\n[" + (new Date()).toString() + "]");
    };
    Logger.prototype.debug = function (output) {
        this._write(output, "\n[" + (new Date()).toString() + " DEBUG]");
    };
    Logger.prototype._write = function (output, prefix) {
        output = String(output);
        if (output !== this.lastStr) {
            this.log_file.write(prefix + " " + output);
            this.lastStr = output;
        }
        else {
            this.log_file.write('*');
        }
    };
    return Logger;
}());
exports.Logger = Logger;
exports.startLog = function () {
    exports.logging = new Logger('dawn', 'Renderer Debug');
};
