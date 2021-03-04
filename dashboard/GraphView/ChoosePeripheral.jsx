import React from "react";
import { Dropdown, SplitButton, ButtonToolbar } from "react-bootstrap";

export const ChoosePeripheral = (props) => {
  return (
    <div>
      <ButtonToolbar>
        <SplitButton
          bsStyle={props.title.toLowerCase()}
          title={props.title}
          id={`split-button-basic`}
        >
          <Dropdown.Item eventKey="1">Velocity</Dropdown.Item>
          <Dropdown.Item eventKey="2">DC</Dropdown.Item>
          <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
        </SplitButton>
      </ButtonToolbar>
    </div>
  );
};
