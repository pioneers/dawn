/**
 * Reducer from asynchronous alerts state data.
 */

import * as consts from '../consts';
import { AddAsyncAlertAction, AlertType, RemoveAsyncAlertAction } from '../types';

type Actions = AddAsyncAlertAction | RemoveAsyncAlertAction;

type AsyncAlertsState = Array<AlertType>;

const initialState: AsyncAlertsState = [];

export const asyncAlerts = (state: AsyncAlertsState = initialState, action: Actions) => {
  switch (action.type) {
    case consts.AlertActionsTypes.ADD_ASYNC_ALERT:
      return [
        ...state,
        {
          id: action.id,
          heading: action.heading,
          message: action.message
        }
      ];
    case consts.AlertActionsTypes.REMOVE_ASYNC_ALERT:
      return state.filter((el: { id?: number }) => el.id !== action.id);
    default:
      return state;
  }
};
