import React from 'react';
import {
  Button,
  // Glyphicon,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { Placement } from 'react-overlays/usePopper';

interface StateProp{
  id: string;
  text: string;
  onClick: () => void;
  glyph: string;
  disabled: boolean;
  bsStyle?: string;
  placement?: Placement;
}

export const TooltipButton = (props: StateProp) => {
  const tooltip = (
    <Tooltip id={`tooltip-editor-button-${props.id}`}>{props.text}</Tooltip>
  );
  return (
    <OverlayTrigger placement={props.placement || 'top'} overlay={tooltip}>
      <Button
        type="button"
        variant={props.bsStyle || 'default'}
        size="sm"
        onClick={props.onClick}
        disabled={props.disabled}
        id={props.id}
      >
        {/* <Glyphicon glyph={props.glyph} /> */}
      </Button>
    </OverlayTrigger>
  );
};

