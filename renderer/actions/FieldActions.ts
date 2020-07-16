import * as consts from '../consts';
import { FieldActions } from './types';

export const updateTimer: FieldActions['updateTimer'] = (msg: any) => ({
    type: consts.FieldActionsTypes.UPDATE_TIMER,
    timeLeft: msg.total_stage_time - msg.stage_time_so_far,
    stage: msg.stage_name,
    totalTime: msg.total_stage_time,
});

export const updateHeart: FieldActions['updateHeart'] = () => ({
  type: consts.FieldActionsTypes.UPDATE_HEART,
});

export const updateMaster: FieldActions['updateMaster'] = (msg: any) => ({
  type: consts.FieldActionsTypes.UPDATE_MASTER,
  blueMaster: msg.blue,
  goldMaster: msg.gold,
});

export const updateMatch: FieldActions['updateMatch'] = (msg: any) => ({
  type: consts.FieldActionsTypes.UPDATE_MATCH,
  matchNumber: msg.match_number,
  teamNames: msg.team_names,
  teamNumbers: msg.team_numbers,
});

export const updateRobot: FieldActions['updateRobot'] = (msg: any) => ({
  type: consts.FieldActionsTypes.UPDATE_ROBOT,
  autonomous: msg.autonomous,
  enabled: msg.enabled,
});

export const toggleFieldControl: FieldActions['toggleFieldControl'] = (msg: boolean) => ({
  type: consts.FieldActionsTypes.FIELD_CONTROL,
  fieldControl: msg,
});

export const updateFieldControl: FieldActions['updateFieldControl'] = (msg: any) => ({
  type: consts.FieldActionsTypes.UPDATE_FC_CONFIG,
  stationNumber: msg.stationNumber,
  bridgeAddress: msg.bridgeAddress,
});
