/* eslint-disable @typescript-eslint/no-floating-promises */
import _ from 'lodash';
import { OpenDialogReturnValue, SaveDialogReturnValue, MessageBoxReturnValue, remote } from 'electron';

type UnsavedDialogButtonOptions = 'saveAction' | 'discardAction' | 'cancelAction';
const unsavedDialogButtonMappings: Record<number, UnsavedDialogButtonOptions> = {
  0: 'saveAction',
  1: 'discardAction',
  2: 'cancelAction'
};

export async function unsavedDialog(action: string): Promise<UnsavedDialogButtonOptions | undefined> {
  const messageBoxReturnValue: MessageBoxReturnValue = await remote.dialog.showMessageBox({
    type: 'warning',
    buttons: [`Save and ${action}`, `Discard and ${action}`, 'Cancel action'],
    title: 'You have unsaved changes!',
    message: `You are trying to ${action} a new file, but you have unsaved changes to your current one. What do you want to do?`
  });

  const { response: responseIdx } = messageBoxReturnValue;
  // `responseIdx` is an integer corrseponding to index in button list above.
  if ([0, 1, 2].includes(responseIdx)) {
    return unsavedDialogButtonMappings[responseIdx];
  }

  return undefined;
}

export async function openFileDialog(): Promise<string | undefined> {
  const openDialogReturnValue: OpenDialogReturnValue = await remote.dialog.showOpenDialog({
    filters: [{ name: 'python', extensions: ['py'] }]
  });

  const { filePaths } = openDialogReturnValue;

  // If filepaths is undefined, the user did not specify a file.
  if (_.isEmpty(filePaths)) {
    return;
  }

  return filePaths[0];
}

export async function saveFileDialog(): Promise<string | undefined> {
  const saveDialogReturnValue: SaveDialogReturnValue = await remote.dialog.showSaveDialog({
    filters: [{ name: 'python', extensions: ['py'] }]
  });

  let { filePath } = saveDialogReturnValue;
  // If filepath is undefined, the user did not specify a file.
  if (filePath === undefined) {
    return;
  }

  // Automatically append .py extension if they don't have it
  if (!filePath.endsWith('.py')) {
    filePath = `${filePath}.py`;
  }

  return filePath;
}

export const createErrorCallback = (logPrefix: string) => (error: NodeJS.ErrnoException | null) => {
  if (error !== null) {
    console.error(`Error - ${logPrefix}: ${error}`);
  }
};
