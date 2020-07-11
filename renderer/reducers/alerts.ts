/**
 * Reducer from asynchronous alerts state data.
 */

import * as consts from '../consts';

const asyncAlerts = (state = [], action) => {
  switch (action.type) {
    case consts.AlertActionsTypes.ADD_ASYNC_ALERT:
      return [
        ...state,
        {
          id: action.id,
          heading: action.heading,
          message: action.message,
        },
      ];
    case consts.AlertActionsTypes.REMOVE_ASYNC_ALERT:
      return state.filter(el => el.id !== action.id);
    default:
      return state;
  }
};

export default asyncAlerts;
