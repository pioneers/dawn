/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { PeripheralTypes } from '../../constants/Constants';

/**
 * Boolean Sensor Component
 */
const formatBoolean = (peripheralType, peripheral) => {
  let sensorValue = peripheral.ival;
  if (sensorValue === undefined) {
    sensorValue = peripheral.bval;
  }
  if (peripheralType === PeripheralTypes.LimitSwitch) {
    return (sensorValue) ? 'Closed' : 'Open';
  }
  return sensorValue;
};

const BooleanSensor = ({
  id, device_type, param,
}) => (
  <div style={{ overflow: 'auto', width: '100%' }}>
    <h4 style={{ float: 'left' }}>
      <div>{id}</div>
    </h4>
    {
      _.map(param, obj => (
        <div key={`${obj.name}-${id}-Overall`}>
          <h4 style={{ clear: 'right', float: 'right', height: '10px' }} key={`${obj.name}-${id}`}>
            {`${obj.name}: ${formatBoolean(device_type, obj)}`}
          </h4>
        </div>
      ))
    }
  </div>
);

BooleanSensor.propTypes = {
  device_type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  param: PropTypes.array.isRequired,
};

export default BooleanSensor;
