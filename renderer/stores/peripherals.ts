import { makeAutoObservable } from 'mobx';
import { RootStore } from './root';

export class PeripheralsStore {
  rootStore: typeof RootStore;

  constructor(rootStore: typeof RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }
}
