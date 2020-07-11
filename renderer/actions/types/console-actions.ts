import * as consts from '../../consts';

export interface ConsoleActions {
  updateConsole: (value: string) => {
    type: consts.ConsoleActionsTypes.UPDATE_CONSOLE,
    consoleOutput: string
  }

  clearConsole: () => {
    type: consts.ConsoleActionsTypes.CLEAR_CONSOLE
  }

  toggleConsole: () => {
    type: consts.ConsoleActionsTypes.TOGGLE_CONSOLE
  }
}