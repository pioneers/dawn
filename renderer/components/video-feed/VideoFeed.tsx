import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import OvenPlayer from 'ovenplayer';
import { keyboardButtons } from '../../consts/keyboard-buttons';
import { Input, Source } from '../../../protos/protos';
import { ipcRenderer } from 'electron';

import '../../../static/video-feed/video-feed.css';
import { ShepherdOverlay } from './ShepherdOverlay';

export const VideoFeed = () => {
  const [isKeyboardModeToggled, setIsKeyboardModeToggled] = useState(false);
  const [keyboardBitmap, setKeyboardBitmap] = useState(0);
  const [shouldShowScoreboard, setShouldShowScoreboard] = useState(true);

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
          file: 'ws://161.35.224.231:3333/overhead/stream',
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

  useEffect(() => {
    const keyboardConnectionStatus = new Input({
      connected: isKeyboardModeToggled,
      axes: [],
      buttons: 0,
      source: Source.KEYBOARD
    });

    ipcRenderer.send('stateUpdate', [keyboardConnectionStatus], Source.KEYBOARD);
  }, [isKeyboardModeToggled]);

  const sendKeyboardInputsToRuntime = (keyboardBitmap: number) => {
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
    sendKeyboardInputsToRuntime(newKeyboardBitmap);
  };

  const turnCharacterOff = (e: KeyboardEvent) => {
    updateKeyboardBitmap(e.key, false);
  };

  const turnCharacterOn = (e: KeyboardEvent) => {
    // Handle special ctrl + q edge case
    if (e.ctrlKey && e.key === 'q') {
      setIsKeyboardModeToggled(false);
    } else {
      updateKeyboardBitmap(e.key, true);
    }
  };

  return (
    <>
      <div id="header">
        <Button
          id="toggleKeyboardControl"
          onClick={toggleKeyboardControl}
          disabled={false}
          bsStyle={isKeyboardModeToggled ? 'info' : 'default'}
        >
          Toggle Keyboard Control Mode
        </Button>
        <Button onClick={() => setShouldShowScoreboard(!shouldShowScoreboard)} bsStyle={shouldShowScoreboard ? 'info' : 'default'}>
          Toggle Overlay  
        </Button>
      </div>

      <div className="video-feed-container">
        <div id="driver-video-feed"></div>
        <div id="overhead-video-feed"></div>
      </div>
      <div className="content">
        {shouldShowScoreboard ? ShepherdOverlay() : null}
      </div>
    </>
  );
};
