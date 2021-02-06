/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState } from 'react';
import {
  Panel,
  ButtonGroup,
  DropdownButton,
  MenuItem,
  FormGroup,
  FormControl,
  Form,
  InputGroup,
  OverlayTrigger,
  Tab,
  Tabs,
  Tooltip
} from 'react-bootstrap';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { remote } from 'electron';
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

import { useFontResizer } from './useFontResizer';
import { ConsoleOutput } from '../ConsoleOutput';
import { TooltipButton } from '../TooltipButton';
import { pathToName, robotState, timings, logging, windowInfo } from '../../utils/utils';

const { dialog } = remote;
const currentWindow = remote.getCurrentWindow();

const FONT_SIZES = [8, 12, 14, 16, 20, 24, 28];

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
}

interface DispatchProps {
  onAlertAdd: (heading: string, message: string) => void;
  onEditorUpdate: (newVal: string) => void;
  onSaveFile: (saveAs?: boolean) => void;
  onDragFile: (filepath: string) => void;
  onOpenFile: () => void;
  onCreateNewFile: () => void;
  onChangeTheme: (theme: string) => void;
  toggleConsole: () => void;
  onClearConsole: () => void;
  onUpdateCodeStatus: (status: number) => void;
  onDownloadCode: () => void;
  onUploadCode: () => void;
}

type Props = StateProps & DispatchProps;

const EDITOR_THEMES = [
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

export const Editor = (props: Props) => {
  let CodeEditor: AceEditor;

  const [consoleHeight, setConsoleHeight] = useState(windowInfo.CONSOLESTART);
  const [editorHeight, setEditorHeight] = useState('0px');
  const [mode, setMode] = useState(robotState.TELEOP);
  const [modeDisplay, setModeDisplay] = useState(robotState.TELEOPSTR);
  const [isRunning, setIsRunning] = useState(false);
  const [simulate, setSimulate] = useState(false);

  const { fontSize, decreaseFontsize, increaseFontsize, handleChangeFontsize, changeFontSize, handleSubmitFontsize } = useFontResizer();

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
  };

  // TODO: Take onEditorPaste items and move to utils?
  const correctText = (text: string) => {
    return text.replace(/[^\x00-\x7F]/g, ''); // eslint-disable-line no-control-regex
  };

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
          { value: 'set()', score: 1000, meta: 'Python3' }
        ]);
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

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    onWindowResize();
  }, [consoleHeight])

  const onWindowResize = () => {
    // Trigger editor to re-render on window resizing.
    setEditorHeight(getEditorHeight());
  };

  const getEditorHeight = () => {
    const windowNonEditorHeight = windowInfo.NONEDITOR + +!!props.showConsole * (consoleHeight + windowInfo.CONSOLEPAD);
    return `${String(window.innerHeight - windowNonEditorHeight)}px`;
  };

  const beforeUnload = (event: any) => {
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
  };

  const toggleConsole = () => {
    props.toggleConsole();
    // Resize since the console overlaps with the editor, but enough time for console changes
    setTimeout(() => onWindowResize(), 0.01);
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
    // props.onClearConsole();
  };

  const stopRobot = () => {
    setSimulate(false);
    setIsRunning(false);
    setModeDisplay(mode === robotState.AUTONOMOUS ? robotState.AUTOSTR : robotState.TELEOPSTR);
    props.onUpdateCodeStatus(robotState.IDLE);
  };

  const simulateCompetition = () => {
    setSimulate(true);
    setModeDisplay(robotState.SIMSTR);
    const simulation = new Promise<void>((resolve, reject) => {
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

    simulation
      .then(
        () =>
          new Promise<void>((resolve, reject) => {
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
                setModeDisplay(`Cooldown: ${timings.IDLE - diff}`)
              }
            }, timings.SEC);
          })
      )
      .then(() => {
        new Promise<void>((resolve, reject) => {
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
        }).then(
          () => {
            logging.log('Simulation Finished');
            props.onUpdateCodeStatus(robotState.IDLE);
          },
          () => {
            logging.log('Simulation Aborted');
            props.onUpdateCodeStatus(robotState.IDLE);
          }
        );
      });
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

  const changeMarker = hasUnsavedChanges() ? '*' : '';
  if (props.consoleUnread) {
    toggleConsole();
  }

  const commonAceEditorProps = {
    mode: 'python',
    theme: props.editorTheme,
    width: '100%',
    fontSize: fontSize,
    height: editorHeight.toString(),
    onChange: props.onEditorUpdate,
    onPaste: onEditorPaste,
    editorProps: { $blockScrolling: Infinity }
  };

  return (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title style={{ fontSize: '14px' }}>
          Editing: {pathToName(props.filepath) ? pathToName(props.filepath) : '[ New File ]'} {changeMarker}
        </Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        <Form inline onSubmit={handleSubmitFontsize}>
          <ButtonGroup id="file-operations-buttons">
            <DropdownButton title="File" bsSize="small" id="choose-theme">
              <MenuItem onClick={props.onCreateNewFile}>New File</MenuItem>
              <MenuItem onClick={props.onOpenFile}>Open</MenuItem>
              <MenuItem onClick={_.partial(props.onSaveFile, false)}>Save</MenuItem>
              <MenuItem onClick={_.partial(props.onSaveFile, true)}>Save As</MenuItem>
            </DropdownButton>
            <TooltipButton id="upload" text="Upload" onClick={upload} glyph="upload" disabled={false} />
            <TooltipButton
              id="download"
              text="Download from Robot"
              onClick={props.onDownloadCode}
              glyph="download"
              disabled={!props.runtimeStatus}
            />
          </ButtonGroup>{' '}
          <ButtonGroup id="code-execution-buttons">
            <TooltipButton
              id="run"
              text="Run"
              onClick={startRobot}
              glyph="play"
              disabled={isRunning || !props.runtimeStatus || props.fieldControlActivity}
            />
            <TooltipButton id="stop" text="Stop" onClick={stopRobot} glyph="stop" disabled={!(isRunning || simulate)} />
            <DropdownButton
              title={modeDisplay}
              bsSize="small"
              key="dropdown"
              id="modeDropdown"
              disabled={isRunning || simulate || props.fieldControlActivity || !props.runtimeStatus}
            >
              <MenuItem
                eventKey="1"
                active={mode === robotState.TELEOP && !simulate}
                onClick={() => {
                  setMode(robotState.TELEOP);
                  setModeDisplay(robotState.TELEOPSTR);
                }}
              >
                Tele-Operated
              </MenuItem>
              <MenuItem
                eventKey="2"
                active={mode === robotState.AUTONOMOUS && !simulate}
                onClick={() => {
                  setMode(robotState.AUTONOMOUS);
                  setModeDisplay(robotState.AUTOSTR);
                }}
              >
                Autonomous
              </MenuItem>
              <MenuItem eventKey="3" active={simulate} onClick={simulateCompetition}>
                Simulate Competition
              </MenuItem>
            </DropdownButton>
          </ButtonGroup>{' '}
          <ButtonGroup id="console-buttons">
            <TooltipButton
              id="toggle-console"
              text="Toggle Console"
              onClick={toggleConsole}
              glyph="console"
              disabled={false}
              bsStyle={props.consoleUnread ? 'danger' : ''}
            />
            <TooltipButton id="clear-console" text="Clear Console" onClick={props.onClearConsole} glyph="remove" disabled={false} />
            <TooltipButton
              id="raise-console"
              text="Raise Console"
              onClick={raiseConsole}
              glyph="arrow-up"
              disabled={consoleHeight > windowInfo.CONSOLEMAX}
            />
            <TooltipButton
              id="lower-console"
              text="Lower Console"
              onClick={lowerConsole}
              glyph="arrow-down"
              disabled={consoleHeight < windowInfo.CONSOLEMIN}
            />
            <TooltipButton id="copy-console" text="Copy Console" onClick={copyConsole} glyph="copy" disabled={false} />
          </ButtonGroup>{' '}
          <FormGroup>
            <InputGroup>
              <FormControl
                type="number"
                value={fontSize}
                bsSize="small"
                onChange={handleChangeFontsize}
                style={{ width: 32, padding: 6 }}
              />
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Text Size</Tooltip>}>
                <DropdownButton componentClass={InputGroup.Button} title="" bsSize="small" id="choose-font-size">
                  {FONT_SIZES.map((fontSize: number) => (
                    <MenuItem key={`font-size-${fontSize}`} className="dropdown-item" onClick={() => changeFontSize(fontSize)}>
                      {fontSize}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </OverlayTrigger>
            </InputGroup>
          </FormGroup>{' '}
          <ButtonGroup id="editor-settings-buttons" className="form-inline">
            <TooltipButton
              id="increase-font-size"
              text="Increase font size"
              onClick={increaseFontsize}
              glyph="zoom-in"
              disabled={props.fontSize >= 28}
            />
            <TooltipButton
              id="decrease-font-size"
              text="Decrease font size"
              onClick={decreaseFontsize}
              glyph="zoom-out"
              disabled={props.fontSize <= 8}
            />
            <DropdownButton title="Theme" bsSize="small" id="choose-theme">
              {EDITOR_THEMES.map((theme: string) => (
                <MenuItem active={theme === props.editorTheme} onClick={_.partial(changeTheme, theme)} key={theme}>
                  {theme}
                </MenuItem>
              ))}
            </DropdownButton>
          </ButtonGroup>
        </Form>

        <Tabs id="editor-tabs">
          <Tab eventKey={1} title="student_code.py">
            <AceEditor
              {...commonAceEditorProps}
              name="StudentCodeEditor"
              value={props.editorCode}
              ref={(input: AceEditor) => {
                CodeEditor = input;
              }}
            />
          </Tab>
          <Tab eventKey={2} title="code_challenges.py">
            <AceEditor
              {...commonAceEditorProps}
              name="StudentCodeEditor"
              value={props.editorCode}
              ref={(input: AceEditor) => {
                CodeEditor = input;
              }}
            />
          </Tab>
        </Tabs>

        <ConsoleOutput
          toggleConsole={toggleConsole}
          show={props.showConsole}
          height={consoleHeight}
          output={props.consoleData}
          disableScroll={props.disableScroll}
        />
      </Panel.Body>
    </Panel>
  );
};
