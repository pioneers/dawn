"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoPerMessage = function (stateChange) { return ({
    type: 'PER_MESSAGE',
    robotState: stateChange,
}); };
exports.ansibleDisconnect = function () { return ({
    type: 'ANSIBLE_DISCONNECT',
}); };
exports.runtimeConnect = function () { return ({
    type: 'RUNTIME_CONNECT',
}); };
exports.masterStatus = function () { return ({
    type: 'MASTER_ROBOT',
}); };
exports.runtimeDisconnect = function () { return ({
    type: 'RUNTIME_DISCONNECT',
}); };
exports.updateCodeStatus = function (studentCodeStatus) { return ({
    type: 'CODE_STATUS',
    studentCodeStatus: studentCodeStatus,
}); };
exports.ipChange = function (ipAddress) { return ({
    type: 'IP_CHANGE',
    ipAddress: ipAddress,
}); };
