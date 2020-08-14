/* eslint-disable import/prefer-default-export */
import * as consts from '../consts';
import { GamepadsActions } from '../types';

export const updateGamepads: GamepadsActions['updateGamepads'] = (gamepads: string) => ({
  type: consts.GamepadsActionsTypes.UPDATE_GAMEPADS,
  gamepads,
});
