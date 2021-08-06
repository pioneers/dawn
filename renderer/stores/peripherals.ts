import { IObservableValue, makeAutoObservable, observable } from 'mobx';
import { RootStore } from './root';
import { Peripheral, PeripheralList } from '../types';

interface PeripheralState {
  peripheralList: PeripheralList;
  batterySafety: boolean;
  batteryLevel: number;
  runtimeVersion: string;
}

export class PeripheralsStore {
  rootStore: typeof RootStore;

  IS_UNSAFE = 0;
  V_BATT = 5;

  peripheralList = observable.map({});
  batterySafety: IObservableValue<boolean> = observable.box(false);
  batteryLevel: IObservableValue<number> = observable.box(0);
  runtimeVersion: IObservableValue<string> = observable.box('1.0.0')

  constructor(rootStore: typeof RootStore) {
    this.rootStore = rootStore;
  }

  updatePeripherals = () => {

  }
}
