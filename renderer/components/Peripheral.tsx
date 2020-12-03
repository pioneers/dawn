import React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { PeripheralTypes } from '../consts';
import { BooleanSensor } from './peripherals/BooleanSensor';
import { GenericPeripheral } from './peripherals/GenericPeripheral';
import { GameValues } from './peripherals/GameValues';
import { Motor } from './peripherals/Motor';
import { Param } from '../../protos/protos';

// Mapping between peripheral types and components
const typesToComponents: Record<string, JSX.Element> = {
  [PeripheralTypes.MOTOR_SCALAR]: Motor,
  
};
typesToComponents[PeripheralTypes.MOTOR_SCALAR] = Motor;
typesToComponents[PeripheralTypes.SENSOR_BOOLEAN] = BooleanSensor;
typesToComponents[PeripheralTypes.LimitSwitch] = BooleanSensor;
typesToComponents[PeripheralTypes.GameValues] = GameValues;

interface OwnProps {
  key: string;
  uid: string;
  name: string;
  type: string;
  params: Param[];
}

/**
 * Outer Component for Individual Peripherals
 *
 * Sets common interface for type-specific components
 * Wraps such components in ListGroupItem for PeripheralList.js
 */
export const Peripheral = (props: OwnProps) => {
  const ActualPeripheral = typesToComponents[props.type] || GenericPeripheral;

  return (
    <ListGroupItem style={{ padding: '0px 0px 15px 0px', border: 'none' }}>
      <ActualPeripheral {...props} />
    </ListGroupItem>
  );
};
