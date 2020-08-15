import * as consts from '../consts';
import { InfoActions } from '../types';

export const infoPerMessage: InfoActions['infoPerMessage'] = () => ({
  type: consts.InfoActionsTypes.PER_MESSAGE,
});

export const ansibleDisconnect: InfoActions['ansibleDisconnect'] = () => ({
  type: consts.InfoActionsTypes.ANSIBLE_DISCONNECT,
});

export const runtimeConnect: InfoActions['runtimeConnect'] = () => ({
  type: consts.InfoActionsTypes.RUNTIME_CONNECT,
});

export const runtimeDisconnect: InfoActions['runtimeDisconnect'] = () => ({
  type: consts.InfoActionsTypes.RUNTIME_DISCONNECT,
});

export const masterStatus: InfoActions['masterStatus'] = () => ({
  type: consts.InfoActionsTypes.MASTER_ROBOT,
});

export const updateCodeStatus: InfoActions['updateCodeStatus'] = (studentCodeStatus: string) => ({
  type: consts.InfoActionsTypes.CODE_STATUS,
  studentCodeStatus,
});

export const ipChange: InfoActions['ipChange'] = (ipAddress: string) => ({
  type: consts.InfoActionsTypes.IP_CHANGE,
  ipAddress,
});
