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
  UpdateIsRunningToggledAction,
  UpdateKeyboardBitmapAction,
  SetLatencyValue
} from '../types';
import { correctText } from '../utils/utils';

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
  | UpdateIsRunningToggledAction
  | UpdateKeyboardBitmapAction
  | SetLatencyValue;

interface EditorState {
  latencyValue: number;
  filepath: string;
  latestSaveCode: string;
  editorCode: string;
  keyboardBitmap: number;
  isRunning: boolean;
}

const defaultEditorState = {
  filepath: '',
  latestSaveCode: '',
  editorCode: '',
  keyboardBitmap: 0,
  isRunning: false,
  latencyValue: 0
};

export const editor = (state: EditorState = defaultEditorState, action: Actions) => {
  switch (action.type) {
    case consts.EditorActionsTypes.UPDATE_EDITOR:
      return {
        ...state,
        editorCode: correctText(action.code),
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
    case consts.EditorActionsTypes.UPDATE_IS_RUNNING_TOGGLED:
      return {
        ...state,
        isRunning: action.isRunningToggled,
      };
    default:
      return state;
  }
};
