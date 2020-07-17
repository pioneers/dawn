"use strict";
/**
 * Actions for the console state.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConsole = function (value) { return ({
    type: 'UPDATE_CONSOLE',
    consoleOutput: value,
}); };
exports.clearConsole = function () { return ({
    type: 'CLEAR_CONSOLE',
}); };
exports.toggleConsole = function () { return ({
    type: 'TOGGLE_CONSOLE',
}); };
