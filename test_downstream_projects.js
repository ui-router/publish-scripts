#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const shelljs = require('shelljs');
const _ = require('lodash');
const isTravis = !!process.env.TRAVIS;
const isGithubActions = !!process.env.GITHUB_ACTIONS;

const yargs = require('yargs')
    .option('group', {
      alias: 'g',
      default: 'all',
      description: 'the group of projects to test (from downstream_projects.json "group" key)',
    })
    .option('workspace', {
      alias: 'ws',
      description: 'use yarn workspace to save space',
    });

const nodeCleanup = require('node-cleanup');
const publishYalcPackage = require('./publish_yalc_package');
const foldStart = (message) => {
  isTravis && console.log('travis_fold:start:' + message.replace(/\s+/g, '.'));
  isGithubActions && console.log('::group::' + message);
  console.log(message);
  return () => {
    isTravis && console.log('travis_fold:end:' + message.replace(/\s+/g, '.'));
    isGithubActions && console.log(message);
    isGithubActions && console.log('::endgroup::');
  };
};
let foldEnd = () => null;

const util = require('./util');
util.packageDir();
const PKG_DIR = process.cwd();

const pkgjson = JSON.parse(fs.readFileSync('package.json'));
const DOWNSTREAM_PKGS = (process.env.DOWNSTREAM_PKGS || '').split(',').filter(x => x);

const TEMP = tmp.dirSync();
const TEMP_DIR = TEMP.name;
const TEMP_DOWNSTREAM_CACHE = path.resolve(TEMP_DIR, '.downstream_cache');
const DOWNSTREAM_CACHE = path.resolve(PKG_DIR, '.downstream_cache');

function parseConfig() {
  const config = JSON.parse(fs.readFileSync('downstream_projects.json'));
  const configBlock = _.toPairs(config.projects || config);

  // Object values are groups (nested config).  string values are github url or local file path
  const isGroup = ([key, value]) => typeof value === 'object';
  const groupsAsPairs = configBlock.filter(pair => isGroup(pair));
  const ungroupedProjectsAsPairs = configBlock.filter(pair => !isGroup(pair));

  const allGroupedProjectPairs = _.flatten(groupsAsPairs.map(([name, groupedProjects]) => _.toPairs(groupedProjects)));

  const groups = _.fromPairs(groupsAsPairs);
  groups.all = _.fromPairs(allGroupedProjectPairs.concat(ungroupedProjectsAsPairs));

  const projects = groups[yargs.argv.group];
  if (!projects) {
    throw new Error(`Attempting to run tests for a group named ${yargs.argv.group}, but no matching group was found in downstream_projects.json`);
  }

  const nohoist = (config.projects && config.nohoist) || [];
  return { projects, nohoist };
}

const { projects, nohoist } = parseConfig();

function makeDownstreamCache() {
  if (!fs.existsSync(DOWNSTREAM_CACHE)) {
    console.log('           ===> making .downstream_cache working directory <===');
    fs.mkdirSync(DOWNSTREAM_CACHE);
  }
}

function localPublish(packageDir) {
  packageDir = packageDir || PKG_DIR;
  process.chdir(packageDir);
  console.log(`           ===> Building ${packageDir} and publishing using yalc... <===`);
  util._exec('yarn build');

  // Un-yalc any deps in the package.json (after building, but before yalc publishing)
  const packageString = fs.readFileSync('package.json');
  const package = JSON.parse(packageString);
  const distDir =  package.distDir || '.';
  const { resolutions = {}, dependencies = {}, devDependencies = {} } = package;

  const yalcLockfile = fs.existsSync('yalc.lock') ? JSON.parse(fs.readFileSync('yalc.lock')) : {};
  const yalcPackages = Object.keys(yalcLockfile.packages || {})

  yalcPackages.forEach(pkg => {
    delete resolutions[pkg];

    if (dependencies[pkg]) {
      dependencies[pkg] = yalcLockfile.packages[pkg].replaced;
    }

    if (devDependencies[pkg]) {
      devDependencies[pkg] = yalcLockfile.packages[pkg].replaced;
    }
  });

  if (yalcPackages.length) {
    console.log(`           ===> De-yalc'ed ${yalcPackages.join(', ')} from ${packageDir}/package.json using ${packageDir}/yarn.lock <===`)
    fs.writeFileSync('package.json', JSON.stringify(package, null, 2));
  }

  shelljs.pushd(distDir);
  util._exec('npx yalc publish');
  shelljs.popd();

  if (yalcPackages.length) {
    console.log(`           ===> Restoring yalc'd manifest ${packageDir}/package.json <===`)
    fs.writeFileSync('package.json', packageString);
  }
}

function installUpstreamDeps(upstreamPackages) {
  upstreamPackages.forEach(upstream => {
    util._exec('npx yalc add ' + upstream);
  });

  upstreamPackages.forEach(upstream => {
    const package = JSON.parse(fs.readFileSync('package.json'));
    const yalcDep = (package.dependencies || {})[upstream] || (package.devDependencies || {})[upstream];
    package.resolutions = package.resolutions || {};
    package.resolutions[upstream] = yalcDep;
    fs.writeFileSync('package.json', JSON.stringify(package, null, 2));
  });

  // Install updated deps from the upstream
  // If local changes point to a new version of @uirouter/core, for example
  util._exec('npx yarn');
  util._exec('npx check-peer-dependencies --install');
}

function runTests() {
  util._exec(`npm test`);
}

function revertLocalChanges(source) {
  const isRemoteSource = source[0] !== '.';
  const ref = isRemoteSource ? 'origin/master' : 'master';
  util._exec(`git reset --hard ${ref}`);
  util._exec('git clean --force -d');
}

function fetchDownstreamProjects(downstreamConfig, prefix, downstreamTreeNode) {
  prefix = prefix || "";

  Object.keys(downstreamConfig).forEach(key => {
    const installDir = prefix ? `${prefix}.${key}` : key;

    console.log(`           ===> Fetching downstream project to '${installDir}' <===`);
    const installSource = downstreamConfig[key];
    const isFile = /^\./.exec(installSource);
    const installSourcePath = prefix ? path.resolve(DOWNSTREAM_CACHE, prefix, installSource) : path.resolve(PKG_DIR, installSource);
    const installSourceForYalc = isFile ? './' + path.relative(process.cwd(), installSourcePath) : installSource;
    const flags = { noBuild: true, noPublish: true, noInstall: true };
    publishYalcPackage(path.resolve(DOWNSTREAM_CACHE, installDir), installSourceForYalc, flags);

    const children = {};
    downstreamTreeNode[key] = { installDir, installSource, children };

    const nestedDownstreamConfigPath = path.resolve(DOWNSTREAM_CACHE, installDir, 'downstream_projects.json');
    if (fs.existsSync(nestedDownstreamConfigPath)) {
      const nestedDownstreamConfig = JSON.parse(fs.readFileSync(nestedDownstreamConfigPath));
      fetchDownstreamProjects(nestedDownstreamConfig.projects || nestedDownstreamConfig, installDir, children);
    }
  });
}

function getDownstreamInstallDirs(downstreamTreeNode) {
  const children = Object.keys(downstreamTreeNode.children);
  const childrenInstallDirs = children.map(key => getDownstreamInstallDirs(downstreamTreeNode.children[key]));
  return [downstreamTreeNode.installDir]
      .concat(childrenInstallDirs)
      .reduce((acc, arr) => acc.concat(arr), [])
      .filter(x => !!x);
}

function installWorkspaceDependencies(downstreamInstallDirs) {
  const yarnWorkspacePackageJsonPath = path.resolve(DOWNSTREAM_CACHE, "package.json");
  const yarnWorkspacePackageJson = {
    private: true,
    "workspaces": {
      "packages": downstreamInstallDirs,
      "nohoist": nohoist.concat([ "**/webpack", "**/karma-webpack", ])
    }
  };

  fs.writeFileSync(yarnWorkspacePackageJsonPath, JSON.stringify(yarnWorkspacePackageJson, null, 2));
  process.chdir(DOWNSTREAM_CACHE);
  util._exec('yarn');
}

let runningTestsFor;
function runDownstreamTests(key, upstreamPackages, downstreamTreeNode, successLog) {
  if (DOWNSTREAM_PKGS.length && DOWNSTREAM_PKGS.indexOf(key) === -1) {
    console.log(`           ===> ${key} not in DOWNSTREAM_PKGS, skipping... <===`);
    return;
  }

  process.chdir(TEMP_DOWNSTREAM_CACHE);

  const name = downstreamTreeNode.installDir;

  foldEnd = foldStart(`Running downstream tests: '${name}'`)
  runningTestsFor = name;

  console.log(`           ===> '${name}': prepping tests <===`);
  process.chdir(downstreamTreeNode.installDir);

  if (!yargs.argv.workspace) {
    console.log(`           ===> '${name}': Installing dependencies <===`);
    util._exec('yarn');
  }

  console.log(`           ===> '${name}': Installing freshly built upstream packages <===`);
  installUpstreamDeps(upstreamPackages);

  console.log(`           ===> '${name}': Running tests <===`);
  runTests();

  successLog.push(key);
  runningTestsFor = undefined;

  console.log(`           ===> '${name}': Reverting working copy <===`);
  revertLocalChanges(downstreamTreeNode.installSource);

  foldEnd();

  const downstreamChildren = Object.keys(downstreamTreeNode.children || {});
  if (downstreamChildren.length) {
    const thisPkg = JSON.parse(fs.readFileSync('package.json')).name;
    const upstreams = upstreamPackages.concat(thisPkg);

    foldEnd = foldStart(`Local Yalc Publish: ${process.cwd().replace(/.*\//, '')}`);
    localPublish(process.cwd());
    foldEnd();

    downstreamChildren.forEach(child => {
      runDownstreamTests(child, upstreams, downstreamTreeNode.children[child], successLog);
    });
  }
}

console.log(`           ===> Creating .downstream_cache working directory <===`);
makeDownstreamCache();

foldEnd = foldStart(`Publishing ${pkgjson.name} to yalc registry`);
localPublish();
foldEnd();

foldEnd = foldStart(`Fetching downstream projects`);
const tree = { children: {} };
fetchDownstreamProjects(projects, "", tree.children);
foldEnd();

if (yargs.argv.workspace) {
  foldEnd = foldStart(`Installing downstream dependencies`);
  const downstreamDirs = getDownstreamInstallDirs(tree);
  installWorkspaceDependencies(downstreamDirs);
  foldEnd();
}

console.log(`           ===> Moving working directory to temp dir ${TEMP_DIR} <===`);
shelljs.mv(DOWNSTREAM_CACHE, TEMP_DIR);

function getAllProjectKeys(tree, keyPrefix) {
  const children = Object.keys(tree.children || {});
  const grandChildren = children.map(child => getAllProjectKeys(tree.children[child], child));
  return children.concat(...grandChildren).map(key => keyPrefix ? `${keyPrefix}.${key}` : key);
}

const successLog = [];
const allProjectKeys = getAllProjectKeys(tree);
nodeCleanup(() => {
  shelljs.mv(TEMP_DOWNSTREAM_CACHE, PKG_DIR);
  console.log(`           ===> Successfully ran downstream tests for: ${successLog.join(', ')} <===`);
  if (runningTestsFor) {
    console.log(`           ===> Failed to run downstream tests for: ${runningTestsFor} <===`);
  }
  const skipped = _.difference(allProjectKeys, successLog.concat(runningTestsFor));
  if (skipped.length) {
    console.log(`           ===> Did not try to run downstream tests for: ${skipped.join(', ')} <===`);
  }
});

console.log(`           ===> Running the following downstream tests <===`);
allProjectKeys.forEach(key => {
  console.log(`           ===> ${_.padEnd(key, 38)} <===`);
});

Object.keys(tree.children).forEach(key => {
  runDownstreamTests(key, [pkgjson.name], tree.children[key], successLog);
});

