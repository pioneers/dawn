/**
 * Reducer for editor state data.
 */
import * as consts from '../consts';
import {
  EditorUpdateAction,
  OpenFileSucceededAction,
  SaveFileSucceededAction,
  OpenFileAction,
  DragFileAction,
  SaveFileAction,
  DeleteFileAction,
  CreateNewFileAction,
  DownloadCodeAction,
  UploadCodeAction,
  UpdateIsKeyboardModeToggledAction,
  UpdateKeyboardBitmapAction,
  GetLatencyRequest,
  SetLatencyValue
} from '../types';

type Actions =
  | EditorUpdateAction
  | OpenFileSucceededAction
  | SaveFileSucceededAction
  | OpenFileAction
  | DragFileAction
  | SaveFileAction
  | DeleteFileAction
  | CreateNewFileAction
  | DownloadCodeAction
  | UploadCodeAction
  | UpdateIsKeyboardModeToggledAction
  | UpdateKeyboardBitmapAction
  | GetLatencyRequest
  | SetLatencyValue;

interface EditorState {
  latencyValue: number;
  filepath: string;
  latestSaveCode: string;
  editorCode: string;
  keyboardBitmap: number;
  isKeyboardModeToggled: boolean;
}

const defaultEditorState = {
  filepath: '',
  latestSaveCode: '',
  editorCode: '',
  keyboardBitmap: 0,
  isKeyboardModeToggled: false,
  latencyValue: 0
};

export const editor = (state: EditorState = defaultEditorState, action: Actions) => {
  switch (action.type) {
    case consts.EditorActionsTypes.UPDATE_EDITOR:
      return {
        ...state,
        editorCode: action.code,
      };
    case consts.EditorActionsTypes.OPEN_FILE_SUCCEEDED:
      return {
        ...state,
        editorCode: action.code,
        filepath: action.filepath,
        latestSaveCode: action.code,
      };
    case consts.EditorActionsTypes.SAVE_FILE_SUCCEEDED:
      return {
        ...state,
        filepath: action.filepath,
        latestSaveCode: action.code,
      };
    case consts.EditorActionsTypes.UPDATE_KEYBOARD_BITMAP:
      return {
        ...state,
        keyboardBitmap: action.keyboardBitmap,
      };
    case consts.EditorActionsTypes.SET_LATENCY_VALUE:
      return {
        ...state,
        latencyValue: action.latencyValue,
      };
    case consts.EditorActionsTypes.UPDATE_IS_KEYBOARD_MODE_TOGGLED:
      return {
        ...state,
        isKeyboardModeToggled: action.isKeyboardToggled,
      };
    default:
      return state;
  }
};
