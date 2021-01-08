/* eslint-disable camelcase */
import React from 'react';
import _ from 'lodash';
import { Peripheral } from '../../types';
import { Param } from '../../../protos/protos';

interface ParamComponentProps {
  uid: string;
  param: Param;
}

const generateParamValue = (param: Param) => {
  const precisionLimit = 5;
  let value: boolean | number | string = 0;

  switch (Param.fromObject(param).val) {
    case 'bval':
      value = Boolean(param.bval);
      break;
    case 'fval':
      value = param.fval.toPrecision(precisionLimit);
      break;
    case 'ival':
      value = param.ival;
      break;
  }

  return String(value);
};

const ParamComponent = React.memo(
  (props: ParamComponentProps) => (
    <div key={`${props.param.name}-${props.uid}-Overall`}>
      <h4 style={{ clear: 'right', float: 'right', height: '10px' }} key={`${props.param.name}-${props.uid}`}>
        {`${props.param.name}: ${generateParamValue(props.param)}`}
      </h4>
    </div>
  ),
  (oldProps, newProps) => _.isEqual(oldProps, newProps)
);

/**
 * Generic Peripheral for General Case
 */
export const GenericPeripheral = ({ uid, params }: Peripheral) => (
  <div style={{ overflow: 'auto', width: '100%' }}>
    <h4 style={{ float: 'left' }}>
      <div>{uid}</div>
    </h4>
    {_.map(params, (param) => (
      <ParamComponent key={`${param.name}-${uid}-Overall`} uid={uid} param={param} />
    ))}
  </div>
);
