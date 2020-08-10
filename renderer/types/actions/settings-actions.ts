import * as consts from '../../consts';

export interface ChangeFontSizeAction{
  type: consts.SettingsActionsTypes.CHANGE_FONT_SIZE;
  newFontsize: number;
}

export interface ChangeThemeAction{
  type: consts.SettingsActionsTypes.CHANGE_THEME;
  theme: string;
}

export interface SettingsActions {
  changeFontsize: (
    newFontSize: number
  ) => ChangeFontSizeAction;

  changeTheme: (
    theme: string
  ) => ChangeThemeAction;
}
