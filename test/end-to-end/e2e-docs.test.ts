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

function split(str: string | undefined) {
  assert(str);
  return str.split(' ').slice(2);
}

describe('./README.md', () => {
  test('quick start', async () => {
    expect.hasAssertions();

    const examples = await extractExamplesFromDocument(
      require.resolve('../../README.md'),
      { useCached: true }
    );

    const examplesRegExp = await extractExamplesFromDocument(
      require.resolve('../../README.md'),
      { useCached: true, asRegExp: true }
    );

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
            split(examples.get('command-1'))
          );

          expect({ id: 1, stderr, exitCode, stdout }).toStrictEqual({
            id: 1,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(examplesRegExp.get('output-1')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            split(examples.get('command-2'))
          );

          expect({ id: 2, stderr, exitCode, stdout }).toStrictEqual({
            id: 2,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(examplesRegExp.get('output-2')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            split(examples.get('command-3'))
          );

          expect({ id: 3, stderr, exitCode, stdout }).toStrictEqual({
            id: 3,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(examplesRegExp.get('output-3')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            split(examples.get('command-4'))
          );

          expect({ id: 4, stderr, exitCode, stdout }).toStrictEqual({
            id: 4,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(examplesRegExp.get('output-4')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            split(examples.get('command-5'))
          );

          expect({ id: 5, stderr, exitCode, stdout }).toStrictEqual({
            id: 5,
            stdout: '',
            exitCode: 1,
            stderr: expect.stringMatching(examplesRegExp.get('output-5')!)
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(
            split(examples.get('command-6'))
          );

          expect({ id: 6, stderr, exitCode, stdout }).toStrictEqual({
            id: 6,
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(examplesRegExp.get('output-6')!)
          });
        }
      },
      {
        initialVirtualFiles: {
          'cli.js': examples.get('cli.js'),
          'commands/index.js': examples.get('commands/index.js'),
          'commands/hello.js': examples.get('commands/hello.js')
        }
      }
    );
  });
});

describe('./docs/features.md', () => {
  const sharedInitialVirtualFiles = {
    'cli.js': /* js */ `#!/usr/bin/env node

import { runProgram } from '@black-flag/core';
// Just point Black Flag at the directory containing your command files
export default runProgram(import.meta.resolve('./commands'));
`,
    'commands/index.js': /* js */ `export const name = 'myctl';`,
    'commands/init.js':
      /* js */ `const PYTHON_DEFAULT_VERSION = '3.13';
const NODE_DEFAULT_VERSION = '23.3';

// "argv" is a new third argument for builders    vvv
export function builder(yargs, helpOrVersionSet, argv) {
  //                                              ^^^

  // Tell Yargs to leave strings that look like numbers as strings
  yargs.parserConfiguration({ 'parse-numbers': false });

  // This conditional branch will be used to validate any ✨ dynamic ✨
  // arguments and trigger the command's handler if validation succeeds.
  //
  // This is possible because Black Flag runs the builder function twice. First
  // WITHOUT the "argv" parameter, and then again WITH the "argv" parameter set
  // to the result from the first run. The recomputed "argv" result from the
  // second run is the one that gets passed to the handler function.
  //
  //   vvv
  if (argv) {
    // ^^^    "argv" is only defined on builder's SECOND run!
    if (argv.lang === 'node') {
      // NOTE THAT "argv" IS RECOMPUTED, so the old "argv" (the one we see now)
      // is discarded! Hence, we need to supply defaults for lang and version:
      return {
        lang: { choices: ['node'], default: 'node' },
        version: {
          choices: ['20.18', '22.12', '23.3'],
          default: NODE_DEFAULT_VERSION
        }
      };
    } else {
      // Also note above how we can return a literal options object instead of
      // calling yargs.options(...), but we still can if we want to:
      return yargs.options({
        lang: { choices: ['python'], default: 'python' },
        version: {
          choices: ['3.11', '3.12', '3.13'],
          default: PYTHON_DEFAULT_VERSION
        }
      });
    }
  }
  // This conditional branch will be used on builder's first run. It's used for
  // initial GENERIC validation and for generating GENERIC --help text.
  else {
    // These next lines are the best you'd be able to do when using vanilla
    // Yargs. But with Black Flag, it's only the generic fallback 🙂
    return {
      lang: { choices: ['node', 'python'], default: 'python' },
      version: { string: true, default: PYTHON_DEFAULT_VERSION }
    };
  }
}

export function handler(argv) {
  console.log(` +
      '`> initializing new ${argv.lang}@${argv.version} project...`' +
      `);
  // ...
}
`
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

        {
          const { stdout, stderr, exitCode } = await run(['init', '--lang', 'node']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new node@23.3 project...'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run([
            'init',
            '--lang',
            'node',
            '--version=23.3'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new node@23.3 project...'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['init']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new python@3.13 project...'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['init', '--lang', 'python']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new python@3.13 project...'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run([
            'init',
            '--lang',
            'python',
            '--version=3.13'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new python@3.13 project...'
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
          const { stdout, stderr, exitCode } = await run([
            'init',
            '--lang',
            'node',
            '--version=23.3'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new node@23.3 project...'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run([
            'init',
            '--lang',
            'python',
            '--version=23.3'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stdout: '',
            exitCode: 1,
            stderr: expect.stringMatching(
              /Usage: myctl init\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --lang\s+ \[choices: "python"\] \[default: "python"\]\n\s+ --version\s+ \[choices: "3\.11", "3\.12", "3\.13"\] \[default: "3\.13"\]\n\nInvalid values:\n\s+ Argument: version, Given: "23\.3", Choices: "3\.11", "3\.12", "3\.13"/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['init', '--lang', 'fake']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stdout: '',
            exitCode: 1,
            stderr: expect.stringMatching(
              /Usage: myctl init\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --lang\s+ \[choices: "node", "python"\] \[default: "python"\]\n\s+ --version\s+ \[string\] \[default: "3\.13"\]\n\nInvalid values:\n\s+ Argument: lang, Given: "fake", Choices: "node", "python"/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['init', '--help']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(
              /Usage: myctl init\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --lang\s+ \[choices: "node", "python"\] \[default: "python"\]\n\s+ --version\s+ \[string\] \[default: "3\.13"\]/
            )
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
          'init.ts':
            /* ts */ `import type { Configuration, $executionContext } from '@black-flag/core';

// Types are also available vvv
const configuration: Configuration = {
  //                        ^^^

  // ALL OF THESE ARE OPTIONAL! Black Flag would still accept this file even if
  // if were completely blank

  // Used as the command's name in help text, when parsing arguments, when
  // replacing "$0" during string interpolation, and elsewhere. Usually defaults
  // to a trimmed version of the file/directory name
  name: 'init',

  // An array of Yargs aliases for this command. DO NOT include positional
  // arguments here, those go in \`command\` just like with vanilla Yargs
  aliases: [],

  // Used to define positional args using Yargs's DSL. All command strings must
  // begin with "$0". Defaults to "$0". This value is also used to replace
  // "$000" during string interpolation for the usage option
  command: '$0 [positional-arg-1] [positional-arg-2]',

  ` +
            String.raw`// Used as the command's usage instructions in its own help text. "$000", if
  // present, will be replaced by the value of the command option. Afterwards,
  // "$1" and then "$0", if present, will be replaced by the description and
  // name options. Defaults to "Usage: $000\n\n$1". Will be trimmed before being
  // output
  usage: 'Usage: $0 [put positional args here]\n\nThis is neat! Also:\n\n$1',

  ` +
            `// Used as the command's description in its parent command's help text, and
  // when replacing "$1" during string interpolation for the usage option. Set
  // to false to disable the description and hide the command. Defaults to ""
  description: 'initializes stuff',

  // If true, this command will be considered deprecated. Defaults to false
  deprecated: false,

  // Can be a Yargs options object or a builder function like below
  builder(yargs, helpOrVersionSet, argv) {
    // ...

    // We are never forced to return anything...
    // return yargs;
    // ... but we can if we want:
    return yargs.boolean('verbose');
    // We can also just return an options object too:
    return {
      verbose: {
        boolean: true,
        description: '...'
      }
    };
    // Also note you can access ExecutionContext with argv?.[$executionContext]
  },

  // This function is called when the arguments match and pass Yargs
  // validation. Defaults to a function that throws CommandNotImplementedError
  handler(argv) {
    console.log(` +
            '`> initializing new ${argv.lang}@${argv.version} project...`' +
            `);
    // Note that you can access ExecutionContext with argv[$executionContext]

    // ...
  }
};

export default configuration;
`
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

        {
          const { stdout, stderr, exitCode } = await run([
            'cli.cjs',
            'init',
            '--lang',
            'node'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new node@23.3 project...'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run([
            'cli.mjs',
            'init',
            '--lang',
            'node'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new node@23.3 project...'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run([
            'cli-manual.mjs',
            'init',
            '--lang',
            'node'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new node@23.3 project...'
          });
        }
      },
      {
        initialVirtualFiles: {
          ...sharedInitialVirtualFiles,
          'cli.cjs': /* js */ `const { join } = require('node:path');
const { runProgram } = require('@black-flag/core');

module.exports = runProgram(join(__dirname, 'commands'));
`,
          'cli.mjs': /* js */ `import { runProgram } from '@black-flag/core';

export default runProgram(import.meta.resolve('./commands'));
`,
          'cli-manual.mjs': /* js */ `import { join } from 'node:path';
import { configureProgram, isCliError } from '@black-flag/core';
import { hideBin } from '@black-flag/core/util';

let parsedArgv = undefined;

try {
  const commandsDir = import.meta.resolve('./commands');
  const preExecutionContext = await configureProgram(commandsDir);
  parsedArgv = await preExecutionContext.execute(hideBin(process.argv));
  process.exitCode = 0;
} catch (error) {
  // This catch block is why runProgram never throws 🙂
  process.exitCode = isCliError(error) ? error.suggestedExitCode : 1;
}

export default parsedArgv;
`
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
          const { stdout, stderr, exitCode } = await run([
            'init',
            '--lang',
            'node',
            '--version=23.3'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: '> initializing new node@23.3 project...'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run([
            'init',
            '--lang',
            'python',
            '--version=23.3'
          ]);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stdout: '',
            exitCode: 1,
            // ? Our custom error handler doesn't add an extra newline before
            // ? "Invalid..."
            stderr: expect.stringMatching(
              /Usage: myctl init\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --lang\s+ \[choices: "python"\] \[default: "python"\]\n\s+ --version\s+ \[choices: "3\.11", "3\.12", "3\.13"\] \[default: "3\.13"\]\nInvalid values:\n\s+ Argument: version, Given: "23\.3", Choices: "3\.11", "3\.12", "3\.13"/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['init', '--lang', 'fake']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stdout: '',
            exitCode: 1,
            // ? Our custom error handler doesn't add an extra newline before
            // ? "Invalid..."
            stderr: expect.stringMatching(
              /Usage: myctl init\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --lang\s+ \[choices: "node", "python"\] \[default: "python"\]\n\s+ --version\s+ \[string\] \[default: "3\.13"\]\nInvalid values:\n\s+ Argument: lang, Given: "fake", Choices: "node", "python"/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['init', '--help']);

          expect({ stderr, exitCode, stdout }).toStrictEqual({
            stderr: '',
            exitCode: 0,
            stdout: expect.stringMatching(
              /Usage: myctl init\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --lang\s+ \[choices: "node", "python"\] \[default: "python"\]\n\s+ --version\s+ \[string\] \[default: "3\.13"\]/
            )
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
          'cli.ts': /* ts */ `#!/usr/bin/env node
// File: my-cli-project/cli.ts

import { runProgram } from '@black-flag/core';

export default runProgram(
  import.meta.resolve('./commands'),
  // Just pass an object of your configuration hooks. Promises are okay!
  import('./configure.js')
);
`,
          'configure.ts': /* ts */ `import type {
  ConfigureArguments,
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext,
  ConfigureExecutionEpilogue,
  ConfigureExecutionPrologue
} from '@black-flag/core';

// These configuration hooks have been listed in the order they're typically
// executed by Black Flag. They are all entirely optional.

/**
 * This function is called once towards the beginning of the execution of
 * configureProgram and should return what will be used to create the global
 * context singleton. Note that the return value of this function is cloned and
 * then discarded.
 */
export const configureExecutionContext: ConfigureExecutionContext = async (
  context
) => {
  // You can add some state shared between all your command handlers and
  // configuration hooks here.
  context.somethingDifferent = 'cool';
  return context; // <== This is: the "context" ExecutionContext used everywhere
};

/**
 * This function is called once towards the end of the execution of
 * configureProgram, after all commands have been discovered but before any
 * have been executed, and should apply any final configurations to the Yargs
 * instances that constitute the command line interface.
 */
export const configureExecutionPrologue: ConfigureExecutionPrologue = async (
  { effector, helper, router }, // <== This is: root Yargs instances (see below)
  context
) => {
  // Typically unnecessary and suboptimal to use this hook. Configure commands
  // (including the root command) declaratively using the simple declarative
  // filesystem-based API instead. Otherwise, at this point, you're just using
  // Yargs but with extra steps.
};

/**
 * This function is called once towards the beginning of the execution of
 * PreExecutionContext::execute(X) and should return a process.argv-like
 * array.
 */
export const configureArguments: ConfigureArguments = async (
  rawArgv, // <== This is either the X in ::execute(X), or hideBin(process.argv)
  context
) => {
  // This is where Yargs middleware and other argument pre-processing can be
  // implemented, if necessary.

  // When PreExecutionContext::execute is invoked without arguments, Black Flag
  // calls the yargs::hideBin helper utility on process.argv for you. Therefore,
  // calling hideBin here would cause a bug. You shouldn't ever need to call
  // hideBin manually, but if you do, it's re-exported from
  // '@black-flag/core/util'.

  return rawArgv; // <== This is: the argv that Yargs will be given to parse
};

/**
 * This function is called once after CLI argument parsing completes and either
 * (1) handler execution succeeds or (2) a GracefulEarlyExitError is thrown.
 */
export const configureExecutionEpilogue: ConfigureExecutionEpilogue = async (
  argv, // <== This is: the yargs::parseAsync() result
  context
) => {
  // If a GracefulEarlyExitError was thrown, then
  // context.state.isGracefullyExiting === true.

  return argv; // <== This is: what is returned by PreExecutionContext::execute
};

/**
 * This function is called once at the very end of the error handling process
 * after an error has occurred. However, this function is NOT called when a
 * GracefulEarlyExitError is thrown!
 */
export const configureErrorHandlingEpilogue: ConfigureErrorHandlingEpilogue =
  async ({ error, message, exitCode }, argv, context) => {
    // message === (error?.message || String(error))

    // Bring your own error handling and reporting if you'd like! By default,
    // this hook will dump any error messages to stderr like so:
    console.error(message);
  };
`
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
          'check.cjs':
            /* js */ `// @ts-check
// This is a pure CJS JavaScript file, no TypeScript allowed!

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {import('@black-flag/core').ParentConfiguration}
 */
module.exports = {
  description: ` +
            '`description for program ${name}`' +
            `,
  builder: (blackFlag) => blackFlag.option(name, { count: true }),
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
`
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

    const virtualTestCjsFile =
      /* js */ `const { makeRunner } = require('@black-flag/core/util');

// makeRunner is a factory function that returns runProgram functions with
// curried arguments.
const run = makeRunner({ commandModulesPath: ` +
      '`${__dirname}/commands`' +
      // TODO: DELETE THIS NEXT BIT (old version interop) WHEN YOU SEE THIS:
      `,
      commandModulePath: ` +
      '`${__dirname}/commands`' +
      ` });

afterEach(() => {
  // Since runProgram (i.e. what is returned by makeRunner) sets
  // process.exitCode before returning, let's unset it after each test
  process.exitCode = undefined;
});

describe('myctl (root)', () => {
  it('emits expected output when called with no arguments', async () => {
    expect.hasAssertions();

    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await run();

    expect(errorSpy).not.toHaveBeenCalled();
    expect(logSpy.mock.calls).toStrictEqual([['ran root command handler']]);
  });

  it('emits expected output when called with unknown arguments', async () => {
    expect.hasAssertions();

    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await run('--unknown');
    await run('unknown');

    expect(errorSpy).not.toHaveBeenCalled();
    expect(logSpy.mock.calls).toStrictEqual([
      ['ran root command handler'],
      ['ran root command handler']
    ]);
  });

  it('still terminates with 0 exit code when called with unknown arguments', async () => {
    expect.hasAssertions();

    await run('--unknown-argument');

    expect(process.exitCode).toBe(0);
  });
});
`;

    const virtualFilePoolEsm = {
      'cli.js': /* js */ `#!/usr/bin/env node

import { runProgram } from '@black-flag/core';
export default runProgram(import.meta.resolve('./commands'));
`,
      'commands/index.js': /* js */ `/**
 * This little comment gives us intellisense support :)
 *
 * Also note how we're using the \`export const X = function(...) { ... }\` syntax
 * instead of the streamlined \`export function X(...) { ... }\` syntax. Both of
 * these syntaxes are correct, however JSDoc does not support using "@type" on
 * the latter form for some reason.
 *
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const builder = function (blackFlag) {
  return blackFlag.strict(false);
};

/**
 * @type {import('@black-flag/core').RootConfiguration['handler']}
 */
export const handler = function (argv) {
  console.log('ran root command handler');
};

/**
 * Note that \`usage\` is just a freeform string used in help text. The \`command\`
 * export, on the other hand, supports the Yargs DSL for defining positional
 * parameters and the like.
 *
 * @type {import('@black-flag/core').RootConfiguration['usage']}
 */
export const usage = 'Usage: $0 command [options]\\n\\nCustom description here.';
`
    } as const;

    const virtualFilePoolCjs = {
      'cli.js': /* js */ `#!/usr/bin/env node

const bf = require('@black-flag/core');
const path = require('node:path');
module.exports = bf.runProgram(path.join(__dirname, 'commands'));
`,
      'commands/index.js': /* js */ `module.exports = {
  builder: function (blackFlag) {
    return blackFlag.strict(false);
  },

  handler: function (argv) {
    console.log('ran root command handler');
  },

  usage: 'Usage: $0 command [options]\\n\\nCustom description here.'
};
`
    } as const;

    for (const runType of ['esm', 'cjs'] as const) {
      const virtualFilePool =
        runType === 'cjs' ? virtualFilePoolCjs : virtualFilePoolEsm;

      await withMockedFixture(async ({ root, fs }) => {
        await fs.mkdir(runType);

        let updatedRoot = toPath(root, runType);

        await runYesRejectOnBadExit('mkdir', ['my-cli-project'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        // * --> cd my-cli-project <--

        updatedRoot = toPath(updatedRoot, 'my-cli-project');

        await runYesRejectOnBadExit('git', ['init'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        const readable = createWriteStream(toPath(updatedRoot, 'package.json'));
        await once(readable, 'open');

        await runYesRejectOnBadExit(
          'echo',
          [
            `{"name":"myctl","version":"1.0.0","type":"module","bin":{"myctl":"./cli.js"}}`.replace(
              '"module"',
              runType === 'cjs' ? '"commonjs"' : '"module"'
            )
          ],
          {
            cwd: updatedRoot,
            env: sharedRunEnv,
            coerceOutputToString: false,
            stdout: readable
          }
        );

        await runYesRejectOnBadExit('mkdir', ['commands'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        await runYesRejectOnBadExit('touch', ['cli.js'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        await runYesRejectOnBadExit('chmod', ['+x', 'cli.js'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        await fs.writeFile(toPath(updatedRoot, 'cli.js'), virtualFilePool['cli.js']);

        await runYesRejectOnBadExit('touch', ['commands/index.js'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        const run = runnerFactory('./cli.js', [], {
          cwd: updatedRoot,
          reject: false,
          env: sharedRunEnv
        });

        {
          const { stdout, stderr, exitCode } = await run();

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: '',
            exitCode: FrameworkExitCode.NotImplemented,
            stderr: 'This command is currently unimplemented'
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['bad']);

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: '',
            exitCode: FrameworkExitCode.DefaultError,
            stderr: expect.stringMatching(
              /Usage: myctl\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --version\s+ Show version number\s+ \[boolean\]\n\nUnknown argument: bad/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['--bad']);

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: '',
            exitCode: FrameworkExitCode.DefaultError,
            stderr: expect.stringMatching(
              /Usage: myctl\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --version\s+ Show version number\s+ \[boolean\]\n\nUnknown argument: bad/
            )
          });
        }

        await fs.writeFile(
          toPath(updatedRoot, 'commands/index.js'),
          virtualFilePool['commands/index.js']
        );

        {
          const { stdout, stderr, exitCode } = await run();

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: 'ran root command handler',
            exitCode: FrameworkExitCode.Ok,
            stderr: ''
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['--bad', '--bad2', '--bad3']);

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: 'ran root command handler',
            exitCode: FrameworkExitCode.Ok,
            stderr: ''
          });
        }

        await runYesRejectOnBadExit('touch', ['commands/init.js'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        await runYesRejectOnBadExit('mkdir', ['commands/remote'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        await runYesRejectOnBadExit('touch', ['commands/remote/index.js'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        await runYesRejectOnBadExit('touch', ['commands/remote/add.js'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        await runYesRejectOnBadExit('touch', ['commands/remote/remove.js'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        await runYesRejectOnBadExit('touch', ['commands/remote/show.js'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        {
          const { stdout, stderr, exitCode } = await run(['--help']);

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stderr: '',
            exitCode: FrameworkExitCode.Ok,
            stdout: expect.stringMatching(
              /Usage: myctl command \[options\]\n\nCustom description here.\n\nCommands:\n\s+ myctl init\n\s+ myctl remote\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\s+ --version\s+ Show version number\s+ \[boolean\]/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['remote', '--help']);

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stderr: '',
            exitCode: FrameworkExitCode.Ok,
            stdout: expect.stringMatching(
              /Usage: myctl remote\n\nCommands:\n\s+ myctl remote add\n\s+ myctl remote remove\n\s+ myctl remote show\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['remote', 'show', '--help']);

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stderr: '',
            exitCode: FrameworkExitCode.Ok,
            stdout: expect.stringMatching(
              /Usage: myctl remote show\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]/
            )
          });
        }

        {
          const { stdout, stderr, exitCode } = await run(['remote', 'bad', 'horrible']);

          expect({ runType, stderr, exitCode, stdout }).toStrictEqual({
            runType,
            stdout: '',
            exitCode: FrameworkExitCode.DefaultError,
            stderr: expect.stringMatching(
              /Usage: myctl remote\n\nCommands:\n\s+ myctl remote add\n\s+ myctl remote remove\n\s+ myctl remote show\n\nOptions:\n\s+ --help\s+ Show help text\s+ \[boolean\]\n\nInvalid subcommand: you must call this with a valid subcommand argument/
            )
          });
        }

        await runYesRejectOnBadExit(
          'npm',
          ['install', '--save-dev', 'jest', '@babel/plugin-syntax-import-attributes'],
          {
            cwd: updatedRoot,
            env: sharedRunEnv
          }
        );

        // ! This might pull @black-flag/core from NPM (i.e. "real end-to-end")
        // ! depending on process.env.SYMBIOTE_TEST_E2E_MODE
        // eslint-disable-next-line unicorn/prefer-ternary
        if (process.env.SYMBIOTE_TEST_E2E_MODE === EndToEndMode.Real) {
          await runYesRejectOnBadExit('npm', ['install', '@black-flag/core'], {
            cwd: updatedRoot,
            env: sharedRunEnv
          });
        } else {
          // * Otherwise, we use the pre-built local version of Black Flag
          await fs.rename(
            'node_modules/@black-flag',
            toPath(updatedRoot, 'node_modules/@black-flag')
          );
        }

        await runYesRejectOnBadExit('touch', ['test.cjs'], {
          cwd: updatedRoot,
          env: sharedRunEnv
        });

        await fs.writeFile(toPath(updatedRoot, 'test.cjs'), virtualTestCjsFile);

        {
          const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(
            'npx',
            ['jest', '--testMatch', '**/test.cjs', '--restoreMocks'],
            {
              cwd: updatedRoot,
              env: {
                ...sharedRunEnv,
                NODE_OPTIONS: '--no-warnings --experimental-vm-modules'
              }
            }
          );

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
