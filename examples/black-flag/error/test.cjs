// @ts-check

/* eslint-disable no-undef */
const path = require('node:path');

const { makeRunner } = require('@black-flag/core/util');

const run = makeRunner({
  commandModulesPath: path.dirname(require.resolve('./commands'))
});

afterEach(() => (process.exitCode = undefined));

describe(path.basename(__dirname), () => {
  // TODO
  it.todo('this');
  void run;
});
