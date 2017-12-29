#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const publishYalcPackage = require('./publish_yalc_package');
const util = require('./util');
util.packageDir();
const PKG_DIR = process.cwd();

const config = JSON.parse(fs.readFileSync('downstream_projects.json'));
const pkgjson = JSON.parse(fs.readFileSync('package.json'));

const DOWNSTREAMS_PATH = path.resolve(PKG_DIR, '.downstream_cache');
const UPSTREAM_PKGS = (process.env.UPSTREAM_PKGS || '').split(',').filter(x => x).concat(pkgjson.name);
const DOWNSTREAM_PKGS = (process.env.DOWNSTREAM_PKGS || '').split(',').filter(x => x);

function forEachDownstream(callback) {
  Object.keys(config).forEach(key => {
    if (DOWNSTREAM_PKGS.length && DOWNSTREAM_PKGS.indexOf(key) === -1) {
      console.log(callback.constructor.name + ": " + key + ' not in DOWNSTREAM_PKGS, skipping...');
      return;
    }

    process.chdir(path.resolve(DOWNSTREAMS_PATH, key));
    callback(key, config[key]);
  });
}

function makeWorkingCopy() {
  process.chdir(PKG_DIR);
  if (!fs.existsSync(DOWNSTREAMS_PATH)) {
    console.log('making .downstream_cache working directory');
    fs.mkdirSync(DOWNSTREAMS_PATH);
  }
}

function localPublish() {
  process.chdir(PKG_DIR);
  console.log('Publishing using yalc...');
  util._exec('yalc publish');
}

function initializeDownstreams() {
  Object.keys(config).forEach(key => {
    const installTargetDir = path.resolve(DOWNSTREAMS_PATH, key);
    const installSource = config[key];
    const flags = { noBuild: true, noPublish: true };
    publishYalcPackage(installTargetDir, installSource, flags);
  });
}

function installUpstreamDeps() {
  UPSTREAM_PKGS.forEach(upstream => util._exec('yalc add ' + upstream));
}

function runTests() {
  util._exec(`UPSTREAM_PKGS="${UPSTREAM_PKGS.join(',')}" npm test`);

  const downstreamPkgJson = JSON.parse(fs.readFileSync('package.json'));
  const hasDownstreamTests = downstreamPkgJson.scripts && !!downstreamPkgJson.scripts['test:downstream'];

  if (hasDownstreamTests) {
    util._exec(`UPSTREAM_PKGS="${UPSTREAM_PKGS.join(',')}" npm run test:downstream`);
  }
}

function revertLocalChanges(key, source) {
  const isRemoteSource = source[0] !== '.';
  const ref = isRemoteSource ? 'origin/master' : 'master';
  util._exec(`git reset --hard ${ref}`);
  util._exec('git clean --force -d');
}

console.log(`      ===> Making working copy <===`);
makeWorkingCopy();

console.log(`      ===> Publishing ${pkgjson.name} to yalc registry <===`);
localPublish();

console.log(`      ===> Fetching downstream projects and their dependencies <===`);
initializeDownstreams();

console.log(`      ===> Installing freshly built upstream packages <===`);
forEachDownstream(installUpstreamDeps);

console.log(`      ===> Running downstream tests <===`);
forEachDownstream(runTests);

console.log(`      ===> Cleaning downstream projects <===`);
forEachDownstream(revertLocalChanges);
