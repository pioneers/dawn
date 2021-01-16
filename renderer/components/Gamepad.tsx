import React from 'react';
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

interface State {
  showModal: boolean;
}

const NUM_GAMEPAD_BUTTONS = 17;
const NUM_GAMEPAD_AXES = 4;

export class Gamepad extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showModal: false };
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  openModal = () => {
    this.setState({ showModal: true });
  }

  roundedValues = () => {
    const gamepadButtons: string[] = [];

    for (let i = 0; i < 32; i++) {
      gamepadButtons.push(numeral((this.props.gamepad.buttons & (1 << i)) >> i).format('0'));
    }

    return {
      axes: this.props.gamepad.axes.map((axis: number) => numeral(axis).format('0.00000')),
      buttons: gamepadButtons
    };
  };

  renderHeader = () => {
    return (
      <div>
        <h4 style={{ display: 'inline' }}> Gamepad {this.props.index} </h4>
      </div>
    );
  }

  render() {
    const { gamepad } = this.props;
    const { showModal } = this.state;

    if (!gamepad) {
      return <></>;
    }
    const values = this.roundedValues();
    return (
      <ListGroupItem>
        <div style={{ overflow: 'auto', width: '100%' }}>
          <span style={{ float: 'left' }}>{this.renderHeader()}</span>
          <Button type="button" bsSize="small" onClick={this.openModal} style={{ float: 'right' }}>
            Details
          </Button>
        </div>
        <Modal show={showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.renderHeader()}</Modal.Title>
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
                  {_.range(NUM_GAMEPAD_AXES).map((gamepadButtonAxis: number) => <td>{values.axes[gamepadButtonAxis]}</td>)}
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
        </Modal>
      </ListGroupItem>
    );
  }
};
