/**
 * Reducer for console state data
 */
import * as consts from '../consts';
import { ClearConsoleAction, UpdateConsoleAction, ToggleConsoleAction, ToggleScrollAction } from '../types';

type Actions = ClearConsoleAction | ToggleConsoleAction | ToggleScrollAction | UpdateConsoleAction;

interface ConsoleState {
  showConsole: boolean;
  consoleData: string[];
  disableScroll: boolean;
  consoleUnread: boolean;
}

const initialState = {
  showConsole: false,
  consoleData: [],
  disableScroll: false,
  consoleUnread: false,
};

export const console = (state: ConsoleState = initialState, action: Actions) => {
  switch (action.type) {
    case consts.ConsoleActionsTypes.UPDATE_CONSOLE:
      return {
        ...state,
        consoleData: [...state.consoleData, action.consoleOutput],
        consoleUnread: !state.showConsole,
      };
    case consts.ConsoleActionsTypes.CLEAR_CONSOLE:
      return {
        ...state,
        consoleData: [],
      };
    case consts.ConsoleActionsTypes.TOGGLE_CONSOLE:
      return {
        ...state,
        showConsole: !state.showConsole,
        consoleUnread: false,
      };
    case consts.ConsoleActionsTypes.TOGGLE_SCROLL:
      return {
        ...state,
        disableScroll: !state.disableScroll,
      };
    default:
      return state;
  }
};
