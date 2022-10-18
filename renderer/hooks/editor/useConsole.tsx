import { clipboard } from 'electron';
import _ from 'lodash';
import { useEffect, useState } from 'react';
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

  const consoleData: string[] = useSelector((state: ApplicationState) => state.console.consoleData);

  useEffect(() => {
    if (isConsoleOpen) {
      setIsConsoleUnread(false);
    } else if (!isConsoleOpen && !_.isEmpty(consoleData)) {
      setIsConsoleUnread(true);
    }
  }, [consoleData, isConsoleOpen]);

  const toggleConsole = () => {
    setIsConsoleOpen(!isConsoleOpen);
    
    onToggled?.();
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

  return { consoleData, isConsoleOpen, isConsoleUnread, consoleHeight, toggleConsole, raiseConsole, lowerConsole, copyConsole };
};
