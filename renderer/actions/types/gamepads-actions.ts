import * as consts from '../../consts';

export interface GamepadsActions{
    updateGamepads : (gamepads: string) => {
        type: consts.GamepadsActionsTypes.UPDATE_GAMEPADS
        gamepads: string
    }
}