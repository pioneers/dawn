import { makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react';

export class ConsoleStore {
  fieldControlStatus = false;

  handleFieldControl = async () => {
    if (this.fieldControlStatus) {
      
    }
  }

  toggleFieldControl = (value: boolean) => {
    this.fieldControlStatus = value;
  }
  
}

// export const PeripheralStore = createContext(new ConsoleStoreImpl());
