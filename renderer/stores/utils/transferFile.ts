/* eslint-disable @typescript-eslint/no-floating-promises */
import { defaults, logging } from '../../utils/utils';
import { Client, SFTPWrapper } from 'ssh2';

export const transferFile = async ({
  localFilePath,
  ip,
  port,
  transferType
}: {
  localFilePath: string;
  ip: string;
  port: number;
  transferType: 'download' | 'upload';
}) => {
  const conn = new Client();

  return await new Promise((resolve) => {
    conn.on('error', (err: any) => {
      logging.log(err);
      resolve('connectionError');
    });

    conn
      .on('ready', () => {
        conn.sftp((err: Error | undefined, sftp: SFTPWrapper) => {
          if (err) {
            logging.log(err);
            resolve('sftpError');
          }

          let transferMethod: 'fastGet' | 'fastPut';
          let srcPath;
          let destPath;

          switch (transferType) {
            case 'download':
              // eslint-disable-next-line @typescript-eslint/unbound-method
              transferMethod = 'fastGet';
              srcPath = defaults.STUDENTCODELOC;
              destPath = `${defaults.DESKTOP_LOC}/robotCode.py`;
              break;

            case 'upload':
              // eslint-disable-next-line @typescript-eslint/unbound-method
              transferMethod = 'fastPut';
              srcPath = localFilePath;
              destPath = defaults.STUDENTCODELOC;
              break;

            default:
              return;
          }

          sftp[transferMethod](srcPath, destPath, (err2: any) => {
            if (err2) {
              logging.log(err2);
              resolve('fileTransmissionError');
            }
            resolve('fileTransmissionSuccess');
          });
        });
      })
      .connect({
        debug: (input: any) => {
          logging.log(input);
        },
        host: ip,
        port,
        username: defaults.USERNAME,
        password: defaults.PASSWORD
      });
  });
};
