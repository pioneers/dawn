"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePeripherals = function (sensors) { return ({
    type: 'UPDATE_PERIPHERALS',
    peripherals: sensors,
}); };
exports.peripheralRename = function (uid, newname) { return ({
    type: 'PERIPHERAL_RENAME',
    id: uid,
    name: newname,
}); };
