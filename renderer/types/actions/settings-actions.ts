import * as consts from '../../consts';

export interface ChangeFontSizeAction {
  type: consts.SettingsActionsTypes.CHANGE_FONT_SIZE;
  newFontSize: number;
}

export interface ChangeThemeAction {
  type: consts.SettingsActionsTypes.CHANGE_THEME;
  theme: string;
}

export interface ToggleThemeGlobalAction {
  type: consts.SettingsActionsTypes.TOGGLE_THEME_GLOBAL;
  globalTheme: string;
}

export interface SettingsActions {
  changeFontSize: (newFontSize: number) => ChangeFontSizeAction;
  changeTheme: (theme: string) => ChangeThemeAction;
  toggleThemeGlobal: (globalTheme: 'light' | 'dark') => ToggleThemeGlobalAction;
}
