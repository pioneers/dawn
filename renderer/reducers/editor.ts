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
  UpdateKeyboardAction,
  UpdateKeyboardBoolAction,
  UpdateBitmapAction
  
} from '../types';
import {  } from '../types/actions/editor-actions';

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
  | UpdateKeyboardAction
  | UpdateKeyboardBoolAction
  | UpdateBitmapAction;

interface EditorState {
  filepath: string;
  latestSaveCode: string;
  editorCode: string;
  keyboard: string;
  bool: boolean;
  bitmap: number
}

const defaultEditorState = {
  filepath: '',
  latestSaveCode: '',
  editorCode: '',
  keyboard: '',
  bool: true,
  bitmap: 0
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
    case consts.EditorActionsTypes.UPDATE_KEYBOARD_BOOL:
      return {
        ...state,
        bool: action.bool,
      };
    case consts.EditorActionsTypes.UPDATE_BITMAP:
      return {
        ...state,
        bitmap: action.bitmap,
      };
    case consts.EditorActionsTypes.UPDATE_KEYBOARD:
      return {
        ...state,
        keyboard: action.keyboard,
      }
    default:
      return state;
  }
};
