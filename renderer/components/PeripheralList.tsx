import React from 'react';
import _ from 'lodash';
import { connect, MapStateToProps } from 'react-redux';
import { Panel, PanelGroup, ListGroup } from 'react-bootstrap';
import { PeripheralTypes } from '../consts';
import { Peripheral as PeripheralComponent } from './Peripheral';
import { Peripheral, PeripheralList } from '../types';
import { State } from 'seedrandom';

const cleanerNames = {};
cleanerNames[PeripheralTypes.MOTOR_SCALAR] = 'Motors';
cleanerNames[PeripheralTypes.SENSOR_BOOLEAN] = 'Boolean Sensors';
cleanerNames[PeripheralTypes.SENSOR_SCALAR] = 'Numerical Sensors';
cleanerNames[PeripheralTypes.LimitSwitch] = 'Limit Switches';
cleanerNames[PeripheralTypes.LineFollower] = 'Line Followers';
cleanerNames[PeripheralTypes.Potentiometer] = 'Potentiometers';
cleanerNames[PeripheralTypes.Encoder] = 'Encoders';
cleanerNames[PeripheralTypes.MetalDetector] = 'Metal Detectors';
cleanerNames[PeripheralTypes.ServoControl] = 'Servo Controllers';
cleanerNames[PeripheralTypes.RFID] = 'RFID';
cleanerNames[PeripheralTypes.YogiBear] = 'Yogi Bear';
cleanerNames[PeripheralTypes.GameValues] = 'Game Values';
cleanerNames[PeripheralTypes.PolarBear] = 'Polar Bear';
cleanerNames[PeripheralTypes.KoalaBear] = 'Koala Bear';

// const filter = new Set();

interface OwnProps {
  connectionStatus: boolean;
  runtimeStatus: boolean;
}

interface StateProps {
  peripheralList: PeripheralList;
}

const handleAccordion = (devices: Peripheral[]) => {
  console.log('devices', devices);
  const peripheralGroups: { [peripheralName: string]: Peripheral[] } = {};

  // Filter and group peripherals by name (type)
  devices
    // .filter((p: Peripheral) => !filter.has(p.uid))
    .forEach((peripheral) => {
      const group: Peripheral[] = peripheralGroups[peripheral.name] ?? [];
      console.log('group', group);
      group.push(peripheral);
      peripheralGroups[peripheral.name] = group;
    });

  console.log('peripheral groups', peripheralGroups);

  return Object.keys(peripheralGroups).map((groupName: string) => {
    const groupNameCleaned = cleanerNames[groupName] as string;

    return (
      <PanelGroup
        accordion
        style={{ marginBottom: '0px' }}
        key={`${groupNameCleaned || 'Default'}-Accordion`}
        id={`${groupNameCleaned || 'Default'}-Accordion`}
      >
        <Panel key={`${groupNameCleaned || 'Default'}-Panel`} defaultExpanded>
          <Panel.Heading>
            <Panel.Title toggle style={{ fontWeight: 'bold' }}>
              {cleanerNames[groupName] || 'Generic'}
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body style={{ padding: '10px' }}>
              {_.map(peripheralGroups[groupName], (peripheral) => (
                <PeripheralComponent
                  key={String(peripheral.uid)}
                  id={String(peripheral.uid)}
                  device_name={peripheral.name}
                  device_type={peripheral.name}
                  params={peripheral.params}
                />
              ))}
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </PanelGroup>
    );
  });
};

const PeripheralListComponent = (props: StateProps & OwnProps) => {
  let errorMsg = null;

  if (!props.connectionStatus) {
    errorMsg = 'You are currently disconnected from the robot.';
  } else if (!props.runtimeStatus) {
    errorMsg = 'There appears to be some sort of General error. ' + 'No data is being received.';
  }

  let panelBody = null;
  if (errorMsg) {
    panelBody = <p className="panelText">{errorMsg}</p>;
  } else {
    const keys = Object.keys(props.peripheralList);
    console.log('keys', keys);
    console.log('peripheral list', props.peripheralList);
    console.log('typeof peripheral list', typeof props.peripheralList);
    console.log('peripheral', props.peripheralList[2]);
    console.log('stringify', JSON.stringify(props.peripheralList));
    console.log('keys', Object.keys(props.peripheralList));
    console.log('values', Object.getOwnPropertyNames(props.peripheralList));
    panelBody = handleAccordion(_.toArray(props.peripheralList));
  }

  return (
    <Panel id="peripherals-panel" bsStyle="primary">
      <Panel.Heading>Peripherals</Panel.Heading>
      <Panel.Body style={{ padding: '0px' }}>
        <ListGroup>{panelBody}</ListGroup>
      </Panel.Body>
    </Panel>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, ApplicationState> = (state: ApplicationState) => {
  console.log('map state to props', state.peripherals.peripheralList);
  // console.log('state.peripherals.peripheralList type', typeof(state.peripherals.peripheralList));

  return {
    peripheralList: state.peripherals.peripheralList
  };
};

const PeripheralListContainer = connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps, {})(PeripheralListComponent);

export default PeripheralListContainer;
