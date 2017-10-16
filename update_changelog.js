#!/usr/bin/env node

require('./util').packageDir();
require('shelljs/global');
const args = process.argv.slice(2);

const fs = require('fs');
const _exec = require('./util')._exec;

echo('Updating CHANGELOG...');
cp('CHANGELOG.md', 'CHANGELOG.bak');
_exec('./node_modules/.bin/show_changelog ' + args + ' >> CHANGELOG.new');
_exec('cat CHANGELOG.new CHANGELOG.bak > CHANGELOG.md');
rm('CHANGELOG.bak', 'CHANGELOG.new');
