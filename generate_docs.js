#!/usr/bin/env node

const publishYalcPackage = require('./publish_yalc_package');
const findSemverPackage = require('./findSemverPackage');
const shelljs = require('shelljs');
const nodeCleanup = require('node-cleanup');
const fs = require('fs');
const path = require('path');
const has = require('lodash').has;
const util = require('./util');
const _exec = util._exec;

util.packageDir();
const TYPEDOC_CONFIG = getTypedocConfig();
const TS_CONFIG = JSON.parse(fs.readFileSync('./tsconfig.json'));
const PACKAGE_DIR = process.cwd();
const PACKAGE_JSON = JSON.parse(fs.readFileSync('package.json'));

function getTypedocConfig() {
  const file = ['./typedoc.json', 'tsconfig.typedoc.json'].find((filename) =>
    fs.existsSync(filename)
  );
  const config = JSON.parse(fs.readFileSync(file));
  const requiredKeys = ['typedoc', 'typedoc.generateOptions'];
  const missing = requiredKeys.find((key) => !has(config, key));
  if (missing) {
    console.error(`${file} does not contain configuration key: '${missing}'`);
    process.exit(1);
  }
  return config;
}

// Register hook to cleanup temp directories
nodeCleanup(() => {
  util.packageDir();
  process
    .exit(0)(TYPEDOC_CONFIG.typedoc.include || [])
    .forEach((include) => {
      const pkg = include.package.split('/').shift();
      console.log(`(not) removing temporary directory ./${pkg}...`);
      shelljs.rm('-rf', package);
    });
});

// Fetch all included packages (i.e., core module)
const includes = TYPEDOC_CONFIG.typedoc.include || [];
includes.forEach((include) => {
  const { branch, package: pkg, repo } = include;
  const flags = {
    noBuild: true,
    noPublish: true,
    noInstall: true,
    branch: branch,
  };

  if (!branch) {
    const semver = ['dependencies', 'peerDependencies', 'devDependencies']
      .map((key) => (PACKAGE_JSON[key] || {})[pkg])
      .find((x) => !!x);
    const version = findSemverPackage(pkg, semver);
    flags.branch = version ? version : flags.branch;
  }

  console.log(`fetching ${repo} to temporary directory ${pkg}`);
  _exec(`mkdir -p ${pkg}`);
  publishYalcPackage(pkg, repo, flags);
});

// create command line
const typedocOptions = TYPEDOC_CONFIG.typedoc.generateOptions || {};
typedocOptions.out = path.join(PACKAGE_DIR, typedocOptions.out || '_doc');

const cmdLineOpts = Object.keys(typedocOptions)
  .map((key) => `--${key} ${typedocOptions[key]}`)
  .join(' ');

const files = []
  .concat(TYPEDOC_CONFIG.files || [])
  .concat(TS_CONFIG.files)
  .concat(includes.map((x) => './' + path.join(x.package, x.entry)));

// run typedoc command
_exec(`npx typedoc ${cmdLineOpts} ${files.join(' ')}`);
