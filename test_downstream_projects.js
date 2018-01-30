#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const shelljs = require('shelljs');

const publishYalcPackage = require('./publish_yalc_package');
const util = require('./util');
util.packageDir();
const PKG_DIR = process.cwd();

const config = JSON.parse(fs.readFileSync('downstream_projects.json'));
const pkgjson = JSON.parse(fs.readFileSync('package.json'));

const DOWNSTREAM_CACHE = path.resolve(PKG_DIR, '.downstream_cache');
const TEMP = tmp.dirSync();
const TEMP_DIR = TEMP.name;

const UPSTREAM_PKGS = (process.env.UPSTREAM_PKGS || '').split(',').filter(x => x).concat(pkgjson.name);
const DOWNSTREAM_PKGS = (process.env.DOWNSTREAM_PKGS || '').split(',').filter(x => x);

function forEachDownstream(callback) {
  Object.keys(config).forEach(key => {
    if (DOWNSTREAM_PKGS.length && DOWNSTREAM_PKGS.indexOf(key) === -1) {
      console.log(callback.constructor.name + ": " + key + ' not in DOWNSTREAM_PKGS, skipping...');
      return;
    }

    process.chdir(path.resolve(DOWNSTREAM_CACHE, key));
    callback(key, config[key]);
  });
}

function makeDownstreamCache() {
  if (!fs.existsSync(DOWNSTREAM_CACHE)) {
    console.log('making .downstream_cache working directory');
    fs.mkdirSync(DOWNSTREAM_CACHE);
  }
}

function localPublish() {
  process.chdir(PKG_DIR);
  console.log('Publishing using yalc...');
  util._exec('yalc publish');
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

function revertLocalChanges(source) {
  const isRemoteSource = source[0] !== '.';
  const ref = isRemoteSource ? 'origin/master' : 'master';
  util._exec(`git reset --hard ${ref}`);
  util._exec('git clean --force -d');
}

try {
  console.log(`      ===> Making .downstream_cache working directory <===`);
  makeDownstreamCache();

  console.log(`      ===> Publishing ${pkgjson.name} to yalc registry <===`);
  localPublish();

  Object.keys(config).forEach(key => {
    if (DOWNSTREAM_PKGS.length && DOWNSTREAM_PKGS.indexOf(key) === -1) {
      console.log(callback.constructor.name + ": " + key + ' not in DOWNSTREAM_PKGS, skipping...');
      return;
    }

    const DOWNSTREAM_PACKAGE_DIR = path.resolve(DOWNSTREAM_CACHE, key);
    process.chdir(PKG_DIR);

    console.log(`      ===> Fetching downstream project '${key}' and its dependencies <===`);
    const installTargetDir = DOWNSTREAM_PACKAGE_DIR;
    const installSource = config[key];
    const flags = { noBuild: true, noPublish: true };
    publishYalcPackage(installTargetDir, installSource, flags);

    console.log(`      ===> Installing freshly built upstream packages <===`);
    process.chdir(DOWNSTREAM_PACKAGE_DIR);
    installUpstreamDeps();

    const DOWNSTREAM_PACKAGE_TEMP_DIR = path.resolve(TEMP_DIR, path.basename(DOWNSTREAM_PACKAGE_DIR));
    try {
      console.log(`      ===> Moving downstream project '${key}' to temp dir '${TEMP_DIR}' <===`);
      shelljs.mv(DOWNSTREAM_PACKAGE_DIR, TEMP_DIR);

      console.log(`      ===> Running downstream tests <===`);
      process.chdir(DOWNSTREAM_PACKAGE_TEMP_DIR);
      runTests();
    } finally {
      console.log(`      ===> Moving downstream project '${key}' back from temp dir <===`);
      shelljs.mv(DOWNSTREAM_PACKAGE_TEMP_DIR, DOWNSTREAM_CACHE);
    }

    console.log(`      ===> Cleaning downstream project '${key}' <===`);
    process.chdir(DOWNSTREAM_PACKAGE_DIR);
    revertLocalChanges(installSource);
  });
} finally {
  shelljs.rm('-rf', TEMP_DIR)
}
