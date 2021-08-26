import { ipcRenderer } from 'electron';
import fs, { readFile, writeFile } from 'fs';
import { IObservableValue, makeAutoObservable, observable } from 'mobx'
import { Client } from 'ssh2';
import { Input, Source, TimeStamps } from '../../protos/protos';
import { defaults, logging } from '../utils/utils';
import { RootStore } from './root';
import { createErrorCallback, openFileDialog, saveFileDialog, unsavedDialog } from './utils';

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
    filepath: IObservableValue<string> = observable.box('')
    latestSaveCode: IObservableValue<string> = observable.box('')
    editorCode: IObservableValue<string> = observable.box('')
    keyboardBitmap: IObservableValue<number> = observable.box(0)
    isKeyboardModeToggled: IObservableValue<boolean> = observable.box(false)
    latencyValue: IObservableValue<number> = observable.box(0)

    constructor(rootStore: typeof RootStore) {
        this.rootStore = rootStore;
    }

    updateEditor = (editor: EditorState) => {
        this.editorCode.set(editor.editorCode);
    }

    updateKeyboardBitmap = (editor: EditorState) => {
        this.keyboardBitmap.set(editor.keyboardBitmap);
    }

    setLatencyValue = (editor: EditorState) => {
        this.latencyValue.set(editor.latencyValue)
    }

    updateIsKeyboardModeToggled = (editor: EditorState) => {
        this.isKeyboardModeToggled.set(editor.isKeyboardModeToggled);
    }

    // Filesystem for editor
    openFileSucceeded = ( code: string, filepath: string) => {
      this.editorCode.set(code);
      this.filepath.set(filepath);
      this.latestSaveCode.set(code);
    }

    /**
     * Simple helper function to write to a codefile and dispatch action
     * notifying store of the save.
     */
    writeCodeToFile = (filepath: string, code: string) => {
      fs.writeFile(filepath, code, createErrorCallback('writeCodeToFile'))

      this.saveFileSucceeded({ latestSaveCode: code, filepath });
    }

    saveFile = async ({ saveAs }: { saveAs: boolean }) => {
        let filepath = this.filepath.get();
        const code = this.editorCode.get();
        // If the action is a "save as" OR there is no filepath (ie, a new file)
        // then we open the save file dialog so the user can specify a filename before saving.
        if (saveAs === true || !this.filepath) {
          try {
            filepath = await saveFileDialog();
            this.writeCodeToFile(filepath, code);
          } catch (e) {
            logging.log('No filename specified, file not saved.');
          }
        } else {
          this.writeCodeToFile(filepath, code);
        }
    }


    openFile = async ({ actionType } : { actionType: string}) => {
        const LOG_PREFIX = 'openFile:';

        const action = (actionType === 'OPEN_FILE') ? 'open' : 'create';
        let chosenAction = 'discardAction';

        if (this.editorCode.get() !== this.latestSaveCode.get()) {
          chosenAction = await unsavedDialog(action);
          if (chosenAction === 'saveAction') {
            await this.saveFile({
              saveAs: false,
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
    }

    dragFile = async (action: any) => {
        const LOG_PREFIX = 'dragFile:';

        let code = this.editorCode.get();
        let savedCode = this.latestSaveCode.get();
        let chosenAction = 'discardAction';
        
        if (code !== savedCode) {
            chosenAction = await unsavedDialog(action);
            if (chosenAction === 'saveAction') {
              await this.saveFile({
                saveAs: false,
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
          } default: {
          logging.log('Drag File Operation Canceled');
        }
      }
    }

    saveFileSucceeded = ({ filepath, latestSaveCode }: {filepath: string, latestSaveCode: string}) => {
        this.filepath.set(filepath);
        this.latestSaveCode.set(latestSaveCode);
    }

    // combine uploadStudentCode and downloadStudentCode into one function
    // we can maybe call the function transferStudentCode
    uploadStudentCode = () => {
        const conn = new Client();
        let port = defaults.PORT;
        let ip = this.rootStore.info.ipAddress.get();
        if (ip.includes(':')) {
          const split = ip.split(':');
          ip = split[0];
          port = Number(split[1]);
        }
        if (this.rootStore.info.runtimeStatus.get()) {
          logging.log(`Uploading ${this.filepath.get()}`);
          const errors = yield call(() => new Promise((resolve) => {
            conn.on('error', (err: any) => {
              logging.log(err);
              resolve('connectionError');
            });
      
            conn.on('ready', () => {
              conn.sftp((err: any, sftp: any) => {
                if (err) {
                  logging.log(err);
                  resolve('sftpError');
                }
                sftp.fastPut(
                  stateSlice.filepath, defaults.STUDENTCODELOC,
                  (err2: any) => {
                    if (err2) {
                      logging.log(err2);
                      resolve('fileTransmissionError');
                    }
                    resolve('fileTransmissionSuccess');
                  },
                );
              });
            }).connect({
              debug: (input: any) => {
                logging.log(input);
              },
              host: ip,
              port: port,
              username: defaults.USERNAME,
              password: defaults.PASSWORD,
            });
          }));
      
          switch (errors) {
            case 'fileTransmissionSuccess': {
              this.rootStore.alert.addAsyncAlert(
                'Upload Success',
                'File Uploaded Successfully',
              );
              break;
            }
            case 'sftpError': {
            this.rootStore.alert.addAsyncAlert(
                'Upload Issue',
                'SFTP session could not be initiated',
              );
              break;
            }
            case 'fileTransmissionError': {
                this.rootStore.alert.addAsyncAlert(
                'Upload Issue',
                'File failed to be transmitted',
              );
              break;
            }
            case 'connectionError': {
                this.rootStore.alert.addAsyncAlert(
                'Upload Issue',
                'Robot could not be connected',
              );
              break;
            }
            default: {
                this.rootStore.alert.addAsyncAlert(
                'Upload Issue',
                'Unknown Error',
              );
              break;
            }
          }
          setTimeout(() => {
            conn.end();
          }, 50);
        }
      }

      initiateLatencyCheck = () => {
        while (true) {
          const time: number = Date.now();
          const timestamps = new TimeStamps({
            dawnTimestamp: time,
            runtimeTimestamp: 0
          });
      
          ipcRenderer.send('initiateLatencyCheck', timestamps);
      
          delay(5000);//TODO!
        }   
      }
    
      sendKeyboardConnectionStatus =() => {
        const keyboardConnectionStatus = new Input({
          connected: this.isKeyboardModeToggled.get(),
          axes: [],
          buttons: 0,
          source: Source.KEYBOARD
        });
      
        ipcRenderer.send('stateUpdate', [keyboardConnectionStatus], Source.KEYBOARD);
      }

      sendKeyboardInputs = () => {
        const keyboard = new Input({
          connected: true,
          axes: [],
          buttons: this.keyboardBitmap.get(),
          source: Source.KEYBOARD
        });
      
        ipcRenderer.send('stateUpdate', [keyboard], Source.KEYBOARD);
      }
}

