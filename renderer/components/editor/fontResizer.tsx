import { useEffect, useState } from 'react';
import storage from 'electron-json-storage';
import _ from 'lodash';
import { logging } from '../../utils/utils';

export const useFontResizer = (defaultFontSize = 14) => {
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

  useEffect(() => {
    storage.set('editorFontSize', { editorFontSize: fontSize }, (err: any) => {
      if (err) logging.log(err);
    });
    console.log('saved font size', fontSize, 'to local storage');
  }, [fontSize]);

  const changeFontSize = (fontSize: number) => {
    if (fontSize > 28) {
      fontSize = 28;
    }
    if (fontSize < 8) {
      fontSize = 8;
    }
    setFontSize(fontSize);
  };

  const decreaseFontsize = () => {
    changeFontSize(fontSize - 1);
  };

  const increaseFontsize = () => {
    changeFontSize(fontSize + 1);
  };

  const handleChangeFontsize = (event: any) => {
    changeFontSize(event.target.value);
  };

  const handleSubmitFontsize = (event: any) => {
    changeFontSize(Number(fontSize));
    event.preventDefault();
  };

  return { fontSize, decreaseFontsize, increaseFontsize, handleChangeFontsize, changeFontSize, handleSubmitFontsize };
};
