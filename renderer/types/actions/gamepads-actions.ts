import * as consts from '../../consts';
import { GpState } from '../../../protos/protos';

export interface UpdateGamepadsAction {
  type: consts.GamepadsActionsTypes.UPDATE_GAMEPADS;
  gamepads: GpState[];
}

export interface GamepadsActions {
  updateGamepads: (gamepads: GpState[]) => UpdateGamepadsAction;
}
