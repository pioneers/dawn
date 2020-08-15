import * as consts from '../../consts';

export interface InfoPerMessageAction {
  type: consts.InfoActionsTypes.PER_MESSAGE;
}

export interface AnsibleDisconnectAction {
  type: consts.InfoActionsTypes.ANSIBLE_DISCONNECT;
}

export interface RuntimeConnectAction {
  type: consts.InfoActionsTypes.RUNTIME_CONNECT;
}

export interface RuntimeDisconnectAction {
  type: consts.InfoActionsTypes.RUNTIME_DISCONNECT;
}

export interface MasterStatusAction {
  type: consts.InfoActionsTypes.MASTER_ROBOT;
}

export interface UpdateCodeStatusAction {
  type: consts.InfoActionsTypes.CODE_STATUS;
  studentCodeStatus: string;
}

export interface IpChangeAction {
  type: consts.InfoActionsTypes.IP_CHANGE;
  ipAddress: string;
}

export interface NotificationChangeAction {
  type: consts.InfoActionsTypes.NOTIFICATION_CHANGE;
  notificationHold: number;
}

export interface InfoActions {
  infoPerMessage: () => InfoPerMessageAction;

  ansibleDisconnect: () => AnsibleDisconnectAction;

  runtimeConnect: () => RuntimeConnectAction;

  masterStatus: () => MasterStatusAction;

  runtimeDisconnect: () => RuntimeDisconnectAction;

  updateCodeStatus: (studentCodeStatus: string) => UpdateCodeStatusAction;

  ipChange: (ipAddress: string) => IpChangeAction;

  notificationChange: () => NotificationChangeAction;
}
