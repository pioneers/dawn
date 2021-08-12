import { ChangeEvent, FocusEvent, KeyboardEvent,useEffect, useState } from 'react';
import storage from 'electron-json-storage';
import _ from 'lodash';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../../consts';
import { logging } from '../../utils/utils';

export const useFontResizer = (defaultFontSize = 14) => {
  const [onChangeFontSize, setOnChangeFontSize] = useState<number | undefined>(undefined);
  const [submittedFontSize, setSubmittedFontSize] = useState<number>(defaultFontSize);

  // Get editor font size from local storage by default
  useEffect(() => {
    storage.get('editorFontSize', (err: any, data: { editorFontSize?: number }) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data) && data.editorFontSize !== undefined) {
        setSubmittedFontSize(data.editorFontSize);
      }
    });
  }, []);

  const changeFontSize = (fontSize: number) => {
    setOnChangeFontSize(fontSize);
  };

  const decreaseFontsize = () => {
    setSubmittedFontSize(submittedFontSize - 1);
  };

  const increaseFontsize = () => {
    setSubmittedFontSize(submittedFontSize + 1);
  };

  const handleChangeFontsize = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    changeFontSize(Number(event.target.value));
  };

  const handleOnBlurFontSize = (event: FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    const fontSize = Number(event.target.value);
    setOnChangeFontSize(undefined);
    submitFontSize(fontSize);
  };

  const handleOnKeyDownFontSize = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const fontSize = Number(event.currentTarget.value);
      setOnChangeFontSize(undefined);
      submitFontSize(fontSize);
    }
  };

  const submitFontSize = (fontSize: number) => {
    setSubmittedFontSize(Math.max(MIN_FONT_SIZE, Math.min(fontSize, MAX_FONT_SIZE)));
    storage.set('editorFontSize', { editorFontSize: fontSize }, (err: any) => {
      if (err) logging.log(err);
    });
  };

  return {
    onChangeFontSize,
    submittedFontSize,
    changeFontSize,
    decreaseFontsize,
    increaseFontsize,
    handleChangeFontsize,
    handleOnBlurFontSize,
    handleOnKeyDownFontSize
  };
};
