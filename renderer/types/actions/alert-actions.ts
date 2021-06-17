import * as consts from '../../consts';

export interface AddAsyncAlertAction {
  type: consts.AlertActionsTypes.ADD_ASYNC_ALERT;
  id: number;
  heading: string;
  message: string;
}

export interface RemoveAsyncAlertAction {
  type: consts.AlertActionsTypes.REMOVE_ASYNC_ALERT;
  id: number;
}

export interface AlertActions {
  addAsyncAlert: (heading: string, message: string) => AddAsyncAlertAction;

  removeAsyncAlert: (id: number) => RemoveAsyncAlertAction;
}
