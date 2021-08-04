import { makeAutoObservable } from 'mobx';
import { FieldControlConfig } from '../types';
import { RootStore } from './root';

export class FieldStore {
    rootStore: typeof RootStore;
    
    stationNumber: number = 4;
    bridgeAddress: string = 'localhost';
    fieldControl: boolean = false;
    rTeamNumber: number = 0;
    rTeamName: string = 'Unknown';
    heart: boolean = false;
    masterStatus: boolean = false;
    mMatchNumber: number = 0;
    mTeamNumbers: number[] = [0, 0, 0, 0];
    mTeamNames: string[] = ['Offline', 'Offline', 'Offline', 'Offline'];
    teamNumber: number = 0;
    teamColor: string = 'Unknown';
    blueMasterTeamNumber: number = 0;
    goldMasterTeamNumber: number = 0;

    constructor(rootStore: typeof RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    updateFCConfig(data: FieldControlConfig) { //Changed into a single object because it is decompiled in the actions
        this.stationNumber = data.stationNumber;
        this.bridgeAddress = data.bridgeAddress;
    }

    toggleFieldControl() { // formerly FIELD_CONTROL reducer
        this.fieldControl = !this.fieldControl; // this is what this is supposed to do, right?
    }

    updateHeart() {
        this.heart = !this.heart;
    }

    updateMaster(blueMasterTeamNumber: number, goldMasterTeamNumber: number) {
        this.masterStatus = true;
        this.blueMasterTeamNumber = blueMasterTeamNumber;
        this.goldMasterTeamNumber = goldMasterTeamNumber;
    }

    updateMatch(matchNumber: number, teamNumbers: number[], teamNames: string[]) {
       this.mMatchNumber = matchNumber;
       this.mTeamNumbers = teamNumbers;
       this.mTeamNames = teamNames;
       this.rTeamNumber = teamNumbers[this.stationNumber];
       this.rTeamName = teamNames[this.stationNumber];
    }
}