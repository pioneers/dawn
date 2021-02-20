import * as consts from '../../consts';

export interface EditorUpdateAction {
  type: consts.EditorActionsTypes.UPDATE_EDITOR;
  code: string;
}

export interface OpenFileSucceededAction {
  type: consts.EditorActionsTypes.OPEN_FILE_SUCCEEDED;
  code: string;
  filepath: string;
}

export interface SaveFileSucceededAction {
  type: consts.EditorActionsTypes.SAVE_FILE_SUCCEEDED;
  code: string;
  filepath: string;
}

export interface OpenFileAction {
  type: consts.EditorActionsTypes.OPEN_FILE;
}

export interface DragFileAction {
  type: consts.EditorActionsTypes.DRAG_FILE;
  filepath: string;
}

export interface SaveFileAction {
  type: consts.EditorActionsTypes.SAVE_FILE;
  saveAs: boolean;
}

export interface DeleteFileAction {
  type: consts.EditorActionsTypes.DELETE_FILE;
}

export interface CreateNewFileAction {
  type: consts.EditorActionsTypes.CREATE_NEW_FILE;
}

export interface DownloadCodeAction {
  type: consts.EditorActionsTypes.DOWNLOAD_CODE;
}

export interface UploadCodeAction {
  type: consts.EditorActionsTypes.UPLOAD_CODE;
}

export interface UpdateKeyboardAction {
  type: consts.EditorActionsTypes.UPDATE_KEYBOARD;
  keyboard: string;
}
export interface UpdateKeyboardBoolAction {
  type: consts.EditorActionsTypes.UPDATE_KEYBOARD_BOOL;
  bool: boolean;
}
export interface UpdateBitmapAction {
  type: consts.EditorActionsTypes.UPDATE_BITMAP;
  bitmap: number;
}


export interface EditorActions {
  editorUpdate: (newVal: string) => EditorUpdateAction;

  openFileSucceeded: (data: string, filepath: string) => OpenFileSucceededAction;

  saveFileSucceeded: (data: string, filepath: string) => SaveFileSucceededAction;

  openFile: () => OpenFileAction;

  dragFile: (filepath: string) => DragFileAction;

  saveFile: (saveAs?: boolean) => SaveFileAction;

  deleteFile: () => DeleteFileAction;

  createNewFile: () => CreateNewFileAction;

  downloadCode: () => DownloadCodeAction;

  uploadCode: () => UploadCodeAction;

  updateKeyboard: (keyboard: string) => UpdateKeyboardAction;

  updateKeyboardBool: (bool: boolean) => UpdateKeyboardBoolAction;

  updateBitmap: (bitmap: number) => UpdateBitmapAction;
}
