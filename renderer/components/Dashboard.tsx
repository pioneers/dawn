import React from 'react';
import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
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

//smPush={8} and smPull={4} straight up removed

export const Dashboard = (props: StateProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(1);
  const [editorWidth, setEditorWidth] = useState(11);

  const handleSidebarExpand = () => {
    if (sidebarWidth == 1) {
      setSidebarWidth(5);
      setEditorWidth(7);
    } else {
      setSidebarWidth(1);
      setEditorWidth(11);
    }
  }

  return (
    <Container fluid>
      <Row>
        {/* <Col md={{ order: 'last' }} sm={4}>
          <PeripheralList connectionStatus={props.connectionStatus} runtimeStatus={props.runtimeStatus} />
          <GamepadList />
        </Col> */}
        <Col sm={sidebarWidth}>
          <div>
            <Button onClick={handleSidebarExpand}>Toggle</Button>
          </div>
        </Col>
        <Col sm={editorWidth}>
          <EditorContainer runtimeStatus={props.runtimeStatus} />
        </Col>
      </Row>
    </Container>
  )
}

