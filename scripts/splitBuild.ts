/* eslint-disable no-console */
import { resolve } from 'path';
import { promisify } from 'util';
import childProcess from 'child_process';
import _glob from 'glob';
import chalk from 'chalk';
const exec = promisify(childProcess.exec);
const glob = promisify(_glob);

/**
 * arrayを分割
 */
const arrayChunk = ([...array], size = 1): string[] => {
  return array.reduce((acc, value, index) => (index % size ? acc : [...acc, array.slice(index, index + size)]), []);
};

/**
 * pages配下のファイルを取得
 */
async function getFileIDs(): Promise<string[]> {
  const pathStringArray = await glob(resolve(__dirname, '../src/pages/**/*.html.tsx'));
  const buildArray = pathStringArray.map((pathString) => pathString.split(/pages\//)[1].replace('.html.tsx', ''));
  const size = Math.ceil(buildArray.length / 4);
  return arrayChunk(buildArray, size);
}
/**
 * build
 */
async function build() {
  const paths = await getFileIDs();
  console.log(paths);
  console.log(chalk.greenBright('split build start'));
  // 並列でparalellにbuildさせる
  const builds = paths
    .map((path) => `cross-env NODE_OPTIONS=--max_old_space_size=6000 NODE_ENV=production webpack --env page=[${path}]`)
    .map(async (command, idx) => {
      const { stdout, stderr } = await exec(command);
      console.log(chalk.yellow(`--------------------- command ${idx} start ---------------------`));
      if (stdout) console.log('stdout:', stdout);
      if (stderr) console.error('stderr:', stderr);
      console.log(chalk.yellow(`--------------------- command ${idx} end ---------------------`));
    });

  await Promise.all(builds).then(() => {
    console.log(chalk.greenBright('split build end'));
  });
}

build();
