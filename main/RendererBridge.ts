/**
 * RendererBridge connects the main process to the renderer's Redux flow.
 * Maintains a real-time copy of the renderer's Redux state in the main process, and
 * allows the main process to dispatch redux actions to the renderer.
 */

import _ from 'lodash';
import { BrowserWindow } from "electron";

class RendererBridge {
  registeredWindow: BrowserWindow | null = null;

  registerWindow = (electronWindow: BrowserWindow) => {
    this.registeredWindow = electronWindow;
  };

  reduxDispatch = (action: any) => {
    if (this.registeredWindow) {
      this.registeredWindow.webContents.send('dispatch', action);
    }
  };
};

export default new RendererBridge();
