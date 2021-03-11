import React from "react";
import { SplitButton, ButtonToolbar, MenuItem } from "react-bootstrap";

type Props = {
  title: string
}
export const ChoosePeripheral = (props: Props) => {
  return (
    <div>
      <ButtonToolbar>
        <SplitButton
          bsStyle={props.title.toLowerCase()}
          title={props.title}
          id={`split-button-basic`}
        >
          <MenuItem eventKey="1">Velocity</MenuItem>
          <MenuItem eventKey="2">DC</MenuItem>
          <MenuItem eventKey="3">Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4">Separated link</MenuItem>
        </SplitButton>
      </ButtonToolbar>
    </div>
  );
};
