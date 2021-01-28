import minimist from 'minimist';
import packager, { Options } from 'electron-packager';
import path from 'path';
import { exec } from 'child_process';

/* General release command: 'ts-node release.ts'
 * For a specific target: 'ts-node release.ts --platform=... --arch=...'
 */
async function pack(platform: string, arch: string) {
  const packageOptions: Options = {
    dir: __dirname, // source dir
    name: 'dawn',
    icon: './icons/pieicon',
    asar: true,
    out: path.resolve('../dawn-packaged'), // build in the parent dir
  };

  if (!platform || !arch) {
    console.log('Packaging for all platforms');
    packageOptions.all = true; // build for all platforms and arch
  } else {
    console.log('Packaging for: ', platform, arch);
    packageOptions.platform = platform;
    packageOptions.arch = arch;
  }

  const appPaths: string[] = await packager(packageOptions);

  Promise.all(appPaths.map((appPath: string) => {
    console.log(`Zipping ${appPath}`);
    
    return new Promise((resolve) => {
      exec(`cd .. && zip -r ${appPath}.zip ${path.basename(appPath)}`, (err, stdout, stderr) => {
        resolve(err ? stdout : stderr);
      })
    })
  }));
}

async function main() {
  const argv = minimist(process.argv.slice(2));
  await pack(argv.platform, argv.arch);
}

main().then(() => console.log('Packaging Done'));
