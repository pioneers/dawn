import React from 'react';
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
  Tooltip,
  // Button,
} from 'react-bootstrap';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds'
import { remote, clipboard } from 'electron';
import storage from 'electron-json-storage';
import _ from 'lodash';
//import { KeyboardButtons } from '../consts';

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
  onUpdateKeyboard: (keyboard: string) => void;
  onUpdateKeyboardBool: (bool: boolean) => void;
}

type Props = StateProps & OwnProps;

interface State {
  consoleHeight: number;
  editorHeight: number | string;
  mode: number;
  modeDisplay: string;
  simulate: boolean;
  isRunning: boolean;
  fontsize?: number;
  keyboardControl: boolean;
  currentCharacter: string;
  characterBool: boolean;
};

export class Editor extends React.Component<Props, State> {
  themes: string[];
  CodeEditor: AceEditor;
  /*
   * ASCII Enforcement
   */
  static onEditorPaste(correctedText: string) {
    correctedText = correctedText.normalize('NFD');
    correctedText = correctedText.replace(/[”“]/g, '"');
    correctedText = correctedText.replace(/[‘’]/g, "'");
    Editor.correctText(correctedText);
    // TODO: Create some notification that an attempt was made at correcting non-ASCII chars.
    //pasteData.text = correctedText; // eslint-disable-line no-param-reassign
  }

  // TODO: Take onEditorPaste items and move to utils?
  static correctText(text: string) {
    return text.replace(/[^\x00-\x7F]/g, ''); // eslint-disable-line no-control-regex
  }

  constructor(props: Props) {
    super(props);
    this.themes = [
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
    this.state = {
      consoleHeight: windowInfo.CONSOLESTART,
      editorHeight: 0, // Filled in later during componentDidMount
      mode: robotState.TELEOP,
      modeDisplay: robotState.TELEOPSTR,
      isRunning: false,
      simulate: false,
      keyboardControl: false,
      currentCharacter: "", // need to store this in redux -> give to backend
      characterBool: true,
    };
  }

  /*
   * Confirmation Dialog on Quit, Stored Editor Settings, Window Size-Editor Re-render
   */
  componentDidMount = () => {
    this.CodeEditor.editor.setOptions({
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
    this.CodeEditor.editor.completers = [autoComplete];

    this.onWindowResize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storage.get('editorTheme', (err: any, data: { theme?: string }) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        this.props.onChangeTheme(data.theme ?? 'github');
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storage.get('editorFontSize', (err: any, data: { editorFontSize?: number }) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        this.props.onChangeFontsize(data.editorFontSize ?? 14);
        this.setState({ fontsize: this.props.fontSize });
      }
    });

    window.addEventListener('beforeunload', this.beforeUnload);
    window.addEventListener('resize', this.onWindowResize, { passive: true });
    window.addEventListener('dragover', (e: any) => {
      e.preventDefault();
      return false;
    });
    window.addEventListener('drop', (e: any) => {
      e.preventDefault();
      this.props.onDragFile(e.dataTransfer.files[0].path);
      return false;
    });
  }

  componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.beforeUnload);
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    // Trigger editor to re-render on window resizing.
    this.setState({ editorHeight: this.getEditorHeight() });
  }

  getEditorHeight = () => {
    const windowNonEditorHeight = windowInfo.NONEDITOR +
      (+!!this.props.showConsole * (this.state.consoleHeight + windowInfo.CONSOLEPAD));
    return `${String(window.innerHeight - windowNonEditorHeight)}px`;
  }

  beforeUnload = (event: any) => {
    // If there are unsaved changes and the user tries to close Dawn,
    // check if they want to save their changes first.
    if (this.hasUnsavedChanges()) {
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
          this.props.onSaveFile();
        } else if (clickedId.response === 2) {
          event.returnValue = false;
        }
      })

    }
  }

  toggleConsole = () => {
    this.props.toggleConsole();
    // Resize since the console overlaps with the editor, but enough time for console changes
    setTimeout(() => this.onWindowResize(), 0.01);
  }

  // toggle keyboard control and add/remove listening for key presses to control robot
  toggleKeyboardControl = () => {
    
    
    this.setState({keyboardControl: !this.state.keyboardControl})
    
    if (!this.state.keyboardControl) {
      window.addEventListener('keydown', this.turnCharacterOn, { passive: true});
      window.addEventListener('keyup', this.turnCharacterOff, { passive: true});
      
    } else {
      window.removeEventListener('keydown', this.turnCharacterOn);
      window.addEventListener('keyup', this.turnCharacterOff);
      this.setState({currentCharacter: ""})
    }
  }
  sendMoves = () => {
    // send this.state
    this.props.onUpdateKeyboard(this.state.currentCharacter);
    this.setState({currentCharacter: ""})
    
  }
  turnCharacterOff = (e: KeyboardEvent) => {
    e.preventDefault();
    this.setState({currentCharacter: e.key, characterBool: false});
    this.props.onUpdateKeyboardBool(this.state.characterBool);
    this.props.onUpdateKeyboard(this.state.currentCharacter);
    this.setState({currentCharacter: ""})
    
  }
  turnCharacterOn = (e: KeyboardEvent) => {
    e.preventDefault();
    this.setState({currentCharacter: e.key, characterBool: true});
    console.log("character: " + this.state.currentCharacter);
    this.props.onUpdateKeyboardBool(this.state.characterBool);
    this.props.onUpdateKeyboard(this.state.currentCharacter);
    this.setState({currentCharacter: ""})
    
  }

  upload = () => {
    const { filepath } = this.props;
    if (filepath === '') {
      this.props.onAlertAdd(
        'Not Working on a File',
        'Please save first',
      );
      logging.log('Upload: Not Working on File');
      return;
    }
    if (this.hasUnsavedChanges()) {
      this.props.onAlertAdd(
        'Unsaved File',
        'Please save first',
      );
      logging.log('Upload: Not Working on Saved File');
      return;
    }
    if (Editor.correctText(this.props.editorCode) !== this.props.editorCode) {
      this.props.onAlertAdd(
        'Invalid characters detected',
        'Your code has non-ASCII characters, which won\'t work on the robot. ' +
        'Please remove them and try again.',
      );
      logging.log('Upload: Non-ASCII Issue');
      return;
    }

    this.props.onUploadCode();
  }

  startRobot = () => {
    this.setState({ isRunning: true });
    this.props.onUpdateCodeStatus(this.state.mode);
    // this.props.onClearConsole();
  }

  stopRobot = () => {
    this.setState({
      simulate: false,
      isRunning: false,
      modeDisplay: (this.state.mode === robotState.AUTONOMOUS) ?
        robotState.AUTOSTR : robotState.TELEOPSTR,
    });
    this.props.onUpdateCodeStatus(robotState.IDLE);
  }


  simulateCompetition = () => {
    this.setState({ simulate: true, modeDisplay: robotState.SIMSTR });
    const simulation = new Promise((resolve, reject) => {
      logging.log(`Beginning ${timings.AUTO}s ${robotState.AUTOSTR}`);
      this.props.onUpdateCodeStatus(robotState.AUTONOMOUS);
      const timestamp = Date.now();
      const autoInt = setInterval(() => {
        const diff = Math.trunc((Date.now() - timestamp) / timings.SEC);
        if (diff > timings.AUTO) {
          clearInterval(autoInt);
          resolve();
        } else if (!this.state.simulate) {
          logging.log(`${robotState.AUTOSTR} Quit`);
          clearInterval(autoInt);
          reject();
        } else {
          this.setState({ modeDisplay: `${robotState.AUTOSTR}: ${timings.AUTO - diff}` });
        }
      }, timings.SEC);
    });

    simulation.then(() =>
      new Promise((resolve, reject) => {
        logging.log(`Beginning ${timings.IDLE}s Cooldown`);
        this.props.onUpdateCodeStatus(robotState.IDLE);
        const timestamp = Date.now();
        const coolInt = setInterval(() => {
          const diff = Math.trunc((Date.now() - timestamp) / timings.SEC);
          if (diff > timings.IDLE) {
            clearInterval(coolInt);
            resolve();
          } else if (!this.state.simulate) {
            clearInterval(coolInt);
            logging.log('Cooldown Quit');
            reject();
          } else {
            this.setState({ modeDisplay: `Cooldown: ${timings.IDLE - diff}` });
          }
        }, timings.SEC);
      })).then(() => {
      new Promise((resolve, reject) => {
        logging.log(`Beginning ${timings.TELEOP}s ${robotState.TELEOPSTR}`);
        this.props.onUpdateCodeStatus(robotState.TELEOP);
        const timestamp = Date.now();
        const teleInt = setInterval(() => {
          const diff = Math.trunc((Date.now() - timestamp) / timings.SEC);
          if (diff > timings.TELEOP) {
            clearInterval(teleInt);
            resolve();
          } else if (!this.state.simulate) {
            clearInterval(teleInt);
            logging.log(`${robotState.TELEOPSTR} Quit`);
            reject();
          } else {
            this.setState({ modeDisplay: `${robotState.TELEOPSTR}: ${timings.TELEOP - diff}` });
          }
        }, timings.SEC);
      }).then(() => {
        logging.log('Simulation Finished');
        this.props.onUpdateCodeStatus(robotState.IDLE);
      }, () => {
        logging.log('Simulation Aborted');
        this.props.onUpdateCodeStatus(robotState.IDLE);
      });
    });
  }

  hasUnsavedChanges = () => {
    return (this.props.latestSaveCode !== this.props.editorCode);
  }

  changeTheme = (theme: string) => {
    this.props.onChangeTheme(theme);
    storage.set('editorTheme', { theme }, (err: any) => {
      if (err) logging.log(err);
    });
  }

  increaseFontsize = () => {
    this.setState({ fontsize: this.props.fontSize + 1 });
    this.props.onChangeFontsize(this.props.fontSize + 1);
    storage.set('editorFontSize', { editorFontSize: this.props.fontSize + 1 }, (err: any) => {
      if (err) logging.log(err);
    });
  }

  handleChangeFontsize = (event: any) => {
    this.setState({ fontsize: event.target.value });
  }

  handleSubmitFontsize = (event: any) => {
    this.changeFontsizeToFont(Number(this.state.fontsize));
    event.preventDefault();
  }

  changeFontsizeToFont = (fontSize: number) => {
    if (fontSize > 28) {
      fontSize = 28;
    }
    if (fontSize < 8) {
      fontSize = 8;
    }
    this.props.onChangeFontsize(fontSize);
    this.setState({ fontsize: fontSize });
    storage.set('editorFontSize', { editorFontSize: fontSize }, (err: any) => {
      if (err) logging.log(err);
    });
  }

  raiseConsole = () => {
    this.setState({ consoleHeight: this.state.consoleHeight + windowInfo.UNIT }, () => {
      this.onWindowResize();
    });
  }

  lowerConsole = () => {
    this.setState({ consoleHeight: this.state.consoleHeight - windowInfo.UNIT }, () => {
      this.onWindowResize();
    });
  }

  copyConsole = () => {
    clipboard.writeText(this.props.consoleData.join(''));
  }

  decreaseFontsize = () => {
    this.setState({ fontsize: this.props.fontSize - 1 });
    this.props.onChangeFontsize(this.props.fontSize - 1);
    storage.set('editorFontSize', { editorFontSize: this.props.fontSize - 1 }, (err: any) => {
      if (err) logging.log(err);
    });
  }

  render() {
    const changeMarker = this.hasUnsavedChanges() ? '*' : '';
    if (this.props.consoleUnread) {
      this.toggleConsole();
    }
    return (
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title style={{ fontSize: '14px' }}>Editing: {pathToName(this.props.filepath) ? pathToName(this.props.filepath) : '[ New File ]' } {changeMarker}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form inline onSubmit={this.handleSubmitFontsize}>
            <ButtonGroup id="file-operations-buttons">
              <DropdownButton
                title="File"
                bsSize="small"
                id="choose-theme"
              >
                <MenuItem
                  onClick={this.props.onCreateNewFile}
                >New File</MenuItem>
                <MenuItem
                  onClick={this.props.onOpenFile}
                >Open</MenuItem>
                <MenuItem
                  onClick={_.partial(this.props.onSaveFile,false)}
                >Save</MenuItem>
                <MenuItem
                  onClick={_.partial(this.props.onSaveFile, true)}
                >Save As</MenuItem>
              </DropdownButton>
              <TooltipButton
                id="upload"
                text="Upload"
                onClick={this.upload}
                glyph="upload"
                disabled={false}
              />
              <TooltipButton
                id="download"
                text="Download from Robot"
                onClick={this.props.onDownloadCode}
                glyph="download"
                disabled={!this.props.runtimeStatus}
              />
            </ButtonGroup>
            {' '}
            <ButtonGroup id="code-execution-buttons">
              <TooltipButton
                id="run"
                text="Run"
                onClick={this.startRobot}
                glyph="play"
                disabled={this.state.isRunning
                || !this.props.runtimeStatus
                || this.props.fieldControlActivity}
              />
              <TooltipButton
                id="stop"
                text="Stop"
                onClick={this.stopRobot}
                glyph="stop"
                disabled={!(this.state.isRunning || this.state.simulate)}
              />
              <DropdownButton
                title={this.state.modeDisplay}
                bsSize="small"
                key="dropdown"
                id="modeDropdown"
                disabled={this.state.isRunning || this.state.simulate
                || this.props.fieldControlActivity
                || !this.props.runtimeStatus}
              >
                <MenuItem
                  eventKey="1"
                  active={this.state.mode === robotState.AUTONOMOUS && !this.state.simulate}
                  onClick={() => {
                    this.setState({ mode: robotState.AUTONOMOUS, modeDisplay: robotState.AUTOSTR });
                  }}
                >Autonomous</MenuItem>
                <MenuItem
                  eventKey="2"
                  active={this.state.mode === robotState.TELEOP && !this.state.simulate}
                  onClick={() => {
                    this.setState({ mode: robotState.TELEOP, modeDisplay: robotState.TELEOPSTR });
                  }}
                >Tele-Operated</MenuItem>
                <MenuItem
                  eventKey="3"
                  active={this.state.simulate}
                  onClick={this.simulateCompetition}
                >Simulate Competition</MenuItem>
              </DropdownButton>
            </ButtonGroup>
            {' '}
            <ButtonGroup id="console-buttons">
              <TooltipButton
                id="toggle-console"
                text="Toggle Console"
                onClick={this.toggleConsole}
                glyph="console"
                disabled={false}
                bsStyle={this.props.consoleUnread ? 'danger' : ''}
              />
              <TooltipButton
                id="clear-console"
                text="Clear Console"
                onClick={this.props.onClearConsole}
                glyph="remove"
                disabled={false}
              />
              <TooltipButton
                id="raise-console"
                text="Raise Console"
                onClick={this.raiseConsole}
                glyph="arrow-up"
                disabled={this.state.consoleHeight > windowInfo.CONSOLEMAX}
              />
              <TooltipButton
                id="lower-console"
                text="Lower Console"
                onClick={this.lowerConsole}
                glyph="arrow-down"
                disabled={this.state.consoleHeight < windowInfo.CONSOLEMIN}
              />
              <TooltipButton
                id="copy-console"
                text="Copy Console"
                onClick={this.copyConsole}
                glyph="copy"
                disabled={false}
              />
            </ButtonGroup>
            {' '}
            <FormGroup>
              <InputGroup>
                <FormControl
                  type="number"
                  value={this.state.fontsize}
                  bsSize="small"
                  onChange={this.handleChangeFontsize}
                  style={{ width: 32, padding: 6 }}
                />
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Text Size</Tooltip>}>
                  <DropdownButton
                    componentClass={InputGroup.Button}
                    title=""
                    bsSize="small"
                    id="choose-font-size"
                  >
                    <MenuItem
                      className="dropdown-item"
                      onClick={() => this.changeFontsizeToFont(8)}
                    >8</MenuItem>
                    <MenuItem
                      className="dropdown-item"
                      onClick={() => this.changeFontsizeToFont(12)}
                    >12</MenuItem>
                    <MenuItem
                      className="dropdown-item"
                      onClick={() => this.changeFontsizeToFont(14)}
                    >14</MenuItem>
                    <MenuItem
                      className="dropdown-item"
                      onClick={() => this.changeFontsizeToFont(16)}
                    >16</MenuItem>
                    <MenuItem
                      className="dropdown-item"
                      onClick={() => this.changeFontsizeToFont(20)}
                    >20</MenuItem>
                    <MenuItem
                      className="dropdown-item"
                      onClick={() => this.changeFontsizeToFont(24)}
                    >24</MenuItem>
                    <MenuItem
                      className="dropdown-item"
                      onClick={() => this.changeFontsizeToFont(28)}
                    >28</MenuItem>
                  </DropdownButton>
                </OverlayTrigger>
              </InputGroup>
              <TooltipButton
                    id="toggleKeyboardControl"
                    text="toggleKeyboardControl"
                    onClick={this.toggleKeyboardControl}
                    glyph="text-background"
                    disabled={false} 
                /> 
            </FormGroup>
            {' '}
            <ButtonGroup id="editor-settings-buttons" className="form-inline">
              <TooltipButton
                id="increase-font-size"
                text="Increase font size"
                onClick={this.increaseFontsize}
                glyph="zoom-in"
                disabled={this.props.fontSize >= 28}
              />
              <TooltipButton
                id="decrease-font-size"
                text="Decrease font size"
                onClick={this.decreaseFontsize}
                glyph="zoom-out"
                disabled={this.props.fontSize <= 8}
              />
              <DropdownButton
                title="Theme"
                bsSize="small"
                id="choose-theme"
              >
                {this.themes.map((theme: string) => (
                  <MenuItem
                    active={theme === this.props.editorTheme}
                    onClick={_.partial(this.changeTheme, theme)}
                    key={theme}
                  >
                    {theme}
                  </MenuItem>
                ))}
              </DropdownButton>
            </ButtonGroup>
          </Form>
          <AceEditor
            mode="python"
            theme={this.props.editorTheme}
            width="100%"
            fontSize={this.props.fontSize}
            ref={(input: AceEditor) => { this.CodeEditor = input; }}
            name="CodeEditor"
            height={this.state.editorHeight.toString()}
            value={this.props.editorCode}
            onChange={this.props.onEditorUpdate}
            onPaste={Editor.onEditorPaste}
            editorProps={{ $blockScrolling: Infinity }}
            readOnly = {this.state.keyboardControl}
          />
          <ConsoleOutput
            toggleConsole={this.toggleConsole}
            show={this.props.showConsole}
            height={this.state.consoleHeight}
            output={this.props.consoleData}
            disableScroll={this.props.disableScroll}
          />
        </Panel.Body>
      </Panel>
    );
  }
}
