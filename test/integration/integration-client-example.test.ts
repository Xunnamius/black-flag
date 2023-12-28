/* eslint-disable jest/require-hook */
/* eslint-disable jest/no-conditional-in-test, jest/no-conditional-expect */

import assert from 'node:assert';
import { join } from 'node:path';
import { exports as pkgExports, name as pkgName } from 'package';

import { debugFactory } from 'multiverse/debug-extended';
import { run } from 'multiverse/run';

import {
  dummyFilesFixture,
  dummyNpmPackageFixture,
  mockFixtureFactory,
  nodeImportAndRunTestFixture,
  npmCopySelfFixture
} from 'testverse/setup';

// * These tests verify that an auto-discovered Black Flag command actually
// * works as advertized. That is: this file tests the examples present in the
// * README.md file, including support for importing both CJS and ESM modules.

// TODO: good fable candidate here

const TEST_IDENTIFIER = 'integration-client-example';
const debug = debugFactory(`${pkgName}:${TEST_IDENTIFIER}`);

const pkgMainPaths = Object.values(pkgExports)
  .map((xport) =>
    typeof xport === 'string'
      ? null
      : `${__dirname}/../../${'node' in xport ? xport.node : xport.default}`
  )
  .filter(Boolean) as string[];

const withMockedFixture = mockFixtureFactory(TEST_IDENTIFIER, {
  performCleanup: true,
  pkgRoot: `${__dirname}/../..`,
  pkgName,
  use: [
    dummyNpmPackageFixture(),
    dummyFilesFixture(),
    npmCopySelfFixture(),
    nodeImportAndRunTestFixture()
  ],
  npmInstall: []
});

beforeAll(async () => {
  debug('pkgMainPaths: %O', pkgMainPaths);

  await Promise.all(
    pkgMainPaths.map(async (pkgMainPath) => {
      if ((await run('test', ['-e', pkgMainPath])).code != 0) {
        debug(`unable to find main distributable: ${pkgMainPath}`);
        throw new Error('must build distributables first (try `npm run build:dist`)');
      }
    })
  );
});

it('supports both CJS and ESM (js, mjs, cjs) configuration files in node CJS mode', async () => {
  expect.hasAssertions();

  await withMockedFixture(
    async (context) => {
      assert(context.testResult, 'must use node-import-and-run-test fixture');
      expect(context.testResult?.stderr).toBeEmpty();
      expect(context.testResult?.code).toBe(0);
      expect(context.testResult?.stdout).toBe('first success');
    },
    {
      initialFileContents: {
        'src/index.cjs': `require('black-flag').runProgram('${join(
          __dirname,
          '..',
          'fixtures',
          'several-files-cjs-esm'
        )}', 'js cjs');`
      }
    }
  );
});

it('supports both CJS and ESM (js, mjs, cjs) configuration files in node ESM mode', async () => {
  expect.hasAssertions();

  await withMockedFixture(
    async (context) => {
      assert(context.testResult, 'must use node-import-and-run-test fixture');
      expect(context.testResult?.stderr).toBeEmpty();
      expect(context.testResult?.code).toBe(0);
      expect(context.testResult?.stdout).toBe('second success');
    },
    {
      initialFileContents: {
        'src/index.mjs': `
import { runProgram } from 'black-flag';
export default runProgram('${join(
          __dirname,
          '..',
          'fixtures',
          'several-files-cjs-esm'
        )}', 'js mjs');`
      }
    }
  );
});
