import React from 'react';
import { Badge } from 'react-bootstrap';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { useStores } from '../hooks';
import { Observer } from 'mobx-react';

interface StateProps {
  batteryLevel?: number;
  batterySafety?: boolean;
}

interface OwnProps {
  fieldControlStatus?: boolean;
}

type Props = StateProps & OwnProps;

const StatusLabelComponent = (props: Props) => {

  const {info, fieldStore} = useStores();

  let labelStyle = 'default';
  let labelText = 'Disconnected';
  const masterRobotHeader = 'Master Robot: Team ';
  const teamIP = info.ipAddress.substring(info.ipAddress.length - 2, info.ipAddress.length);
  const shouldDisplayMaster = (teamNumber: number) => parseInt(teamIP, 10) === teamNumber
                                            && props.fieldControlStatus;
  let masterRobot = null;
  let masterRobotStyle = ' ';
  if (shouldDisplayMaster(fieldStore.blueMasterTeamNumber)) {
    masterRobot = fieldStore.blueMasterTeamNumber;
    masterRobotStyle = 'primary';
  } else if (shouldDisplayMaster(fieldStore.goldMasterTeamNumber)) {
    masterRobot =fieldStore.goldMasterTeamNumber;
    masterRobotStyle = 'warning';
  }

  if (info.connectionStatus) {
    if (!info.runtimeStatus) {
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
    <Observer>{() => 
    <div id="parent">
      <Badge variant={labelStyle}>{labelText}</Badge>
      {' '}
      <Badge variant={masterRobotStyle !== ' ' ? masterRobotStyle : labelStyle}>
        {masterRobot !== null ? masterRobotHeader + masterRobot : null}
      </Badge>
    </div>}</Observer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  batteryLevel: state.peripherals.batteryLevel,
  batterySafety: state.peripherals.batterySafety,
});

export const StatusLabel = connect(mapStateToProps)(StatusLabelComponent);
