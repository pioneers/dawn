import React, { useState, useEffect } from 'react';
import { Modal, Button, FormGroup, Form, FormControl, ControlLabel } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import _ from 'lodash';
import { defaults, getValidationState, logging } from '../utils/utils';
import { updateFieldControl } from '../actions/FieldActions';
import { ipChange } from '../actions/InfoActions';
import storage from 'electron-json-storage';

interface Config {
  stationNumber: number;
  bridgeAddress: string;
}

interface StateProps {
  stationNumber: number;
  ipAddress: string;
}

interface DispatchProps {
  onIPChange: (ipAddress: string) => void;
  onFCUpdate: (config: Config) => void;
}

interface OwnProps {
  fcAddress: string;
  shouldShow: boolean;
  hide: () => void;
}

type Props = StateProps & DispatchProps & OwnProps;

export const ConfigBoxComponent = (props: Props) => {
  const [ipAddress, setIPAddress] = useState(props.ipAddress);
  const [fcAddress, setFCAddress] = useState(props.fcAddress);
  const [stationNumber, setStationNumber] = useState(props.stationNumber);
  const [originalIPAddress, setOriginalIPAddress] = useState(props.ipAddress);
  const [originalStationNumber, setOriginalStationNumber] = useState(props.stationNumber);
  const [originalFCAddress, setOriginalFCAddress] = useState(props.fcAddress);

  const saveChanges = (e: React.FormEvent<Form>) => {
    e.preventDefault();

    props.onIPChange(ipAddress);
    setOriginalIPAddress(ipAddress);
    storage.set('ipAddress', { ipAddress: ipAddress }, (err: any) => {
      if (err) logging.log(err);
    });

    const newConfig = {
      stationNumber: stationNumber,
      bridgeAddress: fcAddress,
    };
    props.onFCUpdate(newConfig);
    setOriginalStationNumber(stationNumber);
    setOriginalFCAddress(fcAddress);

    storage.set('fieldControl', newConfig, (err: any) => {
      if (err) logging.log(err);
    });
    ipcRenderer.send('FC_CONFIG_CHANGE', newConfig);

    props.hide();
  };

  const handleIpChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    setIPAddress(e.currentTarget.value);
  };

  const handleFcChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    setFCAddress(e.currentTarget.value);
  };

  const handleStationChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    setStationNumber(parseInt(e.currentTarget.value));
  };

  const handleClose = () => {
    setIPAddress(originalIPAddress);
    setStationNumber(originalStationNumber);
    setFCAddress(originalFCAddress);
    props.hide();
  };

  const disableUploadUpdate = () => {
    return (
      getValidationState(ipAddress) === 'error' || getValidationState(fcAddress) === 'error' || (stationNumber < 0 && stationNumber > 4)
    );
  };

  useEffect(() => {
    storage.get('ipAddress', (err: any, data: object) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        const ipAddress = (data as { ipAddress: string | undefined }).ipAddress ?? defaults.IPADDRESS;

        props.onIPChange(ipAddress);
        setIPAddress(ipAddress);
        setOriginalIPAddress(ipAddress);
      }
    });

    storage.get('fieldControl', (err: any, data: object) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        const { bridgeAddress, stationNumber } = data as Config;
        setFCAddress(bridgeAddress);
        setOriginalFCAddress(bridgeAddress);
        setStationNumber(stationNumber);
        setOriginalStationNumber(stationNumber);
      }
    });
  }, []);

  const { shouldShow } = props;

  return (
    <Modal show={shouldShow} onHide={handleClose} animation={false}>
      <Form action="" onSubmit={saveChanges}>
        <Modal.Header closeButton>
          <Modal.Title>Dawn Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Make sure only one computer (running instance of Dawn) is attempting to connect to the robot at a time! (i.e. not trying to
            connect to the same IP Address)
          </p>
          <FormGroup controlId="ipAddress" validationState={getValidationState(ipAddress)}>
            <ControlLabel>IP Address</ControlLabel>
            <FormControl type="text" value={ipAddress} placeholder="i.e. 192.168.100.13" onChange={handleIpChange} />
            <FormControl.Feedback />
          </FormGroup>

          <p>Field Control Settings</p>
          <FormGroup controlId="fcAddress" validationState={getValidationState(fcAddress)}>
            <ControlLabel>Field Control IP Address</ControlLabel>
            <FormControl type="text" value={fcAddress} placeholder="i.e. 192.168.100.13" onChange={handleFcChange} />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="stationNumber" validationState={stationNumber >= 0 && stationNumber <= 4 ? 'success' : 'error'}>
            <ControlLabel>Field Control Station Number</ControlLabel>
            <FormControl type="number" value={stationNumber} placeholder="An integer from 0 to 4" onChange={handleStationChange} />
            <FormControl.Feedback />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" bsStyle="primary" disabled={disableUploadUpdate()}>
            Update
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onIPChange: (ipAddress: string) => {
    dispatch(ipChange(ipAddress));
  },
  onFCUpdate: (config: Config) => {
    dispatch(updateFieldControl(config));
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  stationNumber: state.fieldStore.stationNumber,
  fcAddress: state.fieldStore.bridgeAddress,
});

export const ConfigBox = connect(mapStateToProps, mapDispatchToProps)(ConfigBoxComponent);
