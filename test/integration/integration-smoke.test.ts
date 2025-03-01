// * These brutally minimal "smoke" tests ensure this software can be invoked
// * and, when it is, exits cleanly. Functionality testing is not the goal here.

import { pathToFileURL } from 'node:url';

import { toAbsolutePath, toDirname, toPath } from '@-xun/fs';
import { readXPackageJsonAtRoot } from '@-xun/project';
import { createDebugLogger } from 'rejoinder';

import { exports as packageExports, name as packageName } from 'rootverse:package.json';

import {
  dummyFilesFixture,
  dummyNpmPackageFixture,
  ensurePackageHasBeenBuilt,
  mockFixturesFactory,
  nodeImportAndRunTestFixture,
  npmCopyPackageFixture,
  reconfigureJestGlobalsToSkipTestsInThisFileIfRequested
} from 'testverse:util.ts';

const TEST_IDENTIFIER = `${packageName.split('/').at(-1)!}-client`;
const debug = createDebugLogger({ namespace: 'core' }).extend(TEST_IDENTIFIER);
const nodeVersion = process.env.XPIPE_MATRIX_NODE_VERSION || process.version;

debug(`nodeVersion: "${nodeVersion}" (process.version=${process.version})`);

reconfigureJestGlobalsToSkipTestsInThisFileIfRequested({ it: true, test: true });

beforeAll(async () => {
  await ensurePackageHasBeenBuilt(
    toDirname(toAbsolutePath(require.resolve('rootverse:package.json'))),
    packageName,
    packageExports
  );
});

// TODO: good fable candidate here

const packageRoot = toPath(toAbsolutePath(__dirname), '../..');
const withMockedFixture = mockFixturesFactory(
  [
    dummyNpmPackageFixture,
    dummyFilesFixture,
    npmCopyPackageFixture,
    nodeImportAndRunTestFixture
  ],
  {
    performCleanup: true,
    initialVirtualFiles: {},
    packageUnderTest: {
      root: packageRoot,
      attributes: { cjs: true },
      json: readXPackageJsonAtRoot.sync(packageRoot, { useCached: true })
    },
    identifier: TEST_IDENTIFIER
  }
);

it('supports both CJS and ESM (js, mjs, cjs) configuration files in node CJS mode', async () => {
  expect.hasAssertions();

  await withMockedFixture(
    async (context) => {
      expect(context.testResult.stderr).toBeEmpty();
      expect(context.testResult.exitCode).toBe(0);
      expect(context.testResult.stdout).toBe('first success');
    },
    {
      initialVirtualFiles: {
        'src/index.cjs': `require('@black-flag/core').runProgram('${pathToFileURL(
          toPath(__dirname, '..', 'fixtures', 'several-files-cjs-esm')
        ).toString()}', 'js cjs');`
      }
    }
  );
});

it('supports both CJS and ESM (js, mjs, cjs) configuration files in node ESM mode', async () => {
  expect.hasAssertions();

  await withMockedFixture(
    async (context) => {
      expect(context.testResult.stderr).toBeEmpty();
      expect(context.testResult.exitCode).toBe(0);
      expect(context.testResult.stdout).toBe('second success');
    },
    {
      initialVirtualFiles: {
        'src/index.mjs': `
import { runProgram } from '@black-flag/core';

if(typeof module !== 'undefined' || typeof require !== 'undefined') {
  throw new Error('expected ESM runtime but detected CJS');
}

export default runProgram('${pathToFileURL(
          toPath(__dirname, '..', 'fixtures', 'several-files-cjs-esm')
        ).toString()}', 'js mjs');`
      }
    }
  );
});
