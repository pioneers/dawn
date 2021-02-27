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
  UpdateKeyboardBitmapAction,
  updateIsKeyboardToggledAction,
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
  | UpdateKeyboardBitmapAction
  | updateIsKeyboardToggledAction;

interface EditorState {
  filepath: string;
  latestSaveCode: string;
  editorCode: string;
  keyboardBitmap: number;
  isKeyboardToggled: boolean;
}

const defaultEditorState = {
  filepath: '',
  latestSaveCode: '',
  editorCode: '',
  keyboardBitmap: 0,
  isKeyboardToggled: false
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
    case consts.EditorActionsTypes.UPDATE_IS_KEYBOARD_MODE_TOGGLED:
      return{
        ...state,
        isKeyboardToggled: action.isKeyboardToggled,
      }
    default:
      return state;
  }
};
