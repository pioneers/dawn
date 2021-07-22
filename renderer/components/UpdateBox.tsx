import { OpenDialogReturnValue, remote } from 'electron';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Client, SFTPWrapper } from 'ssh2';
import { addAsyncAlert } from '../actions/AlertActions';
import { defaults, logging } from '../utils/utils';

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

export function UpdateBoxContainer(props: Props) {
  const [isUploading, changeIsUploading] = useState(false);
  const [updateFilepath, changeUpdateFilepath] = useState('');

  const chooseUpdate = () => {
    remote.dialog
      .showOpenDialog({
        filters: [{ name: 'Update Package', extensions: ['zip'] }]
      })
      .then((dialogReturn: OpenDialogReturnValue) => {
        if (dialogReturn.filePaths.length > 0) {
          changeUpdateFilepath(dialogReturn.filePaths[0]);
        }
      });
  };

  const upgradeSoftware = () => {
    changeIsUploading(true);
    const RUNTIME_ZIP_REMOTE_PATH = '/tmp/runtime.zip';

    const conn = new Client();
    conn
      .on('ready', () => {
        conn.sftp((err: Error | undefined, sftp: SFTPWrapper) => {
          if (err) {
            logging.log(err.message);
          } else {
            logging.log('SSH Connection');
            sftp.fastPut(updateFilepath, RUNTIME_ZIP_REMOTE_PATH, (err2: any) => {
              conn.end();
              changeIsUploading(false);
              props.hide();
              if (err2) {
                props.onAlertAdd(
                  'Robot Connectivity Error',
                  `Dawn was unable to upload the update to the robot.
                  Please check your connectivity, or try restarting the robot.`
                );
                logging.log(err2);
              } else {
                props.onAlertAdd(
                  'Robot Update Initiated',
                  `Update is installing and Runtime will restart soon.
                  Please leave your robot on for the next 1 minute.`
                );
              }
            });
          }
        });
      })
      .connect({
        debug: (debugInfo: string) => {
          logging.log(debugInfo);
        },
        host: props.ipAddress,
        port: defaults.PORT,
        username: defaults.USERNAME,
        password: defaults.PASSWORD
      });
  };

  const disableUploadUpdate = () => {
    return !updateFilepath || isUploading || !(props.connectionStatus && props.runtimeStatus) || props.isRunningCode;
  };

  const { shouldShow, hide } = props;
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
        <h4>Update Package (.zip file)</h4>
        <h5>{updateFilepath ? updateFilepath : ''}</h5>
        <Button type="button" onClick={chooseUpdate}>
          Choose File
        </Button>
        <br />
      </Modal.Body>
    );
  }
  return (
    <Modal show={shouldShow} onHide={hide} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Update</Modal.Title>
      </Modal.Header>
      {modalBody}
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={upgradeSoftware} disabled={disableUploadUpdate()}>
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAlertAdd: (heading: string, message: string) => {
    dispatch(addAsyncAlert(heading, message));
  }
});

export const UpdateBox = connect(null, mapDispatchToProps)(UpdateBoxContainer);
