import React, { useState } from 'react';
import { ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { Observer } from 'mobx-react';

import { TooltipButton } from '../TooltipButton';
import { useStores } from '../../hooks';
import { getRobotStateReadableString, RobotState } from '../../utils/utils';

export const ConsoleButtons = () => {
  const { info, settings } = useStores();

  return (
    <Observer>
      {() => (
        <ButtonGroup id="console-buttons">
          <TooltipButton
            id="toggle-console"
            text="Toggle Console"
            onClick={toggleConsole}
            icon="terminal"
            disabled={false}
            bsStyle={isConsoleUnread ? 'danger' : ''}
          />
          <TooltipButton id="clear-console" text="Clear Console" onClick={props.onClearConsole} icon="times" disabled={false} />
          <TooltipButton
            id="raise-console"
            text="Raise Console"
            onClick={raiseConsole}
            icon="arrow-up"
            disabled={consoleHeight > windowInfo.CONSOLEMAX}
          />
          <TooltipButton
            id="lower-console"
            text="Lower Console"
            onClick={lowerConsole}
            icon="arrow-down"
            disabled={consoleHeight < windowInfo.CONSOLEMIN}
          />
          <TooltipButton id="copy-console" text="Copy Console" onClick={copyConsole} icon="clipboard" disabled={false} />
        </ButtonGroup>
      )}
    </Observer>
  );
};
