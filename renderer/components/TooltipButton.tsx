import React from 'react';
import {
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';

import { 
  findIconDefinition,
  IconLookup
} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StateProp{
  id: string;
  text: string;
  onClick: () => void;
  icon: IconLookup["iconName"];
  disabled: boolean;
  bsStyle?: string;
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
}

export const TooltipButton = (props: StateProp) => {
  // Look up definition of FA icon passed to props 
  const iconDef = findIconDefinition({ prefix: 'fas', iconName: props.glyph});

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
        <FontAwesomeIcon icon={iconDef} />
      </Button>
    </OverlayTrigger>
  );
};

