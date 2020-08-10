import * as consts from '../../consts';

export interface UpdatePeripheralsAction{
  type: consts.PeripheralActionsTypes.UPDATE_PERIPHERALS;
  peripherals: string;
}

export interface PeripheralRenameAction{
  type: consts.PeripheralActionsTypes.PERIPHERAL_RENAME;
  id: number;
  name: string;
}

export interface PeripheralActions {
  updatePeripherals: (
    sensors: string
  ) => UpdatePeripheralsAction;

  peripheralRename: (
    uid: number,
    newname: string
  ) => PeripheralRenameAction;
}
