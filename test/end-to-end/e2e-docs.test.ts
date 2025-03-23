/* eslint-disable no-await-in-loop */
// * These tests run through the entire process of acquiring this software,
// * using its features as described in the examples documentation, and dealing
// * with its error conditions across a variety of runtimes (e.g. the currently
// * maintained node versions).
// *
// * Typically, these tests involve the use of deep mock fixtures and/or Docker
// * containers, and are built to run in GitHub Actions CI pipelines; some can
// * also be run locally.

import assert from 'node:assert';
import { once } from 'node:events';
import { createWriteStream } from 'node:fs';

import { toAbsolutePath, toDirname, toPath } from '@-xun/fs';

import {
  extractExamplesFromDocument,
  readJsonc,
  readXPackageJsonAtRoot
} from '@-xun/project';

import {
  run as runYesRejectOnBadExit,
  runnerFactory,
  runNoRejectOnBadExit
} from '@-xun/run';

import { EndToEndMode } from '@-xun/symbiote/commands/test';
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

import { FrameworkExitCode } from '@black-flag/core';

import type { AbsolutePath } from '@-xun/fs';
import type { RunOptions } from '@-xun/run';

const shortIdentifier = packageName.split('/').at(-1)!;
const TEST_IDENTIFIER = `${shortIdentifier}-e2e-docs`;
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

const sharedRunEnv: RunOptions['env'] = {
  FORCE_COLOR: 'false',
  NO_COLOR: 'true',
  DEBUG_COLORS: 'false'
};

const readmeExamples = extractExamplesFromDocument.sync(
  require.resolve('rootverse:README.md'),
  { useCached: true }
);

const readmeExamplesRegExp = extractExamplesFromDocument.sync(
  require.resolve('rootverse:README.md'),
  { useCached: true, asRegExp: true }
);

const featuresExamples = extractExamplesFromDocument.sync(
  require.resolve('rootverse:docs/features.md'),
  { useCached: true }
);

const featuresExamplesRegExp = extractExamplesFromDocument.sync(
  require.resolve('rootverse:docs/features.md'),
  { useCached: true, asRegExp: true }
);

const gettingStartedExamples = extractExamplesFromDocument.sync(
  require.resolve('rootverse:docs/getting-started.md'),
  { useCached: true }
);

const gettingStartedExamplesRegExp = extractExamplesFromDocument.sync(
  require.resolve('rootverse:docs/getting-started.md'),
  { useCached: true, asRegExp: true }
);

describe('./README.md', () => {
  test('quick start', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async ({ root }) => {
        const run = runnerFactory('node', ['cli.js'], {
          cwd: root,
          reject: false,
          env: sharedRunEnv
        });

        {
          const { stdout, stderr, exitCode } = await run(['--version']);

          expect({ id: 0, stderr, exitCode, stdout }).toStrictEqual({
            id: 0,
            stderr: '',
            exitCode: 0,
            stdout: '0.0.1'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            splitAndSlice2(readmeExamples.get('command-1'))
          );

          expect({ id: 1, stderr, exitCode, stdout }).toStrictEqual({
            id: 1,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(readmeExamplesRegExp.get('output-1')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            splitAndSlice2(readmeExamples.get('command-2'))
          );

          expect({ id: 2, stderr, exitCode, stdout }).toStrictEqual({
            id: 2,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(readmeExamplesRegExp.get('output-2')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            splitAndSlice2(readmeExamples.get('command-3'))
          );

          expect({ id: 3, stderr, exitCode, stdout }).toStrictEqual({
            id: 3,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(readmeExamplesRegExp.get('output-3')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            splitAndSlice2(readmeExamples.get('command-4'))
          );

          expect({ id: 4, stderr, exitCode, stdout }).toStrictEqual({
            id: 4,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(readmeExamplesRegExp.get('output-4')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            splitAndSlice2(readmeExamples.get('command-5'))
          );

          expect({ id: 5, stderr, exitCode, stdout }).toStrictEqual({
            id: 5,
            stdout: '',
            exitCode: 1,
            stderr: expect.stringMatching(readmeExamplesRegExp.get('output-5')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            splitAndSlice2(readmeExamples.get('command-6'))
          );

          expect({ id: 6, stderr, exitCode, stdout }).toStrictEqual({
            id: 6,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(readmeExamplesRegExp.get('output-6')!)
          });
        }
      },
      {
        initialVirtualFiles: {
          'cli.js': readmeExamples.get('cli.js'),
          'commands/index.js': readmeExamples.get('commands/index.js'),
          'commands/hello.js': readmeExamples.get('commands/hello.js')
        }
      }
    );
  });
});

describe('./docs/features.md', () => {
  const sharedInitialVirtualFiles = {
    'cli.js': featuresExamples.get('run-1'),
    'commands/index.js': /* js */ `export const name = 'myctl';`,
    'commands/init.js': featuresExamples.get('all-1')
  };

  test('built-in support for dynamic options', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async ({ root }) => {
        const run = runnerFactory('node', ['cli.js'], {
          cwd: root,
          reject: false,
          env: sharedRunEnv
        });

        const example1 = featuresExamples.get('dynamic-options-1')!.split('\n');
        const example2 = featuresExamples.get('dynamic-options-2')!.split('\n');

        {
          const { stdout, stderr, exitCode } = await run(splitAndSlice1(example1[1]));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: example1[4]
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(splitAndSlice1(example1[2]));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: example1[5]
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(splitAndSlice1(example2[1]));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: example2[5]
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(splitAndSlice1(example2[2]));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: example2[6]
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(splitAndSlice1(example2[3]));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: example2[7]
          });
        }
      },
      { initialVirtualFiles: sharedInitialVirtualFiles }
    );
  });

  test("it's yargs all the way down", async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async ({ root }) => {
        const run = runnerFactory('node', ['cli.js'], {
          cwd: root,
          reject: false,
          env: sharedRunEnv
        });

        {
          const [input, output] = splitByFirstLine(featuresExamples.get('all-2'));
          const { stdout, stderr, exitCode } = await run(splitAndSlice1(input));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: output
          });
        }

        {
          const [input] = splitByFirstLine(featuresExamples.get('all-3'));
          const [, output] = splitByFirstLine(featuresExamplesRegExp.get('all-3'));

          const { stdout, stderr, exitCode } = await run(splitAndSlice1(input));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stdout: '',
            exitCode: 1,
            stderr: expect.stringMatching(output)
          });
        }

        {
          const [input] = splitByFirstLine(featuresExamples.get('all-4'));
          const [, output] = splitByFirstLine(featuresExamplesRegExp.get('all-4'));

          const { stdout, stderr, exitCode } = await run(splitAndSlice1(input));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stdout: '',
            exitCode: 1,
            stderr: expect.stringMatching(output)
          });
        }

        {
          const [input] = splitByFirstLine(featuresExamples.get('all-5'));
          const [, output] = splitByFirstLine(featuresExamplesRegExp.get('all-5'));

          const { stdout, stderr, exitCode } = await run(splitAndSlice1(input));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(output)
          });
        }

        // * We also make sure the typescript example is syntactically valid
        {
          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(
            'npx',
            ['tsc'],
            { cwd: root, env: sharedRunEnv }
          );

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: ''
          });
        }
      },
      {
        additionalPackagesToInstall: ['typescript'],
        initialVirtualFiles: {
          ...sharedInitialVirtualFiles,
          'tsconfig.json': await readJsonc<Record<string, unknown>>(
            require.resolve('rootverse:tsconfig.json') as AbsolutePath,
            { useCached: true }
          ).then((tsconfig) => {
            delete tsconfig.include;
            delete tsconfig.exclude;

            tsconfig.files = ['init.ts'];
            return JSON.stringify(tsconfig, undefined, 2);
          }),
          'init.ts': featuresExamples.get('all-6')
        }
      }
    );
  });

  test('run your tool safely and consistently', async () => {
    expect.hasAssertions();

    // * First example code block is tested via "cli.js" virtual file

    await withMockedFixture(
      async ({ root }) => {
        const run = runnerFactory('node', [], {
          cwd: root,
          reject: false,
          env: sharedRunEnv
        });

        const example = featuresExamples.get('dynamic-options-1')!.split('\n');
        const args = splitAndSlice1(example[1]);

        {
          const { stdout, stderr, exitCode } = await run(['cli.cjs', ...args]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: example[4]
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['cli.mjs', ...args]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: example[4]
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['cli-manual.mjs', ...args]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: example[4]
          });
        }
      },
      {
        initialVirtualFiles: {
          ...sharedInitialVirtualFiles,
          'cli.cjs': featuresExamples.get('run-2'),
          'cli.mjs': featuresExamples.get('run-3'),
          'cli-manual.mjs': featuresExamples.get('run-4')
        }
      }
    );
  });

  test('convention over configuration', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async ({ root }) => {
        await runYesRejectOnBadExit('npx', ['tsc'], { cwd: root, env: sharedRunEnv });

        const run = runnerFactory('node', ['cli.js'], {
          cwd: root,
          reject: false,
          env: sharedRunEnv
        });

        {
          const [input, output] = splitByFirstLine(featuresExamples.get('all-2'));

          const { stdout, stderr, exitCode } = await run(splitAndSlice1(input));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: output
          });
        }

        {
          const [input] = splitByFirstLine(featuresExamples.get('all-3'));
          const [, output] = splitByFirstLine(featuresExamplesRegExp.get('all-3'));

          const { stdout, stderr, exitCode } = await run(splitAndSlice1(input));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stdout: '',
            exitCode: 1,
            // ? Our custom error handler doesn't add an extra newline before
            // ? "Invalid..."
            stderr: expect.stringMatching(collapseNewlines(output))
          });
        }

        {
          const [input] = splitByFirstLine(featuresExamples.get('all-4'));
          const [, output] = splitByFirstLine(featuresExamplesRegExp.get('all-4'));

          const { stdout, stderr, exitCode } = await run(splitAndSlice1(input));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stdout: '',
            exitCode: 1,
            // ? Our custom error handler doesn't add an extra newline before
            // ? "Invalid..."
            stderr: expect.stringMatching(collapseNewlines(output))
          });
        }

        {
          const [input] = splitByFirstLine(featuresExamples.get('all-5'));
          const [, output] = splitByFirstLine(featuresExamplesRegExp.get('all-5'));

          const { stdout, stderr, exitCode } = await run(splitAndSlice1(input));

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(output)
          });
        }
      },
      {
        additionalPackagesToInstall: ['typescript'],
        initialVirtualFiles: {
          ...sharedInitialVirtualFiles,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'tsconfig.json': await readJsonc<Record<string, any>>(
            require.resolve('rootverse:tsconfig.json') as AbsolutePath,
            { useCached: true }
          ).then((tsconfig) => {
            delete tsconfig.include;
            delete tsconfig.exclude;

            tsconfig.compilerOptions.noEmit = false;
            tsconfig.compilerOptions.allowImportingTsExtensions = false;
            tsconfig.files = ['cli.ts', 'configure.ts'];

            return JSON.stringify(tsconfig, undefined, 2);
          }),
          'cli.ts': featuresExamples.get('convention-2'),
          'configure.ts': featuresExamples.get('convention-1')
        }
      }
    );
  });

  test('extensive intellisense support', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async ({ root }) => {
        {
          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(
            'npx',
            ['tsc'],
            { cwd: root, env: sharedRunEnv }
          );

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: ''
          });
        }
      },
      {
        additionalPackagesToInstall: ['typescript', '@types/node'],
        initialVirtualFiles: {
          ...sharedInitialVirtualFiles,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'tsconfig.json': await readJsonc<Record<string, any>>(
            require.resolve('rootverse:tsconfig.json') as AbsolutePath,
            { useCached: true }
          ).then((tsconfig) => {
            delete tsconfig.include;
            delete tsconfig.exclude;

            tsconfig.compilerOptions.outDir = './dist';
            tsconfig.files = ['check.cjs'];
            return JSON.stringify(tsconfig, undefined, 2);
          }),
          'check.cjs': featuresExamples.get('intellisense-1')
        }
      }
    );
  });
});

describe('./docs/getting-started.md', () => {
  test('run through entire guide (programmatically) start to finish', async () => {
    expect.hasAssertions();

    // * These tests will not work on Windows
    if (process.platform === 'win32') {
      expect(true).toBeTrue();
      return;
    }

    for (const runType of ['esm', 'cjs'] as const) {
      await withMockedFixture(async ({ root, fs }) => {
        await fs.mkdir(runType);

        let updatedRoot = toPath(root, runType);

        const commands1 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-1')
        );

        {
          const [cmd, args] = commands1[0]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        // * --> cd my-cli-project <--

        updatedRoot = toPath(updatedRoot, 'my-cli-project');

        {
          const [cmd, args] = commands1[2]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        const commands2 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get(`cli-2-${runType}`)
        );

        const writable = createWriteStream(toPath(updatedRoot, 'package.json'));
        await once(writable, 'open');

        {
          const [cmd, args] = commands2[0]!;

          await runYesRejectOnBadExit(cmd, [args[0]!], {
            cwd: updatedRoot,
            env: sharedRunEnv,
            coerceOutputToString: false,
            stdout: writable
          });
        }

        writable.close();

        {
          const [cmd, args] = commands2[1]!;

          // ! BF is available in the parent node_modules directory. If we're
          // ! doing a real E2E test, we'll install the real BF locally
          if (process.env.SYMBIOTE_TEST_E2E_MODE === EndToEndMode.Real) {
            await runYesRejectOnBadExit(cmd, args, {
              cwd: updatedRoot,
              env: sharedRunEnv
            });
          }
        }

        const commands3 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-3')
        );

        {
          const [cmd, args] = commands3[0]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        {
          const [cmd, args] = commands3[1]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        {
          const [cmd, args] = commands3[2]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        await fs.writeFile(
          toPath(updatedRoot, 'cli.js'),
          gettingStartedExamples.get(`cli-4-${runType}`)!
        );

        const commands5 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-5')
        );

        {
          const [cmd, args] = commands5[0]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        const commands6 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-6')
        );

        {
          const [cmd, args] = commands6[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: '',
            exitCode: FrameworkExitCode.NotImplemented,
            stderr: gettingStartedExamples.get('cli-7')
          });
        }

        const commands8 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-8')
        );

        {
          const [cmd, args] = commands8[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: '',
            exitCode: FrameworkExitCode.DefaultError,
            stderr: expect.stringMatching(gettingStartedExamplesRegExp.get('cli-9')!)
          });
        }

        const commands10 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-10')
        );

        {
          const [cmd, args] = commands10[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: '',
            exitCode: FrameworkExitCode.DefaultError,
            stderr: expect.stringMatching(gettingStartedExamplesRegExp.get('cli-11')!)
          });
        }

        await fs.writeFile(
          toPath(updatedRoot, 'commands/index.js'),
          gettingStartedExamples.get(`cli-12-${runType}`)!
        );

        const commands13 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-13')
        );

        {
          const [cmd, args] = commands13[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: gettingStartedExamples.get('cli-14')!,
            exitCode: FrameworkExitCode.Ok,
            stderr: ''
          });
        }

        const commands15 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-15')
        );

        {
          const [cmd, args] = commands15[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: gettingStartedExamples.get('cli-16'),
            exitCode: FrameworkExitCode.Ok,
            stderr: ''
          });
        }

        const commands17 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-17')
        );

        {
          const [cmd, args] = commands17[0]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        {
          const [cmd, args] = commands17[1]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        {
          const [cmd, args] = commands17[2]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        {
          const [cmd, args] = commands17[3]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        {
          const [cmd, args] = commands17[4]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        {
          const [cmd, args] = commands17[5]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        const commands18 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-18')
        );

        {
          const [cmd, args] = commands18[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stderr: '',
            exitCode: FrameworkExitCode.Ok,
            stdout: expect.stringMatching(gettingStartedExamplesRegExp.get('cli-19')!)
          });
        }

        const commands20 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-20')
        );

        {
          const [cmd, args] = commands20[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stderr: '',
            exitCode: FrameworkExitCode.Ok,
            stdout: expect.stringMatching(gettingStartedExamplesRegExp.get('cli-21')!)
          });
        }

        const commands22 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-22')
        );

        {
          const [cmd, args] = commands22[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stderr: '',
            exitCode: FrameworkExitCode.Ok,
            stdout: expect.stringMatching(gettingStartedExamplesRegExp.get('cli-23')!)
          });
        }

        const commands24 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-24')
        );

        {
          const [cmd, args] = commands24[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: '',
            exitCode: FrameworkExitCode.DefaultError,
            stderr: expect.stringMatching(gettingStartedExamplesRegExp.get('cli-25')!)
          });
        }

        const commands26 = splitLinesSplitSpacesStripQuotes(
          gettingStartedExamples.get('cli-26')
        );

        {
          const [cmd, args] = commands26[0]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        {
          const [cmd, args] = commands26[1]!;

          await runYesRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        }

        await fs.writeFile(
          toPath(updatedRoot, 'test.cjs'),
          gettingStartedExamples.get(`cli-27-${runType}`)!
        );

        const [commands28NodeOptions, commands28_] = gettingStartedExamples
          .get('cli-28')!
          .split('npx')
          .map((s) => s.trim());

        {
          const [cmd, args] = splitLinesSplitSpacesStripQuotes(
            'npx ' + commands28_!
          )[0]!;

          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(cmd, args, {
            cwd: updatedRoot,
            env: {
              ...sharedRunEnv,
              NODE_OPTIONS: commands28NodeOptions!.split("'")[1]
            }
          });

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: expect.anything(),
            exitCode: 0,
            stderr: expect.stringContaining('PASS')
          });
        }
      });
    }
  });
});

function splitAndSlice1(str: string | undefined) {
  assert(str);
  return str.split(' ').slice(1);
}

function splitAndSlice2(str: string | undefined) {
  assert(str);
  return str.split(' ').slice(2);
}

function splitByFirstLine(str: string | undefined): [string, string];
function splitByFirstLine(str: RegExp | undefined): [RegExp, RegExp];
function splitByFirstLine(str: RegExp | string | undefined) {
  assert(str);

  const isStr = typeof str === 'string';
  const split = isStr ? str.split('\n') : str.source.split(String.raw`\n`);
  const result = [
    split[0]!,
    split.slice(1).join(isStr ? '\n' : String.raw`\n`)
  ] as const;

  return isStr
    ? result
    : result.map((resultStr) => {
        assert(resultStr);
        return new RegExp(resultStr, str.flags);
      });
}

function collapseNewlines(regExp: RegExp | undefined) {
  assert(regExp);
  return new RegExp(
    regExp.source.replaceAll(/(\\n){2,}/g, String.raw`\n+`),
    regExp.flags
  );
}

function splitLinesSplitSpacesStripQuotes(str: string | undefined) {
  assert(str);

  return str.split('\n').map((split) => {
    const splitSplit = split.split(' ');

    return [
      stripQuotes(splitSplit[0]!),
      splitSplit.slice(1).map((s) => stripQuotes(s))
    ] as const;
  });

  function stripQuotes(s: string) {
    s = s.startsWith('"') || s.startsWith("'") ? s.slice(1) : s;
    s = s.endsWith('"') || s.endsWith("'") ? s.slice(0, -1) : s;
    return s;
  }
}
