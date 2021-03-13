import React from 'react';
import { keyboardButtons } from '../../consts/keyboard-buttons';
import { TooltipButton } from '../TooltipButton';
import { updateKeyboardBitmap } from '../../actions/EditorActions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';

interface OwnProps {
    onUpdateKeyboardBitmap: (keyboardBitmap: number) => void;
}
  
type Props = OwnProps;
  
interface State {
    isKeyboardModeToggled: boolean;
    keyboardBitmap: number;
}

export class VideoFeedComponent extends React.Component<Props,State>{
    
    constructor(props: Props) {
        super(props);
        this.state = {
          isKeyboardModeToggled: false,
          keyboardBitmap: 0
        };
    }

  bitShiftLeft = (value: number, numPositions: number) => {
    return value * Math.pow(2, numPositions);
  }


  // toggle keyboard control and add/remove listening for key presses to control robot
  toggleKeyboardControl = () => {
    this.setState({ isKeyboardModeToggled: !this.state.isKeyboardModeToggled });

    if (!this.state.isKeyboardModeToggled) {
      // We need passive true so that we are able to remove the event listener when we are not in Keyboard Control mode
      window.addEventListener('keydown', this.turnCharacterOn, { passive: true });
      window.addEventListener('keyup', this.turnCharacterOff, { passive: true });
    } else {
      window.removeEventListener('keydown', this.turnCharacterOn);
      window.removeEventListener('keyup', this.turnCharacterOff);
      this.setState({ keyboardBitmap: 0 });
      this.props.onUpdateKeyboardBitmap(this.state.keyboardBitmap);
    }
  };

  updateKeyboardBitmap = (currentCharacter: string, isKeyPressed: boolean) => {
    const keyboardNum = keyboardButtons[currentCharacter];
    let newKeyboardBitmap: number = this.state.keyboardBitmap;

    const shift = this.bitShiftLeft(1, keyboardNum);
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

    this.setState({ keyboardBitmap: newKeyboardBitmap });
    this.props.onUpdateKeyboardBitmap(this.state.keyboardBitmap);
  };

  turnCharacterOff = (e: KeyboardEvent) => {
    // NOT THE ACTION updateKeyboardBitmap. THIS IS A LOCAL FUNCTION
    this.updateKeyboardBitmap(e.key, false);
  }
  turnCharacterOn = (e: KeyboardEvent) => {
    this.updateKeyboardBitmap(e.key, true)
  }

  render(){
    return (
      <Panel bsStyle="primary">
        <TooltipButton
        id="toggleKeyboardControl"
        text="Toggle Keyboard Control Mode"
        onClick={this.toggleKeyboardControl}
        glyph="text-background"
        disabled={false}
        bsStyle={this.state.isKeyboardModeToggled ? 'info' : 'default'}
      />
      </Panel>
    )
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  keyboardBitmap: state.editor.keyboardBitmap
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onUpdateKeyboardBitmap: (keyboardBitmap: number) => {
    dispatch(updateKeyboardBitmap(keyboardBitmap));
  }
});

export const VideoFeed = connect(mapStateToProps, mapDispatchToProps)(VideoFeedComponent);