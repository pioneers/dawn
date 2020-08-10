import { ipcRenderer } from 'electron';
import { robotState, runtimeState, defaults } from '../utils/utils';
import * as consts from '../consts';
import { InfoPerMessageAction, AnsibleDisconnectAction, RuntimeConnectAction, MasterStatusAction, RuntimeDisconnectAction, UpdateCodeStatusAction, IpChangeAction, UpdateRobotAction, NotificationChangeAction } from '../types';

type Actions = InfoPerMessageAction | AnsibleDisconnectAction | RuntimeConnectAction | MasterStatusAction | RuntimeDisconnectAction | UpdateCodeStatusAction | IpChangeAction | UpdateRobotAction | NotificationChangeAction;

interface InfoState {
  ipAddress: string
  studentCodeStatus: number,
  robotState: number,
  isRunningCode: boolean,
  connectionStatus: boolean,
  runtimeStatus: boolean,
  masterStatus: boolean,
  notificationHold: number,
  fieldControlDirective: number,
  fieldControlActivity: boolean,
};

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

const info = (state: InfoState = initialInfoState, action: Actions) => {
  switch (action.type) {
    case consts.InfoActionsTypes.PER_MESSAGE:
      return {
        ...state,
        connectionStatus: true,
        robotState: action.robotState,
        isRunningCode: (action.robotState === runtimeState.STUDENT_RUNNING ||
        action.robotState === runtimeState.TELEOP ||
        action.robotState === runtimeState.AUTONOMOUS),
      };
    case consts.InfoActionsTypes.ANSIBLE_DISCONNECT:
      return {
        ...state,
        connectionStatus: false,
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
    case consts.InfoActionsTypes.MASTER_ROBOT:
      return {
        ...state,
        masterStatus: true,
      };
    case consts.InfoActionsTypes.RUNTIME_DISCONNECT:
      return {
        ...state,
        runtimeStatus: false,
        studentCodeStatus: robotState.IDLE,
      };
    case consts.InfoActionsTypes.CODE_STATUS:
      ipcRenderer.send('studentCodeStatus', { studentCodeStatus: action.studentCodeStatus });
      return {
        ...state,
        studentCodeStatus: action.studentCodeStatus,
      };
    case consts.InfoActionsTypes.IP_CHANGE:
      ipcRenderer.send('ipAddress', { ipAddress: action.ipAddress });
      return {
        ...state,
        ipAddress: action.ipAddress,
      };
    case consts.FieldActionsTypes.UPDATE_ROBOT: {
      const stateChange = (action.autonomous) ? robotState.AUTONOMOUS : robotState.TELEOP;
      ipcRenderer.send('studentCodeStatus', { studentCodeStatus: (!action.enabled) ? robotState.IDLE : stateChange });
      return {
        ...state,
        fieldControlDirective: stateChange,
        fieldControlActivity: action.enabled,
        // eslint-disable-next-line no-nested-ternary
        studentCodeStatus: (!action.enabled) ? robotState.IDLE : stateChange,
      };
    }
    default:
      return state;
  }
};

export default info;
