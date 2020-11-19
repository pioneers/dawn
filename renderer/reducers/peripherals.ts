import * as consts from '../consts';
import { UpdatePeripheralsAction, PeripheralRenameAction, PeripheralList } from '../types';
import { Device } from '../../protos/protos';

type Actions = UpdatePeripheralsAction | PeripheralRenameAction;

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
  runtimeVersion: '1.0.0'
};

// Taken from runtime_util.c in Runtime repo
const IS_UNSAFE = 0;
const V_BATT = 5;

// TODO: Handle runtimeVersion since no longer sent
export const peripherals = (state: PeripheralState = initialPeripheralState, action: Actions) => {
  const nextState = Object.assign({}, state);
  const nextPeripherals = nextState.peripheralList;
  switch (action.type) {
    case consts.PeripheralActionsTypes.UPDATE_PERIPHERALS: {
      const keys: string[] = [];

      (action.peripherals ?? []).forEach((peripheral: Device) => {
        if (peripheral.name === consts.PeripheralTypes.BatteryBuzzer) {
          const batteryParams = peripheral.params;
          if (batteryParams[IS_UNSAFE] && batteryParams[IS_UNSAFE].bval) {
            nextState.batterySafety = batteryParams[IS_UNSAFE].bval;
          }
          if (batteryParams[V_BATT] && batteryParams[V_BATT].fval) {
            nextState.batteryLevel = batteryParams[V_BATT].fval;
          }
        } else if (peripheral.uid === -1) {
          // const version = peripheral.params;
          // nextState.runtimeVersion = `${version['major']}.${version['minor']}.${version['patch']}`;
        } else {
          const key =
            typeof peripheral.uid === 'number'
              ? peripheral.uid.toString()
              : (peripheral.uid.high || '').toString() + peripheral.uid.low.toString();
          keys.push(key);
          if (key in nextPeripherals) {
            peripheral.name = nextPeripherals[key].name; // ensures that the device keeps the name, if it was a custom name
          }
          nextPeripherals[key] = { ...peripheral, uid: key };
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
