import * as consts from '../consts';
import { UpdateTimerAction } from '../types';

interface TimerState {
  timestamp: number;
  timeLeft: number;
  computedTime: number;
  totalTime: number;
  stage: string;
}

const initialTimerState = {
  timestamp: 0,
  timeLeft: 0,
  computedTime: 0, // TODO: Questionable if this should even be in the store
  totalTime: 0,
  stage: ''
};

export const timerStore = (state: TimerState = initialTimerState, action: UpdateTimerAction) => {
  switch (action.type) {
    case consts.FieldActionsTypes.UPDATE_TIMER:
      return {
        ...state,
        timestamp: Date.now(),
        timeLeft: action.timeLeft,
        computedTime: action.timeLeft,
        stage: action.stage,
        totalTime: action.totalTime
      };
    default:
      return state;
  }
};
// TODO: Move Elsewhere
// function refreshTimer() {
//   let timeLeft = (_timerData.timeLeft - (Date.now() - _timerData.timestamp));
//   if (timeLeft < 0){
//     timeLeft = 0;
//   }
//   _timerData.computedTime = timeLeft;
// }
// setInterval(refreshTimer, 200);
