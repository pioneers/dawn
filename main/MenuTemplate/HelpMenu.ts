/**
 * Defines the Help menu
 */
import RendererBridge from '../RendererBridge';
import showAPI from '../main-process';
import { MenuItemConstructorOptions } from 'electron';
import { ipcChannels } from '../../shared';

const HelpMenu: MenuItemConstructorOptions = {
  label: 'Help',
  submenu: [
    {
      label: 'Interactive Tutorial',
      click() {
        RendererBridge.dispatch('main', ipcChannels.START_INTERACTIVE_TOUR);
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
  ],
};

export default HelpMenu;
