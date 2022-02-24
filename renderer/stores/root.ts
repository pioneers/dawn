import { AlertStore } from './alert';
import { ConsoleStore } from './console';
import { EditorStore } from './editor';
import { FieldStore } from './fieldStore'
import { GamepadsStore } from './gamepads';
import { InfoStore } from './info';
import { PeripheralsStore } from './peripherals';
import { SettingsStore } from './settings';
import { TimerStore } from './timer'

// Make sure store imports are in alphabetical order

class RootStore_ {
  alert: AlertStore;
  console: ConsoleStore;
  editor: EditorStore;
  fieldStore: FieldStore;
  gamepads: GamepadsStore;
  info: InfoStore;
  peripherals: PeripheralsStore;
  settings: SettingsStore;
  timer: TimerStore;

  constructor() {
    this.alert = new AlertStore(this);
    this.console = new ConsoleStore(this);
    this.editor = new EditorStore(this);
    this.fieldStore = new FieldStore(this);
    this.gamepads = new GamepadsStore(this);
    this.info = new InfoStore(this);
    this.peripherals = new PeripheralsStore(this);
    this.settings = new SettingsStore(this);
    this.timer = new TimerStore(this);

    /** Initialize more stores here (try to keep it in alphabetical order) */
  }
}

export const RootStore = new RootStore_();
