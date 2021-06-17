import { ConsoleStore } from './console';

export class RootStore {
  console: ConsoleStore;

  constructor() {
    this.console = new ConsoleStore(this);
    /** Initialize more stores here (try to keep it in alphabetical order) */
  }
}
