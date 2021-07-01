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
  Dropdown,
} from 'react-bootstrap';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds'
import { remote, clipboard } from 'electron';
import storage from 'electron-json-storage';
import _ from 'lodash';

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
import { keyboardButtons, ROBOT_STAFF_CODE } from '../consts';
import { pathToName, robotState, timings, logging, windowInfo } from '../utils/utils';

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

export function Editor(props: Props) {
  const [consoleHeight, setConsoleHeight] = useState(windowInfo.CONSOLESTART);
  const [editorHeight, setEditorHeight] = useState('0px');
  const [fontSize, setFontSize] = useState(16);
  const [mode, setMode] = useState(robotState.TELEOP);
  const [modeDisplay, setModeDisplay] = useState(robotState.TELEOPSTR);
  const [isRunning, setIsRunning] = useState(false);
  const [simulate, setSimulate] = useState(false);
  const [isKeyboardModeToggled, setIsKeyboardModeToggled] = useState(false);
  const [keyboardBitmap, setKeyboardBitmap] = useState(0);
  
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
    'terminal',
  ];

  /*
   * ASCII Enforcement
   */
  const onEditorPaste = (correctedText: string) => {
    correctedText = correctedText.normalize('NFD');
    correctedText = correctedText.replace(/[”“]/g, '"');
    correctedText = correctedText.replace(/[‘’]/g, "'");
    correctText(correctedText);
    // TODO: Create some notification that an attempt was made at correcting non-ASCII chars.
    //pasteData.text = correctedText; // eslint-disable-line no-param-reassign
  }

  // TODO: Take onEditorPaste items and move to utils?
  const correctText = (text: string): string => {
    return text.replace(/[^\x00-\x7F]/g, ''); // eslint-disable-line no-control-regex
  }

  /*
   * Confirmation Dialog on Quit, Stored Editor Settings, Window Size-Editor Re-render
   */
  useEffect(() => {
    CodeEditor.editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    });
    const autoComplete = {
      getCompletions(_editor: Ace.Editor, _session: Ace.EditSession, _pos: Ace.Point, _prefix: string, callback: Ace.CompleterCallback) {
        callback(null, [
          { value: 'Robot', score: 1000, meta: 'PiE API' },
          { value: 'get_value', score: 900, meta: 'PiE API' },
          { value: 'set_value', score: 900, meta: 'PiE API' },
          { value: 'run', score: 900, meta: 'PiE API' },
          { value: 'is_running', score: 900, meta: 'PiE API' },
          { value: 'Gamepad', score: 1000, meta: 'PiE API' },
          { value: 'Actions', score: 1000, meta: 'PiE API' },
          { value: 'sleep', score: 900, meta: 'PiE API' },
          { value: '"button_a"', score: 900, meta: 'PiE API' },
          { value: '"button_b"', score: 900, meta: 'PiE API' },
          { value: '"button_x"', score: 900, meta: 'PiE API' },
          { value: '"button_y"', score: 900, meta: 'PiE API' },
          { value: '"l_bumper"', score: 900, meta: 'PiE API' },
          { value: '"r_bumper"', score: 900, meta: 'PiE API' },
          { value: '"l_trigger"', score: 900, meta: 'PiE API' },
          { value: '"r_trigger"', score: 900, meta: 'PiE API' },
          { value: '"button_back"', score: 900, meta: 'PiE API' },
          { value: '"button_start"', score: 900, meta: 'PiE API' },
          { value: '"l_stick"', score: 900, meta: 'PiE API' },
          { value: '"r_stick"', score: 900, meta: 'PiE API' },
          { value: '"dpad_up"', score: 900, meta: 'PiE API' },
          { value: '"dpad_down"', score: 900, meta: 'PiE API' },
          { value: '"dpad_left"', score: 900, meta: 'PiE API' },
          { value: '"dpad_right"', score: 900, meta: 'PiE API' },
          { value: '"button_xbox"', score: 900, meta: 'PiE API' },
          { value: 'def', score: 1000, meta: 'Python3' },
          { value: 'await', score: 1000, meta: 'Python3' },
          { value: 'print', score: 1000, meta: 'Python3' },
          { value: 'max', score: 1000, meta: 'Python3' },
          { value: 'min', score: 1000, meta: 'Python3' },
          { value: 'async', score: 1000, meta: 'Python3' },
          { value: 'lambda', score: 1000, meta: 'Python3' },
          { value: 'for', score: 1000, meta: 'Python3' },
          { value: 'while', score: 1000, meta: 'Python3' },
          { value: 'True', score: 1000, meta: 'Python3' },
          { value: 'False', score: 1000, meta: 'Python3' },
          { value: 'abs', score: 1000, meta: 'Python3' },
          { value: 'len', score: 1000, meta: 'Python3' },
          { value: 'round', score: 1000, meta: 'Python3' },
          { value: 'set()', score: 1000, meta: 'Python3' },
        ]);
      },
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storage.get('editorFontSize', (err: any, data: { editorFontSize?: number }) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        props.onChangeFontsize(data.editorFontSize ?? 14);
        // this.setState({ fontsize: this.props.fontSize });
        setFontSize(props.fontSize);
      }
    });

    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('dragover', (e: any) => {
      e.preventDefault();
      return false;
    });

    window.addEventListener('drop', (e: any) => {
      e.preventDefault();
      props.onDragFile(e.dataTransfer.files[0].path);
      return false;
    });

    function beforeUnload(event: any) {
      // If there are unsaved changes and the user tries to close Dawn,
      // check if they want to save their changes first.
      if (hasUnsavedChanges()) {
        dialog.showMessageBox(currentWindow, {
          type: 'warning',
          buttons: ['Save...', 'Don\'t Save', 'Cancel'],
          defaultId: 0,
          cancelId: 2,
          title: 'You have unsaved changes!',
          message: 'Do you want to save the changes made to your program?',
          detail: 'Your changes will be lost if you don\'t save them.',
        })      
        // NOTE: For whatever reason, `event.preventDefault()` does not work within
        // beforeunload events, so we use `event.returnValue = false` instead.
        .then(clickedId => {
          if (clickedId.response === 0) {
            // FIXME: Figure out a way to make Save and Close, well, close.
            event.returnValue = false;
            props.onSaveFile();
          } else if (clickedId.response === 2) {
            event.returnValue = false;
          }
        })
      }
    }
    return function cleanup() {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('resize', onWindowResize);
    }
  });

  const bitShiftLeft = (value: number, numPositions: number) => {
    return value * Math.pow(2, numPositions);
  }

  const toggleConsole = () => {
    props.toggleConsole();
    // Resize since the console overlaps with the editor, but enough time for console changes
    setTimeout(() => onWindowResize(), 0.01);
  };

  const checkLatency = () => {
    props.onInitiateLatencyCheck();
  };

  const insertRobotStaffCode = () => {
    props.onEditorUpdate(ROBOT_STAFF_CODE);
  };

  // toggle keyboard control and add/remove listening for key presses to control robot
  const toggleKeyboardControl = () => {
    setIsKeyboardModeToggled(!isKeyboardModeToggled);
    props.onUpdateKeyboardModeToggle(!isKeyboardModeToggled);

    if (!isKeyboardModeToggled) {
      // We need passive true so that we are able to remove the event listener when we are not in Keyboard Control mode
      window.addEventListener('keydown', turnCharacterOn, { passive: true });
      window.addEventListener('keyup', turnCharacterOff, { passive: true });
    } else {
      window.removeEventListener('keydown', turnCharacterOn);
      window.removeEventListener('keyup', turnCharacterOff);
    }
  };

  const getEditorHeight = () => {
    const windowNonEditorHeight = windowInfo.NONEDITOR +
      (+!!props.showConsole * (consoleHeight + windowInfo.CONSOLEPAD));
    return `${String(window.innerHeight - windowNonEditorHeight)}px`;
  }

  const onWindowResize = () => {
    // Trigger editor to re-render on window resizing.
    setEditorHeight(getEditorHeight());
  }

  const updateKeyboardBitmap = (currentCharacter: string, isKeyPressed: boolean) => {
    const keyboardNum = keyboardButtons[currentCharacter];
    let newKeyboardBitmap: number = keyboardBitmap;

    const shift = bitShiftLeft(1, keyboardNum);
    const MAX_INT32_BITS = 2147483648; // 2^31

    const shiftHighBits = shift / MAX_INT32_BITS;
    const shiftLowBits = shift % MAX_INT32_BITS;
    const mapHighBits = newKeyboardBitmap / MAX_INT32_BITS;
    const mapLowBits = newKeyboardBitmap % MAX_INT32_BITS;

    if (!isKeyPressed) {
      newKeyboardBitmap = (~shiftHighBits & mapHighBits) * MAX_INT32_BITS + (~shiftLowBits & mapLowBits);
    } else if (isKeyPressed) {
      newKeyboardBitmap = (shiftHighBits | mapHighBits) * MAX_INT32_BITS + (shiftLowBits | mapLowBits);
    }

    setKeyboardBitmap(newKeyboardBitmap);
    props.onUpdateKeyboardBitmap(keyboardBitmap);
  };

  const turnCharacterOff = (e: KeyboardEvent) => {
    // NOT THE ACTION updateKeyboardBitmap. THIS IS A LOCAL FUNCTION
    updateKeyboardBitmap(e.key, false);
  }
  const turnCharacterOn = (e: KeyboardEvent) => {
    updateKeyboardBitmap(e.key, true)
  }

  const upload = () => {
    const { filepath } = props;
    if (filepath === '') {
      props.onAlertAdd(
        'Not Working on a File',
        'Please save first',
      );
      logging.log('Upload: Not Working on File');
      return;
    }
    if (hasUnsavedChanges()) {
      props.onAlertAdd(
        'Unsaved File',
        'Please save first',
      );
      logging.log('Upload: Not Working on Saved File');
      return;
    }
    if (correctText(props.editorCode) !== props.editorCode) {
      props.onAlertAdd(
        'Invalid characters detected',
        'Your code has non-ASCII characters, which won\'t work on the robot. ' +
        'Please remove them and try again.',
      );
      logging.log('Upload: Non-ASCII Issue');
      return;
    }

    props.onUploadCode();
  }

  const startRobot = () => {
    setIsRunning(true);
    props.onUpdateCodeStatus(mode);
    // this.props.onClearConsole();
  }

  const stopRobot = () => {
    setSimulate(false);
    setIsRunning(false);
    setModeDisplay(mode === robotState.AUTONOMOUS ? robotState.AUTOSTR : robotState.TELEOPSTR);
    props.onUpdateCodeStatus(robotState.IDLE);
  }

  const simulateCompetition = () => {
    setSimulate(true);
    setModeDisplay(robotState.SIMSTR);
    const simulation = new Promise((resolve, reject) => {
      logging.log(`Beginning ${timings.AUTO}s ${robotState.AUTOSTR}`);
      props.onUpdateCodeStatus(robotState.AUTONOMOUS);
      const timestamp = Date.now();
      const autoInt = setInterval(() => {
        const diff = Math.trunc((Date.now() - timestamp) / timings.SEC);
        if (diff > timings.AUTO) {
          clearInterval(autoInt);
          resolve();
        } else if (!simulate) {
          logging.log(`${robotState.AUTOSTR} Quit`);
          clearInterval(autoInt);
          reject();
        } else {
          setModeDisplay(`${robotState.AUTOSTR}: ${timings.AUTO - diff}`);
        }
      }, timings.SEC);
    });

    simulation.then(() =>
      new Promise((resolve, reject) => {
        logging.log(`Beginning ${timings.IDLE}s Cooldown`);
        props.onUpdateCodeStatus(robotState.IDLE);
        const timestamp = Date.now();
        const coolInt = setInterval(() => {
          const diff = Math.trunc((Date.now() - timestamp) / timings.SEC);
          if (diff > timings.IDLE) {
            clearInterval(coolInt);
            resolve();
          } else if (!simulate) {
            clearInterval(coolInt);
            logging.log('Cooldown Quit');
            reject();
          } else {
            setModeDisplay(`Cooldown: ${timings.IDLE - diff}`);
          }
        }, timings.SEC);
      })).then(() => {
      new Promise((resolve, reject) => {
        logging.log(`Beginning ${timings.TELEOP}s ${robotState.TELEOPSTR}`);
        props.onUpdateCodeStatus(robotState.TELEOP);
        const timestamp = Date.now();
        const teleInt = setInterval(() => {
          const diff = Math.trunc((Date.now() - timestamp) / timings.SEC);
          if (diff > timings.TELEOP) {
            clearInterval(teleInt);
            resolve();
          } else if (!simulate) {
            clearInterval(teleInt);
            logging.log(`${robotState.TELEOPSTR} Quit`);
            reject();
          } else {
            setModeDisplay(`${robotState.TELEOPSTR}: ${timings.TELEOP - diff}`);
          }
        }, timings.SEC);
      }).then(() => {
        logging.log('Simulation Finished');
        props.onUpdateCodeStatus(robotState.IDLE);
      }, () => {
        logging.log('Simulation Aborted');
        props.onUpdateCodeStatus(robotState.IDLE);
      });
    });
  }

  const hasUnsavedChanges = () => {
    return (props.latestSaveCode !== props.editorCode);
  }

  const changeTheme = (theme: string) => {
    props.onChangeTheme(theme);
    storage.set('editorTheme', { theme }, (err: any) => {
      if (err) logging.log(err);
    });
  }

  const increaseFontsize = () => {
    setFontSize(props.fontSize + 1);
    props.onChangeFontsize(props.fontSize + 1);
    storage.set('editorFontSize', { editorFontSize: props.fontSize + 1 }, (err: any) => {
      if (err) logging.log(err);
    });
  }

  const handleChangeFontsize = (event: any) => {
    setFontSize(event.target.value);
  }

  const handleSubmitFontsize = (event: any) => {
    changeFontsizeToFont(Number(fontSize));
    event.preventDefault();
  }

  const changeFontsizeToFont = (fontSize: number) => {
    if (fontSize > 28) {
      fontSize = 28;
    }
    if (fontSize < 8) {
      fontSize = 8;
    }
    props.onChangeFontsize(fontSize);
    setFontSize(fontSize);
    storage.set('editorFontSize', { editorFontSize: fontSize }, (err: any) => {
      if (err) logging.log(err);
    });
  }

  const raiseConsole = () => {
    setConsoleHeight(consoleHeight + windowInfo.UNIT);
  }

  const lowerConsole = () => {
    setConsoleHeight(consoleHeight - windowInfo.UNIT);
  }

  useEffect(() => {
    onWindowResize();
  }, [consoleHeight]);
  
  const copyConsole = () => {
    clipboard.writeText(props.consoleData.join(''));
  }

  const decreaseFontsize = () => {
    setFontSize(props.fontSize - 1);
    props.onChangeFontsize(props.fontSize - 1);
    storage.set('editorFontSize', { editorFontSize: props.fontSize - 1 }, (err: any) => {
      if (err) logging.log(err);
    });
  }

  const changeMarker = hasUnsavedChanges() ? '*' : '';
  if (props.consoleUnread) {
    toggleConsole();
  }
  
  return (
    <Card 
      bg={props.globalTheme === 'dark' ? 'dark' : 'light'} 
      text={props.globalTheme === 'dark' ? 'light' : 'dark'} >
      <Card.Header>
        <Card.Title style={{ fontSize: '14px' }}>Editing: {pathToName(props.filepath) ? pathToName(props.filepath) : '[ New File ]' } {changeMarker}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form inline onSubmit={handleSubmitFontsize}>
          <ButtonGroup id="file-operations-buttons">
            <DropdownButton
              variant={props.globalTheme === 'dark' ? 'outline-info' : 'primary'}
              title="File"
              size="sm"
              id="choose-theme"
            >
              <Dropdown.Item
                onClick={props.onCreateNewFile}
              >New File</Dropdown.Item>
              <Dropdown.Item
                onClick={props.onOpenFile}
              >Open</Dropdown.Item>
              <Dropdown.Item
                onClick={_.partial(props.onSaveFile,false)}
              >Save</Dropdown.Item>
              <Dropdown.Item
                onClick={_.partial(props.onSaveFile, true)}
              >Save As</Dropdown.Item>
            </DropdownButton>
            <TooltipButton
              id="upload"
              text="Upload"
              onClick={upload}
              icon="arrow-circle-up"
              disabled={false}
            />
            <TooltipButton
              id="download"
              text="Download from Robot"
              onClick={props.onDownloadCode}
              icon="arrow-circle-down"
              disabled={!props.runtimeStatus}
            />
          </ButtonGroup>
          {' '}
          <ButtonGroup id="code-execution-buttons">
            <TooltipButton
              id="run"
              text="Run"
              onClick={startRobot}
              icon="play"
              disabled={isRunning
              || !props.runtimeStatus
              || props.fieldControlActivity}
            />
            <TooltipButton
              id="stop"
              text="Stop"
              onClick={stopRobot}
              icon="stop"
              disabled={!(isRunning || simulate)}
            />
            <DropdownButton
              variant={props.globalTheme === 'dark' ? 'outline-info' : 'primary'}
              title={modeDisplay}
              size="sm"
              key="dropdown"
              id="modeDropdown"
              disabled={isRunning || simulate
              || props.fieldControlActivity
              || !props.runtimeStatus}
            >
              <Dropdown.Item
                eventKey="1"
                active={mode === robotState.AUTONOMOUS && !simulate}
                onClick={() => {
                  setMode(robotState.AUTONOMOUS);
                  setModeDisplay(robotState.AUTOSTR);
                }}
              >Autonomous</Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                active={mode === robotState.TELEOP && !simulate}
                onClick={() => {
                  setMode(robotState.TELEOP);
                  setModeDisplay(robotState.TELEOPSTR);
                }}
              >Tele-Operated</Dropdown.Item>
              <Dropdown.Item
                eventKey="3"
                active={simulate}
                onClick={simulateCompetition}
              >Simulate Competition</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
          {' '}
          <ButtonGroup id="console-buttons">
            <TooltipButton
              id="toggle-console"
              text="Toggle Console"
              onClick={toggleConsole}
              icon="terminal"
              disabled={false}
              bsStyle={props.consoleUnread ? 'danger' : ''}
            />
            <TooltipButton
              id="clear-console"
              text="Clear Console"
              onClick={props.onClearConsole}
              icon="times"
              disabled={false}
            />
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
            <TooltipButton
              id="copy-console"
              text="Copy Console"
              onClick={copyConsole}
              icon="clipboard"
              disabled={false}
            />
          </ButtonGroup>
          {' '}
          <FormGroup>
            <InputGroup>
              <FormControl
                type="number"
                value={fontSize ?? '16'}
                size="sm"
                onChange={handleChangeFontsize}
                style={{ width: 32, padding: 6 }}
              />
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Text Size</Tooltip>}>
                <DropdownButton
                  as={ButtonGroup}
                  title=""
                  variant="small"
                  id="choose-font-size"
                >
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => changeFontsizeToFont(8)}
                  >8</Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => changeFontsizeToFont(12)}
                  >12</Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => changeFontsizeToFont(14)}
                  >14</Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => changeFontsizeToFont(16)}
                  >16</Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => changeFontsizeToFont(20)}
                  >20</Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => changeFontsizeToFont(24)}
                  >24</Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => changeFontsizeToFont(28)}
                  >28</Dropdown.Item>
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
          </FormGroup>{' '}
          <ButtonGroup id="editor-settings-buttons" className="form-inline">
            <TooltipButton
              id="increase-font-size"
              text="Increase font size"
              onClick={increaseFontsize}
              icon="search-plus"
              disabled={props.fontSize >= 28}
            />
            <TooltipButton
              id="decrease-font-size"
              text="Decrease font size"
              onClick={decreaseFontsize}
              icon="search-minus"
              disabled={props.fontSize <= 8}
            />
            <DropdownButton
              variant={props.globalTheme === 'dark' ? 'outline-info' : 'primary'}
              title="Theme"
              size="sm"
              id="choose-theme"
            >
              {themes.map((theme: string) => (
                <Dropdown.Item
                  active={theme === props.editorTheme}
                  onClick={_.partial(changeTheme, theme)}
                  key={theme}
                >
                  {theme}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </ButtonGroup>
          <FormGroup>
            <TooltipButton
              id="checkLatency"
              text="Initiate Latency Check"
              onClick={checkLatency}
              icon="paper-plane"
              disabled={false}
            />
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
          fontSize={props.fontSize}
          ref={(input: AceEditor) => { CodeEditor = input; }}
          name="CodeEditor"
          height={editorHeight.toString()}
          value={props.editorCode}
          onChange={props.onEditorUpdate}
          onPaste={onEditorPaste}
          editorProps={{ $blockScrolling: Infinity }}
          readOnly={isKeyboardModeToggled}
        />
        <ConsoleOutput
          toggleConsole={toggleConsole}
          show={props.showConsole}
          height={consoleHeight}
          output={props.consoleData}
          // disableScroll={props.disableScroll}
        />
      </Card.Body>
    </Card>
  );
}
