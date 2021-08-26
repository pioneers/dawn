import { ipcRenderer } from 'electron';
import {  IObservableValue, observable } from 'mobx'
import { logging } from '../utils/utils';
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

    timestamp: IObservableValue<number> = observable.box(0)
    timeLeft: IObservableValue<number> = observable.box(0)
    computedTime: IObservableValue<number> = observable.box(0)
    totalTime: IObservableValue<number> = observable.box(0)
    stage: IObservableValue<string> = observable.box('')

    constructor(rootStore: typeof RootStore) {
        this.rootStore = rootStore;
    }

    updateTimer = (timer: TimerState) => {
        this.timestamp.set(Date.now())
        this.timeLeft.set(timer.timeLeft)
        this.computedTime.set(timer.computedTime)
        this.totalTime.set(timer.totalTime)
        this.stage.set(timer.stage)
    }

    timestampBounceback = () => {
        logging.log('Timestamp Requested in Sagas');
        ipcRenderer.send('TIMESTAMP_SEND');
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