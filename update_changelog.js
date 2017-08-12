#!/usr/bin/env node

require('./util').packageDir();
require('shelljs/global');

let path = require('path');
let _exec = require('./util')._exec;

echo('Updating CHANGELOG...');
cp('CHANGELOG.md', 'CHANGELOG.bak');
_exec('./node_modules/.bin/show_changelog >> CHANGELOG.new');
_exec('cat CHANGELOG.new CHANGELOG.bak > CHANGELOG.md');
rm('CHANGELOG.bak', 'CHANGELOG.new');
