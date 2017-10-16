#!/usr/bin/env node

require('./util').packageDir();
require('shelljs/global');

const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const packageJson = JSON.parse(fs.readFileSync('package.json'));

const yargs = require('yargs')
    .option('allowdirty', {
      description: 'Ignore dirty working copy',
      boolean: true,
    })
    .option('deps', {
      description: 'Deps to include in changelog',
      array: true,
    });

const util = require('./util');
const _exec = util._exec;

if (!yargs.argv.allowdirty) {
  util.ensureCleanMaster('master');
}


// Bump version
const currentVersion = JSON.parse(fs.readFileSync('./package.json')).version;
const versionBumps = ['patch', 'minor', 'major', 'none'];

const versionBump = versionBumps[readlineSync.keyInSelect(versionBumps, `Current version: ${currentVersion} ; bump version?`)];
if (!versionBump) {
  process.exit(1);
}

if (versionBump !== 'none') {
  const version = semver.inc(currentVersion, versionBump);

  console.log(`Bumping version: ${version}`);

  packageJson.version = version;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}


// Generate changelog
if (readlineSync.keyInYN('Update CHANGELOG?')) {
  const depsArg = yargs.argv.deps ? `--deps ${yargs.argv.deps}` : '';
  const show_changelog = path.resolve(__dirname, 'show_changelog.js');

  const changelog = _exec(`${show_changelog} ${depsArg}`, true).stdout;

  console.log('CHANGELOG:\n\n');
  console.log(changelog);

  if (!readlineSync.keyInYN('Does the CHANGELOG look OK?')) {
    process.exit(1);
  }

  let fullChangelog = fs.readFileSync('CHANGELOG.md');
  fs.writeFileSync('CHANGELOG.md', changelog + '\n' + fullChangelog);
}


// Commit and push changes
if (!readlineSync.keyInYN('Ready to publish?')) {
  console.log('Undo changes:\n\ngit checkout CHANGELOG.md package.json\n\n');
  process.exit(1);
}

_exec(`git ci -m ${version} package.json CHANGELOG.md`);

if (!yargs.argv.allowdirty) {
  util.ensureCleanMaster('master');
}

_exec(`npm publish`);
_exec(`git tag ${version}`);
_exec(`git push origin master`);
_exec(`git push origin ${version}`);
