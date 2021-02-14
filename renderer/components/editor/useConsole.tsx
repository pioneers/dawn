import { clipboard } from 'electron';
import { useState } from 'react';
import _ from 'lodash';
import { windowInfo } from '../../utils/utils';

interface Props {
  consoleData: string[];
  isOpenOnStart?: boolean;
  initialHeight?: number;
  onToggled?: () => void;
}

export const useConsole = ({ consoleData, onToggled, isOpenOnStart = false, initialHeight = windowInfo.CONSOLESTART }: Props) => {
  const [isConsoleOpen, setIsConsoleOpen] = useState(isOpenOnStart);
  const [consoleHeight, setConsoleHeight] = useState(initialHeight);

  const toggleConsole = () => {
    setIsConsoleOpen(!isConsoleOpen);

    if (onToggled !== undefined) {
      onToggled();
    }
  };

  const raiseConsole = () => {
    setConsoleHeight(consoleHeight + windowInfo.UNIT);
  };

  const lowerConsole = () => {
    setConsoleHeight(consoleHeight - windowInfo.UNIT);
  };

  const copyConsole = () => {
    clipboard.writeText(consoleData.join(''));
  };
  return { isConsoleOpen, consoleHeight, toggleConsole, raiseConsole, lowerConsole, copyConsole };
};
