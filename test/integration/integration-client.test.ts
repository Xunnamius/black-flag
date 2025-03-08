// * These tests verify that consumers of this software actually receive an API
// * that behaves as described in help text and other documentation. Typically,
// * these integration tests limit module-level mocking to peripheral concerns
// * (e.g. mocking output handling and mocking networking while eschewing
// * filesystem mocking) in favor of testing a "fully integrated" system.

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

const shortIdentifier = packageName.split('/').at(-1)!;
const TEST_IDENTIFIER = `${shortIdentifier}-client`;
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

describe("import {...} from '@black-flag/core'", () => {
  test('configureProgram', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('1.0.0');
      },
      {
        // ! Regression test: we test --version here to ensure ESM-CJS interop
        // ! is working at every level. Do not change --version. This feature
        // ! has broken between node versions more than once :(
        initialVirtualFiles: {
          'src/index.cjs': `require('@black-flag/core').configureProgram('${pathToFileURL(
            toPath(__dirname, '..', 'fixtures', 'one-file-index-cjs')
          ).toString()}').then(({execute}) => execute(['--version']));`
        }
      }
    );
  });

  test('runProgram', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('1.0.0');
      },
      {
        // ! Regression test: we test --version here to ensure ESM-CJS interop
        // ! is working at every level. Do not change --version. This feature
        // ! has broken between node versions more than once :(
        initialVirtualFiles: {
          'src/index.cjs': `require('@black-flag/core').runProgram('${pathToFileURL(
            toPath(__dirname, '..', 'fixtures', 'one-file-index-cjs')
          ).toString()}', '--version');`
        }
      }
    );
  });

  test('$executionContext', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        // ! Regression test: we test --version here to ensure ESM-CJS interop
        // ! is working at every level. Do not change --version. This feature
        // ! has broken between node versions more than once :(
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(require('node:util/types').isSymbolObject(Object(require('@black-flag/core').$executionContext)) ? 'success' : 'failed');`
        }
      }
    );
  });

  // eslint-disable-next-line jest/prefer-lowercase-title
  test('FrameworkExitCode', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(require('@black-flag/core').FrameworkExitCode.DefaultError === 1 ? 'success' : 'failed');`
        }
      }
    );
  });

  // eslint-disable-next-line jest/prefer-lowercase-title
  test('CliError', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(new (require('@black-flag/core').CliError)(new Error('hello!')).message === 'hello!' ? 'success' : 'failed');`
        }
      }
    );
  });

  // eslint-disable-next-line jest/prefer-lowercase-title
  test('GracefulEarlyExitError', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(new (require('@black-flag/core').GracefulEarlyExitError)().message !== 'undefined' ? 'success' : 'failed');`
        }
      }
    );
  });

  test('isCliError', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(require('@black-flag/core').isCliError({}) === false ? 'success' : 'failed');`
        }
      }
    );
  });

  test('isGracefulEarlyExitError', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(require('@black-flag/core').isGracefulEarlyExitError({}) === false ? 'success' : 'failed');`
        }
      }
    );
  });
});

describe("import {...} from '@black-flag/core/util'", () => {
  test('isArguments', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(require('@black-flag/core/util').isArguments({}) === false ? 'success' : 'failed');`
        }
      }
    );
  });

  test('isAssertionSystemError', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(require('@black-flag/core/util').isAssertionSystemError({}) === false ? 'success' : 'failed');`
        }
      }
    );
  });

  test('isNullArguments', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(require('@black-flag/core/util').isNullArguments({}) === false ? 'success' : 'failed');`
        }
      }
    );
  });

  test('isPreExecutionContext', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(require('@black-flag/core/util').isPreExecutionContext({}) === false ? 'success' : 'failed');`
        }
      }
    );
  });

  test('makeRunner', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toInclude('--help');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
require('@black-flag/core/util').makeRunner({
  commandModulesPath: '${pathToFileURL(toPath(__dirname, '..', 'fixtures', 'one-file-index-cjs')).toString()}'
})('--help');`
        }
      }
    );
  });

  test('defaultHelpOptionName', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(typeof require('@black-flag/core/util').defaultHelpOptionName === 'string' ? 'success' : 'failed');`
        }
      }
    );
  });

  test('defaultHelpTextDescription', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(typeof require('@black-flag/core/util').defaultHelpTextDescription === 'string' ? 'success' : 'failed');`
        }
      }
    );
  });

  test('defaultUsageText', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(typeof require('@black-flag/core/util').defaultUsageText === 'string' ? 'success' : 'failed');`
        }
      }
    );
  });

  test('defaultVersionOptionName', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(typeof require('@black-flag/core/util').defaultVersionOptionName === 'string' ? 'success' : 'failed');`
        }
      }
    );
  });

  test('defaultVersionTextDescription', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(typeof require('@black-flag/core/util').defaultVersionTextDescription === 'string' ? 'success' : 'failed');`
        }
      }
    );
  });

  // eslint-disable-next-line jest/prefer-lowercase-title
  test('AssertionFailedError', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        // ! This also tests that CliError can handle weird cause objects, leave
        // ! the AssertionFailedError() constructor call empty!
        initialVirtualFiles: {
          'src/index.cjs': `
console.log((new (require('@black-flag/core/util').AssertionFailedError)()).message !== 'undefined' ? 'success' : 'failed');`
        }
      }
    );
  });

  // eslint-disable-next-line jest/prefer-lowercase-title
  test('CommandNotImplementedError', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(new (require('@black-flag/core/util').CommandNotImplementedError)().message !== 'undefined' ? 'success' : 'failed');`
        }
      }
    );
  });

  // eslint-disable-next-line jest/prefer-lowercase-title
  test('ErrorMessage', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(Object.keys(require('@black-flag/core/util').BfErrorMessage).length ? 'success' : 'failed');`
        }
      }
    );
  });

  test('isCommandNotImplementedError', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.exitCode).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialVirtualFiles: {
          'src/index.cjs': `
console.log(require('@black-flag/core/util').isCommandNotImplementedError({}) === false ? 'success' : 'failed');`
        }
      }
    );
  });
});
