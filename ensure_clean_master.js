#!/usr/bin/env node

const util = require('./util');
util.packageDir();

let branch;
if (require.main === module && process.argv[2]) branch = process.argv[2];

util.ensureCleanMaster(branch);
