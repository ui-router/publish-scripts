#!/usr/bin/env node

// This script is intended to fetch a package from a git url and publish it locally using the npm package `yalc`.
// That package can then be installed from the local yalc registry an tested against by some downstream project.
// This script can optionally fetch from a local directory instead of a git repository.

// The script leaves the files in place after publishing.
// This can be handy in Travis which can cache the directory contents.
// After caching, subsequent re-runs of this script won't have to fetch the git repository (or do much for `yarn install`).
const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const util = require('./util');

const ORIG_DIR = process.cwd();

function publishYalcPackage(installTargetDir, installSource, flags) {
  flags = flags || {};
  if (!installTargetDir || !installSource) {
    throw new Error('Usage: publish_yalc_package [INSTALL_DIR] [GITHUB_URL|LOCAL_DIR]');
  }

  installTargetDir = path.resolve(installTargetDir);
  const isRemoteSource = !/^\./.exec(installSource);
  const installTargetDirTmp = path.join(installTargetDir, ".tmp");
  const installSourceDir = isRemoteSource ? null : path.resolve(installSource);

  // Create directory and clone git repo
  if (!fs.existsSync(path.join(installTargetDir, '.git'))) {
    if (isRemoteSource) {
      util._exec(`git clone --depth 3 ${installSource} ${installTargetDir}`);
    } else {
      shelljs.rm('-rf', installTargetDir);
      shelljs.cp('-r', installSourceDir, installTargetDir);
      process.chdir(installTargetDir);
      util._exec(`git init && git add . && git commit -m "initial commit"`);
      process.chdir(ORIG_DIR);
    }
  }

  // Update git repo from source and make working copy match exactly
  if (isRemoteSource) {
    process.chdir(installTargetDir);
    util._exec('git fetch origin');
    util._exec('git reset --hard origin/master');
    util._exec('git clean --force -d');
  } else {
    // Create a tmp dir with a copy of the current package contents
    shelljs.rm('-rf', installTargetDirTmp);
    shelljs.cp('-r', installSourceDir, installTargetDirTmp);

    // Copy the current .git metadata from the cache dir into the tmp dir
    shelljs.cp('-r', path.join(installTargetDir, ".git"), installTargetDirTmp);
    process.chdir(installTargetDirTmp);

    // Commit the changes from the current package (if any)
    util._exec('git add . && git diff --staged --quiet || git commit -m "update from source directory"');

    process.chdir(installTargetDir);

    // Move the new .git metadata back into the cache dir
    shelljs.rm('-rf', '.git');
    shelljs.mv(path.join('.tmp', '.git'), ".");
    shelljs.rm('-rf', installTargetDirTmp);

    // Update the cache to match the current package contents
    util._exec('git reset --hard master');
    util._exec('git clean --force -d');
  }

  // Update dependencies
  util._exec('yarn install --check-files');

  if (!flags.noBuild) {
    // Build package
    const pkgJson = JSON.parse(fs.readFileSync('package.json'));
    if (pkgJson.scripts && pkgJson.scripts.build) {
      util._exec('npm run build');
    }
  }

  if (!flags.noPublish) {
    // Publish to local yalc registry
    util._exec('yalc publish');
  }

  process.chdir(ORIG_DIR);
}

if (require.main === module) {
  publishYalcPackage(process.argv[2], process.argv[3])
}

module.exports = publishYalcPackage;
