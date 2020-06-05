#!/usr/bin/env node

const findSemverPackage = require('./findSemverPackage');
const shelljs = require('shelljs');
const nodeCleanup = require('node-cleanup');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const util = require('./util');
const _exec = util._exec;
const options = require('yargs').option('noclean', { boolean: true, default: false }).argv;

const PACKAGE_DIR = process.cwd();
const SRC_DIR = `${PACKAGE_DIR}/src`;
const DOCGENCONFIG_PATH = `${PACKAGE_DIR}/docgen.json`;
const TSCONFIG_PATH = `${PACKAGE_DIR}/tsconfig.json`;
const PACKAGEJSON_PATH = `${PACKAGE_DIR}/package.json`;

util.packageDir();

if (!fs.existsSync(SRC_DIR)) { throw new Error(`${SRC_DIR} does not exist`) }
if (!fs.existsSync(DOCGENCONFIG_PATH)) { throw new Error(`${DOCGENCONFIG_PATH} does not exist`); }

const PACKAGEJSON = JSON.parse(fs.readFileSync(PACKAGEJSON_PATH));
const DOCGENCONFIG = getDocgenConfig();
const TSCONFIG_ORIG = JSON.parse(fs.readFileSync(TSCONFIG_PATH));
const TSCONFIG_COPY = _.cloneDeep(TSCONFIG_ORIG);

const cleanupFns = [];

// Merge tsconfig block from docgen.json into tsconfig.json
_.defaultsDeep(TSCONFIG_COPY, DOCGENCONFIG.tsconfig);
fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(TSCONFIG_COPY, null, 2));
cleanupFns.push(() => fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(TSCONFIG_ORIG, null, 2)));
shelljs.cat(TSCONFIG_PATH);

function getDocgenConfig() {
  const config = JSON.parse(fs.readFileSync(DOCGENCONFIG_PATH));
  const requiredKeys = ['navigation', 'tsconfig'];
  const missing = requiredKeys.find((key) => !_.has(config, key));
  if (missing) {
    console.error(`${DOCGENCONFIG_PATH} does not contain configuration key: '${missing}'`);
    process.exit(1);
  }
  return config;
}

// Register hook to cleanup temp directories
nodeCleanup(() => {
  util.packageDir();
  if (!options.noclean) {
    cleanupFns.forEach(fn => fn());
  }
});

// Fetch all included packages (i.e., core module)
const includes = DOCGENCONFIG.include || [];
includes.forEach((include) => {
  const { pkg, repo } = include;
  const semver = ['peerDependencies', 'dependencies', 'devDependencies']
    .map((key) => (PACKAGEJSON[key] || {})[pkg])
    .find((x) => !!x);

  const INSTALLDIR = `${SRC_DIR}/${pkg}`;
  shelljs.mkdir('-p', INSTALLDIR);
  if (!fs.existsSync(path.join(INSTALLDIR, '.git'))) {
    _exec(`git clone ${repo} ${INSTALLDIR}`);
    cleanupFns.push(() => shelljs.rm('-rf', INSTALLDIR));
  }

  const version = findSemverPackage(pkg, semver);
  shelljs.pushd(INSTALLDIR)
  _exec(`git checkout ${version}`);
  shelljs.popd()
});

// run typedoc command
_exec(`npx typedoc`);
