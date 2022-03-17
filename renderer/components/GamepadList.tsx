import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Gamepad } from './Gamepad';
import { Input } from '../../protos-main';

interface StateProps {
  gamepads: Input[] | undefined;
  globalTheme: string;
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
      bg={props.globalTheme === 'dark' ? 'dark' : 'light'}
      text={props.globalTheme === 'dark' ? 'light' : 'dark'}
      className="mb-4"
      id="gamepads-panel"
	  style={props.globalTheme === 'dark' ? { border: "1px solid white" } : {}}
    >
      <Card.Header style={props.globalTheme === 'dark' ? {borderBottom: '1px solid white'} : {}}>Gamepads</Card.Header>
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
  globalTheme: state.settings.globalTheme,
});

export const GamepadList = connect(mapStateToProps)(GamepadListComponent);

