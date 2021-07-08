import { makeAutoObservable } from 'mobx';
import { RootStore } from './root';

export class ConsoleStore {
  rootStore: typeof RootStore;

  showConsole = false;
  consoleData: string[] = [];
  disableScroll = false;
  consoleUnread = false;

  constructor(rootStore: typeof RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  updateConsole = (value: string[]) => {
    this.consoleData = [...this.consoleData, ...value];
    this.consoleUnread = !this.consoleUnread;
  };

  clearConsole = () => {
    this.consoleData = [];
  };

  toggleConsole = () => {
    this.showConsole = !this.showConsole;
    this.consoleUnread = false;
  };
}
