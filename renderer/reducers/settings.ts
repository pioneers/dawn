import * as consts from '../consts';
import { ChangeFontSizeAction, ChangeThemeAction, ToggleThemeGlobalAction } from '../types';

type Actions = ChangeFontSizeAction | ChangeThemeAction | ToggleThemeGlobalAction;

interface SettingState {
  fontSize: number;
  editorTheme: string;
  globalTheme: string;
}

const initialState = {
  fontSize: 14,
  editorTheme: 'tomorrow',
  globalTheme: 'light',
};

export const settings = (state: SettingState = initialState, action: Actions) => {
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
    case consts.SettingsActionsTypes.TOGGLE_THEME_GLOBAL:
      return {
        ...state,
        globalTheme: (state.globalTheme === 'dark' ? 'light' : 'dark'),
      }
    default:
      return state;
  }
};
