#!/usr/bin/env node

const path = require('node:path');

const { runProgram } = require('@black-flag/core');

module.exports = runProgram(path.dirname(require.resolve('./commands')));
