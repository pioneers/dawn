import { makeAutoObservable } from 'mobx';
import { RootStore } from './root';

type AsyncAlertsState = Array<AsyncAlert>;

type AsyncAlert = {
    id?: number;
    heading?: string;
    message?: string;
}

export class AlertStore {
  rootStore: typeof RootStore;

  alertState: AsyncAlertsState = []

  constructor(rootStore: typeof RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }
  
  addAsyncAlert = (alert: AsyncAlert) => {
      this.alertState = [...this.alertState, {
        id: alert.id,
        heading: alert.heading,
        message: alert.message,
      }]
  };

  removeAsyncAlert = (id: number) => {
    this.alertState.filter((el: { id?: number }) => el.id !== id)
  };
}

