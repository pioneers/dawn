/* eslint-disable import/prefer-default-export */
import * as consts from '../consts';
import { GamepadsActions } from '../types';
import { Input } from '../../protos-main/protos';

export const updateGamepads: GamepadsActions['updateGamepads'] = (gamepads: Input[]) => ({
  type: consts.GamepadsActionsTypes.UPDATE_GAMEPADS,
  gamepads,
});
