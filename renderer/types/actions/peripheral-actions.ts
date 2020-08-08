import * as consts from '../consts';

export interface PeripheralActions {
  updatePeripherals: (
    sensors: string
  ) => {
    type: consts.PeripheralActionsTypes.UPDATE_PERIPHERALS;
    peripherals: string;
  };

  peripheralRename: (
    uid: number,
    newname: string
  ) => {
    type: consts.PeripheralActionsTypes.PERIPHERAL_RENAME;
    id: number;
    name: string;
  };
}
