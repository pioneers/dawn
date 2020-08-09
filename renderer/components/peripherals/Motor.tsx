/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import numeral from 'numeral';
import { ProgressBar } from 'react-bootstrap';

/**
 *  Motor Component
 */

const Motor = ({ id, param }) => (
  <div style={{ overflow: 'auto', width: '100%' }}>
    <h4 style={{ float: 'left' }}>
      <div>{id}</div>
      <small>Motor</small>
    </h4>
    {
      _.map(param, obj => ( // TODO: Figure out if a ProgressBar is useful
        <div key={`${obj.name}-${id}-Overall`}>
          <h4 style={{ clear: 'right', float: 'right', height: '50px' }} key={`${obj.name}-${id}`}>
            {`${obj.name}: ${numeral(obj.fval).format('+0.00')}`}

          </h4>
          <ProgressBar style={{ clear: 'right', height: '20px' }} now={obj.fval} min={-100} />
        </div>
      ))
    }
  </div>
);

Motor.propTypes = {
  id: PropTypes.string.isRequired,
  param: PropTypes.array.isRequired,
};

export default Motor;
