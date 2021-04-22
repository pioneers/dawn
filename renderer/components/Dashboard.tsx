import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Step } from 'react-joyride';
import PeripheralList from './PeripheralList';
import { GamepadList } from './GamepadList';
import { EditorContainer } from './EditorContainer';

interface StateProps {
  addSteps: (steps: Array<Step>) => void;
  connectionStatus: boolean;
  runtimeStatus: boolean;
  isRunningCode: boolean; // Currently not provided by runtime, and not used in Editor
}

//previously xs="auto" was smPush={8} and smPull={4}

export const Dashboard = (props: StateProps) => (
  <Container fluid>
    <Row>
      <Col xs="auto" sm={4}>
        <PeripheralList connectionStatus={props.connectionStatus} runtimeStatus={props.runtimeStatus} />
        <GamepadList />
      </Col>
      <Col xs="auto" sm={8}>
        <EditorContainer runtimeStatus={props.runtimeStatus} />
      </Col>
    </Row>
  </Container>
);
