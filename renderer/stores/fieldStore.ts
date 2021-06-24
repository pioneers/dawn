import { makeAutoObservable } from 'mobx';
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

    updateFCConfig(stationNumber: number, bridgeAddress: string) {
        this.stationNumber = stationNumber;
        this.bridgeAddress = bridgeAddress;
    }

    toggleFieldControl() { // formerly FIELD_CONTROL reducer
        this.fieldControl = !this.fieldControl; // this is what this is supposed to do, right?
    }

    updateHeart() {
        this.heart = !this.heart;
    }

    updateMaster() {
        this.masterStatus = true;
        this.blueMasterTeamNumber 
    }

    updateMatch() {

    }


}