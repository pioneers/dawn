import * as consts from '../consts';
import { SettingsActions } from '../types';

export const changeFontsize: SettingsActions['changeFontsize'] = (newFontsize: number) =>({
    type: consts.SettingsActionsTypes.CHANGE_FONT_SIZE,
    newFontsize,
})

export const changeTheme: SettingsActions['changeTheme'] = (theme: string) => ({
    type: consts.SettingsActionsTypes.CHANGE_THEME,
    theme,
})