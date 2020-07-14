import * as consts from '../../consts';

export interface EditorActions{
    editorUpdate: (newVal: string) => {
        type: consts.EditorActionsTypes.EDITOR_UPDATE,
        code: string
    }

    openFileSucceeded: (data: string, filepath: string) => {
        type: consts.EditorActionsTypes.OPEN_FILE_SUCCEEDED,
        code: string,
        filepath: string,
    }

    saveFileSucceeded: (data: string, filepath: string) => {
        type: consts.EditorActionsTypes.SAVE_FILE_SUCCEEDED,
        code: string,
        filepath: string
    }

    openFile: () => {
        type: consts.EditorActionsTypes.OPEN_FILE
    }

    dragFile: (filepath: string) => {
        type: consts.EditorActionsTypes.DRAG_FILE,
        filepath: string
    }

    saveFile: (saveAs: boolean) => {
        type: consts.EditorActionsTypes.SAVE_FILE,
        saveAs: boolean
    }

    deleteFile: () => {
        type: consts.EditorActionsTypes.DELETE_FILE
    }

    createNewFile: () => {
        type: consts.EditorActionsTypes.CREATE_NEW_FILE
    }

    downloadCode: () => {
        type: consts.EditorActionsTypes.DOWNLOAD_CODE
    }

    uploadCode: () => {
        type: consts.EditorActionsTypes.UPLOAD_CODE
    }
}