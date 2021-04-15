import * as consts from '../consts';
import { UpdatePeripheralsAction, PeripheralRenameAction, Peripheral, PeripheralList, UpdateRuntimeVersionAction, UpdateBatteryAction } from '../types';

type Actions = UpdatePeripheralsAction | PeripheralRenameAction | UpdateRuntimeVersionAction | UpdateBatteryAction;

interface PeripheralState {
  peripheralList: PeripheralList;
  batterySafety: boolean;
  batteryLevel: number;
  runtimeVersion: string;
}

const initialPeripheralState: PeripheralState = {
  peripheralList: {},
  batterySafety: false,
  batteryLevel: 0,
  runtimeVersion: '1.0.0',
};

// Taken from runtime_util.c in Runtime repo
const IS_UNSAFE = 0;

export const peripherals = (state: PeripheralState = initialPeripheralState, action: Actions) => {
  const nextState = Object.assign({}, state);
  const nextPeripherals = nextState.peripheralList;
  switch (action.type) {
    case consts.PeripheralActionsTypes.UPDATE_PERIPHERALS: {
      const keys: string[] = [];

      (action.peripherals ?? []).forEach((peripheral: Peripheral) => {
        if (peripheral.name === consts.PeripheralTypes.BatteryBuzzer) {
          const batteryParams = peripheral.params;
          if (batteryParams[IS_UNSAFE] && batteryParams[IS_UNSAFE].bval) {
            nextState.batterySafety = batteryParams[IS_UNSAFE].bval!;
          }
        } else {
          const key = `${peripheral.type}_${peripheral.uid}`;
          keys.push(key);

          if (key in nextPeripherals) {
            peripheral.name = nextPeripherals[key].name; // ensures that the device keeps the name, if it was a custom name
          }
          nextPeripherals[key] = { ...peripheral, uid: key };
        }
        nextState.batteryLevel = state.batteryLevel;
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
    case consts.PeripheralActionsTypes.UPDATE_RUNTIME_VERSION:
      return {
        ...state,
        runtimeVersion: action.version
      }
    case consts.PeripheralActionsTypes.UPDATE_BATTERY:
      return {
        ...state,
        batteryLevel: action.battery
      }
    default: {
      return state;
    }
  }
};
