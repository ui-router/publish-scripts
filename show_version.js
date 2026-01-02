#!/usr/bin/env node
'use strict';

const gitSemverTags = require('git-semver-tags');
const fs = require('fs');
const shelljs = require('shelljs');
const pkgJson = JSON.parse(fs.readFileSync('package.json'));

const opts = ['current', 'previous', 'workingcopy', 'tag'];
const yargs = require('yargs')
  .group(opts, 'Show version number of:')
  .option('workingcopy', {
    alias: 'w',
    boolean: true,
    description: `The working copy's package.json`,
  })
  .option('current', {
    alias: 'c',
    boolean: true,
    description: 'The latest tagged version',
  })
  .option('previous', {
    alias: 'p',
    boolean: true,
    description: 'The second latest tagged version',
  })
  .option('tag', {
    alias: 't',
    string: true,
    description: 'A specific tag',
  })
  .group(['dep'], 'Show version number of a dependency:')
  .option('dep', {
    alias: 'd',
    string: true,
    description: 'The name of the dependency',
  })
  .check((argv) => {
    const optsDesc = opts.map((opt) => `--${opt}`).join(', ');

    if (opts.every((opt) => !argv[opt])) throw new Error(`Specify one of: ${optsDesc}`);
    if (opts.filter((opt) => !!argv[opt]).length > 1) throw new Error(`Opts ${optsDesc} are mutually exclusive`);

    return true;
  });

function getPkgJson() {
  const mode = opts.find((opt) => yargs.argv[opt] && opt);

  const getPkgJsonForTag = (tag) =>
    JSON.parse(shelljs.exec('git show ' + tag + ':package.json', { silent: true }).stdout);

  switch (mode) {
    case 'workingcopy':
      return Promise.resolve(pkgJson);
    case 'current':
    case 'previous':
      return findTag(mode).then(getPkgJsonForTag);
    case 'tag':
      return Promise.resolve(getPkgJsonForTag(yargs.argv.tag));
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}

function getSourceString() {
  switch (mode) {
    case 'workingcopy':
      return 'workingcopy';
    case 'current':
      return 'current tag';
    case 'previous':
      return 'previous tag';
    case 'tag':
      return `tag ${yargs.argv.tag}`;
  }
}

getPkgJson().then((json) => {
  let dep = yargs.argv.dep;

  if (dep) {
    const depVer = json.dependencies && json.dependencies[dep];
    const devDepVer = json.devDependencies && json.devDependencies[dep];

    if (!depVer && !devDepVer) {
      console.error(JSON.stringify(json));
      throw new Error(
        `package.json from ${getSourceString()} has no dependencies["${dep}"] or devDependencies["${dep}"] key.`,
      );
    }

    console.log((depVer || devDepVer).replace(/[^0-9a-zA-Z._+-]/g, ''));
  } else {
    console.log(json.version.replace(/[^0-9a-zA-Z._+-]/g, ''));
  }

  process.exit(0);
});

// previous or current
function findTag(mode) {
  return new Promise((resolve, reject) => {
    gitSemverTags(function (err, tags) {
      if (err) return reject(err);

      let tag;
      if (mode === 'current') tag = tags[0];
      if (mode === 'previous') tag = tags[1];

      if (tag) resolve(tag);

      reject('No tag found');
    });
  });
}
