#!/usr/bin/env node

const { runProgram } = require('@black-flag/core');

module.exports = runProgram(require.resolve('./commands'));
