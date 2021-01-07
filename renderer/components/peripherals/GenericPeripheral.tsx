/* eslint-disable camelcase */
import React from 'react';
import _ from 'lodash';
import { Peripheral } from '../../types';
import { Param } from '../../../protos/protos';

const generateParamValue = (param: Param) => {
  let value: boolean | number | string = 0;

  switch (Param.fromObject(param).val) {
    case 'bval':
      value = param.bval;
      break;
    case 'fval':
      value = param.fval.toFixed(5);
      break;
    case 'ival':
      value = param.ival;
      break;
  }

  return String(value);
};

/**
 * Generic Peripheral for General Case
 */
export const GenericPeripheral = ({ uid, params }: Peripheral) => (
  <div style={{ overflow: 'auto', width: '100%' }}>
    <h4 style={{ float: 'left' }}>
      <div>{uid}</div>
    </h4>
    {_.map(params, (param) => (
      <div key={`${param.name}-${uid}-Overall`}>
        <h4 style={{ clear: 'right', float: 'right', height: '10px' }} key={`${param.name}-${uid}`}>
          {`${param.name}: ${generateParamValue(param)}`}
        </h4>
      </div>
    ))}
  </div>
);
