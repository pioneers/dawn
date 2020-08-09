import * as consts from '../../consts';

export interface updateTimerAction {
  type: consts.FieldActionsTypes.UPDATE_TIMER;
  timeLeft: number;
  stage: string;
  totalTime: number;
}

export interface updateHeartAction {
  type: consts.FieldActionsTypes.UPDATE_HEART;
}

export interface updateMasterAction {
  type: consts.FieldActionsTypes.UPDATE_MASTER;
  blueMaster: string;
  goldMaster: string;
}

export interface updateMatchAction {
  type: consts.FieldActionsTypes.UPDATE_MATCH;
  matchNumber: number;
  teamNames: string[];
  teamNumbers: number[];
}

export interface updateRobotAction {
  type: consts.FieldActionsTypes.UPDATE_ROBOT;
  autonomous: number;
  enabled: boolean;
}

export interface toggleFieldControlAction {
  type: consts.FieldActionsTypes.FIELD_CONTROL;
  fieldControl: boolean;
}

export interface updateFieldControlAction {
  type: consts.FieldActionsTypes.UPDATE_FC_CONFIG;
  stationNumber: number;
  bridgeAddress: string;
}

export interface FieldActions {
  updateTimer: (msg: {
    total_stage_time: number;
    stage_time_so_far: number;
    stage_name: string;
  }) => updateTimerAction;

  updateHeart: () => updateHeartAction;

  updateMaster: (msg: {
    blue: string;
    gold: string;
  }) => updateMasterAction;

  updateMatch: (msg: {
    match_number: number;
    team_names: string[];
    team_numbers: number[];
  }) => updateMatchAction;

  updateRobot: (
    msg: {
      autonomous: number;
      enabled: boolean;
    }
  ) => updateRobotAction;

  toggleFieldControl: (
    msg: boolean
  ) => toggleFieldControlAction;

  updateFieldControl: (
    msg: {
      stationNumber: number;
      bridgeAddress: string;
    }
  ) => updateFieldControlAction;
}
