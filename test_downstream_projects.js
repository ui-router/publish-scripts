#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const util = require('./util');
util.packageDir();
const PKG_DIR = process.cwd();

const config = JSON.parse(fs.readFileSync('downstream_projects.json'));
const pkgjson = JSON.parse(fs.readFileSync('package.json'));

const DOWNSTREAMS_PATH = path.resolve(PKG_DIR, 'downstream_projects');
const UPSTREAM_PKGS = (process.env.UPSTREAM_PKGS || '').split(',').filter(x => x).concat(pkgjson.name);

function forEachDownstream(callback) {
  Object.keys(config).forEach(key => {
    const projectPath = path.resolve(DOWNSTREAMS_PATH, key);
    if (!fs.existsSync(projectPath)) {
      process.chdir(DOWNSTREAMS_PATH);
      const giturl = config[key];
      console.log('cloning ' + giturl);
      util._exec('git clone '+ giturl + ' ' + key);
    }
    process.chdir(projectPath);

    callback();
  });
}

function makeWorkingCopy() {
  process.chdir(PKG_DIR);
  if (!fs.existsSync(DOWNSTREAMS_PATH)) {
    console.log('making downstream_projects working directory');
    fs.mkdirSync(DOWNSTREAMS_PATH);
  }
}

function localPublish() {
  process.chdir(PKG_DIR);
  console.log('Publishing using yalc...');
  util._exec('yalc publish');
}

function getCleanMaster() {
  console.log('cleaning ' + process.cwd());
  util._exec('git fetch origin');
  util._exec('git reset --hard origin/master');
  util._exec('git clean --force -d');
}

function revertLocalChanges() {
  util._exec('git reset --hard origin/master');
  util._exec('git clean --force -d');
}

function installDeps() {
  util._exec('yarn install --check-files');
  UPSTREAM_PKGS.forEach(upstream => util._exec('yalc add ' + upstream));
}

function runTests() {
  util._exec(`UPSTREAM_PKGS="${UPSTREAM_PKGS.join(',')}" npm test`);
}

makeWorkingCopy();
localPublish();

forEachDownstream(getCleanMaster);
forEachDownstream(installDeps);
forEachDownstream(runTests);
forEachDownstream(revertLocalChanges);

