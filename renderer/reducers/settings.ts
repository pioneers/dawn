import * as consts from '../consts';
import { ChangeFontSizeAction, ChangeThemeAction } from '../types';

type Actions = ChangeFontSizeAction |  ChangeThemeAction;

interface SettingState{
  fontSize: number,
  editorTheme: string
}

const initialState = {
  fontSize: 14,
  editorTheme: 'tomorrow',
};

export const settings = (state : SettingState = initialState, action: Actions) => {
  switch (action.type) {
    case consts.SettingsActionsTypes.CHANGE_FONT_SIZE:
      return {
        ...state,
        fontSize: action.newFontSize,
      };
    case consts.SettingsActionsTypes.CHANGE_THEME:
      return {
        ...state,
        editorTheme: action.theme,
      };
    default:
      return state;
  }
};
