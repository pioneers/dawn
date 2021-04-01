/**
 * Redux sagas are how we handle complicated asynchronous stuff with redux.
 * See http://yelouafi.github.io/redux-saga/index.html for docs.
 * Sagas use ES6 generator functions, which have the '*' in their declaration.
 */

import fs, { readFile, writeFile } from 'fs';
import _ from 'lodash';
import { eventChannel } from 'redux-saga';
import { all, call, cps, delay, fork, put, race, select, take, takeEvery } from 'redux-saga/effects';
import { Client } from 'ssh2';
import { ipcRenderer, OpenDialogReturnValue, SaveDialogReturnValue, MessageBoxReturnValue, remote } from 'electron';
import { addAsyncAlert } from '../actions/AlertActions';
import { openFileSucceeded, saveFileSucceeded } from '../actions/EditorActions';
import { toggleFieldControl } from '../actions/FieldActions';
import { updateGamepads } from '../actions/GamepadsActions';
import { runtimeConnect, runtimeDisconnect } from '../actions/InfoActions';
import { TIMEOUT, defaults, logging } from '../utils/utils';
import { Input, Source, TimeStamps } from '../../protos/protos';

let timestamp = Date.now();

/**
 * The electron showOpenDialog interface does not work well
 * with redux-saga's 'cps' for callbacks. To make things nicer, we
 * wrap the Electron dialog functionality in a promise,
 * which works well with redux-saga's 'call' for promises.
 *
 * @return {Promise} - fulfilled if user selects file, rejected otherwise
 */
function openFileDialog() {
  return new Promise((resolve, reject) => {
    remote.dialog.showOpenDialog({
      filters: [{ name: 'python', extensions: ['py'] }],
    }).then((openDialogReturnValue: OpenDialogReturnValue) => {
      const { filePaths } = openDialogReturnValue;
      // If filepaths is undefined, the user did not specify a file.
      if (_.isEmpty(filePaths)) {
        reject();
      } else {
        resolve(filePaths[0]);
      }
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * Using Promise for Electron save dialog functionality for the same
 * reason as above.
 *
 * @return {Promise} - fulfilled with filepath once user hits save.
 */
function saveFileDialog() {
  return new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog({
      filters: [{ name: 'python', extensions: ['py'] }],
    }).then((saveDialogReturnValue: SaveDialogReturnValue) => {
      const { filePath } = saveDialogReturnValue;
      // If filepath is undefined, the user did not specify a file.
      if (filePath === undefined) {
        reject();
        return;
      }

      // Automatically append .py extension if they don't have it
      if (!filePath.endsWith('.py')) {
        resolve(`${filePath}.py`);
      }
      resolve(filePath);
    });
  });
}

/**
 * Using Promise for Electron message dialog functionality for the same
 * reason as above.
 *
 * @return {Promise} - fulfilled with button index.
 */
function unsavedDialog(action: string) {
  return new Promise((resolve, reject) => {
    remote.dialog.showMessageBox({
      type: 'warning',
      buttons: [`Save and ${action}`, `Discard and ${action}`, 'Cancel action'],
      title: 'You have unsaved changes!',
      message: `You are trying to ${action} a new file, but you have unsaved changes to
your current one. What do you want to do?`,
    }).then((messageBoxReturnValue: MessageBoxReturnValue) => {
      const { response } = messageBoxReturnValue;
      // 'res' is an integer corrseponding to index in button list above.
      if (response === 0 || response === 1 || response === 2) {
        resolve(response);
      } else {
        reject();
      }
    })
  });
}

/**
 * Simple helper function to write to a codefile and dispatch action
 * notifying store of the save.
 */
function* writeCodeToFile(filepath: string, code: string): Generator<any, void, any> {
  yield cps([fs, writeFile], filepath, code);
  yield put(saveFileSucceeded(code, filepath));
}

const editorState = (state: ApplicationState) => ({
  filepath: state.editor.filepath,
  code: state.editor.editorCode,
  keyboardBitmap: state.editor.keyboardBitmap,
  isKeyboardModeToggled: state.editor.isKeyboardModeToggled
});

function* saveFile(action: any) {
  const result = yield select(editorState);
  let { filepath } = result;
  const { code } = result;
  // If the action is a "save as" OR there is no filepath (ie, a new file)
  // then we open the save file dialog so the user can specify a filename before saving.
  if (action.saveAs === true || !filepath) {
    try {
      filepath = yield call(saveFileDialog);
      yield* writeCodeToFile(filepath, code);
    } catch (e) {
      logging.log('No filename specified, file not saved.');
    }
  } else {
    yield* writeCodeToFile(filepath, code);
  }
}

const editorSavedState = (state: any) => ({
  savedCode: state.editor.latestSaveCode,
  code: state.editor.editorCode,
});

function* openFile(action: any) {
  const type = (action.type === 'OPEN_FILE') ? 'open' : 'create';
  const result = yield select(editorSavedState);
  let res = 1;
  if (result.code !== result.savedCode) {
    res = yield call(unsavedDialog, type);
    if (res === 0) {
      yield* saveFile({
        type: 'SAVE_FILE',
        saveAs: false,
      });
    }
  }
  if (res === 0 || res === 1) {
    if (type === 'open') {
      try {
        const filepath: string = yield call(openFileDialog);
        const data: Buffer = yield cps([fs, readFile], filepath);
        yield put(openFileSucceeded(data.toString(), filepath));
      } catch (e) {
        logging.log('No filename specified, no file opened.');
      }
    } else if (type === 'create') {
      yield put(openFileSucceeded('', ''));
    }
  } else {
    logging.log(`File ${type} canceled.`);
  }
}

function* dragFile(action: any) {
  const result = yield select(editorSavedState);
  let res = 1; // Refers to unsavedDialog choices
  if (result.code !== result.savedCode) {
    res = yield call(unsavedDialog, 'open');
    if (res === 0) {
      yield* saveFile({
        type: 'SAVE_FILE',
        saveAs: false,
      });
    }
  }

  if (res === 0 || res === 1) {
    try {
      const { filepath } = action;
      const data: Buffer = yield cps([fs, readFile], filepath);
      yield put(openFileSucceeded(data.toString(), filepath));
    } catch (e) {
      logging.log('Failure to Drag File In');
    }
  } else {
    logging.log('Drag File Operation Canceled');
  }
}

/**
 * This saga acts as a "heartbeat" to check whether we are still receiving
 * updates from Runtime.
 *
 * NOTE that this is different from whether or not the Runtime connection
 * is still alive.
 */
function* runtimeHeartbeat() {
  while (true) {
    // Start a race between a delay and receiving an UPDATE_STATUS action from
    // runtime. Only the winner will have a value.
    const result = yield race({
      update: take('PER_MESSAGE'),
      timeout: delay(TIMEOUT)
    });

    // If update wins, we assume we are connected, otherwise disconnected.
    if (result.update) {
      yield put(runtimeConnect());
    } else {
      yield put(runtimeDisconnect());
    }
  }
}

const _timestamps: Array<number | null> = [0, 0, 0, 0];

function _needToUpdate(newGamepads: (Gamepad | null)[]): boolean {
  return _.some(newGamepads, (gamepad, index) => {
    if (gamepad != null && (gamepad.timestamp > (_timestamps[index] ?? 0))) {
      _timestamps[index] = gamepad.timestamp;
      return true;
    } else if (gamepad == null && _timestamps[index] != null) {
      _timestamps[index] = null;
      return true;
    }
    return false;
  });
}

function formatGamepads(newGamepads: (Gamepad | null)[]): Input[] {
  let formattedGamepads: Input[] = [];
  // Currently there is a bug on windows where navigator.getGamepads()
  // returns a second, 'ghost' gamepad even when only one is connected.
  // The filter on 'mapping' filters out the ghost gamepad.
  _.forEach(_.filter(newGamepads, { mapping: 'standard' }), (gamepad: Gamepad | null, indexGamepad: number) => {
    if (gamepad) {
      let bitmap: number = 0;
      gamepad.buttons.forEach((button, index) => {
        if (button.pressed) {
          bitmap |= (1 << index);
        }
      });
      formattedGamepads[indexGamepad] = new Input({
        connected: gamepad.connected,
        axes: gamepad.axes.slice(),
        buttons: bitmap,
        source: Source.GAMEPAD
      });
    }
  });
  return formattedGamepads;
}

function* sendLatencyRequest() {

  while (true){
    const time: number = Date.now()
    console.log(time);
    const getLatency = new TimeStamps({
      dawnTimestamp: time,
      runtimeTimestamp: 0
    });

    ipcRenderer.send('latencyRequest', getLatency);

    yield delay(5000);
  }
  
}
/*
 Send an update to Runtime indicating whether keyboard mode is on/off
*/
function* sendKeyboardConnectionStatus() {
  const currEditorState = yield select(editorState);

  const keyboardConnectionStatus = new Input({
    connected: currEditorState.isKeyboardModeToggled,
    axes: [],
    buttons: 0,
    source: Source.KEYBOARD
  });

  ipcRenderer.send('stateUpdate', [keyboardConnectionStatus], Source.KEYBOARD);
}

function* sendKeyboardInputs() {
  const currEditorState = yield select(editorState);

  const keyboard = new Input({
    connected: true,
    axes: [],
    buttons: currEditorState.keyboardBitmap,
    source: Source.KEYBOARD
  });

  ipcRenderer.send('stateUpdate', [keyboard], Source.KEYBOARD);
}

/**
 * Repeatedly grab gamepad data, send it over Runtime to the robot, and dispatch
 * redux action to update gamepad state.
 */
function* runtimeGamepads() {

  const currEditorState = yield select(editorState)

  if (!currEditorState.isKeyboardModeToggled) {
    while (true) {
      // navigator.getGamepads always returns a reference to the same object. This
      // confuses redux, so we use assignIn to clone to a new object each time.
      const newGamepads = navigator.getGamepads();
      if (_needToUpdate(newGamepads) || Date.now() - timestamp > 100) {
        const formattedGamepads = formatGamepads(newGamepads);
        yield put(updateGamepads(formattedGamepads));

        // Send gamepad data to Runtime.
        if (_.some(newGamepads) || Date.now() - timestamp > 100) {
          timestamp = Date.now();
          yield put({ type: 'UPDATE_MAIN_PROCESS' });
        }
      }

      yield delay(50); // wait 50 ms before updating again.
    }
  }
}

/**
 * Creates the runtimeReceiver eventChannel, which emits
 * data received from the main process.
 */
function runtimeReceiver() {
  return eventChannel((emitter) => {
    const listener = (_event: any, action: any) => {
      emitter(action);
    };
    // Suscribe listener to dispatches from main process.
    ipcRenderer.on('dispatch', listener);
    // Return an unsuscribe function.
    return () => {
      ipcRenderer.removeListener('dispatch', listener);
    };
  });
}

/**
 * Takes data from the runtimeReceiver channel and dispatches
 * it to the store
 */
function* runtimeSaga() {
  try {
    const chan = yield call(runtimeReceiver);

    while (true) {
      const action = yield take(chan);
      // dispatch the action
      yield put(action);
    }
  } catch (e) {
    logging.log(e.stack);
  }
}

const gamepadsState = (state: any) => state.gamepads.gamepads;

/**
 * Send the store to the main process whenever it changes.
 */
function* updateMainProcess() {
  const stateSlice = yield select(gamepadsState); // Get gamepads from Redux state store
  ipcRenderer.send('stateUpdate', stateSlice, Source.GAMEPAD);
}

function* restartRuntime() {
  const conn = new Client();
  const stateSlice = yield select((state: any) => ({
    runtimeStatus: state.info.runtimeStatus,
    ipAddress: state.info.ipAddress,
  }));
  if (stateSlice.runtimeStatus && stateSlice.ipAddress !== defaults.IPADDRESS) {
    const network = yield call(() => new Promise((resolve) => {
      conn.on('ready', () => {
        conn.exec(
          'sudo systemctl restart runtime.service',
          { pty: true }, (uperr: any, stream: any) => {
            if (uperr) {
              resolve(1);
            }
            stream.write(`${defaults.PASSWORD}\n`);
            stream.on('exit', (code: any) => {
              logging.log(`Runtime Restart: Returned ${code}`);
              conn.end();
              resolve(0);
            });
          },
        );
      }).connect({
        debug: (inpt: any) => {
          logging.log(inpt);
        },
        host: stateSlice.ipAddress,
        port: defaults.PORT,
        username: defaults.USERNAME,
        password: defaults.PASSWORD,
      });
    }));
    if (network === 1) {
      yield addAsyncAlert(
        'Runtime Restart Error',
        'Dawn was unable to run restart commands. Please check your robot connectivity.',
      );
    }
  }
}

function* downloadStudentCode() {
  const conn = new Client();
  const stateSlice = yield select((state: any) => ({
    runtimeStatus: state.info.runtimeStatus,
    ipAddress: state.info.sshAddress,
  }));
  let port = defaults.PORT;
  let ip = stateSlice.ipAddress;
  if (ip.includes(':')) {
    const split = ip.split(':');
    ip = split[0];
    port = Number(split[1]);
  }
  console.log(`SSHing into ${ip}:${port} to download code`);
  const path = `${require('electron').remote.app.getPath('desktop')}/Dawn`; // eslint-disable-line global-require
  try {
    fs.statSync(path);
  } catch (fileErr) {
    fs.mkdirSync(path);
  }
  if (stateSlice.runtimeStatus) {
    logging.log(`Downloading to ${path}`);
    const errors = yield call(() => new Promise((resolve) => {
      conn.on('error', (err: any) => {
        logging.log(err);
        resolve(3);
      });

      conn.on('ready', () => {
        conn.sftp((err: any, sftp: any) => {
          if (err) {
            logging.log(err);
            resolve(1);
          }
          sftp.fastGet(
            defaults.STUDENTCODELOC, `${path}/robotCode.py`,
            (err2: any) => {
              if (err2) {
                logging.log(err2);
                resolve(2);
              }
              resolve(0);
            },
          );
        });
      }).connect({
        debug: (inpt: any) => {
          logging.log(inpt);
        },
        host: ip,
        port: port,
        username: defaults.USERNAME,
        password: defaults.PASSWORD,
      });
    }));
    switch (errors) {
      case 0: {
        const data: Buffer = yield cps(fs.readFile, `${path}/robotCode.py`);
        yield put(openFileSucceeded(data.toString(), `${path}/robotCode.py`));
        yield put(addAsyncAlert(
          'Download Success',
          'File Downloaded Successfully',
        ));
        break;
      }
      case 1: {
        yield put(addAsyncAlert(
          'Download Issue',
          'SFTP session could not be initiated',
        ));
        break;
      }
      case 2: {
        yield put(addAsyncAlert(
          'Download Issue',
          'File failed to be downloaded',
        ));
        break;
      }
      case 3: {
        yield put(addAsyncAlert(
          'Download Issue',
          'Robot could not be connected.',
        ));
        break;
      }
      default: {
        yield put(addAsyncAlert(
          'Download Issue',
          'Unknown Error',
        ));
        break;
      }
    }
    setTimeout(() => {
      conn.end();
    }, 50);
  }
}

function* uploadStudentCode() {
  const conn = new Client();
  const stateSlice = yield select((state: any) => ({
    runtimeStatus: state.info.runtimeStatus,
    ipAddress: state.info.sshAddress,
    filepath: state.editor.filepath,
  }));
  let port = defaults.PORT;
  let ip = stateSlice.ipAddress;
  if (ip.includes(':')) {
    const split = ip.split(':');
    ip = split[0];
    port = Number(split[1]);
  }
  if (stateSlice.runtimeStatus) {
    logging.log(`Uploading ${stateSlice.filepath}`);
    const errors = yield call(() => new Promise((resolve) => {
      conn.on('error', (err: any) => {
        logging.log(err);
        resolve(3);
      });

      conn.on('ready', () => {
        conn.sftp((err: any, sftp: any) => {
          if (err) {
            logging.log(err);
            resolve(1);
          }
          sftp.fastPut(
            stateSlice.filepath, defaults.STUDENTCODELOC,
            (err2: any) => {
              if (err2) {
                logging.log(err2);
                resolve(2);
              }
              resolve(0);
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
      case 0: {
        yield put(addAsyncAlert(
          'Upload Success',
          'File Uploaded Successfully',
        ));
        break;
      }
      case 1: {
        yield put(addAsyncAlert(
          'Upload Issue',
          'SFTP session could not be initiated',
        ));
        break;
      }
      case 2: {
        yield put(addAsyncAlert(
          'Upload Issue',
          'File failed to be transmitted',
        ));
        break;
      }
      case 3: {
        yield put(addAsyncAlert(
          'Upload Issue',
          'Robot could not be connected',
        ));
        break;
      }
      default: {
        yield put(addAsyncAlert(
          'Upload Issue',
          'Unknown Error',
        ));
        break;
      }
    }
    setTimeout(() => {
      conn.end();
    }, 50);
  }
}

function* handleFieldControl() {
  const stateSlice = yield select((state: any) => ({
    fieldControlStatus: state.fieldStore.fieldControl,
  }));
  if (stateSlice.fieldControlStatus) {
    yield put(toggleFieldControl(false));
    ipcRenderer.send('FC_TEARDOWN');
  } else {
    yield put(toggleFieldControl(true));
    ipcRenderer.send('FC_INITIALIZE');
  }
}

function timestampBounceback() {
  logging.log('Timestamp Requested in Sagas');
  ipcRenderer.send('TIMESTAMP_SEND');
}

/**
 * The root saga combines all the other sagas together into one.
 */
export default function* rootSaga() {
  yield all([
    takeEvery('OPEN_FILE', openFile),
    takeEvery('SAVE_FILE', saveFile),
    takeEvery('DRAG_FILE', dragFile),
    takeEvery('CREATE_NEW_FILE', openFile),
    takeEvery('UPDATE_MAIN_PROCESS', updateMainProcess),
    takeEvery('RESTART_RUNTIME', restartRuntime),
    takeEvery('DOWNLOAD_CODE', downloadStudentCode),
    takeEvery('UPLOAD_CODE', uploadStudentCode),
    takeEvery('TOGGLE_FIELD_CONTROL', handleFieldControl),
    takeEvery('TIMESTAMP_CHECK', timestampBounceback),
    takeEvery('UPDATE_KEYBOARD_BITMAP', sendKeyboardInputs),
    takeEvery('UPDATE_IS_KEYBOARD_MODE_TOGGLED', sendKeyboardConnectionStatus),
    fork(runtimeHeartbeat),
    fork(runtimeGamepads),
    fork(runtimeSaga),
    fork(sendLatencyRequest)
  ]);
}

export {
  openFileDialog,
  unsavedDialog,
  openFile,
  writeFile,
  editorState,
  editorSavedState,
  saveFileDialog,
  saveFile,
  runtimeHeartbeat,
  gamepadsState,
  updateMainProcess,
  runtimeReceiver,
  runtimeSaga,
}; // for tests
