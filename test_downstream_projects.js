#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const util = require('./util');

util.packageDir();
const PKG_DIR = process.cwd();

const config = JSON.parse(fs.readFileSync('downstream_projects.json'));
const pkgjson = JSON.parse(fs.readFileSync('package.json'));

const DOWNSTREAMS_PATH = path.resolve(PKG_DIR, 'downstream_projects');

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

function cloneDownstreamProjects() {
  Object.keys(config).forEach(key => {
    process.chdir(DOWNSTREAMS_PATH);
    const giturl = config[key];
    const projectPath = path.resolve(DOWNSTREAMS_PATH, key);
    if (!fs.existsSync(projectPath)) {
      console.log('cloning from ' + giturl);
      util._exec('git clone '+ giturl + ' ' + key);
    }
    process.chdir(projectPath);
    console.log('cleaning ' + projectPath);
    util._exec('git fetch origin');
    util._exec('git reset --hard origin/master');
    util._exec('git clean --force -d');
  })
}

function installDownstreamDeps() {
  Object.keys(config).forEach(key => {
    const projectPath = path.resolve(DOWNSTREAMS_PATH, key);
    process.chdir(projectPath);
    util._exec('yarn install --check-files');
    util._exec('yalc add ' + pkgjson.name);
  })
}

function testDownstreamDeps() {
  Object.keys(config).forEach(key => {
    const projectPath = path.resolve(DOWNSTREAMS_PATH, key);
    process.chdir(projectPath);
    util._exec('yarn test');
  })
}


makeWorkingCopy();
localPublish();
cloneDownstreamProjects();
installDownstreamDeps();
testDownstreamDeps();
