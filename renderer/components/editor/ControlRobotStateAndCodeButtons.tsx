import React, { useState } from 'react';
import { ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { Observer } from 'mobx-react';

import { TooltipButton } from '../TooltipButton';
import { ROBOT_STAFF_CODE } from '../../consts';
import { useStores } from '../../hooks';
import { getRobotStateReadableString, RobotState } from '../../utils/utils';

export const ControlRobotStateAndCodeButtons = () => {
  const { editor, info, settings } = useStores();

  const [isRobotRunning, setIsRobotRunning] = useState(false);
  const [mode, setMode] = useState(RobotState.TELEOP);

  const startRobot = () => {
    setIsRobotRunning(true);
    info.updateStudentCodeStatus(mode);
  };

  const stopRobot = () => {
    setIsRobotRunning(false);
    info.updateStudentCodeStatus(RobotState.IDLE);
  };

  const insertRobotStaffCode = () => {
    editor.updateEditorCode(ROBOT_STAFF_CODE);
  };

  const onImportStaffCodeButtonClick = () => {
    if (editor.editorCode.get() === editor.latestSaveCode.get()) {
      insertRobotStaffCode();

      return;
    }

    const shouldOverwriteExistingCode = window.confirm(
      'You currently have unsaved changes. Do you really want to overwrite your code with Staff Code?'
    );

    if (shouldOverwriteExistingCode) {
      insertRobotStaffCode();
    }
  };

  return (
    <Observer>
      {() => (
        <ButtonGroup id="code-execution-buttons">
          <TooltipButton
            id="run"
            text="Run"
            onClick={startRobot}
            icon="play"
            // TODO: info.fieldControlActivity was used here previously, see if it's still needed
            disabled={isRobotRunning || !info.runtimeStatus.get()}
          />
          <TooltipButton id="stop" text="Stop" onClick={stopRobot} icon="stop" disabled={!isRobotRunning} />
          <DropdownButton
            variant={settings.globalTheme.get() === 'dark' ? 'outline-info' : 'primary'}
            title={getRobotStateReadableString(mode)}
            size="sm"
            key="dropdown"
            id="modeDropdown"
            disabled={false}
          >
            <Dropdown.Item
              eventKey="1"
              active={mode === RobotState.AUTONOMOUS}
              onClick={() => {
                setMode(RobotState.AUTONOMOUS);
              }}
            >
              Autonomous
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              active={mode === RobotState.TELEOP}
              onClick={() => {
                setMode(RobotState.TELEOP);
              }}
            >
              Tele-Operated
            </Dropdown.Item>
          </DropdownButton>
          <TooltipButton
            id="staffCodeButton"
            text="Import Staff Code"
            onClick={onImportStaffCodeButtonClick}
            icon="star"
            disabled={false}
          />
        </ButtonGroup>
      )}
    </Observer>
  );
};
