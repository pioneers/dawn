import * as consts from '../consts';
import { UpdatePeripheralsAction, PeripheralRenameAction } from '../types';
import { Device } from "../../protos/protos";

type Actions = UpdatePeripheralsAction | PeripheralRenameAction;
type PeripheralList = Array<{ [uid: string]: Device[] }>;

const initialPeripheralList: PeripheralList = []

interface PeripheralState {
  peripheralList: PeripheralList;
  batterySafety: boolean;
  batteryLevel: number;
  runtimeVersion: string;
}

const initialPeripheralState: PeripheralState = {
  peripheralList: initialPeripheralList,
  batterySafety: false,
  batteryLevel: 0,
  runtimeVersion: '0.0.0',
};


// TODO: Handle runtimeVersion since no longer sent
export const peripherals = (state: PeripheralState = initialPeripheralState, action: Actions) => {
  const nextState = Object.assign({}, state);
  const nextPeripherals = nextState.peripheralList;
  switch (action.type) {
    case consts.PeripheralActionsTypes.UPDATE_PERIPHERALS: {
      const keys: string[] = [];
      action.peripherals.forEach((peripheral: Device) => {
        if (peripheral.name === consts.PeripheralTypes.BatteryBuzzer) {
          const batteryParams = peripheral.params;
          if (batteryParams['is_unsafe'] !== undefined) {
            nextState.batterySafety = batteryParams['is_unsafe'];
          }
          if (batteryParams['v_batt'] !== undefined) {
            nextState.batteryLevel = batteryParams['v_batt'];
          }
        } else if (peripheral.uid === -1) {
          const version = peripheral.params;
          nextState.runtimeVersion = `${version['major']}.${version['minor']}.${version['patch']}`;
        } else {
          const key: string = peripheral.uid.toString();
          keys.push(key);
          if (key in nextPeripherals) {
            peripheral.name = nextPeripherals[key].name;
          }
          nextPeripherals[key] = peripheral;
        }
      });
      Object.keys(nextPeripherals).forEach((uid: string) => {
        if (keys.indexOf(uid) === -1) {
          delete nextPeripherals[uid]; // Delete old devices
        }
      });
      return nextState;
    }
    // Note: This is not being used since NameEdit is still broken
    case consts.PeripheralActionsTypes.PERIPHERAL_RENAME: {
      // nextPeripherals[action.id].name = action.name;
      return nextState;
    }
    default: {
      return state;
    }
  }
};
