import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Navbar, ButtonToolbar, ButtonGroup, Label } from 'react-bootstrap';
import { ConfigBox } from './ConfigBox';
import { UpdateBox } from './UpdateBox';
import { StatusLabel } from './StatusLabel';
import { TooltipButton } from './TooltipButton';
import { VERSION } from '../consts';
import { runtimeState } from '../utils/utils';

interface StateProps {
  runtimeVersion: string;
  robotState: number;
  heart: boolean;
  blueMasterTeamNumber: number;
  goldMasterTeamNumber: number;
  ipAddress: string;
  fieldControlStatus: boolean;
}

interface OwnProps {
  ipAddress: string;
  startTour: () => void;
  runtimeStatus: boolean;
  masterStatus: boolean;
  connectionStatus: boolean;
  isRunningCode: boolean;
}

type Props = StateProps & OwnProps;

/**
 * 3 Icons at the top right of Dawn: Tour, RobotIP, Upload
 * State controls toggling UpdateBox and ConfigBox 
 */
const DNavComponent = (props: Props) => {
  const [showUpdateModal, toggleUpdateModal] = useState(false);
  const [showConfigModal, toggleConfigModal] = useState(false);

  const createHeader = () => {
    if (props.fieldControlStatus) {
      return `Dawn FC v${VERSION} ${props.heart ? '+' : '-'}`;
    }
    return `Dawn v${VERSION}`;
  };

  const createMaster = () => {
    if (props.fieldControlStatus) {
      return props.masterStatus;
    }
    return false;
  };

  const {
    connectionStatus,
    runtimeStatus,
    masterStatus,
    isRunningCode,
    ipAddress,
    runtimeVersion,
    robotState,
    blueMasterTeamNumber,
    goldMasterTeamNumber,
    fieldControlStatus,
    startTour,
  } = props;

  return (
    <Navbar fixedTop fluid>
      <UpdateBox
        isRunningCode={isRunningCode}
        connectionStatus={connectionStatus}
        runtimeStatus={runtimeStatus}
        masterStatus={masterStatus}
        shouldShow={showUpdateModal}
        ipAddress={ipAddress}
        hide={() => toggleUpdateModal(!showUpdateModal)}
      />
      <ConfigBox
        shouldShow={showConfigModal}
        ipAddress={ipAddress}
        hide={() => toggleConfigModal(!showConfigModal)}
      />
      <Navbar.Header>
        <Navbar.Brand id="header-title">
          {createHeader()}
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        {runtimeStatus ?
          <Navbar.Text id="runtime-version">
            <Label bsStyle="info">{
              `Runtime v${runtimeVersion}: ${runtimeState[robotState]}`
            }
            </Label>
          </Navbar.Text> : ''
        }
        <Navbar.Text id="battery-indicator">
          <StatusLabel
            connectionStatus={connectionStatus}
            runtimeStatus={runtimeStatus}
            masterStatus={masterStatus}
            blueMasterTeamNumber={blueMasterTeamNumber}
            goldMasterTeamNumber={goldMasterTeamNumber}
            ipAddress={ipAddress}
            fieldControlStatus={fieldControlStatus}
          />
        </Navbar.Text>
        <Navbar.Form
          pullRight
        >
          <ButtonToolbar>
            <ButtonGroup>
              <TooltipButton
                placement="bottom"
                text="Tour"
                bsStyle="info"
                onClick={startTour}
                id="tour-button"
                glyph="info-sign"
                disabled={false}
              />
              <TooltipButton
                placement="bottom"
                text="Robot IP"
                bsStyle="info"
                onClick={() => toggleConfigModal(!showConfigModal)}
                id="update-address-button"
                glyph="transfer"
                disabled={false}
              />
              <TooltipButton
                placement="bottom"
                text="Upload Upgrade"
                bsStyle="info"
                onClick={() => toggleUpdateModal(!showUpdateModal)}
                disabled={!runtimeStatus}
                id="update-software-button"
                glyph="cloud-upload"
              />
            </ButtonGroup>
          </ButtonToolbar>
        </Navbar.Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  blueMasterTeamNumber: state.fieldStore.blueMasterTeamNumber,
  goldMasterTeamNumber: state.fieldStore.goldMasterTeamNumber,
  robotState: state.info.robotState,
  heart: state.fieldStore.heart,
  ipAddress: state.info.ipAddress,
  fieldControlStatus: state.fieldStore.fieldControl,
  runtimeVersion: state.peripherals.runtimeVersion,
});

export const DNav = connect(mapStateToProps)(DNavComponent);
