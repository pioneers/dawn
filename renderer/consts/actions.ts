export enum AlertActionsTypes {
  ADD_ASYNC_ALERT = 'ADD_ASYNC_ALERT',
  REMOVE_ASYNC_ALERT = 'REMOVE_ASYNC_ALERT',
}

export enum ConsoleActionsTypes {
  UPDATE_CONSOLE = 'UPDATE_CONSOLE',
  CLEAR_CONSOLE = 'CLEAR_CONSOLE',
  TOGGLE_CONSOLE = 'TOGGLE_CONSOLE',
  TOGGLE_SCROLL = 'TOGGLE_SCROLL',
}

export enum PeripheralActionsTypes {
  UPDATE_PERIPHERALS = 'UPDATE_PERIPHERALS',
  PERIPHERAL_RENAME = 'PERIPHERAL_RENAME',
}

export enum EditorActionsTypes {
  UPDATE_EDITOR = 'UPDATE_EDITOR',
  OPEN_FILE_SUCCEEDED = 'OPEN_FILE_SUCCEEDED',
  SAVE_FILE_SUCCEEDED = 'SAVE_FILE_SUCCEEDED',
  OPEN_FILE = 'OPEN_FILE',
  DRAG_FILE = 'DRAG_FILE',
  SAVE_FILE = 'SAVE_FILE',
  DELETE_FILE = 'DELETE_FILE',
  CREATE_NEW_FILE = 'CREATE_NEW_FILE',
  DOWNLOAD_CODE = 'DOWNLOAD_CODE',
  UPLOAD_CODE = 'UPLOAD_CODE',
}

export enum GamepadsActionsTypes {
  UPDATE_GAMEPADS = 'UPDATE_GAMEPADS',
}

export enum SettingsActionsTypes {
  CHANGE_FONT_SIZE = 'CHANGE_FONTSIZE',
  CHANGE_THEME = 'CHANGE_THEME',
}

export enum InfoActionsTypes {
  PER_MESSAGE = 'PER_MESSAGE',
  ANSIBLE_DISCONNECT = 'ANSIBLE_DISCONNECT',
  RUNTIME_CONNECT = 'RUNTIME_CONNECT',
  MASTER_ROBOT = 'MASTER_ROBOT',
  RUNTIME_DISCONNECT = 'RUNTIME_DISCONNECT',
  CODE_STATUS = 'CODE_STATUS',
  IP_CHANGE = 'IP_CHANGE',
  NOTIFICATION_CHANGE = 'NOTIFICATION_CHANGE',
}

export enum FieldActionsTypes {
  UPDATE_TIMER = 'UPDATE_TIMER',
  UPDATE_HEART = 'UPDATE_HEART',
  UPDATE_MASTER = 'UPDATE_MASTER',
  UPDATE_MATCH = 'UPDATE_MATCH',
  UPDATE_ROBOT = 'UPDATE_ROBOT',
  FIELD_CONTROL = 'FIELD_CONTROL',
  UPDATE_FC_CONFIG = 'UPDATE_FC_CONFIG',
}
