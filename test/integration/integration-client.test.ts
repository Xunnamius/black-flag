/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jest/require-hook */
/* eslint-disable jest/no-conditional-in-test, jest/no-conditional-expect */

// * These tests verify that consumers of this software actually receive an API
// * that behaves as described in help text and other documentation. Typically,
// * these integration tests limit module-level mocking to peripheral concerns
// * (e.g. mocking output handling and mocking networking while eschewing
// * filesystem mocking) in favor of testing a "fully integrated" system.

import assert from 'node:assert';
import { join } from 'node:path';
import { exports as pkgExports, name as pkgName } from 'rootverse:package.json';

import { createDebugLogger } from 'rejoinder';

import {
  dummyFilesFixture,
  dummyNpmPackageFixture,
  mockFixtureFactory,
  nodeImportAndRunTestFixture,
  npmCopySelfFixture
} from 'testverse:setup.ts';

import type {
  $executionContext,
  Arguments,
  ChildConfiguration,
  Configuration,
  ConfigurationHooks,
  ConfigureArguments,
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext,
  ConfigureExecutionEpilogue,
  ConfigureExecutionPrologue,
  ImportedConfigurationModule,
  ParentConfiguration,
  RootConfiguration
} from 'universe:exports/index.ts';

import type {
  DescriptorToProgram,
  EffectorProgram,
  ExecutionContext,
  Executor,
  FrameworkArguments,
  HelperProgram,
  PreExecutionContext,
  Program,
  ProgramDescriptor,
  ProgramMetadata,
  ProgramType,
  Programs,
  RouterProgram
} from 'universe:exports/util.ts';
import { access } from 'node:fs/promises';

const TEST_IDENTIFIER = 'integration-node';
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

describe("import {...} from '@black-flag/core'", () => {
  test('configureProgram', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('1.0.0');
      },
      {
        // ! Regression test: we test --version here to ensure ESM-CJS interop
        // ! is working at every level. Do not change --version. This feature
        // ! has broken between node versions more than once :(
        initialFileContents: {
          'src/index.cjs': `require('@black-flag/core').configureProgram('${join(
            __dirname,
            '..',
            'fixtures',
            'one-file-index'
          ).replaceAll('\\', '/')}').then(({execute}) => execute(['--version']));`
        }
      }
    );
  });

  test('runProgram', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('1.0.0');
      },
      {
        initialFileContents: {
          'src/index.cjs': `require('@black-flag/core').runProgram('${join(
            __dirname,
            '..',
            'fixtures',
            'one-file-index'
          ).replaceAll('\\', '/')}', '--version');`
        }
      }
    );
  });

  test('$executionContext', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
          'src/index.cjs': `
console.log(require('@black-flag/core').isGracefulEarlyExitError({}) === false ? 'success' : 'failed');`
        }
      }
    );
  });

  test('<typescript-only type exports>', async () => {
    expect.hasAssertions();

    const _v1: ConfigurationHooks = {
      configureArguments(argv) {
        return argv;
      }
    };

    const _v2: ConfigureArguments = (argv) => argv;
    const _v3: ConfigureErrorHandlingEpilogue = () => undefined;
    const _v4: ConfigureExecutionContext = (context) => context;
    const _v5: ConfigureExecutionEpilogue = (argv) => argv;
    const _v6: ConfigureExecutionPrologue = () => undefined;
    const _v7: ChildConfiguration = { name: 'something' };

    const _v8: Configuration = {
      aliases: [],
      builder: {},
      command: '$0',
      deprecated: false,
      description: '',
      handler: () => undefined,
      name: 'something',
      usage: 'usage'
    };

    const _v9: ImportedConfigurationModule = { name: 'something' };
    const _v10: ParentConfiguration = { name: 'something' };
    const _v11: RootConfiguration = { name: 'something' };

    void _v1, _v2, _v3, _v4, _v5, _v6, _v7, _v8, _v9, _v10, _v11;
    expect(true).toBeTrue();
  });
});

describe("import {...} from '@black-flag/core/util'", () => {
  test('isArguments', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toInclude('--help');
      },
      {
        initialFileContents: {
          'src/index.cjs': `
require('@black-flag/core/util').makeRunner({
  commandModulePath: '${join(__dirname, '..', 'fixtures', 'one-file-index').replaceAll('\\', '/')}'
})('--help');`
        }
      }
    );
  });

  test('defaultHelpOptionName', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        // ! This also tests that CliError can handle weird cause objects, leave
        // ! the AssertionFailedError() constructor call empty!
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
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
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
          'src/index.cjs': `
console.log(Object.keys(require('@black-flag/core/util').ErrorMessage).length ? 'success' : 'failed');`
        }
      }
    );
  });

  test('isCommandNotImplementedError', async () => {
    expect.hasAssertions();

    await withMockedFixture(
      async (context) => {
        assert(context.testResult, 'must use node-import-and-run-test fixture');
        expect(context.testResult.stderr).toBeEmpty();
        expect(context.testResult.code).toBe(0);
        expect(context.testResult.stdout).toBe('success');
      },
      {
        initialFileContents: {
          'src/index.cjs': `
console.log(require('@black-flag/core/util').isCommandNotImplementedError({}) === false ? 'success' : 'failed');`
        }
      }
    );
  });

  test('<typescript-only type exports>', async () => {
    expect.hasAssertions();

    const _v1: DescriptorToProgram<'effector'> = {} as EffectorProgram;
    const _v2: EffectorProgram = {} as DescriptorToProgram<'effector'>;
    const _v3: ExecutionContext = {} as { commands: any; debug: any; state: any };
    const _v4: Executor = () => Promise.resolve({} as Arguments);
    const _v5: FrameworkArguments = {} as { [$executionContext]: any };
    const _v6: HelperProgram = {} as DescriptorToProgram<'helper'>;

    const _v7: PreExecutionContext = {} as ExecutionContext & {
      rootPrograms: any;
      execute: any;
      executionContext: any;
    };

    const _v8: Program = {} as Program;
    const _v9: ProgramDescriptor = 'effector';

    const _v10: ProgramMetadata = {
      filename: '',
      filenameWithoutExtension: '',
      filepath: '',
      hasChildren: false,
      isImplemented: true,
      parentDirName: '',
      reservedCommandNames: [],
      type: 'parent-child'
    };

    const _v11: ProgramType = 'parent-child';

    const _v12: Programs = {
      effector: {} as EffectorProgram,
      helper: {} as HelperProgram,
      router: {} as RouterProgram
    };

    const _v13: RouterProgram = {} as DescriptorToProgram<'router'>;

    void _v1, _v2, _v3, _v4, _v5, _v6, _v7, _v8, _v9, _v10, _v11, _v12, _v13;
    expect(true).toBeTrue();
  });
});
