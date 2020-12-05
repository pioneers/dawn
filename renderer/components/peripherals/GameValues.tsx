/* eslint-disable camelcase */
import React from 'react';
import _ from 'lodash';
import { Peripheral } from '../../types';

/**
 * Generic Peripheral for General Case
 */
export const GameValues = ({ name, params }: Peripheral) => (
  <div style={{ overflow: 'auto', width: '100%' }}>
    <h4 style={{ float: 'left' }}>
      <div>{name}</div>
    </h4>
    {_.map(params, (obj) => (
      <div key={`${obj.name}-${name}-Overall`}>
        <h4 style={{ clear: 'right', float: 'right', height: '10px' }} key={`${obj.name}-${name}`}>
          {obj.ival}
        </h4>
      </div>
    ))}
  </div>
);

GameValues.defaultProps = {
  device_name: 'Unknown Device'
};
