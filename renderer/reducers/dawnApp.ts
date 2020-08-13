/**
 * Combining all the reducers into one and exporting it.
 */

import { combineReducers } from 'redux';

import { asyncAlerts } from './alerts';
import { editor } from './editor';
import { console } from './console';
import { peripherals } from './peripherals';
import { info } from './info';
import { gamepads } from './gamepads';
import { settings } from './settings';
import { fieldStore } from './fieldStore';
import { timerStore  }from './timerStore';

const dawnApp = combineReducers({
  asyncAlerts,
  editor,
  fieldStore,
  console,
  peripherals,
  info,
  gamepads,
  settings,
  timerStore,
});

export default dawnApp;
