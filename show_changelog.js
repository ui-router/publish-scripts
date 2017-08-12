#!/usr/bin/env node
"use strict";
let conventionalChangelog = require('conventional-changelog');

let options = {
  preset: 'ui-router-core'
};

if(require.main === module) {
  let context, gitOpts;

  if (process.argv[2]) {
    context = {};
    gitOpts = {};
    gitOpts.from = context.previousTag = process.argv[2];
  }

  if (process.argv[3]) {
    gitOpts.to = context.currentTag = process.argv[3];
  }

  showChangelog(context, gitOpts);
}

function showChangelog(context, gitOpts) {
  var writerOpts = { doFlush: true, generateOn: function() { return false; } };
  conventionalChangelog(options, context, gitOpts, undefined, writerOpts).pipe(process.stdout);
}
