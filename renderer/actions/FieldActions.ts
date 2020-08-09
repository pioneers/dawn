import * as consts from '../consts';
import { FieldActions } from '../types';

export const updateTimer: FieldActions['updateTimer'] = (msg: { total_stage_time: number; stage_time_so_far: number; stage_name: string; }) => ({
    type: consts.FieldActionsTypes.UPDATE_TIMER,
    timeLeft: msg.total_stage_time - msg.stage_time_so_far,
    stage: msg.stage_name,
    totalTime: msg.total_stage_time,
});

export const updateHeart: FieldActions['updateHeart'] = () => ({
  type: consts.FieldActionsTypes.UPDATE_HEART,
});

export const updateMaster: FieldActions['updateMaster'] = (msg: { blue: number; gold: number; }) => ({
  type: consts.FieldActionsTypes.UPDATE_MASTER,
  blueMasterTeamNumber: msg.blue,
  goldMasterTeamNumber: msg.gold,
});

export const updateMatch: FieldActions['updateMatch'] = (msg: { match_number: number; team_names: string[]; team_numbers: number[]; }) => ({
  type: consts.FieldActionsTypes.UPDATE_MATCH,
  matchNumber: msg.match_number,
  teamNames: msg.team_names,
  teamNumbers: msg.team_numbers,
});

export const updateRobot: FieldActions['updateRobot'] = (msg: { autonomous: number; enabled: boolean; }) => ({
  type: consts.FieldActionsTypes.UPDATE_ROBOT,
  autonomous: msg.autonomous,
  enabled: msg.enabled,
});

export const toggleFieldControl: FieldActions['toggleFieldControl'] = (msg: boolean) => ({
  type: consts.FieldActionsTypes.FIELD_CONTROL,
  fieldControl: msg,
});

export const updateFieldControl: FieldActions['updateFieldControl'] = (msg: {stationNumber: number; bridgeAddress: string;} ) => ({
  type: consts.FieldActionsTypes.UPDATE_FC_CONFIG,
  stationNumber: msg.stationNumber,
  bridgeAddress: msg.bridgeAddress,
});
