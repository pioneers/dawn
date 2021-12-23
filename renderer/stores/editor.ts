import { ipcRenderer, remote} from 'electron';
import fs from 'fs';
import { IObservableValue, observable } from 'mobx';
import { Client, SFTPWrapper } from 'ssh2';
import { Input, Source, TimeStamps } from '../../protos-main';
import { defaults, logging, sleep } from '../utils/utils';
import { RootStore } from './root';
import {
  createErrorCallback,
  openFileDialog,
  saveFileDialog,
  transferFile,
  unsavedDialog,
  UnsavedDialogActions,
  UnsavedDialogActionsOptions
} from './utils';

interface EditorState {
  latencyValue: number;
  filepath: string;
  latestSaveCode: string;
  editorCode: string;
  keyboardBitmap: number;
  isKeyboardModeToggled: boolean;
}

export class EditorStore {
  rootStore: typeof RootStore;
  filepath: IObservableValue<string> = observable.box('');
  latestSaveCode: IObservableValue<string> = observable.box('');
  editorCode: IObservableValue<string> = observable.box('');
  keyboardBitmap: IObservableValue<number> = observable.box(0);
  isKeyboardModeToggled: IObservableValue<boolean> = observable.box(false);
  latencyValue: IObservableValue<number> = observable.box(0);

  constructor(rootStore: typeof RootStore) {
    this.rootStore = rootStore;
  }

  updateEditorCode = (editorCode: string) => {
    this.editorCode.set(editorCode);
  };

  updateKeyboardBitmap = (keyboardBitmap: number) => {
    this.keyboardBitmap.set(keyboardBitmap);
  };

  setLatencyValue = (latencyValue: number) => {
    this.latencyValue.set(latencyValue);
  };

  updateIsKeyboardModeToggled = (isKeyboardModeToggled: boolean) => {
    this.isKeyboardModeToggled.set(isKeyboardModeToggled);
  };

  // Filesystem for editor
  openFileSucceeded = (code: string, filepath: string) => {
    this.editorCode.set(code);
    this.filepath.set(filepath);
    this.latestSaveCode.set(code);
  };

  /**
   * Simple helper function to write to a codefile and dispatch action
   * notifying store of the save.
   */
  writeCodeToFile = (filepath: string, code: string) => {
    fs.writeFile(filepath, code, createErrorCallback('writeCodeToFile'));

    this.saveFileSucceeded({ latestSaveCode: code, filepath });
  };

  saveFile = async ({ saveAs }: { saveAs: boolean }) => {
    let filepath = this.filepath.get();
    const code = this.editorCode.get();
    // If the action is a "save as" OR there is no filepath (ie, a new file)
    // then we open the save file dialog so the user can specify a filename before saving.
    if (saveAs === true || !this.filepath) {
      try {
        filepath = await saveFileDialog();

        if (filepath === undefined) {
          return;
        }

        this.writeCodeToFile(filepath, code);
      } catch (e) {
        logging.log('No filename specified, file not saved.');
      }
    } else {
      this.writeCodeToFile(filepath, code);
    }
  };

  openFile = async ({ actionType }: { actionType: string }) => {
    const LOG_PREFIX = 'openFile:';

    const action = actionType === 'OPEN_FILE' ? 'open' : 'create';
    let chosenAction: UnsavedDialogActionsOptions | undefined = 'discardAction';

    if (this.editorCode.get() !== this.latestSaveCode.get()) {
      chosenAction = await unsavedDialog(action);

      if (chosenAction === undefined) {
        return;
      };


      if (chosenAction === 'saveAction') {
        await this.saveFile({
          saveAs: false
        });
      }
    }

    switch (chosenAction) {
      case 'saveAction':
      case 'discardAction':
        if (action === 'open') {
          try {
            const filepath: string = await openFileDialog();

            fs.readFile(filepath, (error: NodeJS.ErrnoException | null, data: Buffer) => {
              if (error === null) {
                this.openFileSucceeded(data.toString(), filepath);
              }

              console.error(`Error - ${LOG_PREFIX}: ${error}`);
            });
          } catch (e) {
            logging.log(LOG_PREFIX, 'No filename specified, no file opened.');
          }
        } else if (action === 'create') {
          this.openFileSucceeded('', '');
        }
        break;

      default:
        logging.log(LOG_PREFIX, `File ${action} canceled.`);
    }
  };

  dragFile = async (action: any) => {
    const LOG_PREFIX = 'dragFile:';

    const code = this.editorCode.get();
    const savedCode = this.latestSaveCode.get();
    let chosenAction: UnsavedDialogActionsOptions | undefined = 'discardAction';

    if (code !== savedCode) {
      chosenAction = await unsavedDialog(action);

      if (chosenAction === undefined) {
        return;
      }

      if (chosenAction === 'saveAction') {
        await this.saveFile({
          saveAs: false
        });
      }
    }

    switch (chosenAction) {
      case 'saveAction':
      case 'discardAction':
        try {
          const { filepath } = action;
          fs.readFile(filepath, (error: NodeJS.ErrnoException | null, data: Buffer) => {
            if (error === null) {
              this.openFileSucceeded(data.toString(), filepath);
            }

            console.error(`Error - ${LOG_PREFIX}: ${error}`);
          });
        } catch (e) {
          logging.log('Failure to Drag File In');
        }
        break;
      default: {
        logging.log('Drag File Operation Canceled');
      }
    }
  };

  saveFileSucceeded = ({ filepath, latestSaveCode }: { filepath: string; latestSaveCode: string }) => {
    this.filepath.set(filepath);
    this.latestSaveCode.set(latestSaveCode);
  };

  transferStudentCode = async (transferType: 'download' | 'upload') => {
    const isRuntimeConnected = this.rootStore.info.runtimeStatus.get();

    if (!isRuntimeConnected) {
      logging.log(`Runtime not connected - could not ${transferType} student code`);
      return;
    }

    let port = defaults.PORT;
    let ip = this.rootStore.info.ipAddress.get();
    if (ip.includes(':')) {
      const split = ip.split(':');
      ip = split[0];
      port = Number(split[1]);
    }

    const response = await transferFile({ localFilePath: this.filepath.get(), port, ip, transferType });

    const transferTypeHumanString = { download: 'Download', upload: 'Upload' }[transferType];

    switch (response) {
      case 'fileTransmissionSuccess': {
        // @todo: split between download and upload
        this.rootStore.alert.addAsyncAlert(`${transferTypeHumanString} Success`, `File ${transferTypeHumanString}ed Successfully`);
        break;
      }
      case 'sftpError': {
        this.rootStore.alert.addAsyncAlert(`${transferTypeHumanString} Issue`, 'SFTP session could not be initiated');
        break;
      }
      case 'fileTransmissionError': {
        this.rootStore.alert.addAsyncAlert(`${transferTypeHumanString} Issue`, 'File failed to be transmitted');
        break;
      }
      case 'connectionError': {
        this.rootStore.alert.addAsyncAlert(`${transferTypeHumanString} Issue`, 'Robot could not be connected');
        break;
      }
      default: {
        this.rootStore.alert.addAsyncAlert(`${transferTypeHumanString} Issue`, 'Unknown Error');
        break;
      }
    }

    // TODO: need timeout?
    // setTimeout(() => {
    //   conn.end();
    // }, 50);
  };

  initiateLatencyCheck = async () => {
    while (true) {
      const time: number = Date.now();
      const timestamps = new TimeStamps({
        dawnTimestamp: time,
        runtimeTimestamp: 0
      });

      ipcRenderer.send('initiateLatencyCheck', timestamps);

      await sleep(5000);
    }
  };

  sendKeyboardConnectionStatus = () => {
    const keyboardConnectionStatus = new Input({
      connected: this.isKeyboardModeToggled.get(),
      axes: [],
      buttons: 0,
      source: Source.KEYBOARD
    });

    ipcRenderer.send('stateUpdate', [keyboardConnectionStatus], Source.KEYBOARD);
  };

  sendKeyboardInputs = () => {
    const keyboard = new Input({
      connected: true,
      axes: [],
      buttons: this.keyboardBitmap.get(),
      source: Source.KEYBOARD
    });

    ipcRenderer.send('stateUpdate', [keyboard], Source.KEYBOARD);
  };
}
