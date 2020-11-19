/*
 * Defines the edit menu.
 */

import { MenuItemConstructorOptions } from 'electron';

const EditMenu: MenuItemConstructorOptions = {
  label: 'Edit',
  submenu: [
    {
      label: 'Cut',
      accelerator: 'CommandOrControl+X',
      role: 'cut'
    },
    {
      label: 'Copy',
      accelerator: 'CommandOrControl+C',
      role: 'copy'
    },
    {
      label: 'Paste',
      accelerator: 'CommandOrControl+V',
      role: 'paste'
    }
  ]
};

export default EditMenu;
