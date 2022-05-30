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

export interface UpdateKeyboardBitmapAction {
  type: consts.EditorActionsTypes.UPDATE_KEYBOARD_BITMAP;
  keyboardBitmap: number;
}

export interface UpdateIsKeyboardModeToggledAction {
  type: consts.EditorActionsTypes.UPDATE_IS_KEYBOARD_MODE_TOGGLED;
  isKeyboardToggled: boolean;
}

export interface SetLatencyValue {
  type: consts.EditorActionsTypes.SET_LATENCY_VALUE;
  latencyValue: number;
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

  updateKeyboardBitmap: (keyboardBitmap: number) => UpdateKeyboardBitmapAction;

  updateIsKeyboardModeToggled: (isKeyboardToggled: boolean) => UpdateIsKeyboardModeToggledAction;

  setLatencyValue: (latencyValue: number) => SetLatencyValue;
}
