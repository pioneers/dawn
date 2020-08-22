import * as consts from '../../consts';
import { IDevice } from '../../../protos/protos';

export interface UpdatePeripheralsAction {
  type: consts.PeripheralActionsTypes.UPDATE_PERIPHERALS;
  peripherals: IDevice[];
}

export interface PeripheralRenameAction {
  type: consts.PeripheralActionsTypes.PERIPHERAL_RENAME;
  id: number;
  name: string;
}

export interface PeripheralActions {
  updatePeripherals: (sensors: IDevice[]) => UpdatePeripheralsAction;

  peripheralRename: (uid: number, newName: string) => PeripheralRenameAction;
}
