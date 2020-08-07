import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Panel, PanelGroup, ListGroup } from 'react-bootstrap';
import { PeripheralTypes } from '../constants/Constants';
import Peripheral from './Peripheral';

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


const filter = new Set([PeripheralTypes.TeamFlag]);

const handleAccordion = (array) => {
  const peripheralGroups = {};

  console.log('accordion');
  console.log(array);

  array.filter(p => !filter.has(p.name)).forEach((p) => {
    if (!(p.type in peripheralGroups)) {
      peripheralGroups[p.name] = [];
    }
    peripheralGroups[p.name].push(p);
  });
  console.log('filter');
  console.log(array);

  console.log('group');
  console.log(peripheralGroups);

  return (
    _.map(Object.keys(peripheralGroups), groups => (
      <PanelGroup
        accordion
        style={{ marginBottom: '0px' }}
        key={`${cleanerNames[groups] || 'Default'}-Accordion`}
        id={`${cleanerNames[groups] || 'Default'}-Accordion`}
      >
        <Panel key={`${cleanerNames[groups] || 'Default'}-Panel`} defaultExpanded>
          <Panel.Heading>
            <Panel.Title toggle style={{ fontWeight: 'bold' }}>{cleanerNames[groups] || 'Generic'}</Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body style={{ padding: '10px' }} >
              {
                _.map(peripheralGroups[groups], peripheral => (
                  <Peripheral
                    key={String(peripheral.uid)}
                    id={String(peripheral.uid)}
                    device_name={peripheral.name}
                    device_type={peripheral.name}
                    param={peripheral.params}
                  />
                ))
              }
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </PanelGroup>
    ))
  );
};


const PeripheralListComponent = (props) => {
  console.log('peripheral list');
  let errorMsg = null;
  if (!props.connectionStatus) {
    errorMsg = 'You are currently disconnected from the robot.';
  } else if (!props.runtimeStatus) {
    errorMsg = 'There appears to be some sort of General error. ' +
      'No data is being received.';
  }

  console.log(props.peripherals);
  console.log(props.peripherals.peripheralList);

  let panelBody = null;
  if (errorMsg) {
    panelBody = <p className="panelText">{errorMsg}</p>;
  } else {
    panelBody = handleAccordion(_.sortBy(_.toArray(props.peripherals.peripheralList), ['name']));
  }

  return (
    <Panel
      id="peripherals-panel"
      bsStyle="primary"
    >
      <Panel.Heading>Peripherals</Panel.Heading>
      <Panel.Body style={{ padding: '0px' }}>
        <ListGroup>
          {panelBody}
        </ListGroup>
      </Panel.Body>
    </Panel>
  );
};

PeripheralListComponent.propTypes = {
  connectionStatus: PropTypes.bool.isRequired,
  runtimeStatus: PropTypes.bool.isRequired,
  peripherals: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  peripherals: state.peripherals,
});

const PeripheralList = connect(mapStateToProps)(PeripheralListComponent);

export default PeripheralList;
