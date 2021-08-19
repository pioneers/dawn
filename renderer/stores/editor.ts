import { IObservableValue, observable } from 'mobx'
import { RootStore } from './root';

interface EditorState {
    latencyValue: number;
    filepath: string;
    latestSaveCode: string;
    editorCode: string;
    keyboardBitmap: number;
    isKeyboardModeToggled: boolean;
}

export class EditorStore {
    rootStore: typeof RootStore;
    filepath: IObservableValue<string> = observable.box('')
    latestSaveCode: IObservableValue<string> = observable.box('')
    editorCode: IObservableValue<string> = observable.box('')
    keyboardBitmap: IObservableValue<number> = observable.box(0)
    isKeyboardModeToggled: IObservableValue<boolean> = observable.box(false)
    latencyValue: IObservableValue<number> = observable.box(0)

    constructor(rootStore: typeof RootStore) {
        this.rootStore = rootStore;
    }

    updateEditor = (editor: EditorState) => {
        this.editorCode.set(editor.editorCode);
    }

    openFileSucceeded = (editor: EditorState) => {
        this.editorCode.set(editor.editorCode);
        this.filepath.set(editor.filepath);
        this.latestSaveCode.set(editor.latestSaveCode);
    }

    *openFile = (action: any) => {
        const type = (action.type === 'OPEN_FILE') ? 'open' : 'create';
        let res = 1;
        if (this.editorCode !== this.latestSaveCode) {
          res = yield call(unsavedDialog, type);
          if (res === 0) {
            yield* saveFile({
              type: 'SAVE_FILE',
              saveAs: false,
            });
          }
        }
        if (res === 0 || res === 1) {
          if (type === 'open') {
            try {
              const filepath: string = yield call(openFileDialog);
              const data: Buffer = yield cps([fs, readFile], filepath);
              yield put(openFileSucceeded(data.toString(), filepath));
            } catch (e) {
              logging.log('No filename specified, no file opened.');
            }
          } else if (type === 'create') {
            yield put(openFileSucceeded('', ''));
          }
        } else {
          logging.log(`File ${type} canceled.`);
        }
    }

    saveFileSucceeded = (editor: EditorState) => {
        this.filepath.set(editor.filepath);
        this.latestSaveCode.set(editor.latestSaveCode);
    }

    updateKeyboardBitmap = (editor: EditorState) => {
        this.keyboardBitmap.set(editor.keyboardBitmap);
    }

    setLatencyValue = (editor: EditorState) => {
        this.latencyValue.set(editor.latencyValue)
    }

    updateIsKeyboardModeToggled = (editor: EditorState) => {
        this.isKeyboardModeToggled.set(editor.isKeyboardModeToggled);
    }
}