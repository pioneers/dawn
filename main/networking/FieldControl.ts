import io from 'socket.io-client';
import { updateRobot, updateHeart, updateMaster } from '../../renderer/actions/FieldActions';
import RendererBridge from '../RendererBridge';
import { Logger } from '../../renderer/utils/utils';

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
    this.init = this.init.bind(this);
    this.quit = this.quit.bind(this);
  }

  init() {
    this.socket = io.connect(this.bridgeAddress);
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
  }

  quit() {
    try {
      if (this.socket) {
        this.socket.close();
      }
    } catch (err) {
      this.logger.log(err);
    }
    this.socket = null;
  }
}

const FCInternalInit: any = null;

export const FCObject = {
  FCInternal: FCInternalInit,
  stationNumber: 4,
  bridgeAddress: 'localhost',
  logger: new Logger('fieldControl', 'Field Control Debug'),
  setup() {
    if (this.FCInternal !== null) {
      this.FCInternal.quit();
    }
    this.FCInternal = new FCInternals(this.stationNumber, this.bridgeAddress, FCObject.logger);
    this.FCInternal.init();
  },
  changeFCInfo(_event: any, arg: any) {
    if (arg.stationNumber !== null) {
      FCObject.stationNumber = arg.stationNumber;
    }

    if (arg.bridgeAddress !== null) {
      FCObject.bridgeAddress = arg.bridgeAddress;
      RendererBridge.dispatch('video_feed', 'shepherdScoreboardServerIpAddress', arg.bridgeAddress);
    }
  },
};
