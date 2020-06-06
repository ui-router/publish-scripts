#!/usr/bin/env node

const publishYalcPackage = require('./publish_yalc_package');
const util = require('./util');
util.packageDir();

const fs = require('fs');
const path = require('path');
const _exec = util._exec;
const sh = require('shelljs');
const readlineSync = require('readline-sync');

const CONFIG = JSON.parse(fs.readFileSync('./docgen.json'));
const TYPEDOC_CONFIG = JSON.parse(fs.readFileSync('./typedoc.json'));
const pkg = JSON.parse(fs.readFileSync('./package.json'));
const version = pkg.version;

const GIT_URL = "git@github.com:ui-router/ui-router.github.io.git";
const installTargetDir = path.join(".downstream_cache", "ui-router.gihub.io");
const PAGES_DIR = path.join(installTargetDir, CONFIG.publishDir);

sh.rm('-rf', installTargetDir);
_exec(`git clone ${GIT_URL} ${installTargetDir}`);

util.packageDir();

sh.rm('-rf', path.join(PAGES_DIR, 'latest'));
sh.cp('-r', TYPEDOC_CONFIG.out, path.join(PAGES_DIR, 'latest'));

sh.rm('-rf', path.join(PAGES_DIR, version));
sh.cp('-r', TYPEDOC_CONFIG.out, path.join(PAGES_DIR, version));

sh.cd(PAGES_DIR);
_exec("./process_docs.sh");
_exec("git add .");

sh.echo("\n\nSpot check the docs, then run these commands to publish:\n\n");
sh.echo("cd " + PAGES_DIR);
sh.echo(`git commit -m 'publish docs for ${version}'`);
sh.echo(`git push`);

if (readlineSync.keyInYN('Publish docs?')) {
  sh.cd(PAGES_DIR);
  _exec(`git commit -m 'publish docs for ${version}'`);
  _exec(`git push`);
}
