import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Gamepad } from './Gamepad';
import { Input } from '../../protos/protos';
import { useStores } from '../hooks';
import { Observer } from 'mobx-react';

interface StateProps {
  gamepads: Input[] | undefined;
  globalTheme: string;
}

type Props = StateProps;

const GamepadListComponent = (props: Props) => {
  const {settings} = useStores();
  
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
    <Observer>{() =>
    <Card
      bg={settings.globalTheme === 'dark' ? 'dark' : 'light'}
      text={settings.globalTheme === 'dark' ? 'light' : 'dark'}
      className="mb-4"
      //border="primary"
      id="gamepads-panel"
    >
      <Card.Header>Gamepads</Card.Header>
      <Card.Body style={{ padding: '0px' }}>
        <ListGroup style={{ marginBottom: '5px' }}>
          {interior}
        </ListGroup>
      </Card.Body>
    </Card>}</Observer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  gamepads: state.gamepads.gamepads,
  globalTheme: state.settings.globalTheme,
});

export const GamepadList = connect(mapStateToProps)(GamepadListComponent);

