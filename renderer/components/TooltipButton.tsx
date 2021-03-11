import React from 'react';
import {
  Button,
  Glyphicon,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';

interface StateProp{
  id: string;
  text: string;
  onClick: React.MouseEventHandler<Button>;
  glyph: string;
  disabled: boolean;
  bsStyle?: string;
  placement?: string;
}

export const TooltipButton = (props: StateProp) => {
  const tooltip = (
    <Tooltip id={`tooltip-editor-button-${props.id}`}>{props.text}</Tooltip>
  );
  return (
    <OverlayTrigger placement={props.placement || 'top'} overlay={tooltip}>
      <Button
        type="button"
        bsStyle={props.bsStyle || 'default'}
        bsSize="small"
        onClick={props.onClick}
        disabled={props.disabled}
        id={props.id}
      >
        <Glyphicon glyph={props.glyph} />
      </Button>
    </OverlayTrigger>
  );
};

