import React, { useEffect, useState } from 'react';
import Joyride, { Step } from 'react-joyride';
import { remote, ipcRenderer } from 'electron';
import * as electronJSONStorage from 'electron-json-storage';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Dashboard } from './Dashboard';
import { DNav } from './DNav';
import { joyrideSteps } from './JoyrideSteps';
import { removeAsyncAlert } from '../actions/AlertActions';
import { updateFieldControl } from '../actions/FieldActions';
import { logging, startLog } from '../utils/utils';
import { FieldControlConfig } from '../types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Observer } from 'mobx-react';
import { useStores } from '../hooks';
import { ipcChannels } from '../../shared';

type ElectronJSONStorage = typeof electronJSONStorage;

library.add(fas);

const storage = remote.require('electron-json-storage') as ElectronJSONStorage;

interface StateProps {
  connectionStatus: boolean;
  runtimeStatus: boolean;
  masterStatus: boolean;
  isRunningCode: boolean;
  asyncAlerts: Array<Object>;
  globalTheme: string;
}

interface DispatchProps {
  onFCUpdate: (param: FieldControlConfig) => void;
}

type Props = StateProps & DispatchProps;

export const AppComponent = (props: Props) => {
  const [steps, changeSteps] = useState<Array<Step>>([]);
  const [tourRunning, changeTourRunning] = useState(false);
  startLog();

  const { info, settings, fieldStore } = useStores();

  useEffect(() => {
    addSteps(joyrideSteps);
    ipcRenderer.on(ipcChannels.START_INTERACTIVE_TOUR, () => {
      startTour();
    });
    storage.has('firstTime', (hasErr: any, hasKey: any) => {
      if (hasErr) {
        logging.log(hasErr);
        return;
      }

      if (!hasKey) {
        startTour();
        storage.set('firstTime', { first: true }, (setErr: any) => {
          if (setErr) logging.log(setErr);
        });
      }
    });

    // eslint-disable-next-line @typescript-eslint/ban-types
    storage.get('fieldControl', (err: any, data: object) => {
      if (err) {
        logging.log(err);
        return;
      }
      const fieldControlConfig = data as FieldControlConfig;
      fieldStore.updateFCConfig(fieldControlConfig);
      ipcRenderer.send('FC_CONFIG_CHANGE', fieldControlConfig);
    });
  }, []);

  const addSteps = (newSteps: Array<Step>) => {
    if (!Array.isArray(newSteps)) {
      newSteps = [newSteps];
    }
    if (newSteps.length === 0) {
      return;
    }
    changeSteps((steps) => [...steps, ...newSteps]);
  };

  const startTour = () => {
    changeTourRunning(true);
  };

  const joyrideCallback = (action: { type: string }) => {
    // Confirm this still works
    if (action.type === 'finished') {
      changeTourRunning(false);
    }
  };

  const bsPrefix = props.globalTheme === 'dark' ? 'text-light bg-dark' : '';

  return (
    <div className={`${bsPrefix} mt-4`.trim()}>
      <DNav startTour={startTour} />
      <Joyride
        steps={steps}
        continuous={true}
        showSkipButton
        run={tourRunning}
        callback={joyrideCallback}
        locale={{
          back: 'Previous',
          close: 'Close',
          last: 'End Tour',
          next: 'Next',
          skip: 'Skip Tour'
        }}
      />
      <div style={{ height: '35px', marginBottom: '21px' }} />
      <Observer>{() => <Dashboard {...props} addSteps={addSteps} isRunningCode={info.isRunningCode} />}</Observer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  connectionStatus: state.info.connectionStatus,
  runtimeStatus: state.info.runtimeStatus,
  masterStatus: state.fieldStore.masterStatus,
  asyncAlerts: state.asyncAlerts,
  stationNumber: state.fieldStore.stationNumber,
  isRunningCode: state.info.isRunningCode,
  globalTheme: state.settings.globalTheme
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onFCUpdate: (param: FieldControlConfig) => {
    dispatch(updateFieldControl(param));
  }
});

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
