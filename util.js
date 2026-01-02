"use strict";

const findParentDir = require('find-parent-dir');
const fs = require('fs');
require('shelljs/global');

function packageDir() {
  const packageDir = findParentDir.sync(process.cwd(), 'package.json');
  cd(packageDir);
}

function ensureCleanMaster(branch) {
  branch = branch || 'master';
  if (exec('git symbolic-ref HEAD').stdout.trim() !== `refs/heads/${branch}`)
    throw new Error(`Not on ${branch} branch, aborting`);
  if (exec('git status --porcelain').stdout.trim() !== '')
    throw new Error('Working copy is dirty, aborting');
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
  exit(result.code)
}

function _execInteractive(command) {
  echo(command);
  echo();
  const { spawnSync } = require('child_process');
  const result = spawnSync(command, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });
  if (result.status === 0) return result;
  echo(`cwd: ${process.cwd()}`);
  echo(`Aborting; non-zero return value (${result.status}) from: ${command}`);
  exit(result.status)
}

function asJson (obj) { return JSON.stringify(obj, null, 2); }

let ensure = (type) => (path) => {
  let is = false;
  try { is = fs.lstatSync(path)['is' + type](); } catch (e) { console.log(e); }
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
};
