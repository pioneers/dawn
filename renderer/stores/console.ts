import { makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react';

export class ConsoleStore {
  showConsole = false;
  consoleData: string[] = [];
  disableScroll = false;
  consoleUnread = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  updateConsole = (value: string[]) => {
    this.consoleData = [...this.consoleData, ...value];
  }

  clearConsole = (value: string[]) => {
    this.rootStore.peripherals
  }

  toggleConsole = (value: string[]) => {
    
  }
}

// export const PeripheralStore = createContext(new ConsoleStoreImpl());
