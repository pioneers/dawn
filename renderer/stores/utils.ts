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

type UnsavedDialogButtonOptions = 'saveAction' | 'discardAction' | 'cancelAction';
const unsavedDialogButtonMappings: Record<number, UnsavedDialogButtonOptions> = {
  0: 'saveAction',
  1: 'discardAction',
  2: 'cancelAction'
}

export function unsavedDialog(action: string): Promise<UnsavedDialogButtonOptions> {
    return new Promise((resolve, reject) => {
      remote.dialog.showMessageBox({
        type: 'warning',
        buttons: [`Save and ${action}`, `Discard and ${action}`, 'Cancel action'],
        title: 'You have unsaved changes!',
        message: `You are trying to ${action} a new file, but you have unsaved changes to
  your current one. What do you want to do?`,
      }).then((messageBoxReturnValue: MessageBoxReturnValue) => {
        const { response: responseIdx } = messageBoxReturnValue;
        // `responseIdx` is an integer corrseponding to index in button list above.
        if (responseIdx === 0 || responseIdx === 1 || responseIdx === 2) {
          resolve(unsavedDialogButtonMappings[responseIdx]);
        } else {
          reject();
        }
      })
    });
  }

export function openFileDialog(): Promise<string> {
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

export function saveFileDialog(): Promise<string> {
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

export const createErrorCallback = (logPrefix: string) => (error: NodeJS.ErrnoException | null) => {
  if (error !== null) {
    console.error(`Error - ${logPrefix}: ${error}`);
  }
};
  