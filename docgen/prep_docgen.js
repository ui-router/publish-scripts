#!/usr/bin/env node
const fs = require('fs');
const childProcess = require('child_process');

const WORKDIR = process.cwd();
const PACKAGE_DIR = `${WORKDIR}/project`;
const SRC_DIR = `${PACKAGE_DIR}/src`;
const PACKAGEJSON_PATH = `${PACKAGE_DIR}/package.json`;

if (!fs.existsSync(SRC_DIR)) {
  throw new Error(`${SRC_DIR} does not exist`);
}
if (!fs.existsSync(PACKAGEJSON_PATH)) {
  throw new Error(`${PACKAGEJSON_PATH} does not exist`);
}

const PACKAGEJSON = JSON.parse(fs.readFileSync(PACKAGEJSON_PATH));
const DOCGENCONFIG = getDocgenConfig(PACKAGEJSON);

function getDocgenConfig(packageJson) {
  const requiredKeys = ['docgen', 'docgen.navigation', 'docgen.publishDir'];
  const missing = requiredKeys.find(
    (key) => key.split('.').reduce((acc, k) => acc && acc[k], packageJson) === undefined,
  );
  if (missing) {
    console.error(`${PACKAGEJSON_PATH} does not contain configuration key: '${missing}'`);
    process.exit(1);
  }
  return packageJson.docgen;
}

// Fetch all included packages (i.e., core module)
const CLONE_COMMANDS = ['#!/usr/bin/env bash', 'set -x'];

(DOCGENCONFIG.include || []).forEach((include) => {
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
  const lines = stdout.split(/\n/).filter((x) => x.length);
  if (lines.length === 0) {
    throw new Error(`No published package matched ${packageName}@${semver}`);
  } else if (lines.length === 1) {
    return lines[0];
  } else {
    const line = stdout.trim().split(/\n/).pop().trim();
    const [, version] = /.* '(.*)'$/.exec(line) || [];
    if (!version) {
      console.log({ stdout, line });
      throw new Error(`Couldn't find version matching ${packageName}@${semver} in npm registry`);
    }
    return version;
  }
}
