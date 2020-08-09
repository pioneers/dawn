import * as consts from '../../consts';

export interface editorUpdateAction {
  type: consts.EditorActionsTypes.UPDATE_EDITOR;
  code: string;
};

export interface openFileSucceededAction {
  type: consts.EditorActionsTypes.OPEN_FILE_SUCCEEDED;
  code: string;
  filepath: string;
}

export interface saveFileSucceededAction {
  type: consts.EditorActionsTypes.SAVE_FILE_SUCCEEDED;
  code: string;
  filepath: string;
}

export interface openFileAction {
  type: consts.EditorActionsTypes.OPEN_FILE;
}

export interface dragFileAction {
  type: consts.EditorActionsTypes.DRAG_FILE;
  filepath: string;
}

export interface saveFileAction {
  type: consts.EditorActionsTypes.SAVE_FILE;
  saveAs: boolean;
}

export interface deleteFileAction {
  type: consts.EditorActionsTypes.DELETE_FILE;
}

export interface createNewFileAction {
  type: consts.EditorActionsTypes.CREATE_NEW_FILE;
}

export interface downloadCodeAction {
  type: consts.EditorActionsTypes.DOWNLOAD_CODE;
}

export interface uploadCodeAction{
  type: consts.EditorActionsTypes.UPLOAD_CODE;
}

export interface EditorActions {
  editorUpdate: (
    newVal: string
  ) => editorUpdateAction;

  openFileSucceeded: (
    data: string,
    filepath: string
  ) => openFileSucceededAction;

  saveFileSucceeded: (
    data: string,
    filepath: string
  ) => saveFileSucceededAction;

  openFile: () => openFileAction;

  dragFile: (
    filepath: string
  ) => dragFileAction;

  saveFile: (
    saveAs: boolean
  ) => saveFileAction;

  deleteFile: () => deleteFileAction;

  createNewFile: () => createNewFileAction;

  downloadCode: () => downloadCodeAction;

  uploadCode: () => uploadCodeAction;
}
