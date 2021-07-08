import { makeAutoObservable } from 'mobx';
import { RootStore } from './root';

export class SettingsStore {
    rootStore: typeof RootStore;

    fontSize: number = 14;
    editorTheme: string = 'tomorrow';
    globalTheme: string = 'light';

    constructor(rootStore: typeof RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    changeFontSize(size: number) {
        this.fontSize = size;
    };

    changeTheme(theme: string) {
        this.editorTheme = theme;
    };

    toggleThemeGlobal() {
        this.globalTheme = (this.globalTheme === 'dark' ? 'light' : 'dark');
    };
}