#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const util = require('./util');

const ORIG_DIR = process.cwd();

function publishYalcPackage(installDir, githubUrl) {
  if (!installDir || !githubUrl) {
    throw new Error('Usage: publish_yalc_package [INSTALL_DIR] [GITHUB_URL]');
  }

  if (!fs.existsSync(path.join(installDir, '.git'))) {
    util._exec('git clone '+ githubUrl + ' ' + installDir);
  }

  process.chdir(installDir);
  util._exec('git fetch origin');
  util._exec('git reset --hard origin/master');
  util._exec('git clean --force -d');
  util._exec('yarn --check-files');
  util._exec('npm run build');
  util._exec('yalc publish');

  process.chdir(ORIG_DIR);
}

if (require.main === module) {
  publishYalcPackage(process.argv[2], process.argv[3])
}

module.exports = publishYalcPackage;
