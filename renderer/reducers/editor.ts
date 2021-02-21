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
  UpdateBitmapAction,
  UpdateKeyboardToggleAction,
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
  | UpdateBitmapAction
  | UpdateKeyboardToggleAction;

interface EditorState {
  filepath: string;
  latestSaveCode: string;
  editorCode: string;
  bitmap: number;
  keyboardToggle: boolean;
}

const defaultEditorState = {
  filepath: '',
  latestSaveCode: '',
  editorCode: '',
  bitmap: 0,
  keyboardToggle: false
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
    case consts.EditorActionsTypes.UPDATE_BITMAP:
      return {
        ...state,
        bitmap: action.bitmap,
      };
    case consts.EditorActionsTypes.UPDATE_KEYBOARD_TOGGLE:
      return{
        ...state,
        keyboardToggle: action.keyboardToggle,
      }
    default:
      return state;
  }
};
