import * as consts from '../consts';
import { PeripheralActions } from '../types';
import { Device } from '../../protos/protos';

export const updatePeripherals: PeripheralActions['updatePeripherals'] = (sensors: Device[]) => ({
  type: consts.PeripheralActionsTypes.UPDATE_PERIPHERALS,
  peripherals: sensors,
});

export const peripheralRename: PeripheralActions['peripheralRename'] = (uid: number, newName: string) => ({
  type: consts.PeripheralActionsTypes.PERIPHERAL_RENAME,
  id: uid,
  name: newName,
});
