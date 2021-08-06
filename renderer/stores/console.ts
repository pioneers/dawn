import { IObservableArray, observable } from 'mobx';
import { RootStore } from './root';

export class ConsoleStore {
  rootStore: typeof RootStore;

  showConsole = observable.box(false);
  consoleData: IObservableArray = observable.array([], {deep: false});
  disableScroll = observable.box(false);
  consoleUnread = observable.box(false);

  constructor(rootStore: typeof RootStore) {
    this.rootStore = rootStore;
  }

  updateConsole = (value: string[]) => {
    this.consoleData.replace([...this.consoleData, ...value]);
    this.consoleUnread.set(!this.consoleUnread.get());
  };

  clearConsole = () => {
    this.consoleData.clear();
  };

  toggleConsole = () => {
    this.showConsole.set(!this.showConsole.get());
    this.consoleUnread.set(false);
  };
}
