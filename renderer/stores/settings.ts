import { IObservableValue, observable } from 'mobx';
import { RootStore } from './root';

export class SettingsStore {
  rootStore: typeof RootStore;

  fontSize: IObservableValue<number> = observable.box(14);
  editorTheme: IObservableValue<string> = observable.box('tomorrow');
  globalTheme = observable.box<'light' | 'dark'>('light');

  constructor(rootStore: typeof RootStore) {
    this.rootStore = rootStore;
  }

  changeFontSize(size: number) {
    this.fontSize.set(size);
  }

  changeTheme(theme: string) {
    this.editorTheme.set(theme);
  }

  toggleThemeGlobal() {
    this.globalTheme.set(this.globalTheme.get() === 'dark' ? 'light' : 'dark');
  }
}
