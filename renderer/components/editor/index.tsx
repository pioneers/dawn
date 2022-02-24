import React, { useEffect, useState } from 'react';
import {
  Card,
  ButtonGroup,
  DropdownButton,
  FormGroup,
  FormControl,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Dropdown
} from 'react-bootstrap';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { remote } from 'electron';
import storage from 'electron-json-storage';
import _ from 'lodash';
import { Observer } from 'mobx-react';

// React-ace extensions and modes
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/mode-python';
// React-ace themes
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-terminal';

import { ControlRobotStateAndCodeButtons } from './ControlRobotStateAndCodeButtons';
import { FileOperationButtons } from './FileOperationsButtons';
import { FontSizeButtons } from './FontSizeButtons';
import { ConsoleOutput } from '../ConsoleOutput';
import { TooltipButton } from '../TooltipButton';
import { AUTOCOMPLETION_LIST, MAX_FONT_SIZE, MIN_FONT_SIZE, ROBOT_STAFF_CODE } from '../../consts';
import { useConsole, useFontResizer, useKeyboardMode, useStores } from '../../hooks';
import { correctText, pathToName, robotState, logging, windowInfo } from '../../utils/utils';

const { dialog } = remote;
const currentWindow = remote.getCurrentWindow();

interface StateProps {
  editorTheme: string;
  editorCode: string;
  latestSaveCode: string;
  filepath: string;
  fontSize: number;
  showConsole: boolean;
  consoleData: string[];
  runtimeStatus: boolean;
  fieldControlActivity: boolean;
  disableScroll: boolean;
  consoleUnread: boolean;
  latencyValue: number;
  globalTheme: string;
}

interface OwnProps {
  onAlertAdd: (heading: string, message: string) => void;
  onEditorUpdate: (newVal: string) => void;
  onSaveFile: (saveAs?: boolean) => void;
  onDragFile: (filepath: string) => void;
  onOpenFile: () => void;
  onCreateNewFile: () => void;
  onChangeTheme: (theme: string) => void;
  onChangeFontsize: (newFontsize: number) => void;
  toggleConsole: () => void;
  onClearConsole: () => void;
  onUpdateCodeStatus: (status: number) => void;
  onDownloadCode: () => void;
  onUploadCode: () => void;
  onUpdateKeyboardBitmap: (keyboardBitmap: number) => void;
  onUpdateKeyboardModeToggle: (isKeyboardToggled: boolean) => void;
  onInitiateLatencyCheck: () => void;
}

type Props = {}; // StateProps & OwnProps;

const FONT_SIZES = [8, 12, 14, 16, 20, 24, 28];

export const Editor = (props: Props) => {
  const [editorHeight, setEditorHeight] = useState('0px');
  const [mode, setMode] = useState(robotState.TELEOP);
  const [modeDisplay, setModeDisplay] = useState(robotState.TELEOPSTR);
  const [isRunning, setIsRunning] = useState(false);

  const onConsoleToggle = () => {
    // Resize since the console overlaps with the editor, but enough time for console changes
    setTimeout(() => onWindowResize(), 0.01);
  };

  const { consoleData, isConsoleOpen, isConsoleUnread, consoleHeight, toggleConsole, raiseConsole, lowerConsole, copyConsole } = useConsole(
    {
      onToggled: onConsoleToggle
    }
  );

  const {
    onChangeFontSize,
    submittedFontSize,
    decreaseFontsize,
    increaseFontsize,
    handleChangeFontsize,
    handleOnBlurFontSize,
    handleOnKeyDownFontSize,
    submitFontSize
  } = useFontResizer();

  const { editor, settings } = useStores();

  const { isKeyboardModeToggled, toggleKeyboardControl } = useKeyboardMode({
    onUpdateKeyboardBitmap: editor.updateKeyboardBitmap,
    onUpdateKeyboardModeToggle: editor.updateIsKeyboardModeToggled
  });

  let CodeEditor: AceEditor;
  const themes: string[] = [
    'monokai',
    'github',
    'tomorrow',
    'kuroir',
    'twilight',
    'xcode',
    'textmate',
    'solarized_dark',
    'solarized_light',
    'terminal'
  ];

  /*
   * Confirmation Dialog on Quit, Stored Editor Settings, Window Size-Editor Re-render
   */
  useEffect(() => {
    CodeEditor.editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });
    const autoComplete = {
      getCompletions(_editor: Ace.Editor, _session: Ace.EditSession, _pos: Ace.Point, _prefix: string, callback: Ace.CompleterCallback) {
        callback(null, AUTOCOMPLETION_LIST);
      }
    };
    CodeEditor.editor.completers = [autoComplete];

    onWindowResize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storage.get('editorTheme', (err: any, data: { theme?: string }) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        settings.changeTheme(data.theme ?? 'github');
      }
    });

    function beforeUnload(event: BeforeUnloadEvent) {
      // If there are unsaved changes and the user tries to close Dawn,
      // check if they want to save their changes first.
      if (hasUnsavedChanges()) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dialog
          .showMessageBox(currentWindow, {
            type: 'warning',
            buttons: ['Save...', "Don't Save", 'Cancel'],
            defaultId: 0,
            cancelId: 2,
            title: 'You have unsaved changes!',
            message: 'Do you want to save the changes made to your program?',
            detail: "Your changes will be lost if you don't save them."
          })
          // NOTE: For whatever reason, `event.preventDefault()` does not work within
          // beforeunload events, so we use `event.returnValue = false` instead.
          .then((clickedId) => {
            if (clickedId.response === 0) {
              // FIXME: Figure out a way to make Save and Close, well, close.
              event.returnValue = false;
              editor.saveFile(); // TODO: figure out how to remove promise dependency
            } else if (clickedId.response === 2) {
              event.returnValue = false;
            }
          });
      }
    }

    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      return false;
    });

    window.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      editor.dragFile(e.dataTransfer?.files?.[0].path ?? '');
      return false;
    });

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  const checkLatency = () => {
    editor.initiateLatencyCheck.run();
  };

  const insertRobotStaffCode = () => {
    props.onEditorUpdate(ROBOT_STAFF_CODE);
  };

  const onWindowResize = () => {
    // Trigger editor to re-render on window resizing.
    const windowNonEditorHeight = windowInfo.NONEDITOR + +!!isConsoleOpen * (consoleHeight + windowInfo.CONSOLEPAD);
    const newEditorHeight = `${window.innerHeight - windowNonEditorHeight}px`;

    setEditorHeight(newEditorHeight);
  };

  const hasUnsavedChanges = () => {
    return props.latestSaveCode !== props.editorCode;
  };

  const changeTheme = (theme: string) => {
    props.onChangeTheme(theme);
    storage.set('editorTheme', { theme }, (err: any) => {
      if (err) logging.log(err);
    });
  };

  useEffect(() => {
    onWindowResize();
  }, [consoleHeight, onWindowResize]);

  const changeMarker = hasUnsavedChanges() ? '*' : '';

  return (
    <Observer>
      {() => (
        <Card bg={settings.globalTheme.get() === 'dark' ? 'dark' : 'light'} text={settings.globalTheme.get() === 'dark' ? 'light' : 'dark'}>
          <Observer>
            {() => (
              <Card.Header>
                <Card.Title style={{ fontSize: '14px' }}>
                  Editing: {pathToName(editor.filepath.get()) ? pathToName(editor.filepath.get()) : '[ New File ]'} {changeMarker}
                </Card.Title>
              </Card.Header>
            )}
          </Observer>
          <Card.Body>
            <Form inline>
              <FileOperationButtons />
              <ControlRobotStateAndCodeButtons />
              <ButtonGroup id="console-buttons">
                <TooltipButton
                  id="toggle-console"
                  text="Toggle Console"
                  onClick={toggleConsole}
                  icon="terminal"
                  disabled={false}
                  bsStyle={isConsoleUnread ? 'danger' : ''}
                />
                <TooltipButton id="clear-console" text="Clear Console" onClick={props.onClearConsole} icon="times" disabled={false} />
                <TooltipButton
                  id="raise-console"
                  text="Raise Console"
                  onClick={raiseConsole}
                  icon="arrow-up"
                  disabled={consoleHeight > windowInfo.CONSOLEMAX}
                />
                <TooltipButton
                  id="lower-console"
                  text="Lower Console"
                  onClick={lowerConsole}
                  icon="arrow-down"
                  disabled={consoleHeight < windowInfo.CONSOLEMIN}
                />
                <TooltipButton id="copy-console" text="Copy Console" onClick={copyConsole} icon="clipboard" disabled={false} />
              </ButtonGroup>
              <FontSizeButtons />
              <ButtonGroup id="editor-settings-buttons" className="form-inline">
                <DropdownButton
                  variant={settings.globalTheme.get() === 'dark' ? 'outline-info' : 'primary'}
                  title="Theme"
                  size="sm"
                  id="choose-theme"
                >
                  {themes.map((theme: string) => (
                    <Dropdown.Item active={theme === props.editorTheme} onClick={_.partial(changeTheme, theme)} key={theme}>
                      {theme}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <TooltipButton id="checkLatency" text="Initiate Latency Check" onClick={checkLatency} icon="paper-plane" disabled={false} />
                <TooltipButton
                  id="toggleKeyboardControl"
                  text="Toggle Keyboard Control Mode"
                  onClick={toggleKeyboardControl}
                  icon="keyboard"
                  disabled={false}
                  bsStyle={isKeyboardModeToggled ? 'info' : 'default'}
                />
              </ButtonGroup>
            </Form>
            <Observer>
              {() => (
                <AceEditor
                  mode="python"
                  theme={settings.editorTheme.get()}
                  width="100%"
                  fontSize={submittedFontSize}
                  ref={(input: AceEditor) => {
                    CodeEditor = input;
                  }}
                  name="CodeEditor"
                  height={editorHeight}
                  value={editor.editorCode.get()}
                  onChange={editor.updateEditorCode}
                  editorProps={{ $blockScrolling: Infinity }}
                  readOnly={isKeyboardModeToggled}
                />
              )}
            </Observer>
            <ConsoleOutput toggleConsole={toggleConsole} show={isConsoleOpen} height={consoleHeight} output={consoleData} />
          </Card.Body>
        </Card>
      )}
    </Observer>
  );
};
