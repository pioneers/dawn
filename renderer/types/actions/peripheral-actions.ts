import * as consts from '../../consts';
import { Peripheral } from '../peripheral';
import { IDevice } from '../../../protos/protos';

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
  updatePeripherals: (sensors: Peripheral[]) => UpdatePeripheralsAction;

  peripheralRename: (uid: number, newName: string) => PeripheralRenameAction;
}
