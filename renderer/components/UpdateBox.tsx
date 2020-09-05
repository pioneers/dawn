import React from 'react';
import {
  Modal,
  Button,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { addAsyncAlert } from '../actions/AlertActions';
import { pathToName, defaults, logging } from '../utils/utils';

const { dialog } = require('electron').remote;
const { Client } = require('ssh2');

interface StateProps {
  connectionStatus: boolean;
  runtimeStatus: boolean;
  masterStatus: boolean;
  isRunningCode: boolean;
  ipAddress: string;
}

interface DispatchProps {
  onAlertAdd: (heading: string, message: string) => void;
}

interface OwnProps {
  shouldShow: boolean;
  hide: () => void;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  isUploading: boolean;
  updateFilepath: string;
}

class UpdateBoxContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isUploading: false,
      updateFilepath: '',
    };
  }

  chooseUpdate = () => {
    dialog.showOpenDialog({
      filters: [
        { name: 'Update Package', extensions: ['gz', 'tar.gz']}
      ]
    }, (filepaths: string[]) => {
      if (filepaths === undefined) return;
      this.setState({ updateFilepath: filepaths[0] });
    });
  }

  upgradeSoftware = () => {
    this.setState({ isUploading: true });
    const update = pathToName(this.state.updateFilepath);
    const conn = new Client();
    conn.on('ready', () => {
      conn.sftp((err: any, sftp: any) => {
        if (err) {
          logging.log(err);
        } else {
          logging.log('SSH Connection');
          sftp.fastPut(
            this.state.updateFilepath,
            `./updates/${update}`, (err2: any) => {
              conn.end();
              this.setState({ isUploading: false });
              this.props.hide();
              if (err2) {
                this.props.onAlertAdd(
                  'Robot Connectivity Error',
                  `Dawn was unable to upload the update to the robot.
                  Please check your connectivity, or try restarting the robot.`,
                );
                logging.log(err2);
              } else {
                this.props.onAlertAdd(
                  'Robot Update Initiated',
                  `Update is installing and Runtime will restart soon.
                  Please leave your robot on for the next two minutes.`,
                );
              }
            },
          );
        }
      });
    }).connect({
      debug: (inpt: any) => { logging.log(inpt); },
      host: this.props.ipAddress,
      port: defaults.PORT,
      username: defaults.USERNAME,
      password: defaults.PASSWORD,
    });
  }

  disableUploadUpdate = () => {
    return (
      !(this.state.updateFilepath) ||
      this.state.isUploading ||
      !(this.props.connectionStatus && this.props.runtimeStatus) ||
      this.props.isRunningCode
    );
  }

  render() {
    const { shouldShow, hide } = this.props;
    const { isUploading, updateFilepath } = this.state;

    let modalBody = null;
    if (isUploading) {
      modalBody = (
        <Modal.Body>
          <h4>PLEASE DO NOT TURN OFF ROBOT</h4>
          <br />
        </Modal.Body>
      );
    } else {
      modalBody = (
        <Modal.Body>
          <h4>Update Package (tar.gz file)</h4>
          <h5>{updateFilepath ? updateFilepath : ''}</h5>
          <Button type="button" onClick={this.chooseUpdate}>Choose File</Button>
          <br />
        </Modal.Body>
      );
    }
    return (
      <Modal show={shouldShow} onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Update</Modal.Title>
        </Modal.Header>
        {modalBody}
        <Modal.Footer>
          <Button
            type="button"
            bsStyle="primary"
            onClick={this.upgradeSoftware}
            disabled={this.disableUploadUpdate()}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAlertAdd: (heading: string, message: string) => {
    dispatch(addAsyncAlert(heading, message));
  },
});

export const UpdateBox = connect(null, mapDispatchToProps)(UpdateBoxContainer);
