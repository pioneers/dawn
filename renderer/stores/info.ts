import { ipcRenderer } from 'electron';
import { IObservableValue, observable } from 'mobx';
import { robotState, defaults } from '../utils/utils';
import { RootStore } from './root';

type updateState = {
  autonomous: number;
  enabled: boolean;
};

export class InfoStore {
  rootStore: typeof RootStore;

  ipAddress: IObservableValue<string> = observable.box(defaults.IPADDRESS);
  sshAddress: IObservableValue<string> = observable.box(defaults.IPADDRESS);
  studentCodeStatus: IObservableValue<number> = observable.box(robotState.IDLE);
  isRunningCode: IObservableValue<boolean> = observable.box(false);
  connectionStatus: IObservableValue<boolean> = observable.box(false);
  runtimeStatus: IObservableValue<boolean> = observable.box(false);
  notificationHold: IObservableValue<number> = observable.box(0); // TODO: not sure what this is
  fieldControlDirective: IObservableValue<number> = observable.box(robotState.TELEOP); // TODO: not sure what this is
  fieldControlActivity: IObservableValue<boolean> = observable.box(false); // TODO: not sure what this is

  constructor(rootStore: typeof RootStore) {
    this.rootStore = rootStore;
  }

  perMessage = () => {
    this.connectionStatus.set(true);
  };

  notificationChange = (notification: number) => {
    this.notificationHold.set(notification);
  };

  runtimeConnect = () => {
    this.runtimeStatus.set(true);
  };

  runtimeDisconnect = () => {
    this.runtimeStatus.set(false);
    this.connectionStatus.set(false);
    this.studentCodeStatus.set(robotState.IDLE);
  };

  codeStatus = (codeStatus: number) => {
    ipcRenderer.send('runModeUpdate', { mode: codeStatus });
    this.studentCodeStatus.set(codeStatus);
  };

  ipChange = (address: string) => {
    ipcRenderer.send('ipAddress', address);
    this.ipAddress.set(address);
  };

  sshIpChange = (address: string) => {
    this.sshAddress.set(address);
  };

  updateRobot = (status: updateState) => {
    const stateChange = status.autonomous ? robotState.AUTONOMOUS : robotState.TELEOP;
    const codeStatus = !status.enabled ? robotState.IDLE : stateChange;

    this.fieldControlDirective.set(stateChange);
    this.fieldControlActivity.set(status.enabled);
    this.studentCodeStatus.set(codeStatus);
  };
}
