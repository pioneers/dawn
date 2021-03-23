import React, { useEffect, useState } from 'react';
import OvenPlayer from 'ovenplayer';
import { keyboardButtons } from '../../consts/keyboard-buttons';
import { TooltipButton } from '../TooltipButton';
import { Input, Source } from '../../../protos/protos';
import { ipcRenderer } from 'electron';
import '../../../static/video-feed/video-feed.css';

export const VideoFeed = () => {
  const [isKeyboardModeToggled, setIsKeyboardModeToggled] = useState(false);
  const [keyboardBitmap, setKeyboardBitmap] = useState(0);

  useEffect(() => {
    const driverVideoFeed = OvenPlayer.create('driver-video-feed', {
      sources: [
        {
          type: 'webRTC',
          file: 'ws://64.227.109.107:3333/driver/stream',
          label: '720p'
        }
      ],
      autoStart: true,
      controls: false
    });

    const overheadVideoFeed = OvenPlayer.create('overhead-video-feed', {
      sources: [
        {
          type: 'webRTC',
          file: 'ws://64.227.109.107:3333/overhead/stream',
          label: '720p'
        }
      ],
      autoStart: true,
      controls: false
    });

    overheadVideoFeed.on('error', (error: any) => {
      console.log(error);
    });

    driverVideoFeed.on('error', (error: any) => {
      console.log(error);
    });
  }, []);

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
    updateKeyboardBitmap(e.key, false);
  };

  const turnCharacterOn = (e: KeyboardEvent) => {
    updateKeyboardBitmap(e.key, true);
  };

  return (
    <>
      <div id="header">
        <TooltipButton
          id="toggleKeyboardControl"
          text="Toggle Keyboard Control Mode"
          onClick={toggleKeyboardControl}
          glyph="text-background"
          disabled={false}
          bsStyle={isKeyboardModeToggled ? 'info' : 'default'}
        />
      </div>

      <div className="container">
        <div id="driver-video-feed"></div>
        <div className="content">
          <div id="overhead-video-feed"></div>
        </div>
      </div>
    </>
  );
};
