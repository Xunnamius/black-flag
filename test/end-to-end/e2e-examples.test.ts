// * These tests run through the entire process of acquiring this software,
// * using its features as described in the examples documentation, and dealing
// * with its error conditions across a variety of runtimes (e.g. the currently
// * maintained node versions).
// *
// * Typically, these tests involve the use of deep mock fixtures and/or Docker
// * containers, and are built to run in GitHub Actions CI pipelines; some can
// * also be run locally.

import { toAbsolutePath, toDirname, toPath } from '@-xun/fs';
import { readXPackageJsonAtRoot } from '@-xun/project';
import { runnerFactory } from '@-xun/run';
import { createDebugLogger } from 'rejoinder';

import { exports as packageExports, name as packageName } from 'rootverse:package.json';

import {
  dummyFilesFixture,
  dummyNpmPackageFixture,
  ensurePackageHasBeenBuilt,
  mockFixturesFactory,
  npmCopyPackageFixture,
  reconfigureJestGlobalsToSkipTestsInThisFileIfRequested
} from 'testverse:util.ts';

const shortIdentifier = packageName.split('/').at(-1)!;
const TEST_IDENTIFIER = `${shortIdentifier}-e2e-examples`;
const debug = createDebugLogger({ namespace: shortIdentifier }).extend(TEST_IDENTIFIER);
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

const packageRoot = toPath(toAbsolutePath(__dirname), '../..');
const withMockedFixture = mockFixturesFactory(
  [dummyNpmPackageFixture, dummyFilesFixture, npmCopyPackageFixture],
  {
    performCleanup: true,
    initialVirtualFiles: {
      'package.json': JSON.stringify(
        {
          name: 'dummy-pkg',
          version: '0.0.1',
          type: 'module'
        },
        undefined,
        2
      )
    },
    packageUnderTest: {
      root: packageRoot,
      attributes: { cjs: true },
      json: readXPackageJsonAtRoot.sync(packageRoot, { useCached: true })
    },
    identifier: TEST_IDENTIFIER
  }
);

describe('./examples', () => {
  test('example-todo', async () => {
    expect.hasAssertions();
    // TODO: run each test.cjs file and the typescript/test.js file (after
    // TODO: ensuring that dir is built) eslint-disable-next-line
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    void runnerFactory, withMockedFixture;
  });
});
