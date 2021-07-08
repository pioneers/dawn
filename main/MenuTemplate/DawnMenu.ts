/**
 * Defines the Dawn menu
 */

import { app, MenuItemConstructorOptions } from 'electron';
import RendererBridge from '../RendererBridge';

const DawnMenu: MenuItemConstructorOptions = {
  label: 'Dawn',
  submenu: [
    {
      label: 'Quit',
      accelerator: 'CommandOrControl+Q',
      click() {
        app.quit();
      },
    },
    { // this should be a button in the UI instead of a context menu
      label: 'Dark/Light Theme',
      click() {
        RendererBridge.reduxDispatch({
          type: 'TOGGLE_THEME_GLOBAL',
        });
      }
    },
    {
      label: 'Field Control Mode',
      click() {
        RendererBridge.reduxDispatch({
          type: 'TOGGLE_FIELD_CONTROL',
        });
      },
    },
  ],
};

export default DawnMenu;
