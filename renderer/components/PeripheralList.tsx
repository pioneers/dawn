import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Panel, PanelGroup, ListGroup } from 'react-bootstrap';
import { PeripheralTypes } from '../consts';
import { Peripheral } from './Peripheral';
import { Device } from '../../protos/protos';
import { PeripheralList } from '../types';

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

const filter = new Set();

interface StateProps {
  connectionStatus: boolean;
  runtimeStatus: boolean;
  peripheralList: PeripheralList;
}

const handleAccordion = (devices: Device[]) => {
  const peripheralGroups: { [peripheralName: string]: Device[] } = {};

  // Filter and group peripherals by name (type)
  devices
    .filter((p: Device) => !filter.has(p.uid))
    .forEach((p) => {
      const group: Device[] = peripheralGroups[p.name] ?? [];
      group.push(p);
      peripheralGroups[p.name] = group;
    });

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
                <Peripheral
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

const PeripheralListComponent = (props: StateProps) => {
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
    panelBody = handleAccordion(Object.values(props.peripheralList));
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

const mapStateToProps = (state: ApplicationState) => ({
  peripheralList: state.peripherals.peripheralList,
});

const PeripheralList = connect(mapStateToProps)(PeripheralListComponent);

export default PeripheralList;
