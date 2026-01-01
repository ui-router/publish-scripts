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
const tmp = require('tmp');
const util = require('./util');

const ORIG_DIR = process.cwd();

function publishYalcPackage(installTargetDir, installSource, flags) {
  flags = flags || {};
  const branch = flags.branch || 'origin/master';

  if (!installTargetDir || !installSource) {
    throw new Error('Usage: publish_yalc_package [INSTALL_DIR] [GITHUB_URL|LOCAL_DIR]');
  }

  installTargetDir = path.resolve(installTargetDir);
  const isRemoteSource = !/^\./.exec(installSource);
  const installTargetDirTmp = path.join(installTargetDir, ".tmp");
  const installSourceDir = isRemoteSource ? null : path.resolve(installSource);

  // Create directory and clone git repo or copy from directory, when no cached repo exists yet
  if (!fs.existsSync(path.join(installTargetDir, '.git'))) {
    if (isRemoteSource) {
      util._exec(`git clone ${installSource} ${installTargetDir}`);
    } else {
      shelljs.rm('-rf', installTargetDir);
      shelljs.cp('-r', installSourceDir, installTargetDir);
      process.chdir(installTargetDir);
      util._exec(`git init && git add . && git commit -m "initial commit"`);
      process.chdir(ORIG_DIR);
    }
  }

  // Update the git repo (previously cached, or just created) with changes from the source repo or directory
  if (isRemoteSource) {
    // Update git repo from source and make working copy match exactly
    process.chdir(installTargetDir);
    util._exec('git fetch origin');
    util._exec(`git checkout ${branch}`);
    util._exec(`git reset --hard ${branch}`);
    util._exec('git clean --force -d');
  } else {
    // Update the cached git repo with the current package contents
    process.chdir(installTargetDir);
    util._exec(`rsync -a --delete `+
        `--exclude='/yarn.lock' `+
        `--exclude='/yalc.lock' `+
        `--exclude='/.git/' `+
        `--exclude='**/.git/' `+
        `--exclude='/node_modules/' `+
        `--exclude='**/node_modules/' `+
        `"${installSourceDir}/" "${installTargetDir}/"`);

    // Commit the changes from the current package (if any)
    util._exec('git add . && git diff --staged --quiet || git commit -m "update from source directory"');
  }

  // Update dependencies
  if (!flags.noInstall) {
    util._exec('yarn install --check-files');
  }

  const TEMP = tmp.dirSync();
  const TEMP_DIR = TEMP.name;
  const BUILD_TEMP_DIR = path.resolve(TEMP_DIR, path.basename(installTargetDir));
  if (!flags.noBuild || !flags.noPublish) {
    try {
      shelljs.mv(installTargetDir, TEMP_DIR);
      process.chdir(BUILD_TEMP_DIR);

      const pkgJson = JSON.parse(fs.readFileSync('package.json'));
      if (!flags.noBuild) {
        // Build package
        if (pkgJson.scripts && pkgJson.scripts.build) {
          util._exec('npm run build');
        }
      }

      // If ngPackage is found in package.json, the directory to be published is actually ./dist
      const distDir = pkgJson.distDir || '.';
      if (!flags.noPublish) {
        shelljs.pushd(distDir);
        // Publish to local yalc registry
        util._exec('npx yalc publish');
        shelljs.popd();
      }
    } finally {
      shelljs.mv(BUILD_TEMP_DIR, installTargetDir);
      shelljs.rm('-rf', TEMP_DIR);
    }
  }

  process.chdir(ORIG_DIR);
}

if (require.main === module) {
  publishYalcPackage(process.argv[2], process.argv[3])
}

module.exports = publishYalcPackage;
