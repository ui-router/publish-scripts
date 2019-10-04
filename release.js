#!/usr/bin/env node

require('./util').packageDir();
require('shelljs/global');
const open = require('open');

const readlineSync = require('readline-sync');
const shelljs = require('shelljs');
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const packageJson = JSON.parse(fs.readFileSync('package.json'));
const modifiedFiles = [];

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
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + "\n");
  modifiedFiles.push('package.json');

  if (yargs.argv.bower) {
    const bowerJson = fs.readFileSync('bower.json');
    bowerJson.version = version;
    fs.writeFileSync('bower.json', JSON.stringify(bowerJson, null, 2) + "\n");
    modifiedFiles.push('bower.json');
  }
}


// Generate changelog
let changelog;
if (readlineSync.keyInYN('\n\nUpdate CHANGELOG?')) {
  const depsArg = yargs.argv.deps ? `--deps ${yargs.argv.deps.join(' ')}` : '';
  const show_changelog = path.resolve(__dirname, 'show_changelog.js');

  changelog = _exec(`${show_changelog} ${depsArg}`, true).stdout;

  console.log('CHANGELOG:\n\n');
  console.log(changelog);

  const tempChangelogFile = `CHANGELOG.md.${version}`;
  fs.writeFileSync(tempChangelogFile, changelog);

  console.log(`Wrote changelog to temp file: ${tempChangelogFile}`);
  if (!readlineSync.keyInYN('Does the CHANGELOG look OK?')) {
    process.exit(1);
  }

  let existingChangelog = fs.readFileSync('CHANGELOG.md');
  changelog = fs.readFileSync(tempChangelogFile);
  fs.writeFileSync('CHANGELOG.md', changelog + '\n' + existingChangelog);
  fs.unlinkSync(tempChangelogFile);
  modifiedFiles.push('CHANGELOG.md');
}


// Run tests
if (readlineSync.keyInYN('Run tests?')) {
  _exec('npm test')
}


// Commit and push changes
if (!readlineSync.keyInYN('Ready to publish?')) {
  console.log(`\n\nRun this command to undo changes:\n\ngit checkout ${modifiedFiles.join(' ')}\n\n`);
  process.exit(1);
}

if (!yargs.argv.dryrun) {
  _exec(`git commit -m ${version} ${modifiedFiles.join(' ')}`);
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
    console.log(`\n\n1) Update the GitHub release with the release notes/CHANGELOG`);
    console.log(`\n   (Make sure you see "\u2714 Existing tag")`);

    if (haspbcopy) {
      fs.writeFileSync('CHANGELOG.tmp', changelog);
      _exec('pbcopy < CHANGELOG.tmp', true);
      fs.unlinkSync('CHANGELOG.tmp');
      console.log(`(The CHANGELOG has been copied to your clipboard)`);
    } else {
      console.log('CHANGELOG:\n\n');
      console.log(changelog);
    }
    console.log(`\n${githuburl}/releases/edit/${version}`);
    open(`${githuburl}/releases/edit/${version}`);
  }

  console.log(`\n\n2) Check for milestones`);
  console.log(`\n${githuburl}/milestones`);

  console.log(`\n\n\n`);
} else {
  console.log("Could not determine github URL from package.json")
}

// Generate docs
util.packageDir();
if (fs.existsSync('typedoc.json') && readlineSync.keyInYN('Generate docs?')) {
  _exec('generate_docs');
  _exec('publish_docs');
}
