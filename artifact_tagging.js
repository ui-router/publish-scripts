#!/usr/bin/env node

const util = require('./util');
util.packageDir();

const shx = require('shelljs');
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
let _exec = util._exec;
let _execInteractive = util._execInteractive;

const CONFIG = JSON.parse(fs.readFileSync('./artifacts.json'));
const COMMIT_ARTIFACTS = CONFIG.ARTIFACTS;

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const version = pkg.version;

let widen = false,
  npm = false,
  githubtag = false;
let coreDep = pkg.dependencies['@uirouter/core'];
let isNarrow = /^[[=~]?(\d.*)/.exec(coreDep);
let widenedDep = isNarrow && '^' + isNarrow[1];

if (isNarrow && readlineSync.keyInYN('Widen @uirouter/core dependency from ' + coreDep + ' to ' + widenedDep + '?')) {
  widen = false;
}

if (readlineSync.keyInYN('Publish to NPM')) {
  npm = true;
}

if (readlineSync.keyInYN('publish to Github Tag?')) {
  githubtag = true;
}

if (!npm && !githubtag) {
  process.exit(1);
}

const label = githubtag && npm ? 'npm package and github tag' : npm ? 'npm package' : 'github tag';

const YYYYMMDD = (function () {
  const date = new Date();
  const year = date.getFullYear();

  let month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;

  let day = date.getDate();
  day = (day < 10 ? '0' : '') + day;

  return year + month + day;
})();

let tagname = `SNAPSHOT-${YYYYMMDD}`;
let pkgver = `-SNAPSHOT.${YYYYMMDD}`;

if (githubtag) {
  tagname += readlineSync.question(`Suffix for tag ${tagname} (optional)?`);
}

if (npm) {
  pkgver += readlineSync.question(`Suffix for package version ${pkgver} (optional)?`);
}

if (!readlineSync.keyInYN(`Ready to publish ${label}?`)) {
  process.exit(1);
}

util.ensureCleanMaster('master');

// then tag and push tag
_exec(`git checkout -b ${tagname}-prep`);

pkg.dependencies['@uirouter/core'] = widenedDep;
pkg.version += pkgver;

fs.writeFileSync('package.json', JSON.stringify(pkg, undefined, 2));
_exec(`git commit -m "Widening @uirouter/core dependency range to ${widenedDep}" package.json`);

_exec(`npm run package`);

if (npm) {
  let output = _exec(`npm dist-tag ls ${pkg.name}`).stdout;
  let latest = output
    .split(/[\r\n]/)
    .map((line) => line.split(': '))
    .filter((linedata) => linedata[0] === 'latest')[0];

  if (!latest) {
    throw new Error(`Could not determine value of "latest" dist-tag for ${pkg.name}`);
  }

  console.log('\nPublishing to npm (you may be prompted for 2FA)...\n');
  _execInteractive(`npm publish`);
  _exec(`npm dist-tag add ${pkg.name}@${latest[1]} latest`);
}

if (githubtag) {
  _exec(`git add --force ${COMMIT_ARTIFACTS.join(' ')}`);
  _exec(`git rm yarn.lock`);

  _exec(`git commit -m 'chore(*): commiting build files'`);
  _exec(`git tag ${tagname}`);
  _exec(`git push -u origin ${tagname}`);
}

_exec(`git checkout master`);
_exec(`git branch -D ${tagname}-prep`);
