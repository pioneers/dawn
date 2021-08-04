import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Step } from 'react-joyride';
import PeripheralList from './PeripheralList';
import { GamepadList } from './GamepadList';
import { EditorContainer } from './EditorContainer';
import { useStores } from '../hooks';
import { Observer } from 'mobx-react';

interface StateProps {
  addSteps: (steps: Array<Step>) => void;
  isRunningCode: boolean; // Currently not provided by runtime, and not used in Editor
}

//smPush={8} and smPull={4} straight up removed

export const Dashboard = (props: StateProps) => {

  const {info} = useStores();

  return(
    <Observer>{()=>
  <Container fluid>
    <Row>
      <Col md={{ order: 'last' }} sm={4}>
        <PeripheralList connectionStatus={info.connectionStatus} runtimeStatus={info.runtimeStatus}/>
        <GamepadList />
      </Col>
      <Col sm={8}>
        <EditorContainer runtimeStatus={info.runtimeStatus} />
      </Col>
    </Row>
  </Container>}</Observer>
  )
};

