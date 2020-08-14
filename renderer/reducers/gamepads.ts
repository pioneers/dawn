import * as consts from '../consts';
import { UpdateGamepadsAction } from '../types';

interface GamePadsState {
  gamepads?: string;
}

export const gamepads = (state: GamePadsState = {}, action: UpdateGamepadsAction) => {
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
