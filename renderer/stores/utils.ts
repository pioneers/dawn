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

export function unsavedDialog(action: string) {
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

export function openFileDialog() {
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
  