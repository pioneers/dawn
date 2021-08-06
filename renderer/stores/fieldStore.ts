import { IObservableArray, IObservableValue, makeAutoObservable, observable } from 'mobx';
import { FieldControlConfig } from '../types';
import { RootStore } from './root';

export class FieldStore {
    rootStore: typeof RootStore;
    
    stationNumber: IObservableValue<number> = observable.box(4);
    bridgeAddress: IObservableValue<string> = observable.box('localhost');
    fieldControl: IObservableValue<boolean> = observable.box(false);
    rTeamNumber: IObservableValue<number> = observable.box(0);
    rTeamName: IObservableValue<string> = observable.box('Unknown');
    heart: IObservableValue<boolean> = observable.box(false);
    masterStatus: IObservableValue<boolean> = observable.box(false);
    mMatchNumber: IObservableValue<number> = observable.box(0);
    mTeamNumbers: IObservableArray<number> = observable.array([0, 0, 0, 0], {deep: false});
    mTeamNames: IObservableArray<string> = observable.array(['Offline', 'Offline', 'Offline', 'Offline'], {deep: false});
    teamNumber: IObservableValue<number> = observable.box(0);
    teamColor: IObservableValue<string> = observable.box('Unknown');
    blueMasterTeamNumber: IObservableValue<number> = observable.box(0);
    goldMasterTeamNumber: IObservableValue<number> = observable.box(0);

    constructor(rootStore: typeof RootStore) {
        this.rootStore = rootStore;
    }

    updateFCConfig(data: FieldControlConfig) { //Changed into a single object because it is decompiled in the actions
        this.stationNumber.set(data.stationNumber);
        this.bridgeAddress.set(data.bridgeAddress);
    }

    toggleFieldControl() { // formerly FIELD_CONTROL reducer
        this.fieldControl.set(!this.fieldControl.get()); // this is what this is supposed to do, right?
    }

    updateHeart() {
        this.heart.set(!this.heart.get());
    }

    updateMaster(blueMasterTeamNumber: number, goldMasterTeamNumber: number) {
        this.masterStatus.set(true);
        this.blueMasterTeamNumber.set(blueMasterTeamNumber);
        this.goldMasterTeamNumber.set(goldMasterTeamNumber);
    }

    updateMatch(matchNumber: number, teamNumbers: number[], teamNames: string[]) {
       this.mMatchNumber.set(matchNumber);
       this.mTeamNumbers.replace(teamNumbers);
       this.mTeamNames.replace(teamNames);
       this.rTeamNumber.set(teamNumbers[this.stationNumber.get()]);
       this.rTeamName.set(teamNames[this.stationNumber.get()]);
    }
}