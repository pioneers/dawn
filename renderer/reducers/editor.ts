/**
 * Reducer for editor state data.
 */
import * as consts from '../consts';

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

const editor = (state : EditorState = defaultEditorState, action) => {
  switch (action.type) {
    case consts.EditorActionsTypes.EDITOR_UPDATE:
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

export default editor;
