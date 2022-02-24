import { IObservableValue, observable, ObservableMap } from 'mobx';
import { RootStore } from './root';
import * as consts from '../consts';
import { Peripheral, PeripheralList } from '../types';

export class PeripheralsStore {
  rootStore: typeof RootStore;

  peripheralList: ObservableMap<string, Peripheral> = observable.map({});
  batterySafety: IObservableValue<boolean> = observable.box(false);
  batteryLevel: IObservableValue<number> = observable.box(0);
  runtimeVersion: IObservableValue<string> = observable.box('1.0.0');

  constructor(rootStore: typeof RootStore) {
    this.rootStore = rootStore;
  }

  updatePeripherals = (peripherals: Peripheral[]) => {
    const keys: string[] = [];

    (peripherals ?? []).forEach((peripheral: Peripheral) => {
      const key = `${peripheral.type}_${peripheral.uid}`;
      keys.push(key);

      if (key in this.peripheralList) {
        peripheral.name = this.peripheralList[key].name; // ensures that the device keeps the name, if it was a custom name
      }
      this.peripheralList[key] = { ...peripheral, uid: key };
    });

    for (const uid in this.peripheralList.keys()) {
      if (keys.indexOf(uid) === -1) {
        this.peripheralList.delete(uid); // Delete old devices
      }
    }
  };
}
