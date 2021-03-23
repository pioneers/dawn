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
    console.log('registering window', key)
    this.registeredWindows[key] = electronWindow;
  };

  unregisterWindow = (key: string) => {
    console.log('unregistering window', key);
    delete this.registeredWindows[key];
  }

  reloadWindow = (key: string) => {
    console.log('reloading window', key);
    const registeredWindow = this.registeredWindows[key]
    registeredWindow?.reload();
  }

  toggleWindowDevtools = (key: string) => {
    console.log('toggling devtools for window', key);
    const registeredWindow = this.registeredWindows[key];
    if (registeredWindow) {
      registeredWindow.webContents.toggleDevTools();
      // console.log("successfully opened devtools window", key);
    } else {
      // console.log("failed to open devtools -- window", key, "does not exist");
    }

  }

  reduxDispatch = (action: any) => {
    try {
      for (const key of Object.keys(this.registeredWindows)) {
        const registeredWindow = this.registeredWindows[key];
        registeredWindow?.webContents.send('dispatch', action);
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export default new RendererBridge();
