import * as consts from '../../consts';

export interface UpdateGamepadsAction {
  type: consts.GamepadsActionsTypes.UPDATE_GAMEPADS;
  gamepads: string;
}

export interface GamepadsActions {
  updateGamepads: (gamepads: string) => UpdateGamepadsAction;
}
