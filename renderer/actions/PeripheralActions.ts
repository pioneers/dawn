import * as consts from '../consts';
import { PeripheralActions } from './types';

export const updatePeripherals : PeripheralActions['updatePeripherals'] = (sensors: string) => ({
    type: consts.PeripheralActionsTypes.UPDATE_PERIPHERALS,
    peripherals: sensors,
});

export const peripheralRename : PeripheralActions['peripheralRename'] = (uid: number, newname: string) => ({
    type: consts.PeripheralActionsTypes.PERIPHERAL_RENAME,
    id: uid,
    name: newname,
  });
  