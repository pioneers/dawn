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

type Props = StateProps & DispatchProps & OwnProps;
type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;


export const ConfigBoxComponent = (props: Props) => {
  const [ipAddress, setIPAddress] = useState(props.ipAddress);
  const [sshAddress, setSSHAddress] = useState(props.sshAddress);
  const [fcAddress, setFCAddress] = useState(props.fcAddress);
  const [stationNumber, setStationNumber] = useState(props.stationNumber);
  const [originalIPAddress, setOriginalIPAddress] = useState(props.ipAddress);
  const [originalSSHAddress, setOriginalSSHAddress] = useState(props.sshAddress);
  const [originalStationNumber, setOriginalStationNumber] = useState(props.stationNumber);
  const [originalFCAddress, setOriginalFCAddress] = useState(props.fcAddress);
  const [updateDisabled, setUpdateDisabled] = useState(false);

  const saveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.onIPChange(ipAddress);
    setOriginalIPAddress(ipAddress);
    storage.set('ipAddress', { ipAddress }, (err: any) => {
      if (err) logging.log(err);
    });

    props.onSSHAddressChange(sshAddress);
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
    props.onFCUpdate(newConfig);
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
  
  const clearItems = () => {
    setIPAddress("[REMOVE to Reconnect]" + ipAddress);
    setSSHAddress("[REMOVE to Reconnect]" + sshAddress );
  }

  const resetItems = () => {
    setIPAddress(ipAddress.replace("[REMOVE to Reconnect]", ""));
    setSSHAddress(sshAddress.replace("[REMOVE to Reconnect]", ""));  
    props.hide(); 
  }

  const canReconnect = () => {
    return ipAddress.includes("[REMOVE to Reconnect]") && sshAddress.includes("[REMOVE to Reconnect]");
  }

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

    storage.get('sshAddress', (err: any, data: object) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        const sshAddress = (data as { sshAddress: string | undefined }).sshAddress ?? defaults.IPADDRESS;

        props.onSSHAddressChange(sshAddress);
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

  useEffect(() => {
    const isDisabled = getValidationState(ipAddress) === 'error' || getValidationState(sshAddress) === 'error' || getValidationState(fcAddress) === 'error' || (stationNumber < 0 || stationNumber > 4);
    setUpdateDisabled(isDisabled);
  }, [ipAddress, sshAddress, fcAddress, stationNumber])

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
            <Form.Group controlId="ipAddress">
                <Form.Label>IP Address</Form.Label>
                <Form.Control type="text" value={ipAddress} placeholder="i.e. 192.168.100.13" onChange={handleIpChange} isValid={isValidationState(ipAddress)} isInvalid={!isValidationState(ipAddress)}/>
                <Form.Control.Feedback type='invalid'>
                Invalid Address. Try Again
              </Form.Control.Feedback>
              <Form.Control.Feedback>Valid Address!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="Address">
                <Form.Label>SSH Address</Form.Label>
                <Form.Control type="text" value={sshAddress} placeholder="i.e. 192.168.100.13" onChange={handleSSHIpChange} isValid={isValidationState(sshAddress)} isInvalid={!isValidationState(sshAddress)}/>
                <Form.Control.Feedback type='invalid'>
                Invalid Address. Try Again
              </Form.Control.Feedback>
              <Form.Control.Feedback>Valid Address!</Form.Control.Feedback>
            </Form.Group>

            <p>Field Control Settings</p>
            <Form.Group controlId="fcAddress">
                <Form.Label>Field Control IP Address</Form.Label>
                <Form.Control type="text" value={fcAddress} placeholder="i.e. 192.168.100.13" onChange={handleFcChange} isValid={isValidationState(fcAddress)} isInvalid={!isValidationState(fcAddress)}/>
                <Form.Control.Feedback type='invalid'>
                Invalid Address. Try Again
              </Form.Control.Feedback>
              <Form.Control.Feedback>Valid Address!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="stationNumber">
                <Form.Label>Field Control Station Number</Form.Label>
                <Form.Control type="number" value={stationNumber} placeholder="An integer from 0 to 4" onChange={handleStationChange} isValid={stationNumber >= 0 && stationNumber <= 4} isInvalid={stationNumber < 0 || stationNumber > 4}/>
                <Form.Control.Feedback type='invalid'>
                Invalid Station Number. Try Again
              </Form.Control.Feedback>
              <Form.Control.Feedback>Valid Station Number!</Form.Control.Feedback>
            </Form.Group>
            </Modal.Body>
            <Modal.Footer>
            <Button type="submit" variant="success" disabled={!canReconnect()} onClick={resetItems}>
                Reconnect
            </Button>
            <Button type="submit" variant="danger" disabled={updateDisabled} onClick={clearItems}>
                Disconnect
            </Button>
            <Button type="submit" variant="primary" disabled={updateDisabled}>
                Save
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
  onSSHAddressChange: (sshAddress: string) => {
    dispatch(sshIpChange(sshAddress));
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
