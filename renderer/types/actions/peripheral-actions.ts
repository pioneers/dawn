import * as consts from '../../consts';
import { Peripheral } from '../../types';

export interface UpdatePeripheralsAction {
  type: consts.PeripheralActionsTypes.UPDATE_PERIPHERALS;
  peripherals: Peripheral[];
}

export interface PeripheralRenameAction {
  type: consts.PeripheralActionsTypes.PERIPHERAL_RENAME;
  id: number;
  name: string;
}

export interface UpdateRuntimeVersionAction {
  type: consts.PeripheralActionsTypes.UPDATE_RUNTIME_VERSION;
  version: string;
}

export interface UpdateBatteryAction {
  type:consts.PeripheralActionsTypes.UPDATE_BATTERY;
  battery: number;
}

export interface PeripheralActions {
  updatePeripherals: (sensors: Peripheral[]) => UpdatePeripheralsAction;

  peripheralRename: (uid: number, newName: string) => PeripheralRenameAction;

  updateRuntimeVersion: (version: string) => UpdateRuntimeVersionAction;

  updateBattery: (battery: number) => UpdateBatteryAction;
}
