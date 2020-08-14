import * as consts from '../consts';
import { UpdatePeripheralsAction, PeripheralRenameAction } from '../types';
import { PeripheralState, Peripheral, Param } from '../types/peripheral';

type Actions = UpdatePeripheralsAction | PeripheralRenameAction;

const initialPeripheralList: Peripheral[] = []

const initialPeripheralState: PeripheralState = {
  peripheralList: initialPeripheralList,
  batterySafety: false,
  batteryLevel: 0,
  runtimeVersion: '0.0.0',
};

function getParams(peripheral: Peripheral): Omit<Param, 'val'> {
  const res: Omit<Param, 'val'> = { name: ''};
  peripheral.params.forEach((obj: Param) => {
    // eslint-disable-next-line prefer-destructuring
    res[obj.name] = Object.values(obj)[0];
  });
  return res;
}

// TODO: Handle runtimeVersion since no longer sent
export const peripherals = (state: PeripheralState = initialPeripheralState, action: Actions) => {
  const nextState = Object.assign({}, state);
  const nextPeripherals: {[uid: number]: Peripheral} = nextState.peripheralList;
  switch (action.type) {
    case consts.PeripheralActionsTypes.UPDATE_PERIPHERALS: {
      const keys: string[] = [];
      action.peripherals.forEach((peripheral) => {
        if (peripheral.name === consts.PeripheralTypes.BatteryBuzzer) {
          const batteryParams: Omit<Param, 'val'> = getParams(peripheral);
          if (batteryParams['is_unsafe'] !== undefined) {
            nextState.batterySafety = batteryParams['is_unsafe'];
          }
          if (batteryParams['v_batt'] !== undefined) {
            nextState.batteryLevel = batteryParams['v_batt'];
          }
        } else if (peripheral.uid === '-1') {
          const version: Omit<Param, 'val'> = getParams(peripheral);
          nextState.runtimeVersion = `${version['major']}.${version['minor']}.${version['patch']}`;
        } else {
          keys.push(peripheral.uid);
          if (peripheral.uid in nextPeripherals) {
            peripheral.name = nextPeripherals[peripheral.uid].name;
          }
          nextPeripherals[peripheral.uid] = peripheral;
        }
      });
      Object.keys(nextPeripherals).forEach((el: string) => {
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
