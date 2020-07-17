"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = require("socket.io-client");
var FieldActions_1 = require("../../renderer/actions/FieldActions");
var RendererBridge_1 = require("../RendererBridge");
var utils_1 = require("../../renderer/utils/utils");
var Ansible_1 = require("./Ansible");
var FCInternals = /** @class */ (function () {
    function FCInternals(stationNumber, bridgeAddress, logger) {
        this.socket = null;
        this.queuedPublish = null;
        this.stationNumber = stationNumber;
        this.bridgeAddress = bridgeAddress;
        this.logger = logger;
        this.logger.log("Field Control: SN-" + this.stationNumber + " BA-" + this.bridgeAddress);
        this.init = this.init.bind(this);
        this.quit = this.quit.bind(this);
    }
    FCInternals.prototype.init = function () {
        var _this = this;
        this.socket = socket_io_client_1.default("http://" + this.bridgeAddress + ":7000");
        this.socket.on('connect', function () {
            _this.logger.log('Connected to Field Control Socket');
            _this.socket.on('robot_state', function (data) {
                RendererBridge_1.default.reduxDispatch(FieldActions_1.updateRobot(JSON.parse(data)));
            });
            _this.socket.on('heartbeat', function () {
                RendererBridge_1.default.reduxDispatch(FieldActions_1.updateHeart());
            });
            _this.socket.on('codes', function (data) {
                if (Ansible_1.default.conns[2].socket !== null) {
                    Ansible_1.default.conns[2].socket.sendFieldControl(JSON.parse(data));
                }
                else {
                    _this.logger.log('Trying to send FC Info to Disconnected Robot');
                }
            });
            _this.socket.on('master', function (data) {
                RendererBridge_1.default.reduxDispatch(FieldActions_1.updateMaster(JSON.parse(data)));
            });
        });
    };
    FCInternals.prototype.quit = function () {
        try {
            this.socket.close();
        }
        catch (err) {
            this.logger.log(err);
        }
        this.socket = null;
    };
    return FCInternals;
}());
var FCObject = {
    FCInternal: null,
    stationNumber: 4,
    bridgeAddress: 'localhost',
    logger: new utils_1.Logger('fieldControl', 'Field Control Debug'),
    setup: function () {
        if (this.FCInternal !== null) {
            this.FCInternal.quit();
        }
        this.FCInternal = new FCInternals(this.stationNumber, this.bridgeAddress, FCObject.logger);
        this.FCInternal.init();
    },
    changeFCInfo: function (event, arg) {
        if (arg.stationNumber !== null) {
            FCObject.stationNumber = arg.stationNumber;
            FCObject.logger.log("stationNumber set to " + FCObject.stationNumber);
        }
        if (arg.bridgeAddress !== null) {
            FCObject.bridgeAddress = arg.bridgeAddress;
            FCObject.logger.log("bridgeAddress set to " + FCObject.bridgeAddress);
        }
    },
};
exports.default = FCObject;
