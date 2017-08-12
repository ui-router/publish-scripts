#!/usr/bin/env node

require('./util').packageDir();
require('shelljs/global');

const path = require('path');
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
const _exec = require('./util')._exec;

echo('Updating CHANGELOG...');
cp('CHANGELOG.md', 'CHANGELOG.bak');
_exec('./show_changelog.js >> CHANGELOG.new');
_exec('cat CHANGELOG.new CHANGELOG.bak > CHANGELOG.md');
rm('CHANGELOG.bak', 'CHANGELOG.new');
