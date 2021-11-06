import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import _ from 'lodash';
import { defaults, getValidationState, logging, isValidationState } from '../utils/utils';
import { updateFieldControl } from '../actions/FieldActions';
import { ipChange, sshIpChange } from '../actions/InfoActions';
import storage from 'electron-json-storage';
import { Formik } from 'formik';
import { useStores } from '../hooks';
import { Observer } from 'mobx-react';

interface Config {
  stationNumber: number;
  bridgeAddress: string;
}

interface StateProps {
  stationNumber: number;
  ipAddress: string;
  sshAddress: string;
}

interface DispatchProps {
  onIPChange: (ipAddress: string) => void;
  onSSHAddressChange: (ipAddress: string) => void;
  onFCUpdate: (config: Config) => void;
}

interface OwnProps {
  fcAddress: string;
  shouldShow: boolean;
  hide: () => void;
}

type Props = DispatchProps & OwnProps;
type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// TODO: lots of changes to be done here
export const ConfigBoxComponent = (props: Props) => {

  const {info, fieldStore} = useStores();

  const [ipAddress, setIPAddress] = useState(info.ipAddress);
  const [sshAddress, setSSHAddress] = useState(info.sshAddress);
  const [fcAddress, setFCAddress] = useState(props.fcAddress); //TODO
  const [stationNumber, setStationNumber] = useState(fieldStore.stationNumber);
  const [originalIPAddress, setOriginalIPAddress] = useState(info.ipAddress);
  const [originalSSHAddress, setOriginalSSHAddress] = useState(info.sshAddress);
  const [originalStationNumber, setOriginalStationNumber] = useState(fieldStore.stationNumber);
  const [originalFCAddress, setOriginalFCAddress] = useState(props.fcAddress); //TODO

  const saveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    info.ipChange(ipAddress);
    storage.set('ipAddress', { ipAddress }, (err: any) => {
      if (err) logging.log(err);
    });

    info.sshIpChange(sshAddress);
    setOriginalSSHAddress(sshAddress);
    storage.set('sshAddress', { sshAddress }, (err: any) => {
      if (err) {
        logging.log(err);
      }
    })

    const newConfig = {
      stationNumber: stationNumber,
      bridgeAddress: fcAddress,
    };
    fieldStore.updateFCConfig(newConfig);
    setOriginalStationNumber(stationNumber);
    setOriginalFCAddress(fcAddress);

    storage.set('fieldControl', newConfig, (err: any) => {
      if (err) logging.log(err);
    });
    ipcRenderer.send('FC_CONFIG_CHANGE', newConfig);

    props.hide();
  };

  const handleIpChange = (e: React.FormEvent<FormControlElement>) => {
    setIPAddress(e.currentTarget.value);
  };

  const handleSSHIpChange = (e: React.FormEvent<FormControlElement>) => {
    setSSHAddress(e.currentTarget.value);
  }

  const handleFcChange = (e: React.FormEvent<FormControlElement>) => {
    setFCAddress(e.currentTarget.value);
  };

  const handleStationChange = (e: React.FormEvent<FormControlElement>) => {
    setStationNumber(parseInt(e.currentTarget.value));
  };

  const handleClose = () => {
    setIPAddress(originalIPAddress);
    setStationNumber(originalStationNumber);
    setFCAddress(originalFCAddress);
    setSSHAddress(originalSSHAddress);
    props.hide();
  };

  const disableUploadUpdate = () => {
    if (defaults.NGROK) {
      return false;
    }
    return getValidationState(ipAddress) === 'error' || getValidationState(fcAddress) === 'error' || (stationNumber < 0 && stationNumber > 4);
  };

  useEffect(() => {
    storage.get('ipAddress', (err: any, data: object) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        const ipAddress = (data as { ipAddress: string | undefined }).ipAddress ?? defaults.IPADDRESS;

        info.ipChange(ipAddress);
        setIPAddress(ipAddress);
        setOriginalIPAddress(ipAddress);
      }
    });

    storage.get('sshAddress', (err: any, data: object) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        const sshAddress = (data as { sshAddress: string | undefined }).sshAddress ?? defaults.IPADDRESS;

        info.sshIpChange(sshAddress);
        setSSHAddress(sshAddress);
        setOriginalSSHAddress(sshAddress);
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
      // TODO: Figure out formik stuff
      <Formik
    //   validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        
      }}
    >
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
            <Form.Group controlId="ipAddress">
                <Form.Label>IP Address</Form.Label>
                <Form.Control type="text" value={ipAddress} placeholder="i.e. 192.168.100.13" onChange={handleIpChange} isValid={isValidationState(ipAddress)} />
                <Form.Control.Feedback />
            </Form.Group>

            <Form.Group controlId="ipAddress">
                <Form.Label>SSH Address</Form.Label>
                <Form.Control type="text" value={sshAddress} placeholder="i.e. 192.168.100.13" onChange={handleSSHIpChange} isValid={isValidationState(ipAddress)} />
                <Form.Control.Feedback />
            </Form.Group>

            <p>Field Control Settings</p>
            <Form.Group controlId="fcAddress">
                <Form.Label>Field Control IP Address</Form.Label>
                <Form.Control type="text" value={fcAddress} placeholder="i.e. 192.168.100.13" onChange={handleFcChange} isValid={isValidationState(ipAddress)} />
                <Form.Control.Feedback />
            </Form.Group>

            <Form.Group controlId="stationNumber">
                <Form.Label>Field Control Station Number</Form.Label>
                <Form.Control type="number" value={stationNumber} placeholder="An integer from 0 to 4" onChange={handleStationChange} isValid={stationNumber >= 0 && stationNumber <= 4}/>
                <Form.Control.Feedback />
            </Form.Group>
            </Modal.Body>
            <Modal.Footer>
            <Button type="submit" variant="primary" disabled={disableUploadUpdate()}>
                Update
            </Button>
            </Modal.Footer>
        </Form>
        </Modal>
    </Formik>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onIPChange: (ipAddress: string) => {
    dispatch(ipChange(ipAddress));
  },
  onSSHAddressChange: (ipAddress: string) => {
    dispatch(sshIpChange(ipAddress));
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
