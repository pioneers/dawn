import * as consts from '../../consts';

export interface InfoPerMessageAction {
  type: consts.InfoActionsTypes.PER_MESSAGE;
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
  studentCodeStatus: number;
}

export interface IpChangeAction {
  type: consts.InfoActionsTypes.IP_CHANGE;
  ipAddress: string;
}

export interface UDPTunnelIpChangeAction {
  type: consts.InfoActionsTypes.UDP_TUNNEL_IP_CHANGE;
  ipAddress: string;
}

export interface SSHIpChangeAction {
  type: consts.InfoActionsTypes.SSH_IP_CHANGE;
  ipAddress: string;
}

export interface NotificationChangeAction {
  type: consts.InfoActionsTypes.NOTIFICATION_CHANGE;
  notificationHold: number;
}

export interface InfoActions {
  infoPerMessage: () => InfoPerMessageAction;

  runtimeConnect: () => RuntimeConnectAction;

  masterStatus: () => MasterStatusAction;

  runtimeDisconnect: () => RuntimeDisconnectAction;

  updateCodeStatus: (studentCodeStatus: number) => UpdateCodeStatusAction;

  ipChange: (ipAddress: string) => IpChangeAction;

  udpTunnelIpChange: (ipAddress: string) => UDPTunnelIpChangeAction;

  sshIpChange: (ipAddress: string) => SSHIpChangeAction;

  notificationChange: () => NotificationChangeAction;
}
