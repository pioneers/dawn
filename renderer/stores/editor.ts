import { makeAutoObservable } from 'mobx'
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
    filepath: string = ''
    latestSaveCode: string = ''
    editorCode: string = ''
    keyboardBitmap: number = 0
    isKeyboardModeToggled: boolean = false
    latencyValue: number = 0

    constructor(rootStore: typeof RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    updateEditor = (editor: EditorState) => {
        this.editorCode = editor.editorCode;
    }

    openFileSucceeded = (editor: EditorState) => {
        this.editorCode = editor.editorCode;
        this.filepath = editor.filepath;
        this.latestSaveCode = editor.latestSaveCode;
    }

    saveFileSucceeded = (editor: EditorState) => {
        this.filepath = editor.filepath;
        this.latestSaveCode = editor.latestSaveCode;
    }

    updateKeyboardBitmap = (editor: EditorState) => {
        this.keyboardBitmap = editor.keyboardBitmap;
    }

    setLatencyValue = (editor: EditorState) => {
        this.latencyValue = editor.latencyValue
    }

    updateIsKeyboardModeToggled = (editor: EditorState) => {
        this.isKeyboardModeToggled = editor.isKeyboardModeToggled;
    }
}