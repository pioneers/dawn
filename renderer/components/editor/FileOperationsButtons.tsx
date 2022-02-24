import React from 'react';
import { ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { Observer } from 'mobx-react';

import { TooltipButton } from '../TooltipButton';
import { useStores } from '../../hooks';
import { correctText, logging } from '../../utils/utils';

export const FileOperationButtons = () => {
  const { alert, editor, info, settings } = useStores();

  const upload = () => {
    const filepath = editor.filepath.get();

    const hasUnsavedChanges = editor.latestSaveCode.get() !== editor.editorCode.get();

    if (filepath === '') {
      alert.addAsyncAlert('Not Working on a File', 'Please save first');
      logging.log('Upload: Not Working on File');

      return;
    }

    if (hasUnsavedChanges) {
      alert.addAsyncAlert('Unsaved File', 'Please save first');
      logging.log('Upload: Not Working on Saved File');

      return;
    }

    if (correctText(editor.editorCode.get()) !== editor.editorCode.get()) {
      alert.addAsyncAlert(
        'Invalid characters detected',
        "Your code has non-ASCII characters, which won't work on the robot. " + 'Please remove them and try again.'
      );
      logging.log('Upload: Non-ASCII Issue');

      return;
    }

    editor.transferStudentCode.run('upload');
  };

  return (
    <Observer>
      {() => (
        <ButtonGroup id="file-operations-buttons">
          <DropdownButton
            variant={settings.globalTheme.get() === 'dark' ? 'outline-info' : 'primary'}
            title="File"
            size="sm"
            id="choose-theme"
          >
            <Dropdown.Item onClick={() => editor.openFile('create')}>New File</Dropdown.Item>
            <Dropdown.Item onClick={() => editor.openFile('open')}>Open</Dropdown.Item>
            <Dropdown.Item onClick={() => editor.saveFile()}>Save</Dropdown.Item>
            <Dropdown.Item onClick={() => editor.saveFile({ saveAs: true })}>Save As</Dropdown.Item>
          </DropdownButton>
          <TooltipButton id="upload" text="Upload" onClick={upload} icon="arrow-circle-up" disabled={false} />
          <TooltipButton
            id="download"
            text="Download from Robot"
            onClick={() => editor.transferStudentCode.run('download')}
            icon="arrow-circle-down"
            disabled={!info.runtimeStatus.get()}
          />
        </ButtonGroup>
      )}
    </Observer>
  );
};
