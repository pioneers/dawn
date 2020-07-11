/**
 * Actions for asynchronous (non-blocking) alerts.
 */
import * as consts from '../consts';
import seedrandom from 'seedrandom';
import { AlertActions } from './types';

const rng = seedrandom('alertseed');

export const addAsyncAlert: AlertActions['addAsyncAlert'] = (heading: string, message: string) => ({
  type: consts.AlertActionsTypes.ADD_ASYNC_ALERT,
  id: rng.int32(),
  heading,
  message,
});

export const removeAsyncAlert: AlertActions['removeAsyncAlert'] = (id: number) => ({
  type: consts.AlertActionsTypes.REMOVE_ASYNC_ALERT,
  id,
});
