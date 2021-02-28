import * as consts from '../consts';
import { EditorActions } from '../types';

export const editorUpdate: EditorActions['editorUpdate'] = (newVal: string) => ({
  type: consts.EditorActionsTypes.UPDATE_EDITOR,
  code: newVal
});

export const openFileSucceeded: EditorActions['openFileSucceeded'] = (data: string, filepath: string) => ({
  type: consts.EditorActionsTypes.OPEN_FILE_SUCCEEDED,
  code: data,
  filepath
});

export const saveFileSucceeded: EditorActions['saveFileSucceeded'] = (data: string, filepath: string) => ({
  type: consts.EditorActionsTypes.SAVE_FILE_SUCCEEDED,
  code: data,
  filepath
});

export const openFile: EditorActions['openFile'] = () => ({
  type: consts.EditorActionsTypes.OPEN_FILE
});

export const dragFile: EditorActions['dragFile'] = (filepath: string) => ({
  type: consts.EditorActionsTypes.DRAG_FILE,
  filepath
});

export const saveFile: EditorActions['saveFile'] = (saveAs = false) => ({
  type: consts.EditorActionsTypes.SAVE_FILE,
  saveAs
});

export const deleteFile: EditorActions['deleteFile'] = () => ({
  type: consts.EditorActionsTypes.DELETE_FILE
});

export const createNewFile: EditorActions['createNewFile'] = () => ({
  type: consts.EditorActionsTypes.CREATE_NEW_FILE
});

export const downloadCode: EditorActions['downloadCode'] = () => ({
  type: consts.EditorActionsTypes.DOWNLOAD_CODE
});

export const uploadCode: EditorActions['uploadCode'] = () => ({
  type: consts.EditorActionsTypes.UPLOAD_CODE
});

export const updateKeyboardBitmap: EditorActions['updateKeyboardBitmap'] = (keyboardBitmap: number) => ({
  type: consts.EditorActionsTypes.UPDATE_KEYBOARD_BITMAP,
  keyboardBitmap
});

export const updateIsKeyboardModeToggled: EditorActions['updateIsKeyboardModeToggled'] = (isKeyboardToggled: boolean) => ({
  type: consts.EditorActionsTypes.UPDATE_IS_KEYBOARD_MODE_TOGGLED,
  isKeyboardToggled
});
