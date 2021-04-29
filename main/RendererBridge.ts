/**
 * RendererBridge connects the main process to children renderer processes and
 * allows the main process to dispatch data to the renderer processes.
 */

import _ from 'lodash';
import { BrowserWindow } from "electron";

type SingleOrArray<T> = T | T[];

class RendererBridge {
  private registeredWindows: Record<string, BrowserWindow | null> = {};

  hasRegisteredWindow = (key: string) => this.registeredWindows[key] ?? false;

  /** Registers the window in the RendererBridge */
  registerWindow = (key: string, electronWindow: BrowserWindow) => {
    this.registeredWindows[key] = electronWindow;
  };

  /** Unregisters the window from the RendererBridge */
  unregisterWindow = (key: string) => {
    delete this.registeredWindows[key];
  }

  /**
   * Reloads the window specified by its key in the RendererBridge
   * If key specified doesn't exist in the RendererBridge, then nothing will happen.
   */
  reloadWindow = (key: string) => {
    const registeredWindow = this.registeredWindows[key];
    registeredWindow?.reload();
  }

  /**
   * Toggles the window DevTools for window specified by key
   * If key specified doesn't exist in the RendererBridge, then nothing will happen.
   */
  toggleWindowDevtools = (key: string) => {
    const registeredWindow = this.registeredWindows[key];
    registeredWindow?.webContents.toggleDevTools();
  }

  /**
   * From windows specified by `windowKeys`, dispatches `data` to `channel`.
   * If `windowKeys` is undefined, will send to all registered windows.
   * If `windowKeys` is a `string`, then the data will only be dispatched to that registered window.
   */
  dispatch = (windowKeys: SingleOrArray<string> | 'all', channel: string, ...data: any[]) => {
    if (windowKeys === 'all') {
      windowKeys = Object.keys(this.registeredWindows);
    } else if (typeof windowKeys === 'string') {
      windowKeys = [windowKeys]
    }

    try {
      for (const key of windowKeys) {
        const registeredWindow = this.registeredWindows[key];

        // Special case for dispatching Redux since we can only dispatch 1 action at a time
        if (channel === 'reduxDispatch') {
          data = data[0];
        }
        registeredWindow?.webContents.send(channel, data);
      }
    } catch (e) {
      console.log(`[RendererBridge] dispatch caught error:`, e)
    }
  }

  /**
   * More particular usage of `dispatch`. Use this method if windows you are sending to
   * have a Redux store. The default window for this method will have key `'main'` which will dispatch
   * Redux actions to the main window to avoid large refactors from the current usage of this method.
   */
  reduxDispatch = (action: any, windowKeys: SingleOrArray<string> | 'all' | 'main' = 'main') => {
    this.dispatch(windowKeys, 'reduxDispatch', action);
  };
};

export default new RendererBridge();
