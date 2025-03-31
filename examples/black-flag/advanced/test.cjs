// @ts-check

/* eslint-disable no-undef */
const path = require('node:path');

const { withMockedOutput } = require('@-xun/test-mock-output');
const { makeRunner } = require('@black-flag/core/util');

const run = makeRunner({
  commandModulesPath: path.dirname(require.resolve('./commands')),
  configurationHooks: import('./configure.js')
});

afterEach(() => (process.exitCode = undefined));

describe(path.basename(__dirname), () => {
  it('runs each command', async () => {
    expect.hasAssertions();

    await withMockedOutput(async ({ logSpy }) => {
      {
        const result = await run(['--not-an-arg']);
        expect(result).toHaveProperty('_', ['--not-an-arg']);
      }

      {
        const result = await run(['four', '--not-an-arg']);
        expect(result).toHaveProperty('_', ['--not-an-arg']);
      }

      {
        const result = await run(['six', '--not-an-arg']);
        expect(result).toHaveProperty('_', ['--not-an-arg']);
      }

      {
        const result = await run(['ten', '--not-an-arg']);
        expect(result).toHaveProperty('_', ['--not-an-arg']);
      }

      expect(logSpy).toHaveBeenCalled();
    });
  });
});
