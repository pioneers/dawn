import React, { useState, useEffect, ChangeEventHandler } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import _ from 'lodash';
import { defaults, getValidationState, logging } from '../utils/utils';
import { updateFieldControl } from '../actions/FieldActions';
import { ipChange, udpTunnelIpChange, sshIpChange } from '../actions/InfoActions';
import storage from 'electron-json-storage';

interface Config {
  stationNumber: number;
  bridgeAddress: string;
}

interface StateProps {
  stationNumber: number;
  ipAddress: string;
  udpTunnelAddress: string;
  sshAddress: string;
}

interface DispatchProps {
  onIPChange: (ipAddress: string) => void;
  onUDPTunnelingIpAddressChange: (ipAddress: string) => void;
  onSSHAddressChange: (ipAddress: string) => void;
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
  const [udpTunnelIpAddress, setUDPTunnelIpAddress] = useState(props.udpTunnelAddress);
  const [sshAddress, setSSHAddress] = useState(props.sshAddress);
  const [fcAddress, setFCAddress] = useState(props.fcAddress);
  const [stationNumber, setStationNumber] = useState(props.stationNumber);
  const [originalIPAddress, setOriginalIPAddress] = useState(props.ipAddress);
  const [originalUDPTunnelIpAddress, setOriginalUDPTunnelIpAddress] = useState(props.udpTunnelAddress);
  const [originalSSHAddress, setOriginalSSHAddress] = useState(props.sshAddress);
  const [originalStationNumber, setOriginalStationNumber] = useState(props.stationNumber);
  const [originalFCAddress, setOriginalFCAddress] = useState(props.fcAddress);

  const saveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.onUDPTunnelingIpAddressChange(udpTunnelIpAddress);
    setOriginalFCAddress(udpTunnelIpAddress);
    storage.set('udpTunnelIpAddress', { udpTunnelIpAddress }, (err: any) => {
      if (err) logging.log(err);
    });

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

  const handleIpChange = (e: React.ChangeEventHandler<FormControlElement>) => {
    setIPAddress(e.currentTarget.value);
  };


  const handleUDPTunnelIpChange = (e: React.FormEvent<typeof Form.Control & HTMLInputElement>) => {
    setUDPTunnelIpAddress(e.currentTarget.value);
  };

  const handleSSHIpChange = (e: React.FormEvent<typeof Form.Control & HTMLInputElement>) => {
    setSSHAddress(e.currentTarget.value);
  }

  const handleFcChange = (e: React.FormEvent<typeof Form.Control & HTMLInputElement>) => {
    setFCAddress(e.currentTarget.value);
  };

  const handleStationChange = (e: React.FormEvent<typeof Form.Control & HTMLInputElement>) => {
    setStationNumber(parseInt(e.currentTarget.value));
  };

  const handleClose = () => {
    setIPAddress(originalIPAddress);
    setStationNumber(originalStationNumber);
    setFCAddress(originalFCAddress);
    setUDPTunnelIpAddress(originalUDPTunnelIpAddress);
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

        props.onIPChange(ipAddress);
        setIPAddress(ipAddress);
        setOriginalIPAddress(ipAddress);
      }
    });

    storage.get('udpTunnelIpAddress', (err: any, data: object) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        const udpTunnelIpAddress = (data as { udpTunnelIpAddress: string | undefined }).udpTunnelIpAddress ?? defaults.IPADDRESS;

        props.onUDPTunnelingIpAddressChange(udpTunnelIpAddress);
        setUDPTunnelIpAddress(udpTunnelIpAddress);
        setOriginalUDPTunnelIpAddress(udpTunnelIpAddress);
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
          <Form.Group controlId="ipAddress" validationState={getValidationState(ipAddress)}>
            <Form.Label>IP Address</Form.Label>
            <Form.Control type="text" value={ipAddress} placeholder="i.e. 192.168.100.13" onChange={handleIpChange} />
            <Form.Control.Feedback />
          </Form.Group>

          <Form.Group controlId="ipAddress" validationState={getValidationState(udpTunnelIpAddress)}>
            <Form.Label>UDP Tunneling</Form.Label>
            <Form.Control type="text" value={udpTunnelIpAddress} placeholder="i.e. 192.168.100.13" onChange={handleUDPTunnelIpChange} />
            <Form.Control.Feedback />
          </Form.Group>

          <Form.Group controlId="ipAddress" validationState={getValidationState(sshAddress)}>
            <Form.Label>SSH Address</Form.Label>
            <Form.Control type="text" value={sshAddress} placeholder="i.e. 192.168.100.13" onChange={handleSSHIpChange} />
            <Form.Control.Feedback />
          </Form.Group>

          <p>Field Control Settings</p>
          <Form.Group controlId="fcAddress" validationState={getValidationState(fcAddress)}>
            <Form.Label>Field Control IP Address</Form.Label>
            <Form.Control type="text" value={fcAddress} placeholder="i.e. 192.168.100.13" onChange={handleFcChange} />
            <Form.Control.Feedback />
          </Form.Group>

          <Form.Group controlId="stationNumber" validationState={stationNumber >= 0 && stationNumber <= 4 ? 'success' : 'error'}>
            <Form.Label>Field Control Station Number</Form.Label>
            <Form.Control type="number" value={stationNumber} placeholder="An integer from 0 to 4" onChange={handleStationChange} />
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
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onIPChange: (ipAddress: string) => {
    dispatch(ipChange(ipAddress));
  },
  onUDPTunnelingIpAddressChange: (ipAddress: string) => {
    dispatch(udpTunnelIpChange(ipAddress));
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
