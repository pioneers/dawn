import React from 'react';
import { keyboardButtons } from '../../consts/keyboard-buttons';
import { TooltipButton } from '../TooltipButton';
import { Input, Source } from '../../../protos/protos';
import { ipcRenderer } from 'electron';

interface State {
    isKeyboardModeToggled: boolean;
    keyboardBitmap: number;
}

export class VideoFeed extends React.Component<{},State>{
    
    constructor(props = {}) {
        super(props);
        this.state = {
          isKeyboardModeToggled: false,
          keyboardBitmap: 0
        };
    }

  sendToRuntime =() => {

      const keyboard = new Input({
        connected: true,
        axes: [],
        buttons: this.state.keyboardBitmap,
        source: Source.KEYBOARD
      });
    
      ipcRenderer.send('stateUpdate', [keyboard], Source.KEYBOARD);
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
    this.sendToRuntime();
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
        <TooltipButton
        id="toggleKeyboardControl"
        text="Toggle Keyboard Control Mode"
        onClick={this.toggleKeyboardControl}
        glyph="text-background"
        disabled={false}
        bsStyle={this.state.isKeyboardModeToggled ? 'info' : 'default'}
      />
    )
  }
}

