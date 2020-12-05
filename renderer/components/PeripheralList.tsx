import React from 'react';
import _ from 'lodash';
import { Accordion, Card, CardGroup, ListGroup } from 'react-bootstrap';
import { PeripheralTypes } from '../consts';
import { Peripheral as PeripheralComponent } from './Peripheral';
import { Peripheral, PeripheralList } from '../types';
import { connect } from 'react-redux';

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
  const peripheralGroups: { [peripheralName: string]: Peripheral[] } = {};

  // Filter and group peripherals by name (type)
  devices
    // .filter((p: Peripheral) => !filter.has(p.uid))
    .forEach((peripheral) => {
      const group: Peripheral[] = peripheralGroups[peripheral.name] ?? [];
      group.push(peripheral);
      peripheralGroups[peripheral.name] = group;
    });


  return Object.keys(peripheralGroups).map((groupName: string, index: number) => {
    const groupNameCleaned = groupName; //cleanerNames[groupName] as string;

    return (
      <Accordion>
        <CardGroup
          style={{ marginBottom: '0px' }}
          key={`${groupNameCleaned || 'Default'}-Accordion`}
          id={`${groupNameCleaned || 'Default'}-Accordion`}
        >
          <Card key={`${groupNameCleaned || 'Default'}-Panel`}>
            <Accordion.Toggle eventKey={index.toString()}>
              <Card.Header>
                <Card.Title style={{ fontWeight: 'bold' }}>
                  {groupName || 'Generic'}
                </Card.Title>
              </Card.Header>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body style={{ padding: '10px' }}>
                {_.map(peripheralGroups[groupName], (peripheral) => (
                  <PeripheralComponent
                    key={String(peripheral.uid)}
                    uid={String(peripheral.uid)}
                    name={peripheral.name}
                    type={peripheral.name}
                    params={peripheral.params}
                  />
                ))}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </CardGroup>
      </Accordion>
    );
  });
};

const PeripheralListComponent = (props: StateProps & OwnProps) => {
  let errorMsg = null;

  if (!props.connectionStatus) {
    errorMsg = 'You are currently disconnected from the robot.';
  } else if (!props.runtimeStatus) {
    errorMsg = 'There appears to be some sort of General error. No data is being received.';
  }

  let panelBody = null;
  if (errorMsg) {
    panelBody = <p className="panelText">{errorMsg}</p>;
  } else {
    panelBody = handleAccordion(Object.values(props.peripheralList));
  }

  return (
    <Card id="peripherals-panel" bg="primary">
      <Card.Header>Peripherals</Card.Header>
      <Card.Body style={{ padding: '0px' }}>
        <ListGroup>{panelBody}</ListGroup>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  peripheralList: Object.assign({}, state.peripherals.peripheralList)
});

const PeripheralListContainer = connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps, {})(PeripheralListComponent);

export default PeripheralListContainer;
