import { connect } from 'react-redux';
import Editor from './Editor';
import {
  editorUpdate,
  saveFile,
  openFile,
  dragFile,
  createNewFile,
  downloadCode,
  uploadCode,
} from '../actions/EditorActions';
import {
  changeTheme,
  changeFontSize,
} from '../actions/SettingsActions';
import {
  toggleConsole,
  clearConsole,
} from '../actions/ConsoleActions';
import { addAsyncAlert } from '../actions/AlertActions';
import { updateCodeStatus, ipChange } from '../actions/InfoActions';
import { Dispatch } from 'redux';

const mapStateToProps = (state: ApplicationState) => ({
  editorCode: state.editor.editorCode,
  editorTheme: state.settings.editorTheme,
  filepath: state.editor.filepath,
  fontSize: state.settings.fontSize,
  latestSaveCode: state.editor.latestSaveCode,
  showConsole: state.console.showConsole,
  consoleData: state.console.consoleData,
  ipAddress: state.info.ipAddress,
  connectionStatus: state.info.connectionStatus,
  notificationHold: state.info.notificationHold,
  fieldControlActivity: state.info.fieldControlActivity,
  disableScroll: state.console.disableScroll,
  consoleUnread: state.console.consoleUnread,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAlertAdd: (heading: string, message: string) => {
    dispatch(addAsyncAlert(heading, message));
  },
  onEditorUpdate: (newVal: string) => {
    dispatch(editorUpdate(newVal));
  },
  onSaveFile: (saveAs?: boolean) => {
    dispatch(saveFile(saveAs));
  },
  onOpenFile: () => {
    dispatch(openFile());
  },
  onDragFile: (filepath: string) => {
    dispatch(dragFile(filepath));
  },
  onCreateNewFile: () => {
    dispatch(createNewFile());
  },
  onChangeTheme: (theme: string) => {
    dispatch(changeTheme(theme));
  },
  onChangeFontsize: (newFontsize: number) => {
    dispatch(changeFontSize(newFontsize));
  },
  toggleConsole: () => {
    dispatch(toggleConsole());
  },
  onClearConsole: () => {
    dispatch(clearConsole());
  },
  onUpdateCodeStatus: (status: string) => {
    dispatch(updateCodeStatus(status));
  },
  onIPChange: (ipAddress: string) => {
    dispatch(ipChange(ipAddress));
  },
  onDownloadCode: () => {
    dispatch(downloadCode());
  },
  onUploadCode: () => {
    dispatch(uploadCode());
  },
});

export const EditorContainer = connect(mapStateToProps, mapDispatchToProps)(Editor);

