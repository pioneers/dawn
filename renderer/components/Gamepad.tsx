import React, { useState } from 'react';
import { Modal, Button, ListGroupItem, Table } from 'react-bootstrap';
import _ from 'lodash';
import numeral from 'numeral';
import { Input } from '../../protos/protos';

interface OwnProps {
  gamepad: Input;
  index: number;
}

type Props = OwnProps;

const NUM_GAMEPAD_BUTTONS = 17;
const NUM_GAMEPAD_AXES = 4;

/**
 * Each individual gamepad that is connected
 */
export const Gamepad = (props: Props) => {
  const [showModal, setModal] = useState(false);

  const roundedValues = () => {
    const gamepadButtons: string[] = [];

    for (let i = 0; i < NUM_GAMEPAD_BUTTONS; i++) {
      gamepadButtons.push(numeral((Number(props.gamepad.buttons) & (1 << i)) >> i).format('0'));
    }

    return {
      axes: props.gamepad.axes.map((axis: number) => numeral(axis).format('0.00000')),
      buttons: gamepadButtons
    };
  };

  const renderHeader = () => {
    return (
      <div>
        <h4 style={{ display: 'inline' }}> Gamepad {props.index} </h4>
      </div>
    );
  };
  const { gamepad } = props;

  if (!gamepad) {
    return <div />;
  }

  const values = roundedValues();

  return (
    <ListGroupItem>
      <div style={{ overflow: 'auto', width: '100%' }}>
        <span style={{ float: 'left' }}>{renderHeader()}</span>
        <Button type="button" size="sm" onClick={() => setModal(true)} style={{ float: 'right' }}>
          Details
        </Button>
      </div>
      <Modal show={showModal} onHide={() => setModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{renderHeader()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img alt="gamepad" src="graphics/gamepad.png" style={{ width: '100%' }} />
          <Table bordered>
            <tbody>
              <tr>
                <th>Button</th>
                {_.range(NUM_GAMEPAD_BUTTONS).map((gamepadButtonNumber: number) => (
                  <td>{gamepadButtonNumber}</td>
                ))}
              </tr>
              <tr>
                <th>Value</th>
                {_.range(NUM_GAMEPAD_BUTTONS).map((gamepadButtonNumber: number) => (
                  <td>{values.buttons[gamepadButtonNumber]}</td>
                ))}
              </tr>
            </tbody>
          </Table>
          <Table bordered>
            <tbody>
              <tr>
                <th>Axis</th>
                {_.range(NUM_GAMEPAD_AXES).map((gamepadButtonAxis: number) => (
                  <td>{gamepadButtonAxis}</td>
                ))}
              </tr>
              <tr>
                <th>Value</th>
                {_.range(NUM_GAMEPAD_AXES).map((gamepadButtonAxis: number) => (
                  <td>{values.axes[gamepadButtonAxis]}</td>
                ))}
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </ListGroupItem>
  );
};
