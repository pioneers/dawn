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
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../consts';
import { useConsole, useFontResizer, useKeyboardMode } from '../hooks';

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

import { ConsoleOutput } from './ConsoleOutput';
import { TooltipButton } from './TooltipButton';
import { AUTOCOMPLETION_LIST, ROBOT_STAFF_CODE } from '../consts';
import { correctText, pathToName, robotState, logging, windowInfo } from '../utils/utils';

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

type Props = StateProps & OwnProps;

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
    changeFontSize,
    decreaseFontsize,
    increaseFontsize,
    handleChangeFontsize,
    handleOnBlurFontSize,
    handleOnKeyDownFontSize
  } = useFontResizer();

  const { isKeyboardModeToggled, toggleKeyboardControl } = useKeyboardMode({
    onUpdateKeyboardBitmap: props.onUpdateKeyboardBitmap,
    onUpdateKeyboardModeToggle: props.onUpdateKeyboardModeToggle
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
        props.onChangeTheme(data.theme ?? 'github');
      }
    });

    function beforeUnload(event: any) {
      // If there are unsaved changes and the user tries to close Dawn,
      // check if they want to save their changes first.
      if (hasUnsavedChanges()) {
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
              props.onSaveFile();
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
      props.onDragFile(e.dataTransfer?.files?.[0].path ?? '');
      return false;
    });

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  const checkLatency = () => {
    props.onInitiateLatencyCheck();
  };

  const insertRobotStaffCode = () => {
    props.onEditorUpdate(ROBOT_STAFF_CODE);
  };

  const getEditorHeight = () => {
    const windowNonEditorHeight = windowInfo.NONEDITOR + +!!isConsoleOpen * (consoleHeight + windowInfo.CONSOLEPAD);
    return `${String(window.innerHeight - windowNonEditorHeight)}px`;
  };

  const onWindowResize = () => {
    // Trigger editor to re-render on window resizing.
    setEditorHeight(getEditorHeight());
  };

  const upload = () => {
    const { filepath } = props;
    if (filepath === '') {
      props.onAlertAdd('Not Working on a File', 'Please save first');
      logging.log('Upload: Not Working on File');
      return;
    }
    if (hasUnsavedChanges()) {
      props.onAlertAdd('Unsaved File', 'Please save first');
      logging.log('Upload: Not Working on Saved File');
      return;
    }
    if (correctText(props.editorCode) !== props.editorCode) {
      props.onAlertAdd(
        'Invalid characters detected',
        "Your code has non-ASCII characters, which won't work on the robot. " + 'Please remove them and try again.'
      );
      logging.log('Upload: Non-ASCII Issue');
      return;
    }

    props.onUploadCode();
  };

  const startRobot = () => {
    setIsRunning(true);
    props.onUpdateCodeStatus(mode);
  };

  const stopRobot = () => {
    setIsRunning(false);
    setModeDisplay(mode === robotState.AUTONOMOUS ? robotState.AUTOSTR : robotState.TELEOPSTR);
    props.onUpdateCodeStatus(robotState.IDLE);
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

  console.log('font', onChangeFontSize ?? submittedFontSize);

  return (
    <Card bg={props.globalTheme === 'dark' ? 'dark' : 'light'} text={props.globalTheme === 'dark' ? 'light' : 'dark'}>
      <Card.Header>
        <Card.Title style={{ fontSize: '14px' }}>
          Editing: {pathToName(props.filepath) ? pathToName(props.filepath) : '[ New File ]'} {changeMarker}
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Form inline>
          <ButtonGroup id="file-operations-buttons">
            <DropdownButton variant={props.globalTheme === 'dark' ? 'outline-info' : 'primary'} title="File" size="sm" id="choose-theme">
              <Dropdown.Item onClick={props.onCreateNewFile}>New File</Dropdown.Item>
              <Dropdown.Item onClick={props.onOpenFile}>Open</Dropdown.Item>
              <Dropdown.Item onClick={_.partial(props.onSaveFile, false)}>Save</Dropdown.Item>
              <Dropdown.Item onClick={_.partial(props.onSaveFile, true)}>Save As</Dropdown.Item>
            </DropdownButton>
            <TooltipButton id="upload" text="Upload" onClick={upload} icon="arrow-circle-up" disabled={false} />
            <TooltipButton
              id="download"
              text="Download from Robot"
              onClick={props.onDownloadCode}
              icon="arrow-circle-down"
              disabled={!props.runtimeStatus}
            />
          </ButtonGroup>
          <ButtonGroup id="code-execution-buttons">
            <TooltipButton
              id="run"
              text="Run"
              onClick={startRobot}
              icon="play"
              disabled={isRunning || !props.runtimeStatus || props.fieldControlActivity}
            />
            <TooltipButton id="stop" text="Stop" onClick={stopRobot} icon="stop" disabled={!(isRunning)} />
            <DropdownButton
              variant={props.globalTheme === 'dark' ? 'outline-info' : 'primary'}
              title={modeDisplay}
              size="sm"
              key="dropdown"
              id="modeDropdown"
              disabled={false}
            >
              <Dropdown.Item
                eventKey="1"
                active={mode === robotState.AUTONOMOUS}
                onClick={() => {
                  setMode(robotState.AUTONOMOUS);
                  setModeDisplay(robotState.AUTOSTR);
                }}
              >
                Autonomous
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                active={mode === robotState.TELEOP}
                onClick={() => {
                  setMode(robotState.TELEOP);
                  setModeDisplay(robotState.TELEOPSTR);
                }}
              >
                Tele-Operated
              </Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
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
          <FormGroup>
            <InputGroup>
              <FormControl
                value={String(onChangeFontSize ?? submittedFontSize).replace(/^0/, '')}
                size="sm"
                onBlur={handleOnBlurFontSize}
                onChange={handleChangeFontsize}
                onKeyDown={handleOnKeyDownFontSize}
                style={{ width: 32, padding: 6 }}
              />
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Text Size</Tooltip>}>
                <DropdownButton as={ButtonGroup} title="" variant="small" id="choose-font-size">
                  {FONT_SIZES.map((fontSize: number) => (
                    <Dropdown.Item key={`font-size-${fontSize}`} className="dropdown-item" onClick={() => changeFontSize(fontSize)}>
                      {fontSize}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </OverlayTrigger>
            </InputGroup>
            <TooltipButton
              id="toggleKeyboardControl"
              text="Toggle Keyboard Control Mode"
              onClick={toggleKeyboardControl}
              icon="keyboard"
              disabled={false}
              bsStyle={isKeyboardModeToggled ? 'info' : 'default'}
            />
          </FormGroup>
          <ButtonGroup id="editor-settings-buttons" className="form-inline">
            <TooltipButton
              id="increase-font-size"
              text="Increase font size"
              onClick={increaseFontsize}
              icon="search-plus"
              disabled={submittedFontSize >= MAX_FONT_SIZE}
            />
            <TooltipButton
              id="decrease-font-size"
              text="Decrease font size"
              onClick={decreaseFontsize}
              icon="search-minus"
              disabled={submittedFontSize <= MIN_FONT_SIZE}
            />
            <DropdownButton variant={props.globalTheme === 'dark' ? 'outline-info' : 'primary'} title="Theme" size="sm" id="choose-theme">
              {themes.map((theme: string) => (
                <Dropdown.Item active={theme === props.editorTheme} onClick={_.partial(changeTheme, theme)} key={theme}>
                  {theme}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </ButtonGroup>
          <FormGroup>
            <TooltipButton id="checkLatency" text="Initiate Latency Check" onClick={checkLatency} icon="paper-plane" disabled={false} />
          </FormGroup>
          <FormGroup>
            <TooltipButton
              id="staffCodeButton"
              text="Import Staff Code"
              onClick={() => {
                if (props.editorCode !== props.latestSaveCode) {
                  const shouldOverwrite = window.confirm(
                    'You currently have unsaved changes. Do you really want to overwrite your code with Staff Code?'
                  );

                  if (shouldOverwrite) {
                    insertRobotStaffCode();
                  }
                } else {
                  insertRobotStaffCode();
                }
              }}
              icon="star"
              disabled={false}
            />
          </FormGroup>
        </Form>
        <AceEditor
          mode="python"
          theme={props.editorTheme}
          width="100%"
          fontSize={submittedFontSize}
          ref={(input: AceEditor) => {
            CodeEditor = input;
          }}
          name="CodeEditor"
          height={editorHeight.toString()}
          value={props.editorCode}
          onChange={props.onEditorUpdate}
          editorProps={{ $blockScrolling: Infinity }}
          readOnly={isKeyboardModeToggled}
        />
        <ConsoleOutput
          toggleConsole={toggleConsole}
          show={isConsoleOpen}
          height={consoleHeight}
          output={consoleData}
          disableScroll={props.disableScroll}
        />
      </Card.Body>
    </Card>
  );
};
