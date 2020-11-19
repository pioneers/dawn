import React from 'react';
import { Panel, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Gamepad } from './Gamepad';
import { GpState } from '../../protos/protos';

interface StateProps {
  gamepads: GpState[] | undefined;
}

type Props = StateProps;

const GamepadListComponent = (props: Props) => {
  let interior;
  if (_.some(props.gamepads, (gamepad: GpState) => gamepad !== undefined)) {
    interior = _.map(props.gamepads, (gamepad: GpState, index: string) => (
      <Gamepad key={index} index={parseInt(index, 10)} gamepad={gamepad} />
    ));
  } else {
    interior = (
      <p className="panelText">There doesn&apos;t seem to be any gamepads connected. Connect a gamepad and press any button on it.</p>
    );
  }
  return (
    <Panel bsStyle="primary" id="gamepads-panel">
      <Panel.Heading>Gamepads</Panel.Heading>
      <Panel.Body style={{ padding: '0px' }}>
        <ListGroup style={{ marginBottom: '5px' }}>{interior}</ListGroup>
      </Panel.Body>
    </Panel>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  gamepads: state.gamepads.gamepads,
});

export const GamepadList = connect(mapStateToProps)(GamepadListComponent);
