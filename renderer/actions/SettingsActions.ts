import * as consts from '../consts';
import { SettingsActions } from '../types';

export const changeFontSize: SettingsActions['changeFontSize'] = (newFontSize: number) => ({
  type: consts.SettingsActionsTypes.CHANGE_FONT_SIZE,
  newFontSize,
});

export const changeTheme: SettingsActions['changeTheme'] = (theme: string) => ({
  type: consts.SettingsActionsTypes.CHANGE_THEME,
  theme,
});

export const toggleThemeGlobal: SettingsActions['toggleThemeGlobal'] = (globalTheme: 'light' | 'dark') => ({
  type: consts.SettingsActionsTypes.TOGGLE_THEME_GLOBAL,
  globalTheme,
});