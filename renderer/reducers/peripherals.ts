import * as consts from '../consts';
import { UpdatePeripheralsAction, PeripheralRenameAction } from '../types';

type Actions = UpdatePeripheralsAction | PeripheralRenameAction;

interface PeripheralState {
  peripheralList: object;
  batterySafety: boolean;
  batteryLevel: number;
  runtimeVersion: string;
}

const initialPeripheralState = {
  peripheralList: {},
  batterySafety: false,
  batteryLevel: 0,
  runtimeVersion: '0.0.0',
};

function getParams(peripheral: any) {
  const res = {};
  peripheral.param_value.forEach((obj) => {
    // eslint-disable-next-line prefer-destructuring
    res[obj.param] = Object.values(obj)[0];
  });
  return res;
}

export const peripherals = (state: PeripheralState = initialPeripheralState, action: Actions) => {
  const nextState = Object.assign({}, state);
  const nextPeripherals = nextState.peripheralList;
  switch (action.type) {
    case consts.PeripheralActionsTypes.UPDATE_PERIPHERALS: {
      const keys = [];
      action.peripherals.forEach((peripheral) => {
        if (peripheral.device_type === consts.PeripheralTypes.BatteryBuzzer) {
          const batteryParams = getParams(peripheral);
          if (batteryParams.is_unsafe !== undefined) {
            nextState.batterySafety = batteryParams.is_unsafe;
          }
          if (batteryParams.v_batt !== undefined) {
            nextState.batteryLevel = batteryParams.v_batt;
          }
        } else if (peripheral.uid === '-1') {
          const version = getParams(peripheral);
          nextState.runtimeVersion = `${version.major}.${version.minor}.${version.patch}`;
        } else {
          keys.push(peripheral.uid);
          if (peripheral.uid in nextPeripherals) {
            peripheral.device_name = nextPeripherals[peripheral.uid].device_name;
          }
          nextPeripherals[peripheral.uid] = peripheral;
        }
      });
      Object.keys(nextPeripherals).forEach((el) => {
        if (keys.indexOf(el) === -1) {
          delete nextPeripherals[el];
        }
      });
      return nextState;
    }
    // Note: This is not being used since NameEdit is still broken
    case consts.PeripheralActionsTypes.PERIPHERAL_RENAME: {
      nextPeripherals[action.id].name = action.name;
      return nextState;
    }
    default: {
      return state;
    }
  }
};
