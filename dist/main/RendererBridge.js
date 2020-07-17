"use strict";
/**
 * RendererBridge connects the main process to the renderer's Redux flow.
 * Maintains a real-time copy of the renderer's Redux state in the main process, and
 * allows the main process to dispatch redux actions to the renderer.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var RendererBridge = {
    registeredWindow: null,
    registerWindow: function (electronWindow) {
        this.registeredWindow = electronWindow;
    },
    reduxDispatch: function (action) {
        if (this.registeredWindow) {
            this.registeredWindow.webContents.send('dispatch', action);
        }
    },
};
lodash_1.default.bindAll(RendererBridge, ['registerWindow', 'reduxDispatch']);
exports.default = RendererBridge;
