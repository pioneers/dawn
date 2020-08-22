import React from 'react';
import Joyride from 'react-joyride';
import { remote, ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import smalltalk from 'smalltalk';
import { Dashboard } from './Dashboard';
import { DNav } from './DNav';
import joyrideSteps from './JoyrideSteps';
import { removeAsyncAlert } from '../actions/AlertActions';
import { updateFieldControl } from '../actions/FieldActions';
import { logging, startLog } from '../utils/utils';

const storage = remote.require('electron-json-storage');

interface AlertType {
  heading: string;
  message: string;
  id: number;
}

interface StateProps {
  connectionStatus: boolean;
  runtimeStatus: boolean;
  masterStatus: boolean;
  isRunningCode: boolean;
  asyncAlerts: Array<Object>
}

interface DispatchProps {
  onAlertDone: (id: number) => void;
  onFCUpdate: (ipAddress: string) => void;
}

interface OwnProps {
  onAlertDone: Function;
  onFCUpdate: Function;
}

interface State {
  steps: Array<Object>;
  tourRunning: boolean;
}

type Props = StateProps & DispatchProps & OwnProps;

class AppComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      steps: [],
      tourRunning: false,
    };
    startLog();
  }

  componentDidMount = () => {
    this.addSteps(joyrideSteps);
    ipcRenderer.on('start-interactive-tour', () => {
      this.startTour();
    });
    storage.has('firstTime', (hasErr: any, hasKey: any) => {
      if (hasErr) {
        logging.log(hasErr);
        return;
      }

      if (!hasKey) {
        this.startTour();
        storage.set('firstTime', { first: true }, (setErr: any) => {
          if (setErr) logging.log(setErr);
        });
      }
    });

    storage.get('fieldControl', (err: any, data: string) => {
      if (err) {
        logging.log(err);
        return;
      }
      this.props.onFCUpdate(data);
      ipcRenderer.send('FC_CONFIG_CHANGE', data);
    });
  }

  componentWillReceiveProps = (nextProps: Props) => {
    const { asyncAlerts } = nextProps;
    // If the alerts list has changed, display the latest one.
    if (asyncAlerts !== this.props.asyncAlerts) {
      const latestAlert = asyncAlerts[asyncAlerts.length - 1] as AlertType;
      if (latestAlert !== undefined) {
        this.updateAlert(latestAlert);
      }
    }
  }

  shouldComponentUpdate = (nextProps: Props, nextState: State) => {
    return nextProps !== this.props || nextState !== this.state;
  }

  addSteps = (steps: Array<Object>) => {
    if (!Array.isArray(steps)) {
      steps = [steps];
    }
    if (steps.length === 0) {
      return;
    }
    this.setState((currentState: {steps: Array<Object>}) => {
      currentState.steps = currentState.steps.concat(steps);
      return currentState;
    });
  }

  addTooltip = (data: object) => {
    this.joyride.addTooltip(data);
  }

  startTour = () => {
    this.setState({ tourRunning: true });
  }

  joyrideCallback = (action: { type: string }) => {
    if (action.type === 'finished') {
      this.setState({ tourRunning: false });
      this.joyride.reset(false);
    }
  }

  updateAlert = (latestAlert: AlertType) =>  {
    smalltalk.alert(latestAlert.heading, latestAlert.message).then(() => {
      this.props.onAlertDone(latestAlert.id);
    }, () => {
      this.props.onAlertDone(latestAlert.id);
    });
  }

  render() {

    const { runtimeStatus, masterStatus, connectionStatus, isRunningCode } = this.props;
    const { tourRunning } = this.state;

    return (
      <div>
        <DNav
          startTour={this.startTour}
          runtimeStatus={runtimeStatus}
          masterStatus={masterStatus}
          connectionStatus={connectionStatus}
          isRunningCode={isRunningCode}
        />
        <Joyride
          ref={(c: any) => { this.joyride = c; }}
          steps={this.state.steps}
          type="continuous"
          showSkipButton
          autoStart
          run={tourRunning}
          callback={this.joyrideCallback}
          locale={{
            back: 'Previous',
            close: 'Close',
            last: 'End Tour',
            next: 'Next',
            skip: 'Skip Tour',
          }}
        />
        <div style={{ height: '35px', marginBottom: '21px' }} />
        <Dashboard
          {...this.props}
          addSteps={this.addSteps}
          addTooltip={this.addTooltip}
          connectionStatus={connectionStatus}
          runtimeStatus={runtimeStatus}
          isRunningCode={isRunningCode}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  connectionStatus: state.info.connectionStatus,
  runtimeStatus: state.info.runtimeStatus,
  masterStatus: state.fieldStore.masterStatus,
  isRunningCode: state.info.isRunningCode,
  asyncAlerts: state.asyncAlerts,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAlertDone: (id: number) => {
    dispatch(removeAsyncAlert(id));
  },
  onFCUpdate: (ipAddress) => {
    dispatch(updateFieldControl(ipAddress));
  },
});

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
