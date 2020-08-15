import * as consts from '../../consts';
import { IGpState } from "../../../protos/protos";

export interface UpdateGamepadsAction {
  type: consts.GamepadsActionsTypes.UPDATE_GAMEPADS;
  gamepads: IGpState[];
}

export interface GamepadsActions {
  updateGamepads: (gamepads: IGpState[]) => UpdateGamepadsAction;
}
