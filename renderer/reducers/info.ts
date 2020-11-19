import { ipcRenderer } from 'electron';
import { robotState, runtimeState, defaults } from '../utils/utils';
import * as consts from '../consts';
import {
  InfoPerMessageAction,
  RuntimeConnectAction,
  MasterStatusAction,
  RuntimeDisconnectAction,
  UpdateCodeStatusAction,
  IpChangeAction,
  UpdateRobotAction,
  NotificationChangeAction,
} from '../types';

type Actions =
  | InfoPerMessageAction
  | RuntimeConnectAction
  | MasterStatusAction
  | RuntimeDisconnectAction
  | UpdateCodeStatusAction
  | IpChangeAction
  | UpdateRobotAction
  | NotificationChangeAction;

interface InfoState {
  ipAddress: string;
  studentCodeStatus: number;
  robotState: number;
  isRunningCode: boolean;
  connectionStatus: boolean;
  runtimeStatus: boolean;
  masterStatus: boolean;
  notificationHold: number;
  fieldControlDirective: number;
  fieldControlActivity: boolean;
}

const initialInfoState = {
  ipAddress: defaults.IPADDRESS,
  studentCodeStatus: robotState.IDLE,
  robotState: runtimeState.STUDENT_STOPPED,
  isRunningCode: false,
  connectionStatus: false,
  runtimeStatus: false,
  masterStatus: false,
  notificationHold: 0,
  fieldControlDirective: robotState.TELEOP,
  fieldControlActivity: false,
};

export const info = (state: InfoState = initialInfoState, action: Actions): InfoState => {
  switch (action.type) {
    case consts.InfoActionsTypes.PER_MESSAGE:
      return {
        ...state,
        connectionStatus: true,
      };
    case consts.InfoActionsTypes.NOTIFICATION_CHANGE:
      return {
        ...state,
        notificationHold: action.notificationHold,
      };
    case consts.InfoActionsTypes.RUNTIME_CONNECT:
      return {
        ...state,
        runtimeStatus: true,
      };
    case consts.InfoActionsTypes.RUNTIME_DISCONNECT:
      return {
        ...state,
        runtimeStatus: false,
        connectionStatus: false,
        studentCodeStatus: robotState.IDLE,
      };
    case consts.InfoActionsTypes.MASTER_ROBOT:
      return {
        ...state,
        masterStatus: true,
      };
    case consts.InfoActionsTypes.CODE_STATUS:
      return {
        ...state,
        studentCodeStatus: action.studentCodeStatus,
      };
    case consts.InfoActionsTypes.IP_CHANGE:
      ipcRenderer.send('ipAddress', action.ipAddress);
      return {
        ...state,
        ipAddress: action.ipAddress,
      };
    case consts.FieldActionsTypes.UPDATE_ROBOT: {
      const stateChange = action.autonomous ? robotState.AUTONOMOUS : robotState.TELEOP;
      const codeStatus = !action.enabled ? robotState.IDLE : stateChange;
      return {
        ...state,
        fieldControlDirective: stateChange,
        fieldControlActivity: action.enabled,
        // eslint-disable-next-line no-nested-ternary
        studentCodeStatus: codeStatus,
      };
    }
    default:
      return state;
  }
};
