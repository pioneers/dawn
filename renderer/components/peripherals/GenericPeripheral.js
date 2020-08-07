/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import numeral from 'numeral';

/**
 * Generic Peripheral for General Case
 */
const GenericPeripheral = ({
  id, param,
}) => (
  <div style={{ overflow: 'auto', width: '100%' }}>
    <h4 style={{ float: 'left' }}>
      <div>{id}</div>
    </h4>
    {
      _.map(param, obj => (
        <div key={`${obj.name}-${id}-Overall`}>
          <h4 style={{ clear: 'right', float: 'right', height: '10px' }} key={`${obj.name}-${id}`} >
            {`${obj.name}: ${numeral(obj.ival || obj.fval).format('+0.00')}`}
          </h4>
        </div>
      ))
    }
  </div>
);

GenericPeripheral.propTypes = {
  id: PropTypes.string.isRequired,
  param: PropTypes.array.isRequired,
};

export default GenericPeripheral;
