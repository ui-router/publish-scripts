#!/usr/bin/env node

require('./util').packageDir();
require('shelljs/global');

const readlineSync = require('readline-sync');
const fs = require('fs');
const util = require('./util');
const _exec = util._exec;

let version = JSON.parse(fs.readFileSync('./package.json')).version;

if (!readlineSync.keyInYN('Did you bump the version number in package.json?')) {
  process.exit(1);
}

if (!readlineSync.keyInYN('Did you update CHANGELOG.md using scripts/update_changelog.js?')) {
  process.exit(1);
}

if (!readlineSync.keyInYN('Did you push all changes back to origin?')) {
  process.exit(1);
}

if (!readlineSync.keyInYN('Ready to publish?')) {
  process.exit(1);
}

util.ensureCleanMaster('master');
_exec(`npm publish`);
_exec(`git tag ${version}`);
_exec(`git push origin ${version}`);
