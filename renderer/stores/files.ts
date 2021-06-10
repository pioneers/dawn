import { ipcRenderer, IpcRendererEvent } from 'electron';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { Peripheral, PeripheralList } from '../types';

class PeripheralStoreImpl {
  peripherals: PeripheralList = {};

  constructor() {
    ipcRenderer.on('runtime-peripherals', (_: IpcRendererEvent, newPeripherals: Peripheral[]) => {
      this.updatePeripherals(newPeripherals);
    });

    makeAutoObservable(this);
  }

  updatePeripherals = (newPeripherals: Peripheral[]) => {
    const nextPeripherals = this.peripherals;
    const keys: string[] = [];

    // console.log('new peripherals', newPeripherals);

    (newPeripherals ?? []).forEach((peripheral: Peripheral) => {
      const key = `${peripheral.type}_${peripheral.uid}`;
      keys.push(key);

      if (key in nextPeripherals) {
        peripheral.name = nextPeripherals[key].name; // ensures that the device keeps the name, if it was a custom name
      }
      nextPeripherals[key] = { ...peripheral, uid: key };
    });

    Object.keys(nextPeripherals).forEach((uid: string) => {
      if (keys.indexOf(uid) === -1) {
        delete nextPeripherals[uid]; // Delete old devices
      }
    });

    this.peripherals = nextPeripherals;
  };
}

export const PeripheralStore = createContext(new PeripheralStoreImpl());
