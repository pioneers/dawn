import React, { useState } from 'react';
import { keyboardButtons } from '../../consts/keyboard-buttons';
import { TooltipButton } from '../TooltipButton';
import { Input, Source } from '../../../protos/protos';
import { ipcRenderer } from 'electron';
import { ButtonGroup } from 'react-bootstrap';

export const VideoFeed = () => {
  const [isKeyboardModeToggled, setIsKeyboardModeToggled] = useState(false);
  const [keyboardBitmap, setKeyboardBitmap] = useState(0);

  const sendKeyboardInputsToRuntime = () => {
    const keyboard = new Input({
      connected: true,
      axes: [],
      buttons: keyboardBitmap,
      source: Source.KEYBOARD
    });

    ipcRenderer.send('stateUpdate', [keyboard], Source.KEYBOARD);
  };

  const bitShiftLeft = (value: number, numPositions: number) => {
    return value * Math.pow(2, numPositions);
  };

  // toggle keyboard control and add/remove listening for key presses to control robot
  const toggleKeyboardControl = () => {
    if (!isKeyboardModeToggled) {
      // We need passive true so that we are able to remove the event listener when we are not in Keyboard Control mode
      window.addEventListener('keydown', turnCharacterOn, { passive: true });
      window.addEventListener('keyup', turnCharacterOff, { passive: true });
    } else {
      window.removeEventListener('keydown', turnCharacterOn);
      window.removeEventListener('keyup', turnCharacterOff);
      setKeyboardBitmap(0);
    }

    setIsKeyboardModeToggled(!isKeyboardModeToggled);
  };

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
    sendKeyboardInputsToRuntime();
  };

  const turnCharacterOff = (e: KeyboardEvent) => {
    // NOT THE ACTION updateKeyboardBitmap. THIS IS A LOCAL FUNCTION
    updateKeyboardBitmap(e.key, false);
  };

  const turnCharacterOn = (e: KeyboardEvent) => {
    updateKeyboardBitmap(e.key, true);
  };

  return (
    <TooltipButton
      id="toggleKeyboardControl"
      text="Toggle Keyboard Control Mode"
      onClick={toggleKeyboardControl}
      glyph="text-background"
      disabled={false}
      bsStyle={isKeyboardModeToggled ? 'info' : 'default'}
    />
  );
};
