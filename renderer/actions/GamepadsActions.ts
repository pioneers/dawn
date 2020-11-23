/* eslint-disable import/prefer-default-export */
import * as consts from '../consts';
import { GamepadsActions } from '../types';
import { GpState } from '../../protos/protos';

export const updateGamepads: GamepadsActions['updateGamepads'] = (gamepads: GpState[]) => ({
  type: consts.GamepadsActionsTypes.UPDATE_GAMEPADS,
  gamepads
});
