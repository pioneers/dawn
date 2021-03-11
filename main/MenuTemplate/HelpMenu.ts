/**
 * Defines the Help menu
 */
import RendererBridge from '../RendererBridge';
import { showAPI } from '../main-process';
import { MenuItemConstructorOptions } from 'electron';

const HelpMenu: MenuItemConstructorOptions = {
  label: 'Help',
  submenu: [
    {
      label: 'Interactive Tutorial',
      click() {
        RendererBridge.reduxDispatch('start-interactive-tour');
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
