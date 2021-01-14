import React from 'react';
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

interface State {
  ipAddress: string;
  fcAddress: string;
  stationNumber: number;
  originalIPAddress: string;
  originalStationNumber: number;
  originalFCAddress: string;
}

class ConfigBoxComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      ipAddress: this.props.ipAddress,
      fcAddress: this.props.fcAddress,
      stationNumber: this.props.stationNumber,
      originalIPAddress: this.props.ipAddress,
      originalStationNumber: this.props.stationNumber,
      originalFCAddress: this.props.fcAddress,
    };
  }

  componentDidMount() {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
    storage.get('ipAddress', (err: any, data: object) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        const ipAddress = (data as { ipAddress: string | undefined }).ipAddress ?? defaults.IPADDRESS;

        this.props.onIPChange(ipAddress);
        this.setState({
          ipAddress: ipAddress,
          originalIPAddress: ipAddress,
        });
      }
    });

    storage.get('fieldControl', (err: any, data: object) => {
      if (err) {
        logging.log(err);
      } else if (!_.isEmpty(data)) {
        const { bridgeAddress, stationNumber } = data as Config;

        this.setState({
          fcAddress: bridgeAddress,
          originalFCAddress: bridgeAddress,
          stationNumber: stationNumber,
          originalStationNumber: stationNumber,
        });
      }
    });
  }

  saveChanges = (e: React.FormEvent<Form>) => {
    e.preventDefault();

    const { ipAddress } = this.state;

    this.props.onIPChange(ipAddress);
    this.setState({ originalIPAddress: ipAddress });
    storage.set('ipAddress', { ipAddress: this.state.ipAddress }, (err: any) => {
      if (err) logging.log(err);
    });

    const newConfig = {
      stationNumber: this.state.stationNumber,
      bridgeAddress: this.state.fcAddress,
    };
    this.props.onFCUpdate(newConfig);
    this.setState({
      originalStationNumber: this.state.stationNumber,
      originalFCAddress: this.state.fcAddress,
    });
    storage.set('fieldControl', newConfig, (err: any) => {
      if (err) logging.log(err);
    });
    ipcRenderer.send('FC_CONFIG_CHANGE', newConfig);

    this.props.hide();
  };

  handleIpChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    this.setState({ ipAddress: e.currentTarget.value });
  };

  handleFcChange = (e: React.FormEvent<FormControl& HTMLInputElement>) => {
    this.setState({ fcAddress: e.currentTarget.value });
  };

  handleStationChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    this.setState({ stationNumber: parseInt(e.currentTarget.value) });
  };

  handleClose = () => {
    this.setState({
      ipAddress: this.state.originalIPAddress,
      stationNumber: this.state.originalStationNumber,
      fcAddress: this.state.originalFCAddress,
    });
    this.props.hide();
  };

  disableUploadUpdate = () => {
    return (
      getValidationState(this.state.ipAddress) === 'error' ||
      getValidationState(this.state.fcAddress) === 'error' ||
      (this.state.stationNumber < 0 && this.state.stationNumber > 4)
    );
  };

  render() {
    const { shouldShow } = this.props;
    const { ipAddress, fcAddress, stationNumber } = this.state;

    return (
      <Modal show={shouldShow} onHide={this.handleClose} animation={false}>
        <Form action="" onSubmit={this.saveChanges}>
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
              <FormControl type="text" value={ipAddress} placeholder="i.e. 192.168.100.13" onChange={this.handleIpChange} />
              <FormControl.Feedback />
            </FormGroup>

            <p>Field Control Settings</p>
            <FormGroup controlId="fcAddress" validationState={getValidationState(fcAddress)}>
              <ControlLabel>Field Control IP Address</ControlLabel>
              <FormControl type="text" value={fcAddress} placeholder="i.e. 192.168.100.13" onChange={this.handleFcChange} />
              <FormControl.Feedback />
            </FormGroup>

            <FormGroup controlId="stationNumber" validationState={stationNumber >= 0 && stationNumber <= 4 ? 'success' : 'error'}>
              <ControlLabel>Field Control Station Number</ControlLabel>
              <FormControl type="number" value={stationNumber} placeholder="An integer from 0 to 4" onChange={this.handleStationChange} />
              <FormControl.Feedback />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" bsStyle="primary" disabled={this.disableUploadUpdate()}>
              Update
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onIPChange: (ipAddress: string) => {
    dispatch(ipChange(ipAddress));
  },
  onFCUpdate: (config: Config) => {
    dispatch(updateFieldControl(config));
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  stationNumber: state.fieldStore.stationNumber,
  fcAddress: state.fieldStore.bridgeAddress,
});

export const ConfigBox = connect(mapStateToProps, mapDispatchToProps)(ConfigBoxComponent);
