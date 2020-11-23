import { IpcMainEvent } from 'electron';
import io from 'socket.io-client';
import { updateRobot, updateHeart, updateMaster } from '../../renderer/actions/FieldActions';
import RendererBridge from '../RendererBridge';
import { Logger } from '../../renderer/utils/utils';

interface FCObjectInterface {
  FCInternal: FCInternals | null;
  stationNumber: number;
  bridgeAddress: string;
  logger: Logger;

  setup: () => void;
  changeFCInfo: (_event: IpcMainEvent, arg: any) => void;
}

class FCInternals {
  socket: SocketIOClient.Socket | null;
  stationNumber: number;
  bridgeAddress: string;
  logger: Logger;

  constructor(stationNumber: number, bridgeAddress: string, logger: Logger) {
    this.socket = null;
    this.stationNumber = stationNumber;
    this.bridgeAddress = bridgeAddress;
    this.logger = logger;
    this.logger.log(`Field Control: SN-${this.stationNumber} BA-${this.bridgeAddress}`);
  }

  init = () => {
    this.socket = io(`http://${this.bridgeAddress}:7000`);
    this.socket.on('connect', () => {
      this.logger.log('Connected to Field Control Socket');
      this.socket!.on('robot_state', (data: any) => {
        RendererBridge.reduxDispatch(updateRobot(JSON.parse(data)));
      });
      this.socket!.on('heartbeat', () => {
        RendererBridge.reduxDispatch(updateHeart());
      });
      // NOTE: This listener may be deprecated
      // this.socket.on('codes', (data: any) => {
      //   if (Runtime.conns[2].socket !== null) {
      //     Runtime.conns[2].socket.sendFieldControl(JSON.parse(data));
      //   } else {
      //     this.logger.log('Trying to send FC Info to Disconnected Robot');
      //   }
      // });
      this.socket!.on('master', (data: any) => {
        RendererBridge.reduxDispatch(updateMaster(JSON.parse(data)));
      });
    });
  };

  quit = () => {
    try {
      if (this.socket) {
        this.socket.close();
      }
    } catch (err) {
      this.logger.log(err);
    }
    this.socket = null;
  };
}

export const FCObject: FCObjectInterface = {
  FCInternal: null,
  stationNumber: 4,
  bridgeAddress: 'localhost',
  logger: new Logger('fieldControl', 'Field Control Debug'),

  setup() {
    if (this.FCInternal !== null) {
      this.FCInternal!.quit();
    }
    this.FCInternal = new FCInternals(this.stationNumber, this.bridgeAddress, FCObject.logger);
    this.FCInternal.init();
  },

  changeFCInfo(_event: IpcMainEvent, args: any) {
    if (args.stationNumber !== null) {
      FCObject.stationNumber = args.stationNumber;
      FCObject.logger.log(`stationNumber set to ${FCObject.stationNumber}`);
    }

    if (args.bridgeAddress !== null) {
      FCObject.bridgeAddress = args.bridgeAddress;
      FCObject.logger.log(`bridgeAddress set to ${FCObject.bridgeAddress}`);
    }
  }
};
