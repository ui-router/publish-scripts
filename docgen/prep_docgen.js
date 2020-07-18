#!/usr/bin/env node
const fs = require('fs');
const childProcess = require('child_process');
const _ = require('lodash');

const WORKDIR = process.cwd();
const PACKAGE_DIR = `${WORKDIR}/project`;
const SRC_DIR = `${PACKAGE_DIR}/src`;
const DOCGENCONFIG_PATH = `${PACKAGE_DIR}/docgen.json`;
const TSCONFIG_PATH = `${PACKAGE_DIR}/tsconfig.json`;
const PACKAGEJSON_PATH = `${PACKAGE_DIR}/package.json`;

if (!fs.existsSync(SRC_DIR)) { throw new Error(`${SRC_DIR} does not exist`) }
if (!fs.existsSync(DOCGENCONFIG_PATH)) { throw new Error(`${DOCGENCONFIG_PATH} does not exist`); }

const PACKAGEJSON = JSON.parse(fs.readFileSync(PACKAGEJSON_PATH));
const DOCGENCONFIG = getDocgenConfig();
const TSCONFIG_COPY = JSON.parse(fs.readFileSync(TSCONFIG_PATH).toString());

// Merge tsconfig block from docgen.json into tsconfig.json
_.merge(TSCONFIG_COPY, DOCGENCONFIG.tsconfig);
fs.writeFileSync(`${WORKDIR}/tsconfig.json`, JSON.stringify(TSCONFIG_COPY, null, 2));

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

// Fetch all included packages (i.e., core module)
const CLONE_COMMANDS = ['#!/usr/bin/env bash', 'set -x'];

(DOCGENCONFIG.include || []).forEach(include => {
  const { pkg, repo, branch } = include;
  const semver = ['peerDependencies', 'dependencies', 'devDependencies']
    .map((key) => (PACKAGEJSON[key] || {})[pkg])
    .find((x) => !!x);

  const version = branch || findSemverPackage(pkg, semver);
  CLONE_COMMANDS.push(`./clone.sh ${repo} ${PACKAGE_DIR}/src/includes/${pkg} ${version}`);
});

fs.writeFileSync('clone_repos.sh', CLONE_COMMANDS.join('\n'));

// Finds the newest version of a package published to NPM that matches the desired semver range
function findSemverPackage(packageName, semver) {
  const stdout = childProcess.execSync(`npm info ${packageName}@${semver} version`).toString();
  const lines = stdout.split(/\n/).filter(x => x.length);
  if (lines.length === 0) {
    throw new Error(`No published package matched ${packageName}@${semver}`)
  } else if (lines.length === 1) {
    return lines[ 0 ];
  } else {
    const line = stdout.trim().split(/\n/).pop().trim();
    const [, version] = /.* '(.*)'$/.exec(line) || [];
    if (!version) {
      console.log({ stdout, line });
      throw new Error(`Couldn't find version matching ${packageName}@${semver} in npm registry`)
    }
    return version;
  }
}
