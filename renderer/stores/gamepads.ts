import { makeAutoObservable } from 'mobx';
import { RootStore } from './root';
import { Input, Source } from '../../protos/protos';
import _ from 'lodash';
import { ipcRenderer } from 'electron';
import { logging } from '../utils/utils';

export class GamepadsStore {
  rootStore: typeof RootStore;

  gamepads?: Input[];

  constructor(rootStore: typeof RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  updateGamepads(newGamepads: Input[]) {
	this.gamepads = newGamepads;
  }

  _needToUpdate = (newGamepads: (Gamepad | null)[]): boolean => {
    const _timestamps: Array<number | null> = [0, 0, 0, 0];

    return _.some(newGamepads, (gamepad, index) => {
      if (gamepad != null && (gamepad.timestamp > (_timestamps[index] ?? 0))) {
        _timestamps[index] = gamepad.timestamp;
        return true;
      } else if (gamepad == null && _timestamps[index] != null) {
        _timestamps[index] = null;
        return true;
      }
      return false;
    });
  }

  runtimeGamepads = () => {
    let timestamp = Date.now();

    if (!this.rootStore.editor.isKeyboardModeToggled) {
      while (true) {
        // navigator.getGamepads always returns a reference to the same object. This
        // confuses redux, so we use assignIn to clone to a new object each time.
        const newGamepads = navigator.getGamepads();
        if (this._needToUpdate(newGamepads) || Date.now() - timestamp > 100) {
          const formattedGamepads = this.formatGamepads(newGamepads);
          this.updateGamepads(formattedGamepads);
  
          // Send gamepad data to Runtime.
          if (_.some(newGamepads) || Date.now() - timestamp > 100) {
            timestamp = Date.now();
            this.updateMainProcess();
          }
        }
        yield delay(50); // wait 50 ms before updating again. TODO!!!!
      }
    }
  }

  formatGamepads = (newGamepads: (Gamepad | null)[]): Input[] => {
    let formattedGamepads: Input[] = [];
    // Currently there is a bug on windows where navigator.getGamepads()
    // returns a second, 'ghost' gamepad even when only one is connected.
    // The filter on 'mapping' filters out the ghost gamepad.
    _.forEach(_.filter(newGamepads, { mapping: 'standard' }), (gamepad: Gamepad | null, indexGamepad: number) => {
      if (gamepad) {
        let bitmap: number = 0;
        gamepad.buttons.forEach((button, index) => {
          if (button.pressed) {
            bitmap |= (1 << index);
          }
        });
        formattedGamepads[indexGamepad] = new Input({
          connected: gamepad.connected,
          axes: gamepad.axes.slice(),
          buttons: bitmap,
          source: Source.GAMEPAD
        });
      }
    });
    return formattedGamepads;
  }

  updateMainProcess = () => {
    ipcRenderer.send('stateUpdate', this.gamepads, Source.GAMEPAD);
  }

  /**
 * This saga acts as a "heartbeat" to check whether we are still receiving
 * updates from Runtime.
 *
 * NOTE that this is different from whether or not the Runtime connection
 * is still alive.
 */
runtimeHeartbeat = () => {
  while (true) {
    // Start a race between a delay and receiving an UPDATE_STATUS action from
    // runtime. Only the winner will have a value.
    const result = yield race({
      update: take('PER_MESSAGE'),
      timeout: delay(TIMEOUT)
    });

    // If update wins, we assume we are connected, otherwise disconnected.
    if (result.update) {
      this.rootStore.info.runtimeConnect();
    } else {
      this.rootStore.info.runtimeDisconnect();
    }
  }
}

}
