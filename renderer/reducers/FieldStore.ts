import * as consts from '../consts';
import { UpdateTimerAction, UpdateHeartAction, UpdateMasterAction, UpdateMatchAction, UpdateRobotAction, ToggleFieldControlAction, UpdateFieldControlAction, } from '../types';

type Actions = UpdateTimerAction | UpdateHeartAction | UpdateMasterAction | UpdateMatchAction | UpdateRobotAction | ToggleFieldControlAction | UpdateFieldControlAction;

interface FieldState{
  stationNumber: number,
  bridgeAddress: string,
  fieldControl: boolean,
  rTeamNumber: number,
  rTeamName: string,
  heart: boolean,
  masterStatus: boolean,
  mMatchNumber: number,
  mTeamNumbers: number[],
  mTeamNames: string[],
  teamNumber: number,
  teamColor: string,
}

const initialFieldState = {
  stationNumber: 4,
  bridgeAddress: 'localhost',
  fieldControl: false,
  rTeamNumber: 0,
  rTeamName: 'Unknown',
  heart: false,
  masterStatus: false,
  mMatchNumber: 0,
  mTeamNumbers: [0, 0, 0, 0],
  mTeamNames: ['Offline', 'Offline', 'Offline', 'Offline'],
  teamNumber: 0,
  teamColor: 'Unknown',
};

export const fieldStore = (state: FieldState = initialFieldState, action: Actions) => {
  switch (action.type) {
    case consts.FieldActionsTypes.UPDATE_FC_CONFIG:
      return {
        ...state,
        stationNumber: action.stationNumber,
        bridgeAddress: action.bridgeAddress,
      };
    case consts.FieldActionsTypes.FIELD_CONTROL:
      return {
        ...state,
        fieldControl: action.fieldControl,
      };
    case consts.FieldActionsTypes.UPDATE_HEART:
      return {
        ...state,
        heart: !state.heart,
      };
    case consts.FieldActionsTypes.UPDATE_MASTER:
      return {
        ...state,
        masterStatus: true,
        blueMasterTeamNumber: action.blueMasterTeamNumber,
        goldMasterTeamNumber: action.goldMasterTeamNumber,
      };
    case consts.FieldActionsTypes.UPDATE_MATCH:
      return {
        ...state,
        mMatchNumber: action.matchNumber,
        mTeamNumbers: action.teamNumbers,
        mTeamNames: action.teamNames,
        rTeamNumber: action.teamNumbers[state.stationNumber],
        rTeamName: action.teamNames[state.stationNumber],
      };
    default:
      return state;
  }
};
