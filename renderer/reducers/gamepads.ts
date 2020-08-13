import * as consts from '../consts';
import { UpdateGamepadsAction } from '../types';

export const gamepads = (state: object = {}, action : UpdateGamepadsAction) => {
  switch (action.type) {
    case consts.GamepadsActionsTypes.UPDATE_GAMEPADS:
      return {
        ...state,
        gamepads: action.gamepads,
      };
    default:
      return state;
  }
};
