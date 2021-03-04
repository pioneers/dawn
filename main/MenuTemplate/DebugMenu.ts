import { fork, ChildProcess } from 'child_process';
import RendererBridge from '../RendererBridge';
import { FCObject } from '../networking/FieldControl';
import { MenuItemConstructorOptions } from 'electron';

let fakeRuntime: ChildProcess | null = null;

export function killFakeRuntime() {
  if (fakeRuntime) {
    fakeRuntime.kill();
    fakeRuntime = null;
    console.log('Fake runtime killed');
  }
}

const DebugMenu: MenuItemConstructorOptions = {
  label: 'Debug',
  submenu: [
    {
      label: 'Toggle DevTools',
      click() {
        RendererBridge.toggleWindowDevtools('main');
      },
      accelerator: 'CommandOrControl+alt+I',
    },
    {
      label: 'Toggle Dashboard DevTools',
      click() {
        RendererBridge.toggleWindowDevtools('dash');
      },
      accelerator: 'CommandOrControl+alt+shift+I',
    },
    {
      label: 'Restart Runtime',
      click() {
        RendererBridge.reduxDispatch({
          type: 'RESTART_RUNTIME',
        });
      },
    },
    {
      label: 'Restart FC',
      click() {
        if (FCObject.FCInternal !== null) {
          FCObject.FCInternal.quit();
          FCObject.setup();
        } else {
          console.log('Field Control not active');
        }
      },
    },
    {
      label: 'Toggle Console Autoscroll',
      click() {
        RendererBridge.reduxDispatch({
          type: 'TOGGLE_SCROLL',
        });
      },
    },

    {
      label: 'Reload',
      accelerator: 'CommandOrControl+R',
      click() {
        RendererBridge.reloadWindow('main');
      },
    },

    {
      label: 'Full Stack Timestamp',
      click() {
        RendererBridge.reduxDispatch({
          type: 'TIMESTAMP_CHECK',
        });
      },
    },
  ],
};

if (process.env.NODE_ENV === 'development') {
  (DebugMenu.submenu as MenuItemConstructorOptions[]).push({ // Need to type cast since submenu's type isn't always array
    label: 'Toggle Fake Runtime',
    click() {
      if (fakeRuntime) {
        killFakeRuntime();
      } else {
        fakeRuntime = fork('./fake-runtime/FakeRuntime.ts', [], { execArgv: ['-r', 'ts-node/register']});
      }
    },
  });
}

export default DebugMenu;
