// @ts-check

/* eslint-disable no-undef */
const path = require('node:path');

const { toAbsolutePath } = require('@-xun/fs');
const { withMockedOutput } = require('@-xun/test-mock-output');
const { makeRunner } = require('@black-flag/core/util');

const run = makeRunner({
  commandModulesPath: path.dirname(require.resolve('./commands'))
});

afterEach(() => (process.exitCode = undefined));

describe(path.basename(__dirname), () => {
  it('runs each command', async () => {
    expect.hasAssertions();

    await withMockedOutput(async ({ logSpy }) => {
      {
        const result = await run(['array']);
        expect(result).toHaveProperty('values', ['nothing']);
      }

      {
        const result = await run(['array', '--values', 'one', 'two', 'three']);
        expect(result).toHaveProperty('values', [1, 2, 3]);
      }

      {
        const result = await run(['array', '--values', 'a', 'b', 'c']);
        expect(result).toHaveProperty('values', ['a', 'b', 'c']);
      }

      {
        const result = await run([
          'array',
          '--values',
          'a',
          'one',
          '--values',
          'b',
          '2',
          '--values',
          'c',
          'three'
        ]);
        expect(result).toHaveProperty('values', ['a', 1, 'b', 2, 'c', 3]);
      }

      {
        const result = await run(['boolean', '--value']);
        expect(result).toHaveProperty('value', true);
      }

      {
        const result = await run(['count']);
        expect(result).toMatchObject({ u: 0, v: 0, w: 0 });
      }

      {
        const result = await run(['dynamic', '--type', 'number', '--value', '4']);
        expect(result).toMatchObject({ type: 'number', value: 4 });
      }

      {
        const result = await run(['number', '--ints', '2', '4', '8']);
        expect(result).toMatchObject({ ints: [2, 4, 8] });
      }

      {
        const configPath = toAbsolutePath(require.resolve('./config.json'));
        const result = await run(['string', '--config', configPath]);

        expect(result).toMatchObject({
          config: configPath,
          message: 'hello from JSON config landia!'
        });
      }

      {
        const result = await run(['string', '--config-custom', './config.json']);
        expect(result).toMatchObject({
          message: 'hello from custom JSON config landia!'
        });
      }

      expect(logSpy).toHaveBeenCalled();
    });
  });
});
