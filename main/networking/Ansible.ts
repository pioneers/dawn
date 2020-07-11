"use strict";
exports.__esModule = true;
var dgram_1 = require("dgram");
var net_1 = require("net");
var electron_1 = require("electron");
var protobufjs_1 = require("protobufjs");
var lodash_1 = require("lodash");
var RendererBridge_1 = require("../RendererBridge");
var ConsoleActions_1 = require("../../renderer/actions/ConsoleActions");
var InfoActions_1 = require("../../renderer/actions/InfoActions");
var PeripheralActions_1 = require("../../renderer/actions/PeripheralActions");
var utils_1 = require("../../renderer/utils/utils");
var FieldControl_1 = require("./FieldControl");
var DawnData = (new protobufjs_1["default"].Root()).loadSync(__dirname + "/ansible.proto", { keepCase: true }).lookupType('DawnData');
var StudentCodeStatus = DawnData.StudentCodeStatus;
var RuntimeData = (new protobufjs_1["default"].Root()).loadSync(__dirname + "/runtime.proto", { keepCase: true }).lookupType('RuntimeData');
var Notification = (new protobufjs_1["default"].Root()).loadSync(__dirname + "/notification.proto", { keepCase: true }).lookupType('Notification');
var LISTEN_PORT = 1235;
var SEND_PORT = 1236;
var TCP_PORT = 1234;
function buildProto(data) {
    var status = null;
    switch (data.studentCodeStatus) {
        case utils_1.robotState.TELEOP:
            status = StudentCodeStatus.TELEOP;
            break;
        case utils_1.robotState.AUTONOMOUS:
            status = StudentCodeStatus.AUTONOMOUS;
            break;
        case utils_1.robotState.ESTOP:
            status = StudentCodeStatus.ESTOP;
            break;
        default:
            status = StudentCodeStatus.IDLE;
    }
    var gamepads = lodash_1["default"].map(lodash_1["default"].toArray(data.gamepads), function (gamepad) {
        var axes = lodash_1["default"].toArray(gamepad.axes);
        var buttons = lodash_1["default"].map(lodash_1["default"].toArray(gamepad.buttons), Boolean);
        return DawnData.Gamepad.create({
            index: gamepad.index,
            axes: axes,
            buttons: buttons
        });
    });
    return DawnData.create({
        student_code_status: status,
        gamepads: gamepads,
        team_color: (FieldControl_1["default"].stationNumber < 2) ? DawnData.TeamColor.BLUE : DawnData.TeamColor.GOLD
    });
}
var ListenSocket = /** @class */ (function () {
    function ListenSocket(logger) {
        var _this = this;
        this.logger = logger;
        this.statusUpdateTimeout = 0;
        this.socket = dgram_1["default"].createSocket({ type: 'udp4', reuseAddr: true });
        this.studentCodeStatusListener = this.studentCodeStatusListener.bind(this);
        this.close = this.close.bind(this);
        /*
         * Runtime message handler. Sends robot state to store.info
         * and raw sensor array to peripheral reducer
         */
        this.socket.on('message', function (msg) {
            try {
                var _a = RuntimeData.decode(msg), stateRobot = _a.robot_state, sensorData = _a.sensor_data;
                _this.logger.debug("Dawn received UDP with state " + stateRobot);
                RendererBridge_1["default"].reduxDispatch(InfoActions_1.infoPerMessage(stateRobot));
                if (stateRobot === RuntimeData.State.STUDENT_STOPPED) {
                    if (_this.statusUpdateTimeout > 0) {
                        _this.statusUpdateTimeout -= 1;
                    }
                    else {
                        _this.statusUpdateTimeout = 0;
                        RendererBridge_1["default"].reduxDispatch(InfoActions_1.updateCodeStatus(utils_1.robotState.IDLE));
                    }
                }
                _this.logger.debug(JSON.stringify(sensorData));
                RendererBridge_1["default"].reduxDispatch(PeripheralActions_1.updatePeripherals(sensorData));
            }
            catch (err) {
                _this.logger.log('Error decoding UDP');
                _this.logger.debug(err);
            }
        });
        this.socket.on('error', function (err) {
            _this.logger.log('UDP listening error');
            _this.logger.debug(err);
        });
        this.socket.on('close', function () {
            RendererBridge_1["default"].reduxDispatch(InfoActions_1.ansibleDisconnect());
            _this.logger.log('UDP listening closed');
        });
        this.socket.bind(LISTEN_PORT, function () {
            _this.logger.log("UDP Bound to " + LISTEN_PORT);
        });
        electron_1.ipcMain.on('studentCodeStatus', this.studentCodeStatusListener);
    }
    ListenSocket.prototype.studentCodeStatusListener = function (event, _a) {
        var studentCodeStatus = _a.studentCodeStatus;
        if (studentCodeStatus === StudentCodeStatus.TELEOP ||
            studentCodeStatus === StudentCodeStatus.AUTONOMOUS) {
            this.statusUpdateTimeout = 5;
        }
    };
    ListenSocket.prototype.close = function () {
        this.socket.close();
        electron_1.ipcMain.removeListener('studentCodeStatus', this.studentCodeStatusListener);
    };
    return ListenSocket;
}());
var SendSocket = /** @class */ (function () {
    function SendSocket(logger) {
        var _this = this;
        this.logger = logger;
        this.runtimeIP = utils_1.defaults.IPADDRESS;
        this.socket = dgram_1["default"].createSocket({ type: 'udp4', reuseAddr: true });
        this.sendGamepadMessages = this.sendGamepadMessages.bind(this);
        this.ipAddressListener = this.ipAddressListener.bind(this);
        this.close = this.close.bind(this);
        this.socket.on('error', function (err) {
            _this.logger.log('UDP sending error');
            _this.logger.log(err);
        });
        this.socket.on('close', function () {
            _this.logger.log('UDP sending closed');
        });
        electron_1.ipcMain.on('stateUpdate', this.sendGamepadMessages);
        /*
         * IPC Connection with ConfigBox.js' saveChanges()
         * Receives new IP Address to send messages to.
         */
        electron_1.ipcMain.on('ipAddress', this.ipAddressListener);
    }
    /*
     * IPC Connection with sagas.js' ansibleGamepads()
     * Sends messages when Gamepad information changes
     * or when 100 ms has passed (with 50 ms cooldown)
     */
    SendSocket.prototype.sendGamepadMessages = function (event, data) {
        var message = DawnData.encode(buildProto(data)).finish();
        this.logger.debug("Dawn sent UDP to " + this.runtimeIP);
        this.socket.send(message, SEND_PORT, this.runtimeIP);
    };
    SendSocket.prototype.ipAddressListener = function (event, _a) {
        var ipAddress = _a.ipAddress;
        this.runtimeIP = ipAddress;
    };
    SendSocket.prototype.close = function () {
        this.socket.close();
        electron_1.ipcMain.removeListener('stateUpdate', this.sendGamepadMessages);
        electron_1.ipcMain.removeListener('ipAddress', this.ipAddressListener);
    };
    return SendSocket;
}());
var TCPSocket = /** @class */ (function () {
    function TCPSocket(socket, logger) {
        var _this = this;
        this.requestTimestamp = this.requestTimestamp.bind(this);
        this.sendFieldControl = this.sendFieldControl.bind(this);
        this.close = this.close.bind(this);
        this.logger = logger;
        this.socket = socket;
        this.logger.log('Runtime connected');
        this.socket.on('end', function () {
            _this.logger.log('Runtime disconnected');
        });
        this.socket.on('data', function (data) {
            var decoded = Notification.decode(data);
            _this.logger.log("Dawn received TCP Packet " + decoded.header);
            switch (decoded.header) {
                case Notification.Type.CONSOLE_LOGGING:
                    RendererBridge_1["default"].reduxDispatch(ConsoleActions_1.updateConsole(decoded.console_output));
                    break;
                case Notification.Type.TIMESTAMP_UP:
                    _this.logger.log("TIMESTAMP: " + lodash_1["default"].toArray(decoded.timestamps));
                    break;
            }
        });
        /*
         * IPC Connection with Editor.js' upload()
         * When Runtime responds back with confirmation,
         * notifyChange sends received signal (see tcp, received variables)
         */
        electron_1.ipcMain.on('TIMESTAMP_SEND', this.requestTimestamp);
    }
    TCPSocket.prototype.requestTimestamp = function () {
        var _this = this;
        var TIME = Date.now() / 1000.0;
        var message = Notification.encode(Notification.create({
            header: Notification.Type.TIMESTAMP_DOWN,
            timestamps: [TIME]
        })).finish();
        this.socket.write(message, function () {
            _this.logger.log("Timestamp Requested: " + TIME);
        });
    };
    TCPSocket.prototype.sendFieldControl = function (data) {
        var _this = this;
        var rawMsg = {
            header: Notification.Type.GAMECODE_TRANSMISSION,
            gamecode_solutions: data.solutions,
            gamecodes: data.codes,
            rfids: data.rfids
        };
        var message = Notification.encode(Notification.create(rawMsg)).finish();
        this.socket.write(message, function () {
            _this.logger.log("FC Message Sent: " + rawMsg);
        });
    };
    TCPSocket.prototype.close = function () {
        this.socket.end();
    };
    return TCPSocket;
}());
var TCPServer = /** @class */ (function () {
    function TCPServer(logger) {
        var _this = this;
        this.socket = null;
        this.close = this.close.bind(this);
        this.tcp = net_1["default"].createServer(function (socket) {
            _this.socket = new TCPSocket(socket, logger);
        });
        this.logger = logger;
        this.tcp.on('error', function (err) {
            _this.logger.log('TCP error');
            _this.logger.log(err);
        });
        this.tcp.listen(TCP_PORT, function () {
            _this.logger.log("Dawn listening on port " + TCP_PORT);
        });
    }
    TCPServer.prototype.close = function () {
        if (this.socket) {
            this.socket.close();
        }
        this.tcp.close();
    };
    return TCPServer;
}());
var Ansible = {
    conns: [],
    logger: new utils_1.Logger('ansible', 'Ansible Debug'),
    setup: function () {
        this.conns = [
            new ListenSocket(this.logger),
            new SendSocket(this.logger),
            new TCPServer(this.logger),
        ];
    },
    close: function () {
        this.conns.forEach(function (conn) { return conn.close(); }); // Logger's fs closes automatically
    }
};
exports["default"] = Ansible;
