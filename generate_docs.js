#!/usr/bin/env node
const publishYalcPackage = require('./publish_yalc_package');
const util = require('./util');
util.packageDir();

const fs = require('fs');
const path = require('path');
const _exec = util._exec;

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const CONFIG = JSON.parse(fs.readFileSync('./typedoc.json'));

const has =  require('lodash').has;

const requiredKeys = ['typedoc', 'typedoc.generateOptions', 'files'];
const missing = requiredKeys.find(key => !has(CONFIG, key));
if (missing) {
  console.error(`typedoc.json does not contain configuration key: "${missing}"`);
  process.exit(1);
}

const includes = CONFIG.typedoc.include || [];
includes.forEach(include => {
  const { branch, package, repo } = include;
  const flags = { noBuild: true, noPublish: true, noInstall: true, branch: branch };
  const versionline = _exec(`yarn list --pattern ${package}`).stdout.split(/[\r\n]+/).find(line => line.includes(package));
  const version = /.*\@([^@]*)/.exec(versionline)[1];

  if (version) {
    flags.branch = version;
  }

  publishYalcPackage(path.join('.downstream_cache', package), repo, flags);
});

const typedocOptions = CONFIG.typedoc.generateOptions || {};
const cmdLineOpts = Object.keys(typedocOptions)
    .map(key => `--${key} ${typedocOptions[key]}`)
    .join(" ");

const files = CONFIG.files.concat(includes.map(x => path.join('.downstream_cache', x.package, x.entry))).join(" ");

util.packageDir();
_exec(`./node_modules/.bin/typedoc ${cmdLineOpts} ${files}`);

