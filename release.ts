/* eslint-disable */

import minimist from 'minimist';
import packager, { Options } from 'electron-packager';
import path from 'path';
import { spawn } from 'child_process';

/* General release command: 'ts-node release.ts'
 * For a specific target: 'ts-node release.ts --platform=... --arch=...'
 */
async function pack(args: minimist.ParsedArgs) {
  const packageOptions: Options = {
    dir: __dirname, // source dir
    name: 'dawn',
    icon: './icons/pieicon',
    asar: true,
    out: path.resolve('./dawn-packaged') // output to subdirectory
  };

  Object.keys(args).forEach((key: string) => {
    packageOptions[key] = args[key];
  });

  // platform is either 'darwin', 'linux', or 'win32'
  packageOptions.platform = args.platform ? args.platform : 'all';
  console.log('Packaging for: ', packageOptions.platform);

  const appPaths: (string | boolean)[] = await packager(packageOptions);

  appPaths.map((appPath: string | boolean) => {
    if (appPath == true) {
      return;
    }
    console.log(`Zipping ${appPath}`);

    spawn('zip', ['-r', `${appPath}.zip`, `${appPath}`], { stdio: 'inherit' });
  });
}

pack(minimist(process.argv.slice(2))).then(() => console.log('Packaging Done'));
