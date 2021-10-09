/* eslint-disable camelcase */
import React from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import { ProgressBar } from 'react-bootstrap';
import { Device } from '../../../protos-main';

/**
 *  Motor Component
 */

export const Motor = ({ uid, params }: Device) => (
  <div style={{ overflow: 'auto', width: '100%' }}>
    <h4 style={{ float: 'left' }}>
      <div>{uid}</div>
      <small>Motor</small>
    </h4>
    {
      _.map(params, obj => ( // TODO: Figure out if a ProgressBar is useful
        <div key={`${obj.name}-${uid}-Overall`}>
          <h4 style={{ clear: 'right', float: 'right'}} key={`${obj.name}-${uid}`}>
            {`${obj.name}: ${numeral(obj.fval).format('+0.00')}`}

          </h4>
          <ProgressBar style={{ clear: 'right', height: '20px' }} now={obj.fval ?? 0} min={-100} />
        </div>
      ))
    }
  </div>
);
