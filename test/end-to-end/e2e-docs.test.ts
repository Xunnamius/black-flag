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

describe('./README', () => {
  test('quick start', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async ({ root }) => {
        const run = runnerFactory('node', ['cli.js'], {
          cwd: root,
          reject: false,
          env: {
            FORCE_COLOR: 'false',
            NO_COLOR: 'true',
            DEBUG_COLORS: 'false'
          }
        });

        {
          const { stdout, stderr, exitCode } = await run(['--version']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '0.0.1'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['--help']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(
              /Usage: pirate-parser\n\nCommands:\n\s+ pirate-parser hello\s+ Welcome ter black flag, a declarative wrapper around yargs!\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --version\s+ Show version number\s+ \[boolean\]/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['hello', '--help']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(
              /pirate-parser hello <cmd> \[args\]\n\nPositionals:\n\s+ name\s+ The name to say hello to\s+ \[string\] \[default: "Cambi"\]\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['hello', 'Parrot']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: 'Hello Parrot, welcome to Black Flag!'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['hello', 'CAPTAIN']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: 'Hello CAPTAIN, welcome to Black Flag!'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run([
            'hello',
            'Parrot',
            '--attention'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stdout: '',
            exitCode: 1,
            stderr: expect.stringMatching(
              /pirate-parser hello <cmd> \[args\]\n\nPositionals:\n\s+ name\s+ The name to say hello to\s+ \[string\] \[default: "Cambi"\]\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\nUnknown argument: attention/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run([
            'hello',
            'CAPTAIN',
            '--attention'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout:
              '-!- Captain is on the bridge -!-\nHello CAPTAIN, welcome to Black Flag!'
          });
        }
      },
      {
        initialVirtualFiles: {
          'cli.js': /* js */ `#!/usr/bin/env node

import { runProgram } from '@black-flag/core';
export default runProgram(import.meta.resolve('./commands'));
`,
          'commands/index.js': /* js */ `export const name = 'pirate-parser';`,
          'commands/hello.js':
            /* js */ `export const command = '$0 [name]';

export const usage = '$0 <cmd> [args]';

export const description =
  'Welcome ter black flag, a declarative wrapper around yargs!';

export function builder(blackFlag, helpOrVersionSet, argv) {
  blackFlag.positional('name', {
    type: 'string',
    default: 'Cambi',
    describe: 'The name to say hello to'
  });

  // A special --attention flag only available when greeting the captain!
  if (helpOrVersionSet || argv?._.at(0) === 'CAPTAIN') {
    return {
      attention: {
        boolean: true,
        description: 'Alert the watch that the captain is around'
      }
    };
  }
}

export async function handler(argv) {
  if (argv.attention) {
    console.log('-!- Captain is on the bridge -!-');
  }

  console.log(` +
            '`Hello ${argv.name}, welcome to Black Flag!`' +
            `);
}
`
        }
      }
    );
  });
});

describe('./docs/features.md', () => {
  test("it's yargs all the way down", async () => {
    expect.hasAssertions();
  });

  test('run your tool safely and consistently', async () => {
    expect.hasAssertions();
  });

  test('convention over configuration', async () => {
    expect.hasAssertions();
  });

  test('simple comprehensive error handling and reporting', async () => {
    expect.hasAssertions();
  });
  test('a pleasant testing experience', async () => {
    expect.hasAssertions();
  });

  test('built-in debug integration for runtime insights', async () => {
    expect.hasAssertions();
  });

  test('extensive intellisense support', async () => {
    expect.hasAssertions();
  });
});

describe('./docs/getting-started.md', () => {
  test('todo', async () => {
    expect.hasAssertions();
  });
});
