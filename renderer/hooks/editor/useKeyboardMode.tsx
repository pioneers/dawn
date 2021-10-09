import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { keyboardButtons } from '../../consts';

interface Props {
  onUpdateKeyboardBitmap: (keyboardBitMap: number) => void;
  onUpdateKeyboardModeToggle: (isKeyboardModeToggled: boolean) => void;
}

export const useKeyboardMode = (props: Props) => {
  const [isKeyboardModeToggled, setIsKeyboardModeToggled] = useState(false);
  const [keyboardBitmap, setKeyboardBitmap] = useState(0);
  const keyboardBitmapRef = useRef(0);
  keyboardBitmapRef.current = keyboardBitmap;

  // toggle keyboard control and add/remove listening for key presses to control robot
  const toggleKeyboardControl = () => {
    setIsKeyboardModeToggled(!isKeyboardModeToggled);
    props.onUpdateKeyboardModeToggle(!isKeyboardModeToggled);
  };

  useEffect(() => {
    if (isKeyboardModeToggled) {
      // We need passive true so that we are able to remove the event listener when we are not in Keyboard Control mode
      window.addEventListener('keydown', turnCharacterOn, { passive: true });
      window.addEventListener('keyup', turnCharacterOff, { passive: true });
    } else {
      window.removeEventListener('keydown', turnCharacterOn);
      window.removeEventListener('keyup', turnCharacterOff);
      setKeyboardBitmap(0);
    }

    return () => {
      window.removeEventListener('keydown', turnCharacterOn);
      window.removeEventListener('keyup', turnCharacterOff);
    };
  }, [isKeyboardModeToggled]);

  const bitShiftLeft = (value: number, numPositions: number) => {
    return value * Math.pow(2, numPositions);
  };

  const updateKeyboardBitmap = useCallback((currentCharacter: string, isKeyPressed: boolean) => {
    const keyboardNum = keyboardButtons[currentCharacter] as number;
    let newKeyboardBitmap: number = keyboardBitmapRef.current;

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
    props.onUpdateKeyboardBitmap(newKeyboardBitmap);
  }, []);

  const turnCharacterOff = useCallback(
    (e: KeyboardEvent) => {
      updateKeyboardBitmap(e.key, false);
    },
    [updateKeyboardBitmap]
  );

  const turnCharacterOn = useCallback(
    (e: KeyboardEvent) => {
      // Handle special ctrl + q edge case
      if (e.ctrlKey && e.key === 'q') {
        setIsKeyboardModeToggled(false);
      } else {
        updateKeyboardBitmap(e.key, true);
      }
    },
    [updateKeyboardBitmap]
  );

  return { isKeyboardModeToggled, keyboardBitmap, toggleKeyboardControl };
};
