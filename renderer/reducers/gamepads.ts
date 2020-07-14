import * as consts from '../consts';

const gamepads = (state: object = {}, action) => {
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

export default gamepads;
