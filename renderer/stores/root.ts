import { ConsoleStore } from './console';
// Make sure store imports are in alphabetical order

class RootStore_ {
  console: ConsoleStore;

  constructor() {
    this.console = new ConsoleStore(this);
    /** Initialize more stores here (try to keep it in alphabetical order) */
  }
}

export const RootStore = new RootStore_();
