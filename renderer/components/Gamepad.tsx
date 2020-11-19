import React, { useState } from 'react';
import {
  Modal,
  Button,
  ListGroupItem,
  Table,
} from 'react-bootstrap';
import _ from 'lodash';
import numeral from 'numeral';
import { GpState } from '../../protos/protos';

interface OwnProps {
  gamepad: GpState;
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
      
        for (let i = 0; i < 32; i++) {
          gamepadButtons.push(numeral(props.gamepad.buttons | (1 << i)).format('0'));
        }
    
        return {
          axes: _.map(props.gamepad.axes, (axis: number) => numeral(axis).format('0.00000')),
          buttons: gamepadButtons
        };
    }

    const renderHeader = () => {
        return (
          <div>
            <h4 style={{ display: 'inline' }}> Gamepad {props.index} </h4>
          </div>
        );
      }
      const { gamepad } = props;
  
    if (!gamepad) {
        return (<div />);
    }

    const values = roundedValues();

    return (
        <ListGroupItem>
          <div style={{ overflow: 'auto', width: '100%' }}>
            <span style={{ float: 'left' }}>{renderHeader()}</span>
            <Button type="button" bsSize="small" onClick={ () => setModal(true) } style={{ float: 'right' }}>
              Details
            </Button>
          </div>
          <Modal show={ showModal } onHide={ () => setModal(false) }>
            <Modal.Header closeButton>
              <Modal.Title>{renderHeader()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img alt="gamepad" src="graphics/gamepad.png" style={{ width: '100%' }} />
              <Table bordered>
                <tbody>
                  <tr>
                    <th>Button</th>
                    {_.range(NUM_GAMEPAD_BUTTONS).map((gamepadButtonNumber: number) => <td>{gamepadButtonNumber}</td>)}
                  </tr>
                  <tr>
                    <th>Value</th>
                    {_.range(NUM_GAMEPAD_BUTTONS).map((gamepadButtonNumber: number) => <td>{values.buttons[gamepadButtonNumber]}</td>)}
                  </tr>
                </tbody>
              </Table>
              <Table bordered>
                <tbody>
                  <tr>
                    <th>Axis</th>
                    {_.range(NUM_GAMEPAD_AXES).map((gamepadButtonAxis: number) => <td>{gamepadButtonAxis}</td>)}
  
                  </tr>
                  <tr>
                    <th>Value</th>
                    {_.range(NUM_GAMEPAD_AXES).map((gamepadButtonAxis: number) => <td>{values.buttons[gamepadButtonAxis]}</td>)}
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
          </Modal>
        </ListGroupItem>
    );
}

    
    
