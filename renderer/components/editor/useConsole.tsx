import { clipboard } from 'electron'; 
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { logging, windowInfo } from '../../utils/utils';

interface Props {
	isOpenOnStart: boolean;
	initialHeight: number;
	data: 
}

export const useConsole = ({isOpenOnStart = false, initialHeight = windowInfo.CONSOLESTART}) => {
	const [isConsoleOpen, setIsConsoleOpen] = useState(isOpenOnStart);
	const [consoleHeight, setConsoleHeight] = useState(initialHeight);
	
	const toggleConsole = () => {
		setIsConsoleOpen(!isConsoleOpen);
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
