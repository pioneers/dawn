import { makeAutoObservable } from 'mobx'
import { RootStore } from './root';

interface TimerState {
    timestamp: number;
    timeLeft: number;
    computedTime: number;
    totalTime: number;
    stage: string;
  }

export class TimerStore {
    rootStore: typeof RootStore;

    timestamp: number = 0
    timeLeft: number = 0
    computedTime: number = 0 
    totalTime: number = 0
    stage: string = ''

    constructor(rootStore: typeof RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    updateTimer = (timer: TimerState) => {
        this.timestamp = Date.now()
        this.timeLeft = timer.timeLeft
        this.computedTime = timer.computedTime
        this.totalTime = timer.totalTime
        this.stage = timer.stage
    }
}

// TODO: Move Elsewhere
// function refreshTimer() {
//   let timeLeft = (_timerData.timeLeft - (Date.now() - _timerData.timestamp));
//   if (timeLeft < 0){
//     timeLeft = 0;
//   }
//   _timerData.computedTime = timeLeft;
// }
// setInterval(refreshTimer, 200);