import { useEffect, useState } from 'react';
import storage from 'electron-json-storage';
import _ from 'lodash';
import { logging } from '../../utils/utils';

export const useFontSizer = (defaultFontSize = 14) => {
  const [fontSize, setFontSize] = useState(defaultFontSize);

  useEffect(() => {
    storage.get('editorFontSize', (err: any, data: { editorFontSize?: number }) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data) && data.editorFontSize !== undefined) {
        setFontSize(data.editorFontSize);
      }
    });
  }, []);

  const decreaseFontsize = () => {
    setFontSize(fontSize - 1);
    storage.set('editorFontSize', { editorFontSize: fontSize - 1 }, (err: any) => {
      if (err) logging.log(err);
    });
  };

  const increaseFontsize = () => {
    setFontSize(fontSize + 1);
    storage.set('editorFontSize', { editorFontSize: fontSize + 1 }, (err: any) => {
      if (err) logging.log(err);
    });
  };

  const handleChangeFontsize = (event: any) => {
    setFontSize(event.target.value);
  };

  const changeFontsizeToFont = (fontSize: number) => {
    if (fontSize > 28) {
      fontSize = 28;
    }
    if (fontSize < 8) {
      fontSize = 8;
    }
    setFontSize(fontSize);
    storage.set('editorFontSize', { editorFontSize: fontSize }, (err: any) => {
      if (err) logging.log(err);
    });
  };

  const handleSubmitFontsize = (event: any) => {
    changeFontsizeToFont(Number(fontSize));
    event.preventDefault();
  };

  return { decreaseFontsize, increaseFontsize, handleChangeFontsize, changeFontsizeToFont, handleSubmitFontsize };
};
