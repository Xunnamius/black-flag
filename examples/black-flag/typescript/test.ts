import { basename, dirname } from 'node:path';

import { makeRunner } from '@black-flag/core/util';

const run = makeRunner({
  commandModulesPath: dirname(require.resolve('./commands'))
});

afterEach(() => (process.exitCode = undefined));

describe(basename(__dirname), () => {
  // TODO
  it.todo('this');
  void run;
});
