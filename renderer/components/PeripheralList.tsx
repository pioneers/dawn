import React from 'react';
import _ from 'lodash';
import { Card, CardGroup, ListGroup } from 'react-bootstrap';
// import { Peripheral as PeripheralComponent } from './Peripheral';
import { Peripheral, PeripheralList } from '../types';
import { connect } from 'react-redux';
import PeripheralGroup from './PeripheralGroup';
import { useStores } from '../hooks';
import { Observer } from 'mobx-react';

// const filter = new Set();

interface StateProps {
  peripheralList: PeripheralList;
  globalTheme: string;
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

  return Object.keys(peripheralGroups).map((groupName: string) => {
    const groupNameCleaned = groupName; //cleanerNames[groupName] as string;

    return (
      <CardGroup
        // accordion
        style={{ marginBottom: '0px' }}
        key={`${groupNameCleaned || 'Default'}-Accordion`}
        id={`${groupNameCleaned || 'Default'}-Accordion`}
      >
        <PeripheralGroup groupName={groupName} peripherals={peripheralGroups[groupName]}/>
      </CardGroup>
    );
  });
};

const PeripheralListComponent = (props: StateProps) => {
  const {info, settings} = useStores();

  let errorMsg = null;

  if (!info.connectionStatus) {
    errorMsg = 'You are currently disconnected from the robot.';
  } else if (!info.runtimeStatus) {
    errorMsg = 'There appears to be some sort of General error. No data is being received.';
  }

  let panelBody = null;
  if (errorMsg) {
    panelBody = <p className="panelText">{errorMsg}</p>;
  } else {
    panelBody = handleAccordion(Object.values(props.peripheralList));
  }

  return (
    <Observer>{() => 
    <Card 
      className="mb-4" 
      id="peripherals-panel" 
      bg={settings.globalTheme === 'dark' ? 'dark' : 'light'}
      text={settings.globalTheme === 'dark' ? 'light' : 'dark'}
      >
      <Card.Header>Peripherals</Card.Header>
      <Card.Body style={{ padding: '0px' }}>
        <ListGroup>{panelBody}</ListGroup>
      </Card.Body>
    </Card>}</Observer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  peripheralList: Object.assign({}, state.peripherals.peripheralList),
  globalTheme: state.settings.globalTheme,
});

const PeripheralListContainer = connect(mapStateToProps)(PeripheralListComponent);

export default PeripheralListContainer;
