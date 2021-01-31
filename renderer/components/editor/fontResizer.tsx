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

  const decreaseFontsize = () => {
    setFontSize(fontSize - 1);
    console.log('decreased font size to', fontSize);
  };

  const increaseFontsize = () => {
    setFontSize(fontSize + 1);
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
  };

  const handleSubmitFontsize = (event: any) => {
    changeFontsizeToFont(Number(fontSize));
    event.preventDefault();
  };

  console.log('font size', fontSize);

  return { fontSize, decreaseFontsize, increaseFontsize, handleChangeFontsize, changeFontsizeToFont, handleSubmitFontsize };
};
