/**
 * Reducer for editor state data.
 */
import * as consts from '../consts';
import { EditorUpdateAction, OpenFileSucceededAction, SaveFileSucceededAction, OpenFileAction, DragFileAction, 
  SaveFileAction, DeleteFileAction, CreateNewFileAction, DownloadCodeAction, UploadCodeAction } from '../types';

type Actions = EditorUpdateAction | OpenFileSucceededAction | SaveFileSucceededAction | OpenFileAction | DragFileAction | 
SaveFileAction| DeleteFileAction | CreateNewFileAction | DownloadCodeAction | UploadCodeAction;

interface EditorState{
  filepath: string,
  latestSaveCode: string,
  editorCode: string
}

const defaultEditorState = {
  filepath: '',
  latestSaveCode: '',
  editorCode: '',
};

export const editor = (state : EditorState = defaultEditorState, action : Actions) => {
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
    default:
      return state;
  }
};
