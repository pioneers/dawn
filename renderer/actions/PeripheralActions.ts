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
