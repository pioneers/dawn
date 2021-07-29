import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import storage from 'electron-json-storage';
import _ from 'lodash';
import { logging } from '../../utils/utils';

export const useFontResizer = (defaultFontSize = 14) => {
  const [fontSize, setFontSize] = useState(defaultFontSize);

  // Get editor font size from local storage by default
  useEffect(() => {
    storage.get('editorFontSize', (err: any, data: { editorFontSize?: number }) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data) && data.editorFontSize !== undefined) {
        setFontSize(data.editorFontSize);
      }
    });
  }, []);

  useEffect(() => {
    storage.set('editorFontSize', { editorFontSize: fontSize }, (err: any) => {
      if (err) logging.log(err);
    });
  }, [fontSize]);

  const changeFontSize = (fontSize: number) => {
    setFontSize(fontSize);
  };

  const decreaseFontsize = () => {
    changeFontSize(fontSize - 1);
  };

  const increaseFontsize = () => {
    changeFontSize(fontSize + 1);
  };

  const handleChangeFontsize = (event: ChangeEvent<HTMLInputElement>) => {
    changeFontSize(Number(event.target.value));
  };

  const handleSubmitFontsize = (event: FormEvent<HTMLFormElement>) => {
    changeFontSize(Number(fontSize));
    event.preventDefault();
  };

  return { currentFontSize: fontSize, decreaseFontsize, increaseFontsize, handleChangeFontsize, changeFontSize, handleSubmitFontsize };
};
