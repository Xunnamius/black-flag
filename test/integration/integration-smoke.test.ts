/* eslint-disable jest/require-hook */
/* eslint-disable jest/no-conditional-in-test, jest/no-conditional-expect */

// * These brutally minimal "smoke" tests ensure this software can be invoked
// * and, when it is, exits cleanly. Functionality testing is not the goal here.

import assert from 'node:assert';
import { join } from 'node:path';
import { access } from 'node:fs/promises';
import { exports as pkgExports, name as pkgName } from 'rootverse:package.json';

import { createDebugLogger } from 'rejoinder';

import {
  dummyFilesFixture,
  dummyNpmPackageFixture,
  mockFixtureFactory,
  nodeImportAndRunTestFixture,
  npmCopySelfFixture
} from 'testverse:setup.ts';

// TODO: good fable candidate here

const TEST_IDENTIFIER = 'integration-node-smoke';
const debug = createDebugLogger({ namespace: `${pkgName}:${TEST_IDENTIFIER}` });

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
      if (
        await access(pkgMainPath).then(
          () => false,
          () => true
        )
      ) {
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
      expect(context.testResult.stderr).toBeEmpty();
      expect(context.testResult.code).toBe(0);
      expect(context.testResult.stdout).toBe('first success');
    },
    {
      initialFileContents: {
        'src/index.cjs': `require('@black-flag/core').runProgram('${join(
          __dirname,
          '..',
          'fixtures',
          'several-files-cjs-esm'
        ).replaceAll('\\', '/')}', 'js cjs');`
      }
    }
  );
});

it('supports both CJS and ESM (js, mjs, cjs) configuration files in node ESM mode', async () => {
  expect.hasAssertions();

  await withMockedFixture(
    async (context) => {
      assert(context.testResult, 'must use node-import-and-run-test fixture');
      expect(context.testResult.stderr).toBeEmpty();
      expect(context.testResult.code).toBe(0);
      expect(context.testResult.stdout).toBe('second success');
    },
    {
      initialFileContents: {
        'src/index.mjs': `
import { runProgram } from '@black-flag/core';

if(typeof module !== 'undefined' || typeof require !== 'undefined') {
  throw new Error('expected ESM runtime but detected CJS');
}

export default runProgram('${join(
          __dirname,
          '..',
          'fixtures',
          'several-files-cjs-esm'
        ).replaceAll('\\', '/')}', 'js mjs');`
      }
    }
  );
});
