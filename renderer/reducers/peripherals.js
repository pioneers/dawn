import { PeripheralTypes } from '../constants/Constants';

const initialPeripheralState = {
  peripheralList: {},
  batterySafety: false,
  batteryLevel: 0,
  runtimeVersion: '0.0.0',
};

function getParams(peripheral) {
  const res = {};
  peripheral.params.forEach((obj) => {
    // eslint-disable-next-line prefer-destructuring
    res[obj.name] = Object.values(obj)[0];
  });
  return res;
}

const peripherals = (state = initialPeripheralState, action) => {
  console.log(state);
  const nextState = Object.assign({}, state);
  const nextPeripherals = nextState.peripheralList;
  switch (action.type) {
    case 'UPDATE_PERIPHERALS': {
      console.log('update reducer');
      const keys = [];
      action.peripherals.forEach((peripheral) => {
        console.log(peripheral);
        if (peripheral.name === PeripheralTypes.BatteryBuzzer) {
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
          console.log('pushing peripheral');
          keys.push(peripheral.uid);
          if (peripheral.uid in nextPeripherals) {
            peripheral.name = nextPeripherals[peripheral.uid].name;
          }
          nextPeripherals[peripheral.uid] = peripheral;
        }
      });
      console.log(nextPeripherals);
      Object.keys(nextPeripherals).forEach((el) => {
        if (keys.indexOf(el) === -1) {
          delete nextPeripherals[el];
        }
      });
      console.log('keys');
      console.log(keys);
      console.log('next state');
      console.log(nextState);
      return nextState;
    }
    // Note: This is not being used since NameEdit is still broken
    case 'PERIPHERAL_RENAME': {
      nextPeripherals[action.id].name = action.name;
      return nextState;
    }
    default: {
      return state;
    }
  }
};

export default peripherals;
