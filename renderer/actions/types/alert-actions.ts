import * as consts from '../../consts';

export interface AlertActions {
  addAsyncAlert: (heading: string, message: string) => { 
    type: consts.AlertActionsTypes.ADD_ASYNC_ALERT,
    id: number,
    heading: string,
    message: string
  }

  removeAsyncAlert: (id: number) => {
    type: consts.AlertActionsTypes.REMOVE_ASYNC_ALERT,
    id: number,
  }
}