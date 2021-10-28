import React, { useState } from 'react';
import { Card, Collapse } from 'react-bootstrap';
import { Peripheral as PeripheralComponent } from './Peripheral';
import { PeripheralTypes } from '../consts';
import { Peripheral } from '../types';
import _ from 'lodash';

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

interface PeripheralGroupProps {
  peripherals: Peripheral[];
  groupName: string;
  globalTheme: string;
}

const PeripheralGroup = (props: PeripheralGroupProps) => {
  const [out, setOut] = useState(false); // controls toggle

  const { peripherals, groupName } = props;
  const groupNameCleaned = groupName; //cleanerNames[groupName] as string;
  const bsTheme = props.globalTheme;

    return (
      <Card key={`${groupNameCleaned || 'Default'}-Card`} bg={bsTheme}>
        <Card.Header>
          <Card.Title onClick={() => setOut(!out)} style={{ fontWeight: 'bold'}}>
            {groupName || 'Generic'}
          </Card.Title>
        </Card.Header>
        <Collapse in={!out}>
          <Card.Body style={{ padding: '10px'}}>
            {_.map(peripherals, (peripheral: Peripheral) => (
              <PeripheralComponent
                key={peripheral.uid}
                uid={peripheral.uid}
                name={peripheral.name}
                type={peripheral.type}
                params={peripheral.params}
                background={props.globalTheme === 'dark' ? '#353a3f' : 'white'}
                color=""
              />
            ))}
          </Card.Body>
        </Collapse>
      </Card>
    )
}

export default PeripheralGroup;
