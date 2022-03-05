/* eslint-disable */

import archiver from 'archiver';
import { map } from 'bluebird';
import fs from 'fs';
import minimist from 'minimist';
import packager, { Options, PlatformOption, TargetArch } from 'electron-packager';
import path from 'path';

interface Args extends minimist.ParsedArgs {
  arch?: TargetArch;
  platform?: PlatformOption;
  shouldZip?: boolean;
}

async function zip(srcPath: string) {
  const theZipper = archiver('zip', { zlib: { level: 9 }}); // level 9 uses max compression
  const outputZipFilePath = `${srcPath}.zip`;
  const output = fs.createWriteStream(outputZipFilePath);

  theZipper
    .directory(srcPath, false)
    .pipe(output)
    .on('finish', () => {
      console.log(`Finished zipping ${outputZipFilePath}`);
    })
    .on('error', (err) => {
      console.error(`Failed to zip file with source path ${srcPath} -- err: ${err}`);
    });

  await theZipper.finalize();
}

/* General release command: 'ts-node release.ts'
 * For a specific target: 'ts-node release.ts --platform=... --arch=... --shouldZip=...'
 */
async function pack(args: Args) {
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
  packageOptions.platform = args.platform ?? 'all';
  console.log('Packaging for: ', packageOptions.platform);

  const appPaths: Array<string | boolean> = await packager(packageOptions);

  // Should zip the packages for each platform by default
  const shouldZip = args.shouldZip ?? true;

  if (shouldZip) {
    map(appPaths, async (appPath: string | boolean) => {
      if (appPath == true) {
        // Package for platform already exists, so no need to do anything
        return;
      }
      console.log(`Zipping ${appPath}`);

      await zip(appPath as string);
    });
  }
}

pack(minimist(process.argv.slice(2))).then(() => console.log('Packaging Done'));
