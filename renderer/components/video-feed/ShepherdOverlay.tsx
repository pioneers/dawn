import parse from 'html-react-parser';
import './scoreboard';
import '../../../static/video-feed/scoreboard.css';

const shepherdScoreHtml = require('../../../static/video-feed/scoreboard.html');

export const ShepherdOverlay = () => {
  return (
    parse(shepherdScoreHtml)
  );
};
