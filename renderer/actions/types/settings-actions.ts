import * as consts from '../../consts';

export interface SettingsActions{
    changeFontsize: (newFontSize: number) => {
        type: consts.SettingsActionsTypes.CHANGE_FONT_SIZE,
        newFontsize: number,
    }

    changeTheme: (theme: string) => {
        type: consts.SettingsActionsTypes.CHANGE_THEME,
        theme: string,
    }
}