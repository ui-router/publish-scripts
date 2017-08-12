#!/usr/bin/env node

require('./util').packageDir();
require('shelljs/global');

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const pkg = JSON.parse(fs.readFileSync('./package.json'));
const allartifacts = JSON.parse(fs.readFileSync('./artifacts.json')).ARTIFACTS;

const globs = allartifacts
    .filter(dir => fs.lstatSync(dir).isDirectory())
    .map(dir => `${dir}/**/*.js.map`);

const files = globs
    .map(pattern => glob.sync(pattern))
    .reduce((acc, arr) => acc.concat(arr), []);

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(file));
  if (Array.isArray(data.sources)) {
    data.sources = data.sources.map(source => source.replace(/^(?:\.\.\/)*src/, pkg.name));
    fs.writeFileSync(file, JSON.stringify(data));
  }
});
