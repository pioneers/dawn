import { IObservableValue, observable, ObservableMap } from 'mobx';
import { RootStore } from './root';
import * as consts from '../consts';
import { Peripheral, PeripheralList } from '../types';

interface PeripheralState {
  peripheralList: PeripheralList;
  batterySafety: boolean;
  batteryLevel: number;
  runtimeVersion: string;
}

export class PeripheralsStore {
  rootStore: typeof RootStore;

  IS_UNSAFE = 0; //Move to Consts?
  V_BATT = 5;

  peripheralList: ObservableMap = observable.map({});
  batterySafety: IObservableValue<boolean> = observable.box(false);
  batteryLevel: IObservableValue<number> = observable.box(0);
  runtimeVersion: IObservableValue<string> = observable.box('1.0.0')

  constructor(rootStore: typeof RootStore) {
    this.rootStore = rootStore;
  }

  updatePeripherals = (peripherals: Peripheral[]) => {
    const keys: string[] = [];

    (peripherals ?? []).forEach((peripheral: Peripheral) => {
      if (peripheral.name === consts.PeripheralTypes.BatteryBuzzer) {
        const batteryParams = peripheral.params;
        if (batteryParams[this.IS_UNSAFE] && batteryParams[this.IS_UNSAFE].bval) {
          this.peripheralList.merge({"batterySafety" : batteryParams[this.IS_UNSAFE].bval!});
        }
        if (batteryParams[this.V_BATT] && batteryParams[this.V_BATT].fval) {
          this.peripheralList.merge({"batteryLevel" : batteryParams[this.V_BATT].fval!});
        }
      } else {
        const key = `${peripheral.type}_${peripheral.uid}`;
        keys.push(key);

        if (key in this.peripheralList) {
          peripheral.name = this.peripheralList[key].name; // ensures that the device keeps the name, if it was a custom name
        }
        this.peripheralList[key] = { ...peripheral, uid: key };
      }})

      for (let uid in this.peripheralList.keys()){
        if (keys.indexOf(uid) === -1) {
          this.peripheralList.delete(uid) // Delete old devices
        }
      }
    };

    

}
