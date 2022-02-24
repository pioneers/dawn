import { ipcRenderer } from 'electron';
import { IObservableArray, IObservableValue, observable } from 'mobx';
import { FieldControlConfig } from '../types';
import { RootStore } from './root';

export class FieldStore {
  rootStore: typeof RootStore;

  stationNumber: IObservableValue<number> = observable.box(4);
  bridgeAddress: IObservableValue<string> = observable.box('localhost');
  isFieldControlModeOn: IObservableValue<boolean> = observable.box(false);
  rTeamNumber: IObservableValue<number> = observable.box(0);
  rTeamName: IObservableValue<string> = observable.box('Unknown');
  heart: IObservableValue<boolean> = observable.box(false);
  mMatchNumber: IObservableValue<number> = observable.box(0);
  mTeamNumbers: IObservableArray<number> = observable.array([0, 0, 0, 0], { deep: false });
  mTeamNames: IObservableArray<string> = observable.array(['Offline', 'Offline', 'Offline', 'Offline'], { deep: false });
  teamNumber: IObservableValue<number> = observable.box(0);
  teamColor: IObservableValue<string> = observable.box('Unknown');

  constructor(rootStore: typeof RootStore) {
    this.rootStore = rootStore;
  }

  updateFCConfig(data: FieldControlConfig) {
    //Changed into a single object because it is decompiled in the actions
    this.stationNumber.set(data.stationNumber);
    this.bridgeAddress.set(data.bridgeAddress);
  }

  toggleFieldControl = () => {
    if (this.isFieldControlModeOn.get()) {
      this.isFieldControlModeOn.set(false);
      ipcRenderer.send('FC_TEARDOWN');
    } else {
      this.isFieldControlModeOn.set(true);
      ipcRenderer.send('FC_INITIALIZE');
    }
  };

  updateHeart() {
    this.heart.set(!this.heart.get());
  }

  updateMatch(matchNumber: number, teamNumbers: number[], teamNames: string[]) {
    this.mMatchNumber.set(matchNumber);
    this.mTeamNumbers.replace(teamNumbers);
    this.mTeamNames.replace(teamNames);
    this.rTeamNumber.set(teamNumbers[this.stationNumber.get()]);
    this.rTeamName.set(teamNames[this.stationNumber.get()]);
  }
}
