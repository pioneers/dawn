import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Gamepad } from './Gamepad';
import { Input } from '../../protos/protos';

interface StateProps {
  gamepads: Input[] | undefined;
}

type Props = StateProps;

const GamepadListComponent = (props: Props) => {
  let interior;
  if (_.some(props.gamepads, (gamepad: Input) => gamepad !== undefined)) {
    interior = _.map(
      props.gamepads,
      (gamepad: Input, index: string) => <Gamepad key={index} index={parseInt(index, 10)} gamepad={gamepad} />,
    );
  } else {
    interior = (
      <p className="panelText">
        There doesn&apos;t seem to be any gamepads connected.
        Connect a gamepad and press any button on it.
      </p>
    );
  }
  return (
    <Card
      className="mb-4"
      border="primary"
      id="gamepads-panel"
    >
      <Card.Header>Gamepads</Card.Header>
      <Card.Body style={{ padding: '0px' }}>
        <ListGroup style={{ marginBottom: '5px' }}>
          {interior}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  gamepads: state.gamepads.gamepads,
});

export const GamepadList = connect(mapStateToProps)(GamepadListComponent);

