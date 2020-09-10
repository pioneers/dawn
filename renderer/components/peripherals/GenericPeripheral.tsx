/* eslint-disable camelcase */
import React from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import { Device } from '../../../protos/protos';

/**
 * Generic Peripheral for General Case
 */
export const GenericPeripheral = ({
  uid, params,
}: Device) => (
  <div style={{ overflow: 'auto', width: '100%' }}>
    <h4 style={{ float: 'left' }}>
      <div>{uid}</div>
    </h4>
    {
      _.map(params, obj => (
        <div key={`${obj.name}-${uid}-Overall`}>
          <h4 style={{ clear: 'right', float: 'right', height: '10px' }} key={`${obj.name}-${uid}`} >
            {`${obj.name}: ${numeral(obj.ival || obj.fval).format('+0.00')}`}
          </h4>
        </div>
      ))
    }
  </div>
);

