import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Navbar, ButtonToolbar, ButtonGroup, Label } from 'react-bootstrap';
import { ConfigBox } from './ConfigBox';
import { UpdateBox } from './UpdateBox';
import { StatusLabel } from './StatusLabel';
import { TooltipButton } from './TooltipButton';
import { VERSION } from '../consts';
import { robotState } from '../utils/utils';
import { ipcRenderer } from 'electron';

interface StateProps {
  runtimeVersion: string;
  codeStatus: number;
  heart: boolean;
  blueMasterTeamNumber: number;
  goldMasterTeamNumber: number;
  ipAddress: string;
  udpTunnelAddress: string;
  sshAddress: string;
  fieldControlStatus: boolean;
  latencyValue: number
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

  const getLatencyThresholdColor = (latency : number) => {
    if (latency <= LOW_LATENCY_THRESHOLD_MSEC) {
      return "success"
    } else if (latency > LOW_LATENCY_THRESHOLD_MSEC && latency < HIGH_LATENCY_THRESHOLD_MSEC) {
      return "warning"
    } else {
      return "danger"
    }
  }

  const {
    connectionStatus,
    runtimeStatus,
    masterStatus,
    isRunningCode,
    ipAddress,
    udpTunnelAddress,
    sshAddress,
    runtimeVersion,
    codeStatus,
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
      <ConfigBox shouldShow={showConfigModal} ipAddress={ipAddress} udpTunnelAddress={udpTunnelAddress} sshAddress={sshAddress} hide={() => toggleConfigModal(!showConfigModal)} />
      <Navbar.Header>
        <Navbar.Brand id="header-title">{createHeader()}</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        {runtimeStatus ? (
          <Navbar.Text id="runtime-version">
            <Label bsStyle="info">{`Runtime v${runtimeVersion}: ${String(robotState[codeStatus])}`}</Label>
          </Navbar.Text>
        ) : (
          ''
        )}
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
        <Navbar.Text id="Latency">
          <Label bsStyle={getLatencyThresholdColor(props.latencyValue)}>{`Latency: ${props.latencyValue}`}</Label>
        </Navbar.Text>
        <Navbar.Form pullRight>
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
              <TooltipButton
                placement="bottom"
                text="Open Video Feed"
                bsStyle="info"
                onClick={() => ipcRenderer.send('SHOW_VIDEOFEED')}
                id="show-video-feed-button"
                glyph="play"
                disabled={false}
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
  codeStatus: state.info.studentCodeStatus,
  heart: state.fieldStore.heart,
  ipAddress: state.info.ipAddress,
  udpTunnelAddress: state.info.udpTunnelIpAddress,
  sshAddress: state.info.sshAddress,
  fieldControlStatus: state.fieldStore.fieldControl,
  runtimeVersion: state.peripherals.runtimeVersion,
  latencyValue: state.editor.latencyValue
});

export const DNav = connect(mapStateToProps)(DNavComponent);
