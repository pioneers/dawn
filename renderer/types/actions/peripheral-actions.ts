import * as consts from '../../consts';
import { Peripheral } from '../peripheral';

export interface UpdatePeripheralsAction {
  type: consts.PeripheralActionsTypes.UPDATE_PERIPHERALS;
  peripherals: Peripheral[];
}

export interface PeripheralRenameAction {
  type: consts.PeripheralActionsTypes.PERIPHERAL_RENAME;
  id: number;
  name: string;
}

export interface PeripheralActions {
  updatePeripherals: (sensors: string) => UpdatePeripheralsAction;

  peripheralRename: (uid: number, newName: string) => PeripheralRenameAction;
}
