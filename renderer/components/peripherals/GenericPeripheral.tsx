import React from 'react';
import _ from 'lodash';
import { Peripheral } from '../../types';
import { Param } from '../../../protos/protos';

interface ParamComponentProps {
  uid: string;
  param: Param;
}

const getParamValue = (param: Param) => {
  const precisionLimit = 5;
  // By default, the val property that should be in the `param` argument isn't defined even though it is typecasted to Param.
  // To fix this, we explicity run Param.fromObject with the `param` argument.
  const paramVal = Param.fromObject(param).val;
  let value: boolean | number | string;

  switch (paramVal) {
    case 'bval':
      value = Boolean(param.bval);
      break;
    case 'fval':
      value = param.fval.toPrecision(precisionLimit);
      break;
    case 'ival':
      value = param.ival;
      break;
    default:
      value = 0;
  }

  return String(value);
};

/**
 * Param component that memoizes the display of a param value and will only rerender if the underlying data is different.
 */
const ParamComponent = React.memo(
  (props: ParamComponentProps) => (
    <div key={`${props.param.name}-${props.uid}-Overall`}>
      <h4 style={{ clear: 'right', float: 'right', height: '10px' }} key={`${props.param.name}-${props.uid}`}>
        {`${props.param.name}: ${getParamValue(props.param)}`}
      </h4>
    </div>
  ),
  (prevProps, nextProps) => _.isEqual(prevProps, nextProps)
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
