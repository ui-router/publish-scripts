#!/usr/bin/env node
const publishYalcPackage = require('./publish_yalc_package');
const shelljs = require('shelljs');
const nodeCleanup = require('node-cleanup');
const tmp = require('tmp');
const fs = require('fs');
const path = require('path');
const has = require('lodash').has;
const util = require('./util');
const _exec = util._exec;

util.packageDir();

const kebob = (string) => string
    .split(/[@_/-]/)
    .filter(x => !!x)
    .map(x => x.toLowerCase() === 'uirouter' ? 'ui-router' : x)
    .join('-');

const PACKAGE_JSON = JSON.parse(fs.readFileSync('./package.json'));
const TS_CONFIG = JSON.parse(fs.readFileSync('./tsconfig.json'));
const TYPEDOC_CONFIG = JSON.parse(fs.readFileSync('./typedoc.json'));
const PACKAGE_DIR = process.cwd();
const DOWNSTREAM_CACHE = path.join(PACKAGE_DIR, '.downstream_cache');
const DOCGEN_DIR = tmp.dirSync().name;
const DOCGEN_PACKAGE_DIR = path.join(DOCGEN_DIR, kebob(PACKAGE_JSON.name));

const requiredKeys = [ 'typedoc', 'typedoc.generateOptions' ];
const missing = requiredKeys.find(key => !has(TYPEDOC_CONFIG, key));
if (missing) {
  console.error(`typedoc.json does not contain configuration key: "${missing}"`);
  process.exit(1);
}

// Create directory in temp dir for the current package
shelljs.mkdir('-p', DOCGEN_PACKAGE_DIR);
// Register hook to cleanup temp dir
nodeCleanup(() => {
  const symlinks = fs.readdirSync(DOCGEN_DIR)
    .filter(file => fs.lstatSync(file).isSymbolicLink());
  symlinks.forEach(file => fs.unlinkSync(file));
  shelljs.rm('-rf', DOCGEN_DIR);
});

// Fetch all included packages (i.e., core module) to .downstream_cache
// Symlink each package into the temp dir
const includes = TYPEDOC_CONFIG.typedoc.include || [];
includes.forEach(include => {
  const { branch, package, repo } = include;
  const flags = { noBuild: true, noPublish: true, noInstall: true, branch: branch };

  if (!branch) {
    const versionline = _exec(`yarn list --pattern ${package}`).stdout
        .split(/[\r\n]+/).find(line => line.includes(package));
    const match = /.*\@(([^@]*?)(-[a-zA-Z0-9]{8})?$)/.exec(versionline);
    const version = match[2];
    console.log({ versionline });
    console.log({ match });
    console.log({ version });
    flags.branch = version ? version : flags.branch;
  }

  publishYalcPackage(path.join(DOWNSTREAM_CACHE, package), repo, flags);
  shelljs.ln('-s', path.join(DOWNSTREAM_CACHE, package), path.join(DOCGEN_DIR, kebob(package)));
});

// symlink node_modules, package.json, typedoc.json into temp dir
shelljs.ln('-s', path.join(PACKAGE_DIR, 'package.json'), path.join(DOCGEN_DIR, 'package.json'));
shelljs.ln('-s', path.join(PACKAGE_DIR, 'typedoc.json'), path.join(DOCGEN_DIR, 'typedoc.json'));
shelljs.mkdir(path.join(DOCGEN_DIR, 'node_modules'));
fs.readdirSync(path.join(PACKAGE_DIR, 'node_modules')).forEach(module => {
  const source = path.join(PACKAGE_DIR, 'node_modules', module);
  const dest = path.join(DOCGEN_DIR, 'node_modules', module);
  shelljs.ln('-s', source, dest);
});
// re-hydrate current package using .git dir
shelljs.cp('-r', path.join(PACKAGE_DIR, '.git'), DOCGEN_PACKAGE_DIR);
process.chdir(DOCGEN_PACKAGE_DIR);
shelljs.exec("git checkout .");

// create command line
const typedocOptions = TYPEDOC_CONFIG.typedoc.generateOptions || {};
typedocOptions.out = path.join(PACKAGE_DIR, typedocOptions.out || "_doc");

const cmdLineOpts = Object.keys(typedocOptions)
    .map(key => `--${key} ${typedocOptions[ key ]}`)
    .join(" ");

process.chdir(DOCGEN_DIR);
const files = []
    .concat(TYPEDOC_CONFIG.files || [])
    .concat(TS_CONFIG.files.map(x => path.join(DOCGEN_PACKAGE_DIR, x)))
    .concat(includes.map(x => path.join(DOCGEN_DIR, kebob(x.package), x.entry)))
    .map(x => `${path.normalize(x)}`)
    .map(x => `./${path.relative(DOCGEN_DIR, x)}`)
    .concat(path.join(PACKAGE_DIR, 'node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts'));

// run typedoc command
_exec(`npx typedoc ${cmdLineOpts} ${files.join(' ')}`);

