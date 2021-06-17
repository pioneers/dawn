import { createContext, useContext } from 'react';
import { ConsoleStore } from './console';

export class RootStore {
  console: ConsoleStore;

  constructor() {
    this.console = new ConsoleStore(this);
    this.peripherals
  }
}

// export const rootStore = createContext(new RootStore());
export const useRootStore = () => useContext(createContext(new RootStore()));
