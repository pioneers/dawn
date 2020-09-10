import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
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
  <Grid fluid>
    <Row>
      <Col smPush={8} sm={4}>
        <PeripheralList
          connectionStatus={props.connectionStatus}
          runtimeStatus={props.runtimeStatus}
        />
        <GamepadList />
      </Col>
      <Col smPull={4} sm={8}>
        <EditorContainer
          runtimeStatus={props.runtimeStatus}
          isRunningCode={props.isRunningCode}
        />
      </Col>
    </Row>
  </Grid>
);
