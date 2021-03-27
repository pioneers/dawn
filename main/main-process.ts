/*
 * Entrypoint for Dawn's main process
 */

import { app, BrowserWindow, Menu, ipcMain } from 'electron';
/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

import RendererBridge from './RendererBridge';
import { killFakeRuntime } from './MenuTemplate/DebugMenu';
import Template from './MenuTemplate/Template';
import { FCObject, Runtime } from './networking';

app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-quit', () => {
  Runtime.close();
  if (FCObject.FCInternal !== null) {
    FCObject.FCInternal.quit();
  }

  if (process.env.NODE_ENV === 'development') {
    killFakeRuntime();
  }
});

function initializeFC(_event: any) { // eslint-disable-line no-unused-vars
  try {
    FCObject.setup();
  } catch (err) {
    console.log(err);
  }
}

function teardownFC(_event: any) { // eslint-disable-line no-unused-vars
  if (FCObject.FCInternal !== null) {
    FCObject.FCInternal.quit();
  }
}

export default function showAPI() {
  let api: BrowserWindow | null = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    width: 1400,
    height: 900,
    show: false,
  });
  api.on('closed', () => {
    api = null;
  });
  api.loadURL(`file://${__dirname}/../static/website-robot-api-master/robot_api.html`);
  api.once('ready-to-show', () => {
    if (api) {
      api.show();
    }
  });
}

app.on('ready', () => {
  let videoWindow: BrowserWindow | null = null;

  Runtime.setup();
  ipcMain.on('FC_CONFIG_CHANGE', FCObject.changeFCInfo);
  ipcMain.on('FC_INITIALIZE', initializeFC);
  ipcMain.on('FC_TEARDOWN', teardownFC);

  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  ipcMain.on('SHOW_VIDEOFEED', () => {
    if (!videoWindow) {
      videoWindow = new BrowserWindow({
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true,
        },
        width: 1000,
        height: 700,
      });
      RendererBridge.registerWindow('videofeed', videoWindow);
      videoWindow.on('closed', () => {
        videoWindow = null;
      });
      videoWindow.maximize();
      videoWindow.loadURL(`file://${__dirname}/../static/video-feed/video.html`);
      videoWindow.webContents.on('dom-ready', () => RendererBridge.dispatchToWindow('videofeed', 'shepherdScoreboardServerIpAddress', FCObject.bridgeAddress))
      // setTimeout(() => RendererBridge.windowDispatch('videofeed', 'shepherdScoreboardServerIpAddress', FCObject.bridgeAddress), 3000)
      videoWindow.on('ready-to-show', () => {
        if (videoWindow) {
          videoWindow.show();
        }
      });
    }
  })

  // Binding for the main process to inject into Redux workflow
  RendererBridge.registerWindow('main', mainWindow);

  mainWindow.maximize();
  mainWindow.loadURL(`file://${__dirname}/../static/index.html`);

  const menu = Menu.buildFromTemplate(Template);
  Menu.setApplicationMenu(menu);

  if (process.env.NODE_ENV !== 'production') {
    installExtension(REACT_DEVELOPER_TOOLS).then((name: string) => {
      console.log(`Added Extension:  ${name}`);
    }).catch((err: Error) => {
      console.log('An error occurred: ', err);
    });

    installExtension(REDUX_DEVTOOLS).then((name: string) => {
      console.log(`Added Extension:  ${name}`);
    }).catch((err: Error) => {
      console.log('An error occurred: ', err);
    });
  }
});
