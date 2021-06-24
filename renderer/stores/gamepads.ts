import { makeAutoObservable } from 'mobx';
import { RootStore } from './root';
import { Input } from '../../protos/protos';

export class GamepadsStore {
  rootStore: typeof RootStore;

  gamepads?: Input[];

  constructor(rootStore: typeof RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  updateGamepads(newGamepads: Input[]) {
	this.gamepads = newGamepads;
  }
}
