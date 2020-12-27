import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
} from 'react-bootstrap';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { addAsyncAlert } from '../actions/AlertActions';
import { pathToName, defaults, logging } from '../utils/utils';

const { dialog } = remote;
const { Client } = require('ssh2');

function UpdateBox (props) {

  const [isUploading, setIsUploading] = useState(false)
  const [updateFilePath, setUpdateFilePath] = useState('')

  // this.chooseUpdate = this.chooseUpdate.bind(this);
  // this.upgradeSoftware = this.upgradeSoftware.bind(this);
  // this.disableUploadUpdate = this.disableUploadUpdate.bind(this);

  const chooseUpdate = () => {
    dialog.showOpenDialog({
      filters: [{ name: 'Update Package', extensions: ['gz', 'tar.gz'] }],
    }, (filepaths) => {
      if (filepaths === undefined) return;
      setUpdateFilePath(filepaths[0])
    });
  }

  const upgradeSoftware = () => {
    setIsUploading(true)
    const update = pathToName(updateFilePath);
    const conn = new Client();
    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
        if (err) {
          logging.log(err);
        } else {
          logging.log('SSH Connection');
          sftp.fastPut(
            updateFilePath,
            `./updates/${update}`, (err2) => {
              conn.end();
              setIsUploading(false)
              props.hide();
              if (err2) {
                props.onAlertAdd(
                  'Robot Connectivity Error',
                  `Dawn was unable to upload the update to the robot.
                  Please check your connectivity, or try restarting the robot.`,
                );
                logging.log(err2);
              } else {
                props.onAlertAdd(
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
      debug: (inpt) => { logging.log(inpt); },
      host: props.ipAddress,
      port: defaults.PORT,
      username: defaults.USERNAME,
      password: defaults.PASSWORD,
    });
  }

  const disableUploadUpdate = () => {
    return (
      !(updateFilePath) ||
      isUploading ||
      !(props.connectionStatus && props.runtimeStatus) ||
      props.isRunningCode
    );
  }
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
          <h5>{updateFilePath ? updateFilePath : ''}</h5>
          <Button type="button" onClick={chooseUpdate}>Choose File</Button>
          <br />
        </Modal.Body>
      );
    }
    return (
      <Modal show={props.shouldShow} onHide={props.hide}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Update</Modal.Title>
        </Modal.Header>
        {modalBody}
        <Modal.Footer>
          <Button
            type="button"
            bsStyle="primary"
            onClick={upgradeSoftware}
            disabled={disableUploadUpdate()}
          >
            {isUploading? 'Uploading...' : 'Upload Files'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

UpdateBox.propTypes = {
  shouldShow: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  connectionStatus: PropTypes.bool.isRequired,
  runtimeStatus: PropTypes.bool.isRequired,
  isRunningCode: PropTypes.bool.isRequired,
  ipAddress: PropTypes.string.isRequired,
  onAlertAdd: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onAlertAdd: (heading, message) => {
    dispatch(addAsyncAlert(heading, message));
  },
});

const UpdateBoxContainer = connect(null, mapDispatchToProps)(UpdateBox);

export default UpdateBoxContainer;
