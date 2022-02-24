import React from 'react';
import { ButtonGroup, DropdownButton, Dropdown, InputGroup, FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Observer } from 'mobx-react';

import { TooltipButton } from '../TooltipButton';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../../consts';
import { useFontResizer } from '../../hooks';

const FONT_SIZES = [8, 12, 14, 16, 20, 24, 28];

export const FontSizeButtons = () => {
  const {
    onChangeFontSize,
    submittedFontSize,
    decreaseFontsize,
    increaseFontsize,
    handleChangeFontsize,
    handleOnBlurFontSize,
    handleOnKeyDownFontSize,
    submitFontSize
  } = useFontResizer();

  return (
    <>
      <InputGroup>
        <FormControl
          value={String(onChangeFontSize ?? submittedFontSize).replace(/^0/, '')}
          size="sm"
          onBlur={handleOnBlurFontSize}
          onChange={handleChangeFontsize}
          onKeyDown={handleOnKeyDownFontSize}
          style={{ width: 32, padding: 6 }}
        />
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Text Size</Tooltip>}>
          <DropdownButton as={ButtonGroup} title="" variant="small" id="choose-font-size">
            {FONT_SIZES.map((fontSize: number) => (
              <Dropdown.Item key={`font-size-${fontSize}`} className="dropdown-item" onClick={() => submitFontSize(fontSize)}>
                {fontSize}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </OverlayTrigger>
      </InputGroup>
      <ButtonGroup id="editor-settings-buttons" className="form-inline">
        <TooltipButton
          id="increase-font-size"
          text="Increase font size"
          onClick={increaseFontsize}
          icon="search-plus"
          disabled={submittedFontSize >= MAX_FONT_SIZE}
        />
        <TooltipButton
          id="decrease-font-size"
          text="Decrease font size"
          onClick={decreaseFontsize}
          icon="search-minus"
          disabled={submittedFontSize <= MIN_FONT_SIZE}
        />
      </ButtonGroup>
    </>
  );
};
