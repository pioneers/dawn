import * as consts from '../../consts';
import { Device } from '../../../protos/protos';

export interface UpdatePeripheralsAction {
  type: consts.PeripheralActionsTypes.UPDATE_PERIPHERALS;
  peripherals: Device[];
}

export interface PeripheralRenameAction {
  type: consts.PeripheralActionsTypes.PERIPHERAL_RENAME;
  id: number;
  name: string;
}

export interface PeripheralActions {
  updatePeripherals: (sensors: Device[]) => UpdatePeripheralsAction;

  peripheralRename: (uid: number, newName: string) => PeripheralRenameAction;
}
