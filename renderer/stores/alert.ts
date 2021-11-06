import { IObservableArray, observable } from 'mobx';
import { RootStore } from './root';
import seedrandom from 'seedrandom';

interface AsyncAlert {
  id?: number;
  heading: string;
  message: string;
}

const rng = seedrandom('alertseed');
export class AlertStore {
  rootStore: typeof RootStore;

  alertState: IObservableArray<AsyncAlert> = observable([]);

  constructor(rootStore: typeof RootStore) {
    this.rootStore = rootStore;
  }

  addAsyncAlert = (heading: string, message: string) => {
    this.alertState.replace([
      ...this.alertState,
      {
        id: rng.int32(),
        heading: heading,
        message: message
      }
    ]);
  };

  removeAsyncAlert = (id: number) => {
    this.alertState.filter((el: AsyncAlert) => el.id !== id); //This line is not redlining. Use array.replace?
  };
}
