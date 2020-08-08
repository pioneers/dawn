import * as consts from '../../consts';

export interface UpdateConsoleAction {
  type: consts.ConsoleActionsTypes.UPDATE_CONSOLE;
  consoleOutput: string;
}

export interface ClearConsoleAction {
  type: consts.ConsoleActionsTypes.CLEAR_CONSOLE;
}

export interface ToggleConsoleAction {
  type: consts.ConsoleActionsTypes.TOGGLE_CONSOLE;
}

export interface ConsoleActions {
  updateConsole: (value: string) => UpdateConsoleAction;

  clearConsole: () => ClearConsoleAction;

  toggleConsole: () => ToggleConsoleAction;
}
