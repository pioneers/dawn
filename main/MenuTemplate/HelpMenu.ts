/**
 * Defines the Help menu
 */
import RendererBridge from '../RendererBridge';
import {showAPI, showVideo} from '../main-process';
import { MenuItemConstructorOptions } from 'electron';

const HelpMenu: MenuItemConstructorOptions = {
  label: 'Help',
  submenu: [
    {
      label: 'Interactive Tutorial',
      click() {
        if (RendererBridge.registeredWindow) {
          RendererBridge.registeredWindow.webContents.send('start-interactive-tour');
        }
      },
      accelerator: 'CommandOrControl+T',
    },
    {
      label: 'PiE API',
      click() {
        showAPI();
      },
      accelerator: 'CommandOrControl+P',
    },
    {
      label: 'Video Feed',
      click() {
        showVideo();
      },
      accelerator: 'CommandOrControl+V'
    }
  ],
};

export default HelpMenu;
