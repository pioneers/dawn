import { ipcRenderer } from 'electron';
import { makeAutoObservable } from 'mobx';
import { robotState, defaults } from '../utils/utils';
import { RootStore } from './root';

type updateState = {
    autonomous: number,
    enabled: boolean
}

export class InfoStore {
    rootStore: typeof RootStore;

    ipAddress: string= defaults.IPADDRESS
    udpTunnelIpAddress: string = defaults.IPADDRESS
    sshAddress: string = defaults.IPADDRESS
    studentCodeStatus: number = robotState.IDLE
    isRunningCode: boolean = false
    connectionStatus: boolean = false
    runtimeStatus: boolean = false
    masterStatus: boolean = false
    notificationHold: number = 0
    fieldControlDirective: number = robotState.TELEOP
    fieldControlActivity: boolean = false
  
    constructor(rootStore: typeof RootStore) {
      makeAutoObservable(this);
      this.rootStore = rootStore;
    }

    perMessage = () => {
        this.connectionStatus = true
    }
    
    notificationChange = (notification: number) => {
        this.notificationHold = notification
    };
  
    runtimeConnect = () => {
        this.runtimeStatus = true
    };

    runtimeDisconnect = () => {
        this.runtimeStatus = false;
        this.connectionStatus = false;
        this.studentCodeStatus = robotState.IDLE;
    }

    masterRobot = () => {
        this.masterStatus = true;
    }

    codeStatus = (codeStatus: number) => {
        ipcRenderer.send('runModeUpdate', { mode: codeStatus });
        this.studentCodeStatus = codeStatus;
    }

    ipChange = (address: string) => {
        ipcRenderer.send('ipAddress', address);
        this.ipAddress = address;
    }

    udpTunnelIpChange = (address: string) => {
        ipcRenderer.send('udpTunnelIpAddress', address);
        this.udpTunnelIpAddress = address
    }

    sshIpChange = (address: string) => {
        this.sshAddress = address
    }

    updateRobot = (status: updateState) => {
        const stateChange = (status.autonomous) ? robotState.AUTONOMOUS : robotState.TELEOP;
        const codeStatus = (!status.enabled) ? robotState.IDLE : stateChange;

        this.fieldControlDirective = stateChange;
        this.fieldControlActivity = status.enabled;
        this.studentCodeStatus = codeStatus
    }
  }