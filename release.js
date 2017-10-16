#!/usr/bin/env node

require('./util').packageDir();
require('shelljs/global');

const readlineSync = require('readline-sync');
const shelljs = require('shelljs');
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const packageJson = JSON.parse(fs.readFileSync('package.json'));

const yargs = require('yargs')
    .option('dryrun', {
      alias: ['dry-run', 'd'],
      description: 'Dry run: Ignores dirty working copy and does not commit or publish anything.',
      boolean: true,
    })
    .option('deps', {
      description: 'Deps to include in changelog',
      array: true,
    });

const util = require('./util');
const _exec = util._exec;

if (yargs.argv.dryrun) {
  console.log('Dry run mode...')
} else {
  util.ensureCleanMaster('master');
}


// Bump version
const currentVersion = JSON.parse(fs.readFileSync('./package.json')).version;
const versionBumps = ['patch', 'minor', 'major', 'none'];

const versionBump = versionBumps[readlineSync.keyInSelect(versionBumps, `Current version: ${currentVersion} ; bump version?`)];
if (!versionBump) {
  process.exit(1);
}

let version = currentVersion;
if (versionBump !== 'none') {
  version = semver.inc(currentVersion, versionBump);

  console.log(`Bumping version: ${version}`);

  packageJson.version = version;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}


// Generate changelog
let changelog;
if (readlineSync.keyInYN('\n\nUpdate CHANGELOG?')) {
  const depsArg = yargs.argv.deps ? `--deps ${yargs.argv.deps}` : '';
  const show_changelog = path.resolve(__dirname, 'show_changelog.js');

  changelog = _exec(`${show_changelog} ${depsArg}`, true).stdout;

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
  console.log('\n\nUndo changes:\n\ngit checkout CHANGELOG.md package.json\n\n');
  process.exit(1);
}

if (!yargs.argv.dryrun) {
_exec(`git ci -m ${version} package.json CHANGELOG.md`);
}

if (!yargs.argv.dryrun) {
  util.ensureCleanMaster('master');
}


// Publish to NPM and push to github
if (!yargs.argv.dryrun) {
  _exec(`npm publish`);
  _exec(`git tag ${version}`);
  _exec(`git push origin master`);
  _exec(`git push origin ${version}`);
}


// Help with manual steps
let githuburl = packageJson.repository && packageJson.repository.url;
githuburl = githuburl && githuburl.replace(/^git\+/, '').replace(/\.git$/, '');

if (githuburl) {
  if (changelog) {
    const haspbcopy = shelljs.exec(`which pbcopy`, true).code === 0;
    console.log(`\n\n1) Update the GitHub tag with release notes/CHANGELOG`);

    if (haspbcopy) {
      fs.writeFileSync('CHANGELOG.tmp', changelog);
      _exec('pbcopy < CHANGELOG.tmp', true);
      fs.unlinkSync('CHANGELOG.tmp');
      console.log(`(The CHANGELOG has been copied to your clipboard)`);
    } else {
      console.log('CHANGELOG:\n\n');
      console.log(changelog);
    }
    console.log(`\n${githuburl}/releases/tag/${version}`);
  }

  console.log(`\n\n2) Check for milestones`);
  console.log(`\n${githuburl}/milestones`);

  console.log(`\n\n\n`);
} else {
  console.log("Could not determine github URL from package.json")
}

