import * as consts from '../../consts';
import { Input } from '../../../protos-main';

export interface UpdateGamepadsAction {
  type: consts.GamepadsActionsTypes.UPDATE_GAMEPADS;
  gamepads: Input[];
}

export interface GamepadsActions {
  updateGamepads: (gamepads: Input[]) => UpdateGamepadsAction;
}
