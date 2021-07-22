import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Navbar, ButtonToolbar, ButtonGroup, Badge } from 'react-bootstrap';
import { ConfigBox } from './ConfigBox';
import { UpdateBox } from './UpdateBox';
import { StatusLabel } from './StatusLabel';
import { TooltipButton } from './TooltipButton';
import { VERSION } from '../consts';
import { robotState } from '../utils/utils';
import { useStores } from '../hooks';
import { Observer } from 'mobx-react';

interface StateProps {
  codeStatus: number;
  fieldControlStatus: boolean;
  latencyValue: number;
  globalTheme: string;
}

interface OwnProps {
  startTour: () => void;
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

  const {info, fieldStore, editor, settings} = useStores();

  const createHeader = () => {
    if (props.fieldControlStatus) {
      return `Dawn FC v${VERSION} ${fieldStore.heart ? '+' : '-'}`;
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

  const formatLatencyValue = (latency: number) => {
    if (latency > MSEC_IN_ONE_SECOND) {
      latency = latency / MSEC_IN_ONE_SECOND;
      return `${latency} sec`;
    }

    return `${latency} ms`;
  }

  const {
    runtimeVersion,
    codeStatus,
    fieldControlStatus,
    startTour,
  } = props;

  /**
   * 4.21.2021
   * DELETE THIS COMMENT BLOCK IF THIS WORKS
   * (lines: 98, 101) Navbar.Header replaced with: Navbar
   * (lines: 124, 156) Navbar.Form pullRight replaced with: Navbar
   */

  return (
    <Observer>{() =>
    <Navbar 
      fixed={"top"} 
      bg={settings.globalTheme === 'dark' ? 'dark' : 'light'} 
      variant={settings.globalTheme === 'dark' ? 'dark' : 'light'}
      >
      <UpdateBox
        shouldShow={showUpdateModal}
        hide={() => toggleUpdateModal(!showUpdateModal)}
      />
      <ConfigBox shouldShow={showConfigModal} hide={() => toggleConfigModal(!showConfigModal)} />
      <Navbar>
        <Navbar.Brand id="header-title">{createHeader()}</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar>
      <Navbar.Collapse>
        {info.runtimeStatus ? (
          <Navbar.Text id="runtime-version">
            <Badge variant="info">{`Runtime v${runtimeVersion}: ${String(robotState[codeStatus])}`}</Badge>
          </Navbar.Text>
        ) : (
          ''
        )}
        <Navbar.Text id="battery-indicator">
          <StatusLabel
            fieldControlStatus={fieldControlStatus}
          />
        </Navbar.Text>
        <Navbar.Text id="Latency">
          <Badge variant={getLatencyThresholdColor(editor.latencyValue)}>{`Latency: ${editor.latencyValue}`}</Badge>
        </Navbar.Text>
        <Navbar>
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
                disabled={!info.runtimeStatus}
                id="update-software-button"
                icon="cloud-upload-alt"
              />
            </ButtonGroup>
          </ButtonToolbar>
        </Navbar>
      </Navbar.Collapse>
    </Navbar>}</Observer>
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
  latencyValue: state.editor.latencyValue,
  globalTheme: state.settings.globalTheme,
});

export const DNav = connect(mapStateToProps)(DNavComponent);
