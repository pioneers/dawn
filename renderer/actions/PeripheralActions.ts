import * as consts from '../consts';
import { Peripheral, PeripheralActions } from '../types';

export const updatePeripherals: PeripheralActions['updatePeripherals'] = (peripherals: Peripheral[]) => ({
  type: consts.PeripheralActionsTypes.UPDATE_PERIPHERALS,
  peripherals
});

export const peripheralRename: PeripheralActions['peripheralRename'] = (uid: number, newName: string) => ({
  type: consts.PeripheralActionsTypes.PERIPHERAL_RENAME,
  id: uid,
  name: newName,
});

export const updateRuntimeVersion: PeripheralActions['updateRuntimeVersion'] = (version: string) => ({
  type: consts.PeripheralActionsTypes.UPDATE_RUNTIME_VERSION,
  version: version,
})

export const updateBattery: PeripheralActions['updateBattery'] = (battery: number) => ({
  type: consts.PeripheralActionsTypes.UPDATE_BATTERY,
  battery: battery,
})