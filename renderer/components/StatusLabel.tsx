import React from 'react';
import { Label } from 'react-bootstrap';
import { connect } from 'react-redux';
import numeral from 'numeral';

interface StateProps {
  connectionStatus: boolean;
  runtimeStatus: boolean;
  batteryLevel: number;
  batterySafety: boolean;
  blueMasterTeamNumber: number;
  goldMasterTeamNumber: number;
  ipAddress: string;
}

interface OwnProps {
  fieldControlStatus: boolean;
}

type Props = StateProps & OwnProps;

const StatusLabelComponent = (props: Props) => {
  let labelStyle = 'default';
  let labelText = 'Disconnected';
  const masterRobotHeader = 'Master Robot: Team ';
  const teamIP = props.ipAddress.substring(props.ipAddress.length - 2, props.ipAddress.length);
  const shouldDisplayMaster = (teamNumber: number) => parseInt(teamIP, 10) === teamNumber
                                            && props.fieldControlStatus;
  let masterRobot = null;
  let masterRobotStyle = ' ';
  if (shouldDisplayMaster(props.blueMasterTeamNumber)) {
    masterRobot = props.blueMasterTeamNumber;
    masterRobotStyle = 'primary';
  } else if (shouldDisplayMaster(props.goldMasterTeamNumber)) {
    masterRobot = props.goldMasterTeamNumber;
    masterRobotStyle = 'warning';
  }

  if (props.connectionStatus) {
    if (!props.runtimeStatus) {
      labelStyle = 'danger';
      labelText = 'General Error';
    } else if (props.batterySafety) {
      labelStyle = 'danger';
      labelText = 'Unsafe Battery';
    } else {
      labelStyle = 'success';
      labelText = `Battery: ${numeral(props.batteryLevel).format('0.00')} V`;
    }
  }
  return (
    <div id="parent">
      <Label bsStyle={labelStyle}>{labelText}</Label>
      {' '}
      <Label bsStyle={masterRobotStyle !== ' ' ? masterRobotStyle : labelStyle}>
        {masterRobot !== null ? masterRobotHeader + masterRobot : null}
      </Label>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  batteryLevel: state.peripherals.batteryLevel,
  batterySafety: state.peripherals.batterySafety,
  masterStatus: state.fieldStore.masterStatus,
  blueMasterTeamNumber: state.fieldStore.blueMasterTeamNumber,
  goldMasterTeamNumber: state.fieldStore.goldMasterTeamNumber,
  ipAddress: state.info.ipAddress,
  fieldControlStatus: state.fieldStore.fieldControl,
});

export const StatusLabel = connect(mapStateToProps)(StatusLabelComponent);
