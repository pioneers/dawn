/**
 * Actions for the console state.
 */
import * as consts from '../consts';
import { ConsoleActions } from '../types';

export const updateConsole: ConsoleActions['updateConsole'] = (value: string) => ({
  type: consts.ConsoleActionsTypes.UPDATE_CONSOLE,
  consoleOutput: value,
});

export const clearConsole: ConsoleActions['clearConsole'] = () => ({
  type: consts.ConsoleActionsTypes.CLEAR_CONSOLE,
});

export const toggleConsole: ConsoleActions['toggleConsole'] = () => ({
  type: consts.ConsoleActionsTypes.TOGGLE_CONSOLE,
});
