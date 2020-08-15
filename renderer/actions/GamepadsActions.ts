/* eslint-disable import/prefer-default-export */
import * as consts from '../consts';
import { GamepadsActions } from '../types';
import { IGpState } from '../../protos/protos';

export const updateGamepads: GamepadsActions['updateGamepads'] = (gamepads: IGpState[]) => ({
  type: consts.GamepadsActionsTypes.UPDATE_GAMEPADS,
  gamepads,
});
