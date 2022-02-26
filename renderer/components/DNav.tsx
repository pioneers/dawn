import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Navbar, ButtonToolbar, ButtonGroup, Badge } from 'react-bootstrap';
import { ConfigBox } from './ConfigBox';
import { UpdateBox } from './UpdateBox';
import { StatusLabel } from './StatusLabel';
import { TooltipButton } from './TooltipButton';
import { VERSION } from '../consts';
import { robotState } from '../utils/utils';

interface StateProps {
  runtimeVersion: string;
  codeStatus: number;
  heart: boolean;
  blueMasterTeamNumber: number;
  goldMasterTeamNumber: number;
  ipAddress: string;
  sshAddress: string;
  fieldControlStatus: boolean;
  latencyValue: number;
  globalTheme: string;
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

const LOW_LATENCY_THRESHOLD_MSEC = 200;
const HIGH_LATENCY_THRESHOLD_MSEC = 300;
const MSEC_IN_ONE_SECOND = 1000;

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

  const getLatencyThresholdColor = (latency: number) => {
    if (latency <= LOW_LATENCY_THRESHOLD_MSEC) {
      return 'success';
    } else if (latency > LOW_LATENCY_THRESHOLD_MSEC && latency < HIGH_LATENCY_THRESHOLD_MSEC) {
      return 'warning';
    } else {
      return 'danger';
    }
  };

  const formatLatencyValue = (latency: number) => {
    if (latency > MSEC_IN_ONE_SECOND) {
      latency = latency / MSEC_IN_ONE_SECOND;
      return `${latency} sec`;
    }

    return `${latency} ms`;
  };

  const {
    connectionStatus,
    runtimeStatus,
    masterStatus,
    isRunningCode,
    ipAddress,
    sshAddress,
    runtimeVersion,
    codeStatus,
    blueMasterTeamNumber,
    goldMasterTeamNumber,
    fieldControlStatus,
    startTour
  } = props;

  return (
    <Navbar fixed={'top'} style={{zIndex:0}} bg={props.globalTheme === 'dark' ? 'dark' : 'light'} variant={props.globalTheme === 'dark' ? 'dark' : 'light'}>
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
        sshAddress={sshAddress}
        hide={() => toggleConfigModal(!showConfigModal)}
      />
      <Navbar>
        <Navbar.Brand id="header-title">{createHeader()}</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar>
      <Navbar.Collapse>
        {runtimeStatus ? (
          <Navbar.Text id="runtime-version">
            <Badge variant="info">{`Runtime v${runtimeVersion}: ${String(robotState[codeStatus])}`}</Badge>
          </Navbar.Text>
        ) : (
          ''
        )}
        <div style={{ marginRight: '25px' }}></div>
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
        <div style={{ marginRight: '25px' }}></div>
        <Navbar.Text id="Latency">
          <Badge variant={getLatencyThresholdColor(props.latencyValue)}>{`Latency: ${formatLatencyValue(props.latencyValue)}`}</Badge>
        </Navbar.Text>
        {/* Adding ml-auto aligns the nav bar to the right */}
        <Navbar className="ml-auto">
          <ButtonToolbar>
            <ButtonGroup>
              <TooltipButton
                placement="bottom"
                text="Tour"
                bsStyle="info"
                onClick={startTour}
                id="tour-button"
                icon="info-circle"
                disabled={false}
              />
              <TooltipButton
                placement="bottom"
                text="Robot IP"
                bsStyle="info"
                onClick={() => toggleConfigModal(!showConfigModal)}
                id="update-address-button"
                icon="exchange-alt"
                disabled={false}
              />
              <TooltipButton
                placement="bottom"
                text="Upload Upgrade"
                bsStyle="info"
                onClick={() => toggleUpdateModal(!showUpdateModal)}
                disabled={!runtimeStatus}
                id="update-software-button"
                icon="cloud-upload-alt"
              />
            </ButtonGroup>
          </ButtonToolbar>
        </Navbar>
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  blueMasterTeamNumber: state.fieldStore.blueMasterTeamNumber,
  goldMasterTeamNumber: state.fieldStore.goldMasterTeamNumber,
  codeStatus: state.info.studentCodeStatus,
  heart: state.fieldStore.heart,
  ipAddress: state.info.ipAddress,
  sshAddress: state.info.sshAddress,
  fieldControlStatus: state.fieldStore.fieldControl,
  runtimeVersion: state.peripherals.runtimeVersion,
  latencyValue: state.editor.latencyValue,
  globalTheme: state.settings.globalTheme
});

export const DNav = connect(mapStateToProps)(DNavComponent);
