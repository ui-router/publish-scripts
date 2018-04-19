#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const shelljs = require('shelljs');

const yargs = require('yargs')
    .option('workspace', {
      alias: 'ws',
      description: 'use yarn workspace to save space',
    });

const nodeCleanup = require('node-cleanup');
const publishYalcPackage = require('./publish_yalc_package');

const util = require('./util');
util.packageDir();
const PKG_DIR = process.cwd();

const config = JSON.parse(fs.readFileSync('downstream_projects.json'));
const pkgjson = JSON.parse(fs.readFileSync('package.json'));
const projects = config.projects || config;
const nohoist = (config.projects && config.nohoist) || [];

const DOWNSTREAM_PKGS = (process.env.DOWNSTREAM_PKGS || '').split(',').filter(x => x);

const TEMP = tmp.dirSync();
const TEMP_DIR = TEMP.name;
const TEMP_DOWNSTREAM_CACHE = path.resolve(TEMP_DIR, '.downstream_cache');
const DOWNSTREAM_CACHE = path.resolve(PKG_DIR, '.downstream_cache');

function makeDownstreamCache() {
  if (!fs.existsSync(DOWNSTREAM_CACHE)) {
    console.log('making .downstream_cache working directory');
    fs.mkdirSync(DOWNSTREAM_CACHE);
  }
}

function localPublish(packageDir) {
  packageDir = packageDir || PKG_DIR;
  process.chdir(packageDir);
  console.log(`Building ${packageDir} and publishing using yalc...`);
  util._exec('yarn build && npx yalc publish');
}

function installUpstreamDeps(upstreamPackages) {
  upstreamPackages.forEach(upstream => util._exec('npx yalc add ' + upstream));
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

    console.log(`      ===> Fetching downstream project to '${installDir}' <===`);
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
      fetchDownstreamProjects(nestedDownstreamConfig, installDir, children);
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
  util._exec('yarn && yarn upgrade');
}

function runDownstreamTests(key, upstreamPackages, downstreamTreeNode, successLog) {
  if (DOWNSTREAM_PKGS.length && DOWNSTREAM_PKGS.indexOf(key) === -1) {
    console.log(`${key} not in DOWNSTREAM_PKGS, skipping...`);
    return;
  }

  process.chdir(TEMP_DOWNSTREAM_CACHE);

  const name = downstreamTreeNode.installDir;

  console.log(`      ===> '${name}': prepping tests <===`);
  process.chdir(downstreamTreeNode.installDir);

  if (!yargs.argv.workspace) {
    console.log(`      ===> '${name}': Installing  dependencies <===`);
    util._exec('yarn && yarn upgrade');
  }

  console.log(`      ===> '${name}': Installing freshly built upstream packages <===`);
  installUpstreamDeps(upstreamPackages);

  console.log(`      ===> '${name}': Running tests <===`);
  runTests();

  successLog.push(key);

  console.log(`      ===> '${name}': Reverting working copy <===`);
  revertLocalChanges(downstreamTreeNode.installSource);


  const downstreamChildren = Object.keys(downstreamTreeNode.children || {});
  if (downstreamChildren.length) {
    const thisPkg = JSON.parse(fs.readFileSync('package.json')).name;
    const upstreams = upstreamPackages.concat(thisPkg);

    localPublish(process.cwd());

    downstreamChildren.forEach(child => {
      runDownstreamTests(child, upstreams, downstreamTreeNode.children[child], successLog);
    });
  }
}

console.log(`      ===> Creating .downstream_cache working directory <===`);
makeDownstreamCache();

console.log(`      ===> Publishing ${pkgjson.name} to yalc registry <===`);
localPublish();

console.log(`      ===> Fetching downstream projects <===`);
const tree = { children: {} };
fetchDownstreamProjects(projects, "", tree.children);

if (yargs.argv.workspace) {
  console.log(`      ===> Installing downstream dependencies <===`);
  const downstreamDirs = getDownstreamInstallDirs(tree);
  installWorkspaceDependencies(downstreamDirs);
}

console.log(`      ===> Moving working directory to temp dir ${TEMP_DIR} <===`);
shelljs.mv(DOWNSTREAM_CACHE, TEMP_DIR);

const successLog = [];
nodeCleanup(() => {
  shelljs.mv(TEMP_DOWNSTREAM_CACHE, PKG_DIR);
  console.log("Successfully ran downstream tests for: " + successLog.join(', '));
});

console.log(`      ===> Running downstream tests <===`);
Object.keys(tree.children).forEach(key => {
  runDownstreamTests(key, [pkgjson.name], tree.children[key], successLog);
});

