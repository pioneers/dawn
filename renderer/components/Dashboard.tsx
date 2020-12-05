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
  isRunningCode: boolean;
}

export const Dashboard = (props: StateProps) => (
  <Container fluid>
    <Row>
    <Col sm={{ span: 8, order: 'first'}}>
        <EditorContainer
          runtimeStatus={props.runtimeStatus}
          isRunningCode={props.isRunningCode}
        />
      </Col>
      <Col sm={{ span: 4, order: 'last' }}>
        <PeripheralList
          connectionStatus={props.connectionStatus}
          runtimeStatus={props.runtimeStatus}
        />
        <GamepadList />
      </Col>
    </Row>
  </Container>
);
