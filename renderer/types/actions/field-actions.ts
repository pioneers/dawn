import * as consts from '../../consts';

export interface UpdateTimerAction {
  type: consts.FieldActionsTypes.UPDATE_TIMER;
  timeLeft: number;
  stage: string;
  totalTime: number;
}

export interface UpdateHeartAction {
  type: consts.FieldActionsTypes.UPDATE_HEART;
}

export interface UpdateMasterAction {
  type: consts.FieldActionsTypes.UPDATE_MASTER;
  blueMasterTeamNumber: number;
  goldMasterTeamNumber: number;
}

export interface UpdateMatchAction {
  type: consts.FieldActionsTypes.UPDATE_MATCH;
  matchNumber: number;
  teamNames: string[];
  teamNumbers: number[];
}

export interface UpdateRobotAction {
  type: consts.FieldActionsTypes.UPDATE_ROBOT;
  autonomous: number;
  enabled: boolean;
}

export interface ToggleFieldControlAction {
  type: consts.FieldActionsTypes.FIELD_CONTROL;
  fieldControl: boolean;
}

export interface UpdateFieldControlAction {
  type: consts.FieldActionsTypes.UPDATE_FC_CONFIG;
  stationNumber: number;
  bridgeAddress: string;
}

export interface FieldActions {
  updateTimer: (msg: { total_stage_time: number; stage_time_so_far: number; stage_name: string }) => UpdateTimerAction;

  updateHeart: () => UpdateHeartAction;

  updateMaster: (msg: { blue: number; gold: number }) => UpdateMasterAction;

  updateMatch: (msg: { match_number: number; team_names: string[]; team_numbers: number[] }) => UpdateMatchAction;

  updateRobot: (msg: { autonomous: number; enabled: boolean }) => UpdateRobotAction;

  toggleFieldControl: (msg: boolean) => ToggleFieldControlAction;

  updateFieldControl: (msg: { stationNumber: number; bridgeAddress: string }) => UpdateFieldControlAction;
}
