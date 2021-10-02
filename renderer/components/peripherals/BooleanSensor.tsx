/* eslint-disable camelcase */
import React from 'react';
import _ from 'lodash';
import { PeripheralTypes } from '../../consts';
import { Param, Device } from '../../../protos-main';

/**
 * Boolean Sensor Component
 */
const formatBoolean = (peripheralType: any, peripheral: Param) => {
  let sensorValue: boolean | number | null | undefined = peripheral.ival;
  if (sensorValue === undefined) {
    sensorValue = peripheral.bval;
  }
  if (peripheralType === PeripheralTypes.LimitSwitch) {
    return (sensorValue) ? 'Closed' : 'Open';
  }
  return sensorValue;
};

export const BooleanSensor = ({
  uid,
  type,
  params,
}: Device) => (
  <div style={{ overflow: 'auto', width: '100%' }}>
    <h4 style={{ float: 'left' }}>
      <div>{uid}</div>
    </h4>
    {
      _.map(params, obj => (
        <div key={`${obj.name}-${uid}-Overall`}>
          <h4 style={{ clear: 'right', float: 'right', height: '10px' }} key={`${obj.name}-${uid}`}>
            {`${obj.name}: ${formatBoolean(type, obj)}`}
          </h4>
        </div>
      ))
    }
  </div>
);

