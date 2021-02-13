/**
 * RendererBridge connects the main process to the renderer's Redux flow.
 * Maintains a real-time copy of the renderer's Redux state in the main process, and
 * allows the main process to dispatch redux actions to the renderer.
 */

import _ from 'lodash';
import { BrowserWindow } from "electron";

class RendererBridge {
  registeredWindows: Record<string, BrowserWindow | null> = {};
  registerWindow = (key: string, electronWindow: BrowserWindow) => {
    this.registeredWindows[key] = electronWindow;
  };
  reduxDispatch = (action: any) => {
    for (const key of Object.keys(this.registeredWindows)) {
      const registeredWindow = this.registeredWindows[key];
      if (registeredWindow) {
        registeredWindow.webContents.send('dispatch', action);
      }
    }
  };
};

export default new RendererBridge();
