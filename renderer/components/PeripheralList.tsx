import React from 'react';
import _ from 'lodash';
import { Panel, PanelGroup, ListGroup } from 'react-bootstrap';
import { PeripheralTypes } from '../consts';
import { Peripheral as PeripheralComponent } from './Peripheral';
import { Peripheral, PeripheralList } from '../types';
import { connect } from 'react-redux';
import { Observer, observer } from 'mobx-react-lite';
import { PeripheralStore } from '../stores/peripherals';
import { isObservable, toJS } from 'mobx';
import { useRootStore } from '../stores/root';

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

const Accordion = observer(({ peripherals }: { peripherals: PeripheralList }) => {
  const peripheralGroups: { [peripheralName: string]: Peripheral[] } = {};

  // Filter and group peripherals by name (type)
  Object.values(peripherals)
    // .filter((p: Peripheral) => !filter.has(p.uid))
    .forEach((peripheral) => {
      const group: Peripheral[] = peripheralGroups[peripheral.name] ?? [];
      group.push(peripheral);
      peripheralGroups[peripheral.name] = group;
    });

  // console.log('peripheral groups', peripheralGroups);

  return (
    <ListGroup>
      {Object.keys(peripheralGroups).map((groupName: string) => {
        const groupNameCleaned = groupName; //cleanerNames[groupName] as string;

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
                  {groupName || 'Generic'}
                </Panel.Title>
              </Panel.Heading>
              <Panel.Collapse>
                <Panel.Body style={{ padding: '10px' }}>
                  {peripheralGroups[groupName].map((peripheral) => (
                    <PeripheralComponent
                      key={peripheral.uid}
                      uid={peripheral.uid}
                      name={peripheral.name}
                      type={peripheral.type}
                      params={peripheral.params}
                    />
                  ))}
                </Panel.Body>
              </Panel.Collapse>
            </Panel>
          </PanelGroup>
        );
      })}
    </ListGroup>
  );
});

// const PeripheralListComponent = (props: StateProps & OwnProps) => {
//   let errorMsg = null;

//   if (!props.connectionStatus) {
//     errorMsg = 'You are currently disconnected from the robot.';
//   } else if (!props.runtimeStatus) {
//     errorMsg = 'There appears to be some sort of General error. No data is being received.';
//   }

//   let panelBody = null;
//   if (errorMsg) {
//     panelBody = <p className="panelText">{errorMsg}</p>;
//   } else {
//     panelBody = handleAccordion(Object.values(props.peripheralList));
//   }

//   return (
//     <Panel id="peripherals-panel" bsStyle="primary">
//       <Panel.Heading>Peripherals</Panel.Heading>
//       <Panel.Body style={{ padding: '0px' }}>
//         <ListGroup>{panelBody}</ListGroup>
//       </Panel.Body>
//     </Panel>
//   );
// };

export const PeripheralListContainer = () => {
  const peripheralStore = React.useContext(PeripheralStore);
  const { peripherals } = peripheralStore;
  // panelBody = handleAccordion(Object.values(peripherals));
  const { console } = useRootStore();

  return (
    <Panel id="peripherals-panel" bsStyle="primary">
      <Panel.Heading>Peripherals</Panel.Heading>
      <Panel.Body style={{ padding: '0px' }}>
        <Observer>{() => <Accordion peripherals={peripherals.groupedPeripherals} />}</Observer>
      </Panel.Body>
    </Panel>
  );

  return (
    <Panel id="peripherals-panel" bsStyle="primary">
      <Panel.Heading>Peripherals</Panel.Heading>
      <Panel.Body style={{ padding: '0px' }}>
        <Accordion peripherals={peripherals} />
      </Panel.Body>
    </Panel>
  );
};

// const mapStateToProps = (state: ApplicationState) => ({
//   peripheralList: Object.assign({}, state.peripherals.peripheralList)
// });

// const PeripheralListContainer = connect(mapStateToProps)(PeripheralListComponent);

export default PeripheralListContainer;
