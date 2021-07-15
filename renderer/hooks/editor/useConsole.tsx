import { clipboard } from 'electron';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { windowInfo } from '../../utils/utils';

interface Props {
  isOpenOnStart?: boolean;
  initialHeight?: number;
  onToggled?: () => void;
}

export const useConsole = ({ onToggled, isOpenOnStart = false, initialHeight = windowInfo.CONSOLESTART }: Props) => {
  const [isConsoleOpen, setIsConsoleOpen] = useState(isOpenOnStart);
  const [consoleHeight, setConsoleHeight] = useState(initialHeight);
  const [isConsoleUnread, setIsConsoleUnread] = useState(false);

  const consoleData = useSelector((state: ApplicationState) => state.console.consoleData);

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

  return { consoleData, isConsoleOpen, consoleHeight, toggleConsole, raiseConsole, lowerConsole, copyConsole };
};
