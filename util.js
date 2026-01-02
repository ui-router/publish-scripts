'use strict';

const findParentDir = require('find-parent-dir');
const fs = require('fs');
const path = require('path');
require('shelljs/global');

function packageDir() {
  const packageDir = findParentDir.sync(process.cwd(), 'package.json');
  cd(packageDir);
}

/**
 * Detects the package manager based on the presence of lockfiles.
 * Priority: yarn.lock > pnpm-lock.yaml > package-lock.json > npm (default)
 * @param {string} [dir] - Directory to check (defaults to cwd)
 * @returns {'yarn'|'npm'|'pnpm'} The detected package manager
 */
function detectPackageManager(dir) {
  dir = dir || process.cwd();

  if (fs.existsSync(path.join(dir, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(dir, 'package-lock.json'))) {
    return 'npm';
  }
  // Default to npm if no lockfile is present
  return 'npm';
}

/**
 * Returns package manager specific commands
 * @param {'yarn'|'npm'|'pnpm'} [pm] - Package manager (auto-detected if not provided)
 * @returns {object} Object with command functions
 */
function getPackageManagerCommands(pm) {
  pm = pm || detectPackageManager();

  const commands = {
    yarn: {
      install: (flags) => `yarn install${flags ? ' ' + flags : ''}`,
      run: (script) => `yarn run ${script}`,
      test: () => `yarn test`,
      add: (pkg, flags) => `yarn add ${pkg}${flags ? ' ' + flags : ''}`,
      addDev: (pkg) => `yarn add --dev ${pkg}`,
      upgrade: (pkgs, flags) =>
        pkgs
          ? `yarn upgrade ${Array.isArray(pkgs) ? pkgs.join(' ') : pkgs}${flags ? ' ' + flags : ''}`
          : `yarn upgrade${flags ? ' ' + flags : ''}`,
      exec: (cmd) => `yarn ${cmd}`,
      lockfileName: 'yarn.lock',
    },
    npm: {
      install: (flags) => `npm install${flags ? ' ' + flags : ''}`,
      run: (script) => `npm run ${script}`,
      test: () => `npm test`,
      add: (pkg, flags) => `npm install ${pkg}${flags ? ' ' + flags : ''}`,
      addDev: (pkg) => `npm install --save-dev ${pkg}`,
      upgrade: (pkgs, flags) =>
        pkgs
          ? `npm update ${Array.isArray(pkgs) ? pkgs.join(' ') : pkgs}${flags ? ' ' + flags : ''}`
          : `npm update${flags ? ' ' + flags : ''}`,
      exec: (cmd) => `npx ${cmd}`,
      lockfileName: 'package-lock.json',
    },
    pnpm: {
      install: (flags) => `pnpm install${flags ? ' ' + flags : ''}`,
      run: (script) => `pnpm run ${script}`,
      test: () => `pnpm test`,
      add: (pkg, flags) => `pnpm add ${pkg}${flags ? ' ' + flags : ''}`,
      addDev: (pkg) => `pnpm add --save-dev ${pkg}`,
      upgrade: (pkgs, flags) =>
        pkgs
          ? `pnpm update ${Array.isArray(pkgs) ? pkgs.join(' ') : pkgs}${flags ? ' ' + flags : ''}`
          : `pnpm update${flags ? ' ' + flags : ''}`,
      exec: (cmd) => `pnpm exec ${cmd}`,
      lockfileName: 'pnpm-lock.yaml',
    },
  };

  return commands[pm];
}

/**
 * Returns the detected package manager name
 * @param {string} [dir] - Directory to check (defaults to cwd)
 * @returns {'yarn'|'npm'|'pnpm'}
 */
function pm(dir) {
  return detectPackageManager(dir);
}

/**
 * Returns package manager commands for the current directory
 * @param {string} [dir] - Directory to check (defaults to cwd)
 * @returns {object} Object with command functions (install, run, test, add, etc.)
 */
function pkgMgrCommands(dir) {
  return getPackageManagerCommands(detectPackageManager(dir));
}

function ensureCleanMaster(branch) {
  branch = branch || 'master';
  if (exec('git symbolic-ref HEAD').stdout.trim() !== `refs/heads/${branch}`)
    throw new Error(`Not on ${branch} branch, aborting`);
  if (exec('git status --porcelain').stdout.trim() !== '') throw new Error('Working copy is dirty, aborting');
}

function _exec(command, silent) {
  if (!silent) {
    echo(command);
    echo();
  }
  var result = exec(command, { silent: !!silent });
  if (result.code === 0) return result;
  echo(`cwd: ${process.cwd()}`);
  echo(`Aborting; non-zero return value (${result.code}) from: ${command}`);
  console.error(result.stderr);
  exit(result.code);
}

function _execInteractive(command) {
  echo(command);
  echo();
  const { spawnSync } = require('child_process');
  const result = spawnSync(command, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
  });
  if (result.status === 0) return result;
  echo(`cwd: ${process.cwd()}`);
  echo(`Aborting; non-zero return value (${result.status}) from: ${command}`);
  exit(result.status);
}

function asJson(obj) {
  return JSON.stringify(obj, null, 2);
}

let ensure = (type) => (path) => {
  let is = false;
  try {
    is = fs.lstatSync(path)['is' + type]();
  } catch (e) {
    console.log(e);
  }
  if (!is) echo(`Not a ${type}: ${path}`) && exit(-3);
};
let assertDir = ensure('Directory');
let assertFile = ensure('File');

module.exports = {
  ensureCleanMaster: ensureCleanMaster,
  _exec: _exec,
  _execInteractive: _execInteractive,
  asJson: asJson,
  assertDir: assertDir,
  assertFile: assertFile,
  packageDir: packageDir,
  detectPackageManager: detectPackageManager,
  getPackageManagerCommands: getPackageManagerCommands,
  pm: pm,
  pkgMgrCommands: pkgMgrCommands,
};
