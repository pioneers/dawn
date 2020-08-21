import * as consts from '../consts';
import { UpdateGamepadsAction } from '../types';
import { GpState } from '../../protos/protos';

interface GamePadsState {
  gamepads?: GpState[];
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
