import React from 'react';
import _ from 'lodash';
import { Card, CardGroup, ListGroup } from 'react-bootstrap';
// import { Peripheral as PeripheralComponent } from './Peripheral';
import { Peripheral, PeripheralList } from '../types';
import { connect } from 'react-redux';
import PeripheralGroup from './PeripheralGroup';

// const filter = new Set();

interface OwnProps {
  connectionStatus: boolean;
  runtimeStatus: boolean;
}

interface StateProps {
  peripheralList: PeripheralList;
  globalTheme: string;
}

const handleAccordion = (devices: Peripheral[], globalTheme: string) => {
  const peripheralGroups: { [peripheralName: string]: Peripheral[] } = {};

  // Filter and group peripherals by name (type)
  devices
    // .filter((p: Peripheral) => !filter.has(p.uid))
    .forEach((peripheral) => {
      const group: Peripheral[] = peripheralGroups[peripheral.name] ?? [];
      group.push(peripheral);
      peripheralGroups[peripheral.name] = group;
    });

  return Object.keys(peripheralGroups).map((groupName: string) => {
    const groupNameCleaned = groupName; //cleanerNames[groupName] as string;

    return (
      <CardGroup
        // accordion
        style={{ marginBottom: '0px' }}
        key={`${groupNameCleaned || 'Default'}-Accordion`}
        id={`${groupNameCleaned || 'Default'}-Accordion`}
      >
        <PeripheralGroup groupName={groupName} peripherals={peripheralGroups[groupName]} globalTheme={globalTheme} />
      </CardGroup>
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
    panelBody = handleAccordion(Object.values(props.peripheralList), props.globalTheme);
  }

  return (
    <Card 
      className="mb-4" 
      id="peripherals-panel" 
      bg={props.globalTheme === 'dark' ? 'dark' : 'light'}
      text={props.globalTheme === 'dark' ? 'light' : 'dark'}
	  style={props.globalTheme === 'dark' ? { border: "1px solid white" } : {}}
      >
      <Card.Header style={props.globalTheme === 'dark' ? {borderBottom: '1px solid white'} : {}}>Peripherals</Card.Header>
      <Card.Body style={{ padding: '0px' }}>
        <ListGroup>{panelBody}</ListGroup>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  peripheralList: Object.assign({}, state.peripherals.peripheralList),
  globalTheme: state.settings.globalTheme,
});

const PeripheralListContainer = connect(mapStateToProps)(PeripheralListComponent);

export default PeripheralListContainer;
