#!/usr/bin/env node
"use strict";

const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');
const conventionalChangelog = require('conventional-changelog');
const _exec = require('./util')._exec;
const yargs = require('yargs')
    .option('from', {
      description: 'The starting tag'
    })
    .option('to', {
      description: 'The ending tag'
    })
    .option('deps', {
      description: 'Include changelogs of dependencies',
      array: true,
    })
    .check(argv => {
      if (argv.to && !argv.from)
        throw new Error(`If you specify a 'to', you should also specify a 'from'.`);
      return true;
    });

let options = {
  preset: 'ui-router-core'
};

const context = {}, gitOpts = {};
const to = yargs.argv.to;
const from = yargs.argv.from;
const deps = yargs.argv.deps || [];
const scriptPath = path.resolve(__dirname, __filename);

if (to && from) {
  gitOpts.to = context.currentTag = to;
  gitOpts.from = context.previousTag = from;
} else if (from) {
  gitOpts.from = context.previousTag = from;
} else if (!to && !from) {
  gitOpts.from = context.previousTag = getVersion('current');
} else {
  throw new Error('How did this happen?');
}

const cwd = shelljs.pwd().stdout;

if (deps.length) {
  // If --deps was used, shell out and re-run the show_changelog command without the --deps argument
  // This is an awful hack to flush the changelog to stdout before getting the dependency changelog(s)
  // because conventional-changelog-core doesn't seem to have a callback to tap into
  const fromArg = (from ? ` --from ${from}` : '');
  const toArg = (to ? ` --to ${to}` : '');
  let stdout = _exec(`${scriptPath} ${fromArg} ${toArg}`, true).stdout;
  console.log(stdout.trim());

  shelljs.mkdir('.show_changelog.tmp');
  try {
    deps.forEach(showDepChangelog);
  } finally {
    shelljs.cd(cwd);
    shelljs.rm('-rf', '.show_changelog.tmp');
  }
} else {
  showChangelog(context, gitOpts);
}

function showDepChangelog(dependency) {
  if (typeof dependency !== 'string') throw new Error('Expected dep to be a string: ' + dependency);

  const tmpdir = path.resolve(cwd, '.show_changelog.tmp', dependency.replace(/[^a-zA-Z]/g, "_"));

  const pkgPath = `${cwd}/node_modules/${dependency}/package.json`;
  const pkg = JSON.parse(fs.readFileSync(pkgPath));
  const repotype = pkg.repository && pkg.repository.type;
  let giturl = pkg.repository && pkg.repository.url;

  if (repotype !== 'git') {
    throw new Error(`Expected repository.type to be 'git' in ${pkgPath} but it was '${repotype}'`);
  }

  if (!giturl) {
    throw new Error(`Expected repository.url to be defined in ${pkgPath} `);
  }

  giturl = giturl.replace(/^git\+/, '');

  const from = getDepVersion(dependency, 'tag', gitOpts.from);
  const to = (function() {
    if (gitOpts.to) return getDepVersion(dependency, 'tag', gitOpts.to);
    return getDepVersion(dependency, 'workingcopy');
  }());

  if (from === to) return;

  try {
    _exec(`git clone ${giturl} ${tmpdir}`, true);
    shelljs.config.silent = true;
    shelljs.pushd(tmpdir);
    shelljs.config.silent = false;
    console.log(`\n`);
    console.log(`### Updated \`${dependency}\` from ${from} to ${to}`);
    let depChangelog = _exec(`node ${scriptPath} --from ${from} --to ${to}`, true).stdout.trim();
    console.log(depChangelog.split(/[\r\n]/).slice(1).join('\n'));
  } finally {
    shelljs.popd();
  }
}

// mode: 'workingcopy', 'current', 'previous', 'tag'
// tag: (optional) the tag to fetch from
function getVersion(mode, tag) {
  const showversion = path.resolve(__dirname, 'show_version.js');
  return _exec(`node ${showversion} --${mode} ${tag || ''}`, true).stdout.replace(/[\r\n]/g, '');
}

// dep: the dependency
// mode: 'workingcopy', 'current', 'previous', 'tag'
// tag: (optional) the tag to fetch from
function getDepVersion(dep, mode, tag) {
  const showversion = path.resolve(__dirname, 'show_version.js');
  return _exec(`node ${showversion} --dep ${dep} --${mode} ${tag || ''}`, true).stdout.replace(/[\r\n]/g, '');
}

function showChangelog(context, gitOpts) {
  var writerOpts = {
    doFlush: true,
    generateOn: function () {
      return false;
    }
  };
  const readable = conventionalChangelog(options, context, gitOpts, undefined, writerOpts).pipe(process.stdout);
  return new Promise(resolve => readable.on('end', resolve));
}
