/* eslint-disable @typescript-eslint/no-explicit-any */

// * These tests ensure the exported interfaces under test function as expected.

// ! Make sure not to get caught up expecting a certain order when different
// ! OSes and Node.js versions walk the filesystem in different orders!

import assert from 'node:assert';
import fsPromises from 'node:fs/promises';

import { nullArguments$0 } from 'universe:constant.ts';
import { BfErrorMessage, CliError } from 'universe:error.ts';
import * as bf from 'universe:exports/index.ts';
import * as bf_util from 'universe:exports/util.ts';
import { capitalize } from 'universe:util.ts';

import { expectedCommandsRegex, getFixturePath, withMocks } from 'testverse:util.ts';

import type { Argv } from 'yargs';
import type { Arguments, ExecutionContext } from 'universe:types/program.ts';

const mockNullArguments: bf.NullArguments = {
  $0: nullArguments$0,
  _: [],
  [bf.$executionContext]: expect.objectContaining({
    commands: expect.any(Map),
    debug: expect.anything(),
    state: expect.any(Object)
  })
};

const capitalizedCommandNotImplementedErrorMessage = capitalize(
  BfErrorMessage.CommandNotImplemented()
);

describe('::configureProgram', () => {
  it('returns PreExecutionContext with expected properties and values', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const {
        rootPrograms,
        execute,
        commands,
        debug,
        state,
        executionContext,
        ...rest
      } = await bf.configureProgram(getFixturePath('one-file-index-cjs'));

      expect(rootPrograms).toBeObject();
      expect(rootPrograms).toContainAllKeys(['effector', 'helper', 'router']);
      expect(execute).toBeFunction();
      expect(executionContext).toBeObject();
      expect(commands).toBeDefined();
      expect(debug).toBeFunction();
      expect(state).toBeObject();
      expect(state).toContainAllKeys([
        'rawArgv',
        'initialTerminalWidth',
        'isGracefullyExiting',
        'didAlreadyHandleError',
        'isHandlingHelpOption',
        'globalHelpOption',
        'isHandlingVersionOption',
        'globalVersionOption',
        'showHelpOnFail',
        'firstPassArgv',
        'deepestParseResult',
        'didOutputHelpOrVersionText',
        'finalError'
      ]);
      expect(rest).toBeEmpty();
    });

    await withMocks(async () => {
      const {
        rootPrograms,
        execute,
        commands,
        debug,
        state,
        executionContext,
        ...rest
      } = await bf.configureProgram(getFixturePath('one-file-index-esm'));

      expect(rootPrograms).toBeObject();
      expect(rootPrograms).toContainAllKeys(['effector', 'helper', 'router']);
      expect(execute).toBeFunction();
      expect(executionContext).toBeObject();
      expect(commands).toBeDefined();
      expect(debug).toBeFunction();
      expect(state).toBeObject();
      expect(state).toContainAllKeys([
        'rawArgv',
        'initialTerminalWidth',
        'isGracefullyExiting',
        'didAlreadyHandleError',
        'isHandlingHelpOption',
        'globalHelpOption',
        'isHandlingVersionOption',
        'globalVersionOption',
        'showHelpOnFail',
        'firstPassArgv',
        'deepestParseResult',
        'didOutputHelpOrVersionText',
        'finalError'
      ]);
      expect(rest).toBeEmpty();
    });
  });

  it('uses default configuration hooks when provided hooks are explicitly undefined', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy }) => {
      await expect(
        (
          await bf.configureProgram(getFixturePath('one-file-index-cjs'), {
            configureArguments: undefined,
            configureErrorHandlingEpilogue: undefined,
            configureExecutionContext: undefined,
            configureExecutionEpilogue: undefined,
            configureExecutionPrologue: undefined
          })
        ).execute(['--bad'])
      ).rejects.toBeDefined();

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        [],
        ['Unknown argument: bad']
      ]);
    });

    await withMocks(async ({ errorSpy }) => {
      await expect(
        (
          await bf.configureProgram(getFixturePath('one-file-index-esm'), {
            configureArguments: undefined,
            configureErrorHandlingEpilogue: undefined,
            configureExecutionContext: undefined,
            configureExecutionEpilogue: undefined,
            configureExecutionPrologue: undefined
          })
        ).execute(['--bad'])
      ).rejects.toBeDefined();

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        [],
        ['Unknown argument: bad']
      ]);
    });
  });

  it('throws when called with undefined or non-existent commandModulePath', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      // @ts-expect-error: testing bad call
      await expect(bf.configureProgram()).rejects.toMatchObject({
        message: BfErrorMessage.BadConfigurationPath(undefined)
      });

      await expect(bf.configureProgram('')).rejects.toMatchObject({
        message: BfErrorMessage.BadConfigurationPath('')
      });

      await expect(bf.configureProgram('/does-not-exist')).rejects.toMatchObject({
        message: BfErrorMessage.BadConfigurationPath('/does-not-exist')
      });

      // @ts-expect-error: testing bad call
      await expect(bf.configureProgram({})).rejects.toMatchObject({
        message: BfErrorMessage.BadConfigurationPath({})
      });

      await expect(bf.configureProgram('', {})).rejects.toMatchObject({
        message: BfErrorMessage.BadConfigurationPath('')
      });
    });
  });

  it('uses "name" from package.json, directory, or filename without extension as program name if no name is provided', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const context = await bf.configureProgram(
        getFixturePath('nested-several-files-empty-cjs')
      );

      expect(Array.from(context.commands.keys())).toIncludeSameMembers([
        'test',
        'test nested',
        'test nested first',
        'test nested second',
        'test nested third'
      ]);
    });

    await withMocks(async () => {
      const context = await bf.configureProgram(
        getFixturePath('nested-several-files-empty-esm')
      );

      expect(Array.from(context.commands.keys())).toIncludeSameMembers([
        'test',
        'test nested',
        'test nested first',
        'test nested second',
        'test nested third'
      ]);
    });
  });

  it('uses "name" from directory or filename without extension as root program name if no name is provided and no package.json is found', async () => {
    expect.hasAssertions();

    jest.spyOn(fsPromises, 'stat').mockImplementation(async (path) => {
      const realResult = fsPromises.lstat(path);

      if (path.toString().endsWith('package.json')) {
        // eslint-disable-next-line @typescript-eslint/no-misused-spread
        return { ...(await realResult), isFile: () => false };
      }

      return realResult;
    });

    await withMocks(async () => {
      const context = await bf.configureProgram(
        getFixturePath('nested-several-files-empty-cjs')
      );

      expect(Array.from(context.commands.keys())).toIncludeSameMembers([
        'nested-several-files-empty-cjs',
        'nested-several-files-empty-cjs nested',
        'nested-several-files-empty-cjs nested first',
        'nested-several-files-empty-cjs nested second',
        'nested-several-files-empty-cjs nested third'
      ]);
    });

    await withMocks(async () => {
      const context = await bf.configureProgram(
        getFixturePath('nested-several-files-empty-esm')
      );

      expect(Array.from(context.commands.keys())).toIncludeSameMembers([
        'nested-several-files-empty-esm',
        'nested-several-files-empty-esm nested',
        'nested-several-files-empty-esm nested first',
        'nested-several-files-empty-esm nested second',
        'nested-several-files-empty-esm nested third'
      ]);
    });
  });

  it('uses "name" from directory or filename without extension as root program name if no name is provided and empty package.json is found', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const context = await bf.configureProgram(
        getFixturePath('empty-index-file-package')
      );

      expect(Array.from(context.commands.keys())).toStrictEqual([
        'empty-index-file-package'
      ]);
    });
  });

  it('disables --version if package.json has no "version" property', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      const context = await bf.configureProgram(
        getFixturePath('empty-index-file-package-no-version')
      );

      expect(Array.from(context.commands.keys())).toStrictEqual(['test-no-version']);

      await expect(context.execute(['--help'])).resolves.toBeDefined();

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.not.stringContaining('--version')]
      ]);
    });
  });

  it('returns program instances instead of vanilla yargs instances from proxied methods', async () => {
    expect.hasAssertions();

    {
      let succeeded = false;

      await withMocks(async () => {
        await bf.configureProgram(getFixturePath('one-file-loose-cjs'), {
          configureExecutionPrologue({ effector, helper, router }) {
            expect(effector.boolean('key')).toBe(effector);
            expect(helper.options({ option: { boolean: true } })).toBe(helper);
            expect(router.command(['x'], false, {}, () => undefined, [], false)).toBe(
              router
            );
            succeeded = true;
          }
        });
      });

      expect(succeeded).toBeTrue();
    }

    {
      let succeeded = false;

      await withMocks(async () => {
        await bf.configureProgram(getFixturePath('one-file-loose-esm'), {
          configureExecutionPrologue({ effector, helper, router }) {
            expect(effector.boolean('key')).toBe(effector);
            expect(helper.options({ option: { boolean: true } })).toBe(helper);
            expect(router.command(['x'], false, {}, () => undefined, [], false)).toBe(
              router
            );
            succeeded = true;
          }
        });
      });

      expect(succeeded).toBeTrue();
    }
  });

  it('supports "file://..."-style URLs as commandModulePath', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      const context = await bf.configureProgram(
        'file://' + getFixturePath('empty-index-file-package-no-version')
      );

      expect(Array.from(context.commands.keys())).toStrictEqual(['test-no-version']);

      await expect(context.execute(['--help'])).resolves.toBeDefined();

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.not.stringContaining('--version')]
      ]);
    });
  });

  it('throws when configureExecutionContext returns falsy', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('empty-index-file-cjs'), {
          configureExecutionContext: () => undefined as any
        })
      ).rejects.toMatchObject({
        message: expect.stringMatching(/ExecutionContext/)
      });
    });

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('empty-index-file-esm'), {
          configureExecutionContext: () => undefined as any
        })
      ).rejects.toMatchObject({
        message: expect.stringMatching(/ExecutionContext/)
      });
    });
  });

  it('throws when calling disallowed methods or properties on programs', async () => {
    expect.hasAssertions();

    let succeeded = false;

    await withMocks(async () => {
      await bf.configureProgram(getFixturePath('one-file-loose-cjs'), {
        configureExecutionPrologue({ effector, helper, router }) {
          const asYargs = (o: unknown): Argv => o as Argv;

          expect(() => asYargs(effector).help(false)).toThrow(
            BfErrorMessage.InvocationNotAllowed('help')
          );
          expect(() => asYargs(helper).help(false)).toThrow(
            BfErrorMessage.InvocationNotAllowed('help')
          );
          expect(() => asYargs(router).help(false)).toThrow(
            BfErrorMessage.InvocationNotAllowed('help')
          );

          expect(() => asYargs(effector).parseSync()).toThrow(
            BfErrorMessage.UseParseAsyncInstead()
          );
          expect(() => asYargs(helper).parseSync()).toThrow(
            BfErrorMessage.UseParseAsyncInstead()
          );
          expect(() => asYargs(router).parseSync()).toThrow(
            BfErrorMessage.UseParseAsyncInstead()
          );

          expect(asYargs(effector).argv).toBeUndefined();
          expect(asYargs(helper).argv).toBeUndefined();
          expect(asYargs(router).argv).toBeUndefined();

          expect(() => asYargs(effector).showHelpOnFail(false)).not.toThrow(
            BfErrorMessage.InvocationNotAllowed('showHelpOnFail')
          );
          expect(() => asYargs(helper).showHelpOnFail(false)).not.toThrow(
            BfErrorMessage.InvocationNotAllowed('showHelpOnFail')
          );
          expect(() => asYargs(router).showHelpOnFail(false)).toThrow(
            BfErrorMessage.InvocationNotAllowed('showHelpOnFail')
          );

          expect(asYargs(effector).parsed).toBeFalse();
          expect(asYargs(helper).parsed).toBeFalse();
          expect(asYargs(router).parsed).toBeUndefined();
          succeeded = true;
        }
      });
    });

    expect(succeeded).toBeTrue();
  });

  describe('::execute', () => {
    it('returns parsed arguments object', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        await expect(
          (await bf.configureProgram(getFixturePath('one-file-loose-cjs'))).execute([
            'arg1',
            '-2',
            '--arg3'
          ])
        ).resolves.toStrictEqual({
          $0: 'test',
          _: ['arg1', -2],
          arg3: true,
          handled_by: getFixturePath(['one-file-loose-cjs', 'index.js']),
          [bf.$executionContext]: expect.anything()
        } satisfies Arguments);
      });

      await withMocks(async () => {
        await expect(
          (await bf.configureProgram(getFixturePath('one-file-loose-esm'))).execute([
            'arg1',
            '-2',
            '--arg3'
          ])
        ).resolves.toStrictEqual({
          $0: 'test',
          _: ['arg1', -2],
          arg3: true,
          handled_by: getFixturePath(['one-file-loose-esm', 'index.js']),
          [bf.$executionContext]: expect.anything()
        } satisfies Arguments);
      });
    });

    it('calls hideBin on process.argv only if no argv argument provided', async () => {
      expect.hasAssertions();

      {
        let succeeded = 0;

        await withMocks(
          async () => {
            const config: bf.ConfigurationHooks = {
              configureArguments(argv) {
                expect(argv).toStrictEqual(['3']);
                succeeded++;
                return argv;
              }
            };

            await expect(
              (
                await bf.configureProgram(getFixturePath('one-file-loose-cjs'), config)
              ).execute()
            ).resolves.toBeDefined();

            await expect(
              (
                await bf.configureProgram(getFixturePath('one-file-loose-cjs'), config)
              ).execute(['3'])
            ).resolves.toBeDefined();
          },
          {
            simulatedArgv: ['1', '2', '3'],
            options: { replaceEntireArgv: true }
          }
        );

        expect(succeeded).toBe(2);
      }

      {
        let succeeded = 0;

        await withMocks(
          async () => {
            const config: bf.ConfigurationHooks = {
              configureArguments(argv) {
                expect(argv).toStrictEqual(['3']);
                succeeded++;
                return argv;
              }
            };

            await expect(
              (
                await bf.configureProgram(getFixturePath('one-file-loose-esm'), config)
              ).execute()
            ).resolves.toBeDefined();

            await expect(
              (
                await bf.configureProgram(getFixturePath('one-file-loose-esm'), config)
              ).execute(['3'])
            ).resolves.toBeDefined();
          },
          {
            simulatedArgv: ['1', '2', '3'],
            options: { replaceEntireArgv: true }
          }
        );

        expect(succeeded).toBe(2);
      }
    });

    it('passes around configured arguments and returns epilogue result', async () => {
      expect.hasAssertions();

      const expectedArgv = ['a', 'b', 'c'];
      const expectedResult: Arguments = {
        $0: '$0',
        _: expectedArgv,
        [bf.$executionContext]: {} as ExecutionContext,
        something: 'else'
      };

      await withMocks(async () => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-loose-cjs'),
          {
            configureArguments() {
              return expectedArgv;
            },
            configureExecutionEpilogue(argv) {
              expect(argv._).toStrictEqual(expectedArgv);
              return expectedResult;
            }
          }
        );

        await expect(execute()).resolves.toBe(expectedResult);
      });
    });

    it('passes around context singleton', async () => {
      expect.hasAssertions();

      let expectedContext: ExecutionContext;

      await withMocks(async () => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-loose-cjs'),
          {
            configureArguments(argv, context) {
              expect(context).toBe(expectedContext);
              return argv;
            },
            configureExecutionEpilogue(argv, context) {
              expect(argv[bf.$executionContext]).toBe(expectedContext);
              expect(context).toBe(expectedContext);
              return argv;
            },
            configureErrorHandlingEpilogue(_meta, argv, context) {
              expect(argv[bf.$executionContext]).toBe(expectedContext);
              expect(context).toBe(expectedContext);
            },
            configureExecutionContext(context) {
              context.ok = true;
              return context;
            },
            configureExecutionPrologue(_program, context) {
              expect(context.ok).toBeTrue();
              expectedContext = context;
            }
          }
        );

        const result = await execute();
        expect(result).toBeDefined();
        expect(result[bf.$executionContext]).toBe(expectedContext);
      });
    });

    it('outputs explicit help text to stdout and implicit to stderr with expected exit codes', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy, errorSpy }) => {
        await expect(
          (await bf.configureProgram(getFixturePath('one-file-index-cjs'))).execute([
            '--help'
          ])
        ).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([[expect.stringContaining('--help')]]);
        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--version')]
        ]);

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--one-file-index')]
        ]);

        expect(errorSpy.mock.calls).toHaveLength(0);

        await expect(
          (await bf.configureProgram(getFixturePath('one-file-index-cjs'))).execute([
            '--bad'
          ])
        ).rejects.toBeDefined();

        expect(logSpy.mock.calls).toHaveLength(1);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--help')],
          [],
          ['Unknown argument: bad']
        ]);

        expect(errorSpy.mock.calls[0]).toStrictEqual([
          expect.stringContaining('--version')
        ]);

        expect(errorSpy.mock.calls[0]).toStrictEqual([
          expect.stringContaining('--one-file-index')
        ]);
      });

      await withMocks(async ({ logSpy, errorSpy }) => {
        await expect(
          (await bf.configureProgram(getFixturePath('one-file-index-esm'))).execute([
            '--help'
          ])
        ).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([[expect.stringContaining('--help')]]);
        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--version')]
        ]);

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--one-file-index')]
        ]);

        expect(errorSpy.mock.calls).toHaveLength(0);

        await expect(
          (await bf.configureProgram(getFixturePath('one-file-index-esm'))).execute([
            '--bad'
          ])
        ).rejects.toBeDefined();

        expect(logSpy.mock.calls).toHaveLength(1);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--help')],
          [],
          ['Unknown argument: bad']
        ]);

        expect(errorSpy.mock.calls[0]).toStrictEqual([
          expect.stringContaining('--version')
        ]);

        expect(errorSpy.mock.calls[0]).toStrictEqual([
          expect.stringContaining('--one-file-index')
        ]);
      });
    });

    it('replaces "$000", "$0", and "$1" in usage text in the appropriate order when outputting help text', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy, errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-custom-usage-cjs'))
          ).execute(['--help'])
        ).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /^Usage: custom-name - Custom-description custom-name \$1 \$1 custom-name - custom-name <custom1\|custom2> \[custom3\.\.]/
            )
          ]
        ]);

        expect(errorSpy.mock.calls).toHaveLength(0);

        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-custom-usage-cjs'))
          ).execute(['--bad'])
        ).rejects.toBeDefined();

        expect(logSpy.mock.calls).toHaveLength(1);
        expect(errorSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /^Usage: custom-name - Custom-description custom-name \$1 \$1 custom-name - custom-name <custom1\|custom2> \[custom3\.\.]/
            )
          ],
          [],
          ['Not enough non-option arguments: got 0, need at least 1']
        ]);
      });

      await withMocks(async ({ logSpy, errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-custom-usage-cjs'))
          ).execute(['custom-param', '--bad'])
        ).rejects.toBeDefined();

        expect(logSpy.mock.calls).toHaveLength(0);
        expect(errorSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /^Usage: custom-name - Custom-description custom-name \$1 \$1 custom-name - custom-name <custom1\|custom2> \[custom3\.\.]/
            )
          ],
          [],
          ['Unknown argument: bad']
        ]);
      });

      await withMocks(async ({ logSpy, errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-custom-usage-esm'))
          ).execute(['--help'])
        ).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /^Usage: custom-name - Custom-description custom-name \$1 \$1 custom-name - custom-name <custom1\|custom2> \[custom3\.\.]/
            )
          ]
        ]);

        expect(errorSpy.mock.calls).toHaveLength(0);

        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-custom-usage-esm'))
          ).execute(['--bad'])
        ).rejects.toBeDefined();

        expect(logSpy.mock.calls).toHaveLength(1);
        expect(errorSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /^Usage: custom-name - Custom-description custom-name \$1 \$1 custom-name - custom-name <custom1\|custom2> \[custom3\.\.]/
            )
          ],
          [],
          ['Not enough non-option arguments: got 0, need at least 1']
        ]);
      });

      await withMocks(async ({ logSpy, errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-custom-usage-esm'))
          ).execute(['custom-param', '--bad'])
        ).rejects.toBeDefined();

        expect(logSpy.mock.calls).toHaveLength(0);
        expect(errorSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /^Usage: custom-name - Custom-description custom-name \$1 \$1 custom-name - custom-name <custom1\|custom2> \[custom3\.\.]/
            )
          ],
          [],
          ['Unknown argument: bad']
        ]);
      });
    });

    it('supports "$1" interpolation in usage even when description is false and commands are hidden', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy }) => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-false-description-cjs')
        });

        await expect(run('--help')).resolves.toBeDefined();
        await expect(run('nested --help')).resolves.toBeDefined();
        await expect(run('nested child --help')).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(/^Usage: test\n\nOptions:/)],
          [expect.stringMatching(/^Usage: test nested\n\nOptions:/)],
          [expect.stringMatching(/^Usage: test nested child\n\nOptions:/)]
        ]);
      });

      await withMocks(async ({ logSpy }) => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-false-description-esm')
        });

        await expect(run('--help')).resolves.toBeDefined();
        await expect(run('nested --help')).resolves.toBeDefined();
        await expect(run('nested child --help')).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(/^Usage: test\n\nOptions:/)],
          [expect.stringMatching(/^Usage: test nested\n\nOptions:/)],
          [expect.stringMatching(/^Usage: test nested child\n\nOptions:/)]
        ]);
      });
    });

    it('capitalizes descriptions and custom usage text', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-custom-usage-cjs'))
          ).execute(['--help'])
        ).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(/^Usage: custom-name - C/)]
        ]);
      });

      await withMocks(async ({ logSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-custom-usage-esm'))
          ).execute(['--help'])
        ).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(/^Usage: custom-name - C/)]
        ]);
      });
    });

    it('outputs error messages to console.error via default handler if no error handling configuration hook is provided', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-index-cjs'),
          {
            configureErrorHandlingEpilogue: undefined
          }
        );

        await expect(execute(['bad-bad'])).rejects.toBeDefined();
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(/^Usage/)],
          [],
          [expect.stringContaining('bad-bad')]
        ]);
      });

      await withMocks(async ({ errorSpy }) => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-index-esm'),
          {
            configureErrorHandlingEpilogue: undefined
          }
        );

        await expect(execute(['bad-bad'])).rejects.toBeDefined();
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(/^Usage/)],
          [],
          [expect.stringContaining('bad-bad')]
        ]);
      });
    });

    it('calls all configuration hooks in the expected order', async () => {
      expect.hasAssertions();

      const callOrder: string[] = [];

      await withMocks(async ({ logSpy, errorSpy }) => {
        const config: bf.ConfigurationHooks = {
          configureArguments(argv) {
            callOrder.push('configureArguments');
            return argv;
          },
          configureExecutionEpilogue(argv) {
            callOrder.push('configureExecutionEpilogue');
            return argv;
          },
          configureErrorHandlingEpilogue() {
            callOrder.push('configureErrorHandlingEpilogue');
          },
          configureExecutionContext(context) {
            callOrder.push('configureExecutionContext');
            return context;
          },
          configureExecutionPrologue() {
            callOrder.push('configureExecutionPrologue');
          }
        };

        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-index-cjs'), config)
          ).execute()
        ).resolves.toBeDefined();

        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-index-cjs'), config)
          ).execute(['--help'])
        ).resolves.toBeDefined();

        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-index-cjs'), config)
          ).execute(['--bad'])
        ).rejects.toBeDefined();

        expect(logSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();

        expect(callOrder).toStrictEqual([
          'configureExecutionContext',
          'configureExecutionPrologue',
          'configureArguments',
          'configureExecutionEpilogue',

          'configureExecutionContext',
          'configureExecutionPrologue',
          'configureArguments',
          'configureExecutionEpilogue',

          'configureExecutionContext',
          'configureExecutionPrologue',
          'configureArguments',
          'configureErrorHandlingEpilogue'
        ]);
      });
    });

    it('still calls configureExecutionEpilogue and not configureErrorHandlingEpilogue when GracefulEarlyExitError is thrown from a command handler', async () => {
      expect.hasAssertions();

      const configureErrorHandlingEpilogueSpy = jest.fn();
      const configureExecutionEpilogueSpy = jest.fn(() => ({
        $0: '$0',
        _: [],
        [bf.$executionContext]: {} as ExecutionContext,
        something: 'else'
      }));

      await withMocks(async () => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-throws-handler-graceful-cjs'),
          {
            configureErrorHandlingEpilogue: configureErrorHandlingEpilogueSpy,
            configureExecutionEpilogue: configureExecutionEpilogueSpy
          }
        );

        await expect(execute()).resolves.toBeDefined();

        expect(configureErrorHandlingEpilogueSpy).not.toHaveBeenCalled();
        expect(configureExecutionEpilogueSpy).toHaveBeenCalledTimes(1);
      });
    });

    it("calls configureErrorHandlingEpilogue when configureExecutionEpilogue throws unless it's a GracefulEarlyExitError", async () => {
      expect.hasAssertions();

      const configureErrorHandlingEpilogueSpy = jest.fn();

      await withMocks(async () => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-index-cjs'),
          {
            configureErrorHandlingEpilogue: configureErrorHandlingEpilogueSpy,
            configureExecutionEpilogue: () => {
              throw new Error('badness');
            }
          }
        );

        await expect(execute()).rejects.toBeDefined();

        expect(configureErrorHandlingEpilogueSpy.mock.calls).toStrictEqual([
          [
            expect.objectContaining({ message: expect.stringContaining('badness') }),
            expect.any(Object),
            expect.any(Object)
          ]
        ]);
      });
    });

    it('calls configureErrorHandlingEpilogue with the expected arguments', async () => {
      expect.hasAssertions();

      let executed = false;

      await withMocks(async ({ errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-throws-handler-1-cjs'), {
              configureErrorHandlingEpilogue(
                { error, exitCode, message },
                argv,
                context
              ) {
                expect(error).toBeInstanceOf(Error);
                expect(exitCode).toBe(bf.FrameworkExitCode.DefaultError);
                expect(message).toBe('error thrown in handler');
                expect(argv).toSatisfy(bf_util.isNullArguments);
                expect(context).toBeDefined();
                executed = true;
              }
            })
          ).execute()
        ).rejects.toMatchObject({ message: 'error thrown in handler' });

        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(executed).toBeTrue();
      });
    });

    it('calls builder twice, passes correct programs and third parameter on second pass', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy }) => {
        const { execute, rootPrograms } = await bf.configureProgram(
          getFixturePath('one-file-verbose-builder-cjs')
        );

        await expect(execute(['--option'])).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([
          ['builder called', expect.anything(), false, undefined],
          [
            'builder called',
            expect.anything(),
            false,
            expect.objectContaining({ option: true })
          ]
        ]);

        // ? Jest will get VERY ANGRY if we combine the below and the above

        expect(logSpy.mock.calls[0][1]).toBe(rootPrograms.helper);
        expect(logSpy.mock.calls[1][1]).toBe(rootPrograms.effector);
      });

      await withMocks(async ({ logSpy }) => {
        const { execute, rootPrograms } = await bf.configureProgram(
          getFixturePath('one-file-verbose-builder-esm')
        );

        await expect(execute(['--option'])).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([
          ['builder called', expect.anything(), false, undefined],
          [
            'builder called',
            expect.anything(),
            false,
            expect.objectContaining({ option: true })
          ]
        ]);

        // ? Jest will get VERY ANGRY if we combine the below and the above

        expect(logSpy.mock.calls[0][1]).toBe(rootPrograms.helper);
        expect(logSpy.mock.calls[1][1]).toBe(rootPrograms.effector);
      });
    });

    it('supports returning program from builder', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-builder-program-cjs'))
          ).execute(['--option', '5'])
        ).resolves.toStrictEqual(expect.objectContaining({ option: 5 }));
      });
    });

    it('supports returning undefined from builder', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-builder-undefined-cjs'))
          ).execute(['--option', '5'])
        ).resolves.toStrictEqual(expect.objectContaining({ option: 5 }));
      });
    });

    it('allows returning a plain object from builder instead of program', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-builder-object-cjs'))
          ).execute(['--option', '5'])
        ).resolves.toStrictEqual(expect.objectContaining({ option: 5 }));
      });

      await withMocks(async () => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-builder-object-esm'))
          ).execute(['--option', '5'])
        ).resolves.toStrictEqual(expect.objectContaining({ option: 5 }));
      });
    });

    it('supports calling showHelpOnFail(boolean) or using context', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-index-cjs'), {
              configureExecutionPrologue({ helper }) {
                helper.showHelpOnFail(false);
              }
            })
          ).execute(['--bad'])
        ).rejects.toBeDefined();

        expect(errorSpy.mock.calls).toStrictEqual([[expect.stringContaining('bad')]]);

        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-index-cjs'), {
              configureExecutionPrologue({ helper }) {
                helper.showHelpOnFail(true);
              }
            })
          ).execute(['--bad'])
        ).rejects.toBeDefined();

        expect(errorSpy).toHaveReturnedTimes(4);
      });
    });

    it('capitalizes error messages (via configureErrorHandlingEpilogue) by default', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-throws-handler-1-cjs'))
          ).execute()
        ).rejects.toMatchObject({ message: 'error thrown in handler' });

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.objectContaining({ message: 'error thrown in handler' })]
        ]);
      });

      await withMocks(async ({ errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(getFixturePath('one-file-throws-handler-1-cjs'), {
              configureArguments() {
                throw new CliError('super bad error');
              }
            })
          ).execute()
        ).rejects.toMatchObject({ message: 'super bad error' });

        expect(errorSpy.mock.calls).toStrictEqual([['Super bad error']]);
      });
    });

    it('supports adding positional arguments (custom command export) to an executable command that has no handler export', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(
              getFixturePath('one-file-positionals-no-handler-cjs')
            )
          ).execute()
        ).rejects.toMatchObject({
          message: 'Not enough non-option arguments: got 0, need at least 2'
        });

        await expect(
          (
            await bf.configureProgram(
              getFixturePath('one-file-positionals-no-handler-cjs')
            )
          ).execute(['first', 'second'])
        ).rejects.toMatchObject({
          message: BfErrorMessage.CommandNotImplemented()
        });

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--help')],
          [],
          [expect.stringMatching(/^Not enough/)],
          [capitalizedCommandNotImplementedErrorMessage]
        ]);
      });

      await withMocks(async ({ errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(
              getFixturePath('one-file-positionals-no-handler-esm')
            )
          ).execute()
        ).rejects.toMatchObject({
          message: 'Not enough non-option arguments: got 0, need at least 2'
        });

        await expect(
          (
            await bf.configureProgram(
              getFixturePath('one-file-positionals-no-handler-esm')
            )
          ).execute(['first', 'second'])
        ).rejects.toMatchObject({
          message: BfErrorMessage.CommandNotImplemented()
        });

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--help')],
          [],
          [expect.stringMatching(/^Not enough/)],
          [capitalizedCommandNotImplementedErrorMessage]
        ]);
      });
    });

    it('throws CommandNotImplemented error and does not output help text when attempting to execute a childless command with no handler export and no custom command export', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        // * Childless root
        await expect(
          (await bf.configureProgram(getFixturePath('empty-index-file'))).execute()
        ).rejects.toMatchObject({
          message: BfErrorMessage.CommandNotImplemented()
        });

        // * Pure child
        await expect(
          (
            await bf.configureProgram(getFixturePath('nested-several-files-empty-cjs'))
          ).execute(['nested', 'first'])
        ).rejects.toMatchObject({
          message: BfErrorMessage.CommandNotImplemented()
        });

        // * Childless parent
        await expect(
          (
            await bf.configureProgram(getFixturePath('nested-one-file-index-empty-cjs'))
          ).execute(['nested'])
        ).rejects.toMatchObject({
          message: BfErrorMessage.CommandNotImplemented()
        });

        expect(errorSpy.mock.calls).toStrictEqual([
          [capitalizedCommandNotImplementedErrorMessage],
          [capitalizedCommandNotImplementedErrorMessage],
          [capitalizedCommandNotImplementedErrorMessage]
        ]);
      });
    });

    it('outputs help text with ErrorMessage.InvalidSubCommandInvocation epilogue when attempting to execute a parent command that has children and no handler export and no custom command export', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        // * Implementation-less parent with children
        await expect(
          (
            await bf.configureProgram(getFixturePath('nested-several-files-empty-cjs'))
          ).execute(['nested'])
        ).rejects.toMatchObject({
          message: BfErrorMessage.InvalidSubCommandInvocation()
        });

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--help')],
          [],
          [capitalize(BfErrorMessage.InvalidSubCommandInvocation())]
        ]);
      });
    });

    it('throws when execution fails', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-index-cjs')
        );

        await expect(execute(['--x-bad-x'])).rejects.toMatchObject({
          message: expect.stringMatching('x-bad-x')
        });

        expect(errorSpy).toHaveBeenCalled();
      });
    });

    it('throws if configureArguments returns falsy', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-loose-cjs'),
          {
            configureArguments: () => undefined as any
          }
        );

        await expect(execute(['--help'])).rejects.toMatchObject({
          message: expect.stringMatching(/typeof process\.argv/)
        });

        expect(errorSpy).toHaveBeenCalled();
      });
    });

    it('throws if configureExecutionEpilogue returns falsy', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-loose-cjs'),
          {
            configureExecutionEpilogue: () => undefined as any
          }
        );

        await expect(execute(['--vex'])).rejects.toMatchObject({
          message: expect.stringMatching(/Arguments/)
        });

        expect(errorSpy).toHaveBeenCalled();
      });
    });

    it('throws if invoked more than once', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-loose-cjs')
        );

        await expect(execute()).resolves.toBeDefined();
        await expect(execute()).rejects.toMatchObject({
          message: BfErrorMessage.CannotExecuteMultipleTimes()
        });
      });
    });

    it('does the right thing when a command builder throws on first pass', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-throws-builder-1-cjs')
        );

        await expect(execute()).rejects.toBeDefined();

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.objectContaining({ message: 'error #1 thrown in builder' })]
        ]);
      });
    });

    it('does the right thing when a command builder throws on second pass', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-throws-builder-2-cjs')
        );

        await expect(execute()).rejects.toBeDefined();

        expect(errorSpy.mock.calls).toStrictEqual([
          [
            expect.objectContaining({
              message: 'error #2 thrown in builder'
            })
          ]
        ]);
      });
    });

    it('does the right thing when a command handler throws', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-throws-handler-1-cjs')
        );

        await expect(execute()).rejects.toBeDefined();

        expect(errorSpy.mock.calls).toStrictEqual([
          [
            expect.objectContaining({
              message: 'error thrown in handler'
            })
          ]
        ]);
      });
    });

    it('does not show help text when a command handler throws', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-throws-handler-1-cjs')
        );

        await expect(execute()).rejects.toBeDefined();
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.objectContaining({ message: 'error thrown in handler' })]
        ]);
      });
    });

    it('returns NullArguments if builder or handler throws GracefulEarlyExitError, otherwise throws normally', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy }) => {
        await expect(
          (
            await bf.configureProgram(
              getFixturePath('one-file-throws-builder-1-graceful-cjs')
            )
          ).execute()
        ).resolves.toStrictEqual(mockNullArguments);

        await expect(
          (
            await bf.configureProgram(
              getFixturePath('one-file-throws-builder-2-graceful-cjs')
            )
          ).execute()
        ).resolves.toStrictEqual(mockNullArguments);

        await expect(
          (
            await bf.configureProgram(
              getFixturePath('one-file-throws-handler-graceful-cjs')
            )
          ).execute()
        ).resolves.toStrictEqual(mockNullArguments);

        await expect(
          (
            await bf.configureProgram(getFixturePath('empty-index-file'), {
              configureArguments() {
                throw new bf.GracefulEarlyExitError();
              }
            })
          ).execute(['--help'])
        ).rejects.toMatchObject({ message: BfErrorMessage.GracefulEarlyExit() });

        await expect(
          (await bf.configureProgram(getFixturePath('empty-index-file'))).execute()
        ).rejects.toMatchObject({ message: BfErrorMessage.CommandNotImplemented() });

        expect(errorSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('util::makeRunner', () => {
  const cjsCommandModulePath = getFixturePath('one-file-log-handler-cjs');

  const configurationHooks: bf.ConfigurationHooks = {
    configureExecutionPrologue() {
      // eslint-disable-next-line no-console
      console.warn(1);
    }
  };

  const errorConfigurationHooks: bf.ConfigurationHooks = {
    configureArguments() {
      throw new Error('badbadnotgood');
    }
  };

  const promisedConfigurationHooks = Promise.resolve({
    configureExecutionPrologue() {
      // eslint-disable-next-line no-console
      console.warn(2);
    }
  });

  it('splits singular argv strings on spaces', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, warnSpy }) => {
      await expect(
        bf_util.makeRunner({
          commandModulePath: getFixturePath('one-file-loose-cjs'),
          configurationHooks
        })('--option1 --option2 --option3')
      ).resolves.toContainEntries([
        ['option1', true],
        ['option2', true],
        ['option3', true]
      ]);

      expect(warnSpy).toHaveBeenCalledOnce();
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });

  it('supports high-order function signatures', async () => {
    expect.hasAssertions();

    await withMocks(async ({ warnSpy, logSpy, getExitCode }) => {
      await expect(
        bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          configurationHooks
        })(['--one-file-log-handler-cjs'])
      ).resolves.toBeDefined();

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await expect(
        bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          preExecutionContext: await bf.configureProgram(
            cjsCommandModulePath,
            promisedConfigurationHooks
          )
        })(['--one-file-log-handler-cjs'])
      ).resolves.toBeDefined();

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(warnSpy).toHaveBeenCalledTimes(2);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await expect(
        bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          configurationHooks: promisedConfigurationHooks
        })(['--one-file-log-handler-cjs'])
      ).resolves.toBeDefined();

      expect(logSpy).toHaveBeenCalledTimes(3);
      expect(warnSpy).toHaveBeenCalledTimes(3);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await expect(
        bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          preExecutionContext: bf.configureProgram(
            cjsCommandModulePath,
            promisedConfigurationHooks
          )
        })(['--one-file-log-handler-cjs'])
      ).resolves.toBeDefined();

      expect(logSpy).toHaveBeenCalledTimes(4);
      expect(warnSpy).toHaveBeenCalledTimes(4);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });

  it('supports low-order function signatures', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, logSpy, warnSpy }) => {
      const run = bf_util.makeRunner({ commandModulePath: cjsCommandModulePath });

      await run();

      expect(logSpy.mock.calls).toHaveLength(1);
      expect(warnSpy.mock.calls).toStrictEqual([]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run('--help');

      expect(logSpy.mock.calls).toHaveLength(2);
      expect(warnSpy.mock.calls).toStrictEqual([]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(['--help']);

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(warnSpy.mock.calls).toStrictEqual([]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(configurationHooks);

      expect(logSpy.mock.calls).toHaveLength(4);
      expect(warnSpy.mock.calls).toStrictEqual([[1]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(promisedConfigurationHooks);

      expect(logSpy.mock.calls).toHaveLength(5);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(await bf.configureProgram(cjsCommandModulePath, configurationHooks));

      expect(logSpy.mock.calls).toHaveLength(6);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(['--help'], configurationHooks);

      expect(logSpy.mock.calls).toHaveLength(7);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(['--help'], promisedConfigurationHooks);

      expect(logSpy.mock.calls).toHaveLength(8);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(
        '--help',
        await bf.configureProgram(cjsCommandModulePath, promisedConfigurationHooks)
      );

      expect(logSpy.mock.calls).toHaveLength(9);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2], [2]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(
        '--help',
        bf.configureProgram(cjsCommandModulePath, promisedConfigurationHooks)
      );

      expect(logSpy.mock.calls).toHaveLength(10);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2], [2], [2]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(bf.configureProgram(cjsCommandModulePath, configurationHooks));

      expect(logSpy.mock.calls).toHaveLength(11);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2], [2], [2], [1]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });

  it('supports low-order args overwriting high-order defaults', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, logSpy, warnSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        configurationHooks: {
          ...configurationHooks,
          configureExecutionEpilogue(argv) {
            // eslint-disable-next-line no-console
            console.warn(3);
            return argv;
          }
        }
      });

      const expectedWarnSpy = [];
      await run();

      expect(logSpy.mock.calls).toHaveLength(1);
      expectedWarnSpy.push([1], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run('--help');

      expect(logSpy.mock.calls).toHaveLength(2);
      expectedWarnSpy.push([1], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(['--help']);

      expect(logSpy.mock.calls).toHaveLength(3);
      expectedWarnSpy.push([1], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(configurationHooks);

      expect(logSpy.mock.calls).toHaveLength(4);
      expectedWarnSpy.push([1], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(promisedConfigurationHooks);

      expect(logSpy.mock.calls).toHaveLength(5);
      expectedWarnSpy.push([2], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(
        await bf.configureProgram(cjsCommandModulePath, promisedConfigurationHooks)
      );

      expect(logSpy.mock.calls).toHaveLength(6);
      expectedWarnSpy.push([2]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(['--help'], configurationHooks);

      expect(logSpy.mock.calls).toHaveLength(7);
      expectedWarnSpy.push([1], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(['--help'], promisedConfigurationHooks);

      expect(logSpy.mock.calls).toHaveLength(8);
      expectedWarnSpy.push([2], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(
        '--help',
        await bf.configureProgram(cjsCommandModulePath, promisedConfigurationHooks)
      );

      expect(logSpy.mock.calls).toHaveLength(9);
      expectedWarnSpy.push([2]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);
    });

    await withMocks(async ({ getExitCode, logSpy, warnSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        configurationHooks: Promise.resolve({
          configureExecutionPrologue() {
            // eslint-disable-next-line no-console
            console.warn(4);
          },
          configureExecutionEpilogue(argv) {
            // eslint-disable-next-line no-console
            console.warn(3);
            return argv;
          }
        })
      });

      const expectedWarnSpy = [];
      await run();

      expect(logSpy.mock.calls).toHaveLength(1);
      expectedWarnSpy.push([4], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run('--help');

      expect(logSpy.mock.calls).toHaveLength(2);
      expectedWarnSpy.push([4], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(['--help']);

      expect(logSpy.mock.calls).toHaveLength(3);
      expectedWarnSpy.push([4], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(configurationHooks);

      expect(logSpy.mock.calls).toHaveLength(4);
      expectedWarnSpy.push([1], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(promisedConfigurationHooks);

      expect(logSpy.mock.calls).toHaveLength(5);
      expectedWarnSpy.push([2], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(await bf.configureProgram(cjsCommandModulePath, configurationHooks));

      expect(logSpy.mock.calls).toHaveLength(6);
      expectedWarnSpy.push([1]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(['--help'], configurationHooks);

      expect(logSpy.mock.calls).toHaveLength(7);
      expectedWarnSpy.push([1], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(['--help'], promisedConfigurationHooks);

      expect(logSpy.mock.calls).toHaveLength(8);
      expectedWarnSpy.push([2], [3]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);

      await run(
        '--help',
        await bf.configureProgram(cjsCommandModulePath, promisedConfigurationHooks)
      );

      expect(logSpy.mock.calls).toHaveLength(9);
      expectedWarnSpy.push([2]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);
    });

    await withMocks(async ({ getExitCode, logSpy, warnSpy, errorSpy }) => {
      const run1 = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        preExecutionContext: bf.configureProgram(cjsCommandModulePath, {
          configureExecutionPrologue() {
            // eslint-disable-next-line no-console
            console.warn(5);
          },
          configureExecutionEpilogue(argv) {
            // eslint-disable-next-line no-console
            console.warn(6);
            return argv;
          }
        })
      });

      const run2 = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        preExecutionContext: await bf.configureProgram(cjsCommandModulePath, {
          configureExecutionPrologue() {
            // eslint-disable-next-line no-console
            console.warn(5);
          },
          configureExecutionEpilogue(argv) {
            // eslint-disable-next-line no-console
            console.warn(6);
            return argv;
          }
        })
      });

      const expectedWarnSpy = [];

      await run1();
      await run2();

      expect(logSpy.mock.calls).toHaveLength(2);
      expectedWarnSpy.push([5], [5], [6], [6]);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.Ok);
      expect(errorSpy).toHaveBeenCalledTimes(0);

      // ? Test that we can't invoke PreExecutionContext::execute >1 times

      await run1('--help');
      await run2('--help');

      expect(logSpy.mock.calls).toHaveLength(2);
      expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
      expect(getExitCode()).toStrictEqual(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining(BfErrorMessage.CannotExecuteMultipleTimes())],
        [expect.stringContaining(BfErrorMessage.CannotExecuteMultipleTimes())]
      ]);
    });
  });

  it('supports surfacing errors across high-order function signatures when using errorHandlingBehavior', async () => {
    expect.hasAssertions();

    // * Non-framework errors (default behavior)
    await withMocks(async ({ getExitCode, errorSpy }) => {
      {
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'default'
        });

        await run('--flag-one --flag-two');

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('Usage text for')],
          [],
          [
            expect.stringContaining(
              'Unknown arguments: flag-one, flagOne, flag-two, flagTwo'
            )
          ]
        ]);
      }

      {
        const error = new Error('bad');
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          configurationHooks: {
            configureArguments() {
              throw error;
            }
          },
          errorHandlingBehavior: 'default'
        });

        await run('--flag-one --flag-two');

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        expect(errorSpy).toHaveBeenCalledWith(error);
      }
    });

    // * Framework errors (default behavior)
    await withMocks(async ({ getExitCode, errorSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        configurationHooks: {
          configureExecutionContext() {
            throw new Error('bad');
          }
        },
        errorHandlingBehavior: 'default'
      });

      await run('--flag-one --flag-two');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);
    });

    // * Non-framework errors (throw behavior)
    await withMocks(async ({ getExitCode, logSpy, errorSpy }) => {
      {
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'throw'
        });

        await expect(run('--help')).rejects.toMatchObject({
          message: BfErrorMessage.GracefulEarlyExit()
        });

        expect(logSpy).toHaveBeenCalled();
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        await expect(run('--unknown-option')).rejects.toMatchObject({
          message: 'Unknown arguments: unknown-option, unknownOption'
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        expect(errorSpy).toHaveBeenCalled();
      }

      {
        const error = new Error('bad');
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          configurationHooks: {
            configureArguments() {
              throw error;
            }
          },
          errorHandlingBehavior: 'throw'
        });

        await expect(run('--flag-one --flag-two')).rejects.toMatchObject({
          message: error.message
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      }
    });

    // * Framework errors (hooks) (throw behavior)
    await withMocks(async ({ getExitCode, errorSpy }) => {
      {
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          configurationHooks: {
            configureExecutionContext() {
              throw new Error('badness');
            }
          },
          errorHandlingBehavior: 'throw'
        });

        await expect(run('--flag-one --flag-two')).rejects.toMatchObject({
          message: 'badness'
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('UNHANDLED FRAMEWORK')]
        ]);
      }

      {
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          configurationHooks: Promise.resolve({
            configureExecutionContext() {
              throw new Error('badness');
            }
          }),
          errorHandlingBehavior: 'throw'
        });

        await expect(run('--flag-one --flag-two')).rejects.toMatchObject({
          message: 'badness'
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('UNHANDLED FRAMEWORK')],
          [expect.stringContaining('UNHANDLED FRAMEWORK')]
        ]);
      }

      {
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          configurationHooks: Promise.reject<typeof configurationHooks>(
            new Error('badness')
          ),
          errorHandlingBehavior: 'throw'
        });

        await expect(run('--flag-one --flag-two')).rejects.toMatchObject({
          message: 'badness'
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('UNHANDLED FRAMEWORK')],
          [expect.stringContaining('UNHANDLED FRAMEWORK')],
          [expect.stringContaining('UNHANDLED FRAMEWORK')]
        ]);
      }
    });

    // * Framework errors (preExecutionContext) (throw behavior)
    await withMocks(async ({ getExitCode, errorSpy }) => {
      {
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          preExecutionContext: bf.configureProgram(cjsCommandModulePath, {
            configureExecutionContext() {
              throw new Error('badness');
            }
          }),
          errorHandlingBehavior: 'throw'
        });

        await expect(run('--flag-one --flag-two')).rejects.toMatchObject({
          message: 'badness'
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('UNHANDLED FRAMEWORK')]
        ]);
      }

      {
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          preExecutionContext: bf.configureProgram(
            cjsCommandModulePath,
            Promise.resolve({
              configureExecutionContext() {
                throw new Error('badness');
              }
            })
          ),
          errorHandlingBehavior: 'throw'
        });

        await expect(run('--flag-one --flag-two')).rejects.toMatchObject({
          message: 'badness'
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('UNHANDLED FRAMEWORK')],
          [expect.stringContaining('UNHANDLED FRAMEWORK')]
        ]);
      }
    });

    // * Errors across high-order signatures
    await withMocks(async ({ errorSpy, getExitCode }) => {
      await expect(
        bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'throw',
          configurationHooks: errorConfigurationHooks
        })(['--one-file-log-handler-cjs'])
      ).rejects.toMatchObject({ message: 'badbadnotgood' });

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'throw',
          preExecutionContext: await bf.configureProgram(
            cjsCommandModulePath,
            Promise.resolve(errorConfigurationHooks)
          )
        })(['--one-file-log-handler-cjs'])
      ).rejects.toMatchObject({ message: 'badbadnotgood' });

      expect(errorSpy).toHaveBeenCalledTimes(2);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'throw',
          configurationHooks: Promise.resolve(errorConfigurationHooks)
        })(['--one-file-log-handler-cjs'])
      ).rejects.toMatchObject({ message: 'badbadnotgood' });

      expect(errorSpy).toHaveBeenCalledTimes(3);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'throw',
          configurationHooks: Promise.reject(new Error('badbadnotgood'))
        })(['--one-file-log-handler-cjs'])
      ).rejects.toMatchObject({ message: 'badbadnotgood' });

      expect(errorSpy).toHaveBeenCalledTimes(4);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);

      await expect(
        bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'throw',
          preExecutionContext: bf.configureProgram(
            cjsCommandModulePath,
            Promise.resolve(errorConfigurationHooks)
          )
        })(['--one-file-log-handler-cjs'])
      ).rejects.toMatchObject({ message: 'badbadnotgood' });

      expect(errorSpy).toHaveBeenCalledTimes(5);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });
  });

  it('supports surfacing errors across low-order function signatures when using errorHandlingBehavior', async () => {
    expect.hasAssertions();

    // * Non-framework errors (default behavior)
    await withMocks(async ({ getExitCode, errorSpy }) => {
      {
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'default'
        });

        await run('--flag-one --flag-two');

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('Usage text for')],
          [],
          [
            expect.stringContaining(
              'Unknown arguments: flag-one, flagOne, flag-two, flagTwo'
            )
          ]
        ]);
      }

      {
        const error = new Error('bad');
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'default'
        });

        await run('--flag-one --flag-two', {
          configureArguments() {
            throw error;
          }
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        expect(errorSpy).toHaveBeenCalledWith(error);
      }
    });

    // * Framework errors (default behavior)
    await withMocks(async ({ getExitCode, errorSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        errorHandlingBehavior: 'default'
      });

      await run('--flag-one --flag-two', {
        configureExecutionContext() {
          throw new Error('bad');
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);
    });

    // * Non-framework errors (throw behavior)
    await withMocks(async ({ getExitCode, logSpy, errorSpy }) => {
      {
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'throw'
        });

        await expect(run('--help')).rejects.toMatchObject({
          message: BfErrorMessage.GracefulEarlyExit()
        });

        expect(logSpy).toHaveBeenCalled();
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        await expect(run('--unknown-option')).rejects.toMatchObject({
          message: 'Unknown arguments: unknown-option, unknownOption'
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        expect(errorSpy).toHaveBeenCalled();
      }

      {
        const error = new Error('bad');
        const run = bf_util.makeRunner({
          commandModulePath: cjsCommandModulePath,
          errorHandlingBehavior: 'throw'
        });

        await expect(
          run('--flag-one --flag-two', {
            configureArguments() {
              throw error;
            }
          })
        ).rejects.toMatchObject({
          message: error.message
        });

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      }
    });

    // * Framework errors (hooks) (throw behavior)
    await withMocks(async ({ getExitCode, errorSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        errorHandlingBehavior: 'throw'
      });

      await expect(
        run('--flag-one --flag-two', {
          configureExecutionContext() {
            throw new Error('badness');
          }
        })
      ).rejects.toMatchObject({
        message: 'badness'
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);

      await expect(
        run(
          '--flag-one --flag-two',
          Promise.resolve({
            configureExecutionContext() {
              throw new Error('badness');
            }
          })
        )
      ).rejects.toMatchObject({
        message: 'badness'
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')],
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);

      await expect(
        run(
          '--flag-one --flag-two',
          Promise.reject<typeof configurationHooks>(new Error('badness'))
        )
      ).rejects.toMatchObject({
        message: 'badness'
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')],
        [expect.stringContaining('UNHANDLED FRAMEWORK')],
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);
    });

    // * Framework errors (preExecutionContext) (throw behavior)
    await withMocks(async ({ getExitCode, errorSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        errorHandlingBehavior: 'throw'
      });

      await expect(
        run(
          '--flag-one --flag-two',
          bf.configureProgram(cjsCommandModulePath, {
            configureExecutionContext() {
              throw new Error('badness');
            }
          })
        )
      ).rejects.toMatchObject({
        message: 'badness'
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);

      await expect(
        run(
          '--flag-one --flag-two',
          bf.configureProgram(
            cjsCommandModulePath,
            Promise.resolve({
              configureExecutionContext() {
                throw new Error('badness');
              }
            })
          )
        )
      ).rejects.toMatchObject({
        message: 'badness'
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')],
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);
    });

    // * Errors across low-order signatures
    await withMocks(async ({ getExitCode, logSpy, warnSpy, errorSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        errorHandlingBehavior: 'throw'
      });

      await expect(run()).not.toReject();

      expect(logSpy.mock.calls).toHaveLength(1);
      expect(warnSpy.mock.calls).toHaveLength(0);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await expect(run('--help')).toReject();

      expect(logSpy.mock.calls).toHaveLength(2);
      expect(warnSpy.mock.calls).toHaveLength(0);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await expect(run(['--help'])).toReject();

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(warnSpy.mock.calls).toHaveLength(0);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await expect(run(errorConfigurationHooks)).toReject();

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(errorSpy.mock.calls).toHaveLength(1);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(run(Promise.resolve(errorConfigurationHooks))).toReject();

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(errorSpy.mock.calls).toHaveLength(2);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        run(await bf.configureProgram(cjsCommandModulePath, errorConfigurationHooks))
      ).toReject();

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(errorSpy.mock.calls).toHaveLength(3);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(run(['--help'], errorConfigurationHooks)).toReject();

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(errorSpy.mock.calls).toHaveLength(4);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(run(['--help'], Promise.resolve(errorConfigurationHooks))).toReject();

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(errorSpy.mock.calls).toHaveLength(5);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        run(
          '--help',
          await bf.configureProgram(
            cjsCommandModulePath,
            Promise.resolve(errorConfigurationHooks)
          )
        )
      ).toReject();

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(errorSpy.mock.calls).toHaveLength(6);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        run(
          '--help',
          bf.configureProgram(
            cjsCommandModulePath,
            Promise.resolve(errorConfigurationHooks)
          )
        )
      ).toReject();

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(errorSpy.mock.calls).toHaveLength(7);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        run(bf.configureProgram(cjsCommandModulePath, errorConfigurationHooks))
      ).toReject();

      expect(logSpy.mock.calls).toHaveLength(3);
      expect(errorSpy.mock.calls).toHaveLength(8);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });
  });

  it('outputs framework errors via console.error by default when passed hooks and when passed a PreExecutionContext', async () => {
    expect.hasAssertions();

    const error = new Error('something awful');

    // * Black Flag <=1.3.2 didn't output framework errors when a
    // * PreExecutionContext was passed directly!

    await withMocks(async ({ getExitCode, errorSpy }) => {
      const run = bf_util.makeRunner({ commandModulePath: cjsCommandModulePath });

      await run('--help', {
        configureExecutionContext() {
          throw error;
        }
      });

      expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
        BfErrorMessage.FrameworkError(error)
      );

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
    });

    await withMocks(async ({ getExitCode, errorSpy }) => {
      const preExecutionContext = bf.configureProgram(cjsCommandModulePath, {
        configureExecutionContext() {
          throw error;
        }
      });

      const run = bf_util.makeRunner({ commandModulePath: cjsCommandModulePath });
      await run('--help', preExecutionContext);

      expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
        BfErrorMessage.FrameworkError(error)
      );

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
    });
  });

  it('supports surfacing an error using configureErrorHandlingEpilogue manually', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, errorSpy }) => {
      let surfacedError = undefined;
      const run = bf_util.makeRunner({ commandModulePath: cjsCommandModulePath });

      await run('--flag-one --flag-two', {
        configureErrorHandlingEpilogue: ({ error }) => void (surfacedError = error)
      });

      expect(surfacedError).toMatchObject({
        message: 'Unknown arguments: flag-one, flagOne, flag-two, flagTwo'
      });

      expect(errorSpy).toHaveBeenCalled();
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });
  });

  it('throws if given both preExecutionContext and configurationHooks', async () => {
    expect.hasAssertions();

    await expect(
      // @ts-expect-error: testing illegal parameter
      bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        configurationHooks: {},
        preExecutionContext: {} as unknown as bf_util.PreExecutionContext
      })()
    ).rejects.toMatchObject({ message: BfErrorMessage.BadParameterCombination() });
  });

  it('exits with bf.FrameworkExitCode.Ok upon success', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, logSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath
      });

      await run();

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run();

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });

  it('exits with bf.FrameworkExitCode.NotImplemented and outputs unhandled error text to stderr when child command provides no handler', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('not-implemented')
      });

      await run('cmd');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.NotImplemented);
      expect(errorSpy.mock.calls).toStrictEqual([
        [capitalizedCommandNotImplementedErrorMessage]
      ]);

      await run('nested cmd');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.NotImplemented);
      expect(errorSpy.mock.calls).toStrictEqual([
        [capitalizedCommandNotImplementedErrorMessage],
        [capitalizedCommandNotImplementedErrorMessage]
      ]);
    });

    // * Note that parous parents won't output NotImplemented but will instead
    // * output help text and exit with DefaultError. This is for superior UX.
  });

  it('exits with bf.FrameworkExitCode.DefaultError and outputs help text and invalid subcommand error to stderr when parous parent command provides no handler', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('not-implemented')
      });

      await run('nested');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        [],
        [capitalize(BfErrorMessage.InvalidSubCommandInvocation())]
      ]);

      await run('nested');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        [],
        [capitalize(BfErrorMessage.InvalidSubCommandInvocation())],
        [expect.stringContaining('--help')],
        [],
        [capitalize(BfErrorMessage.InvalidSubCommandInvocation())]
      ]);
    });
  });

  it('exits with bf.FrameworkExitCode.Ok when given --help argument even when command provides no handler', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('not-implemented')
      });

      await run('nested --help');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
      expect(logSpy).toHaveBeenCalledTimes(1);

      await run('nested --help');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
      expect(logSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('exits with bf.FrameworkExitCode.AssertionFailed and outputs full unhandled error to stderr when sanity check or node assert fails', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath,
        configurationHooks: {
          configureArguments: () => undefined as any
        }
      });

      await run();

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [
          expect.objectContaining({
            message: BfErrorMessage.InvalidConfigureArgumentsReturnType()
          })
        ]
      ]);
    });

    await withMocks(async ({ errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath
      });

      // ? Will be handled by ConfigureErrorHandlingEpilogue
      await run({ configureArguments: () => assert.fail() });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.objectContaining({ message: 'Failed' })]
      ]);
    });

    await withMocks(async ({ getExitCode, errorSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath
      });

      // ? Will NOT be handled by ConfigureErrorHandlingEpilogue
      await run({ configureExecutionContext: () => assert.fail() });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);
    });
  });

  it('exits with bf.FrameworkExitCode.Ok when graceful exit is requested extremely early', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: cjsCommandModulePath
      });

      await run({
        configureExecutionContext: () => {
          throw new bf.GracefulEarlyExitError();
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await run(
        bf.configureProgram(cjsCommandModulePath, {
          configureExecutionContext: () => {
            throw new bf.GracefulEarlyExitError();
          }
        })
      );

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });
});

describe('::runProgram', () => {
  const cjsCommandModulePath = getFixturePath('one-file-log-handler-cjs');

  const configurationHooks: bf.ConfigurationHooks = {
    configureExecutionPrologue() {
      // eslint-disable-next-line no-console
      console.warn(1);
    }
  };

  const promisedConfigurationHooks = Promise.resolve({
    configureExecutionPrologue() {
      // eslint-disable-next-line no-console
      console.warn(2);
    }
  });

  it('supports all call signatures', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, logSpy, warnSpy }) => {
      await bf.runProgram(getFixturePath('one-file-loose-cjs'));

      expect(logSpy).toHaveBeenCalledTimes(0);
      expect(warnSpy).toHaveBeenCalledTimes(0);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(cjsCommandModulePath);

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(0);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(cjsCommandModulePath, '--help');

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(warnSpy).toHaveBeenCalledTimes(0);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(cjsCommandModulePath, ['--help']);

      expect(logSpy).toHaveBeenCalledTimes(3);
      expect(warnSpy).toHaveBeenCalledTimes(0);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(cjsCommandModulePath, configurationHooks);

      expect(logSpy).toHaveBeenCalledTimes(4);
      expect(warnSpy.mock.calls).toStrictEqual([[1]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(cjsCommandModulePath, promisedConfigurationHooks);

      expect(logSpy).toHaveBeenCalledTimes(5);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(
        cjsCommandModulePath,
        await bf.configureProgram(cjsCommandModulePath, configurationHooks)
      );

      expect(logSpy).toHaveBeenCalledTimes(6);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(cjsCommandModulePath, '--help', configurationHooks);

      expect(logSpy).toHaveBeenCalledTimes(7);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(cjsCommandModulePath, ['--help'], promisedConfigurationHooks);

      expect(logSpy).toHaveBeenCalledTimes(8);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(
        cjsCommandModulePath,
        '--help',
        await bf.configureProgram(cjsCommandModulePath, promisedConfigurationHooks)
      );

      expect(logSpy).toHaveBeenCalledTimes(9);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2], [2]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(
        cjsCommandModulePath,
        '--help',
        bf.configureProgram(cjsCommandModulePath, promisedConfigurationHooks)
      );

      expect(logSpy).toHaveBeenCalledTimes(10);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2], [2], [2]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(
        cjsCommandModulePath,
        bf.configureProgram(cjsCommandModulePath, configurationHooks)
      );

      expect(logSpy).toHaveBeenCalledTimes(11);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2], [2], [2], [1]]);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });

  it('splits singular argv strings on spaces', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode }) => {
      await expect(
        bf.runProgram(
          getFixturePath('one-file-loose-cjs'),
          '--option1 --option2 --option3'
        )
      ).resolves.toContainEntries([
        ['option1', true],
        ['option2', true],
        ['option3', true]
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });

  it('exits with bf.FrameworkExitCode.Ok upon success', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, logSpy }) => {
      await bf.runProgram(cjsCommandModulePath);

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });

  it('exits with bf.FrameworkExitCode.NotImplemented and outputs unhandled error text to stderr when child command provides no handler', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('not-implemented'), 'cmd');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.NotImplemented);
      expect(errorSpy.mock.calls).toStrictEqual([
        [capitalizedCommandNotImplementedErrorMessage]
      ]);

      await bf.runProgram(getFixturePath('not-implemented'), 'nested cmd');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.NotImplemented);
      expect(errorSpy.mock.calls).toStrictEqual([
        [capitalizedCommandNotImplementedErrorMessage],
        [capitalizedCommandNotImplementedErrorMessage]
      ]);
    });

    // * Note that parous parents won't output NotImplemented but will instead
    // * output help text and exit with DefaultError. This is for superior UX.
  });

  it('exits with bf.FrameworkExitCode.DefaultError and outputs help text and invalid subcommand error to stderr when parous parent command provides no handler', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('not-implemented'), 'nested');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        [],
        [capitalize(BfErrorMessage.InvalidSubCommandInvocation())]
      ]);
    });
  });

  it('exits with bf.FrameworkExitCode.Ok when given --help argument even when command provides no handler', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('not-implemented'), 'nested --help');

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
      expect(logSpy).toHaveBeenCalled();
    });
  });

  it('exits with bf.FrameworkExitCode.AssertionFailed and outputs full unhandled error to stderr when sanity check or node assert fails', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(cjsCommandModulePath, {
        configureArguments: () => undefined as any
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [
          expect.objectContaining({
            message: BfErrorMessage.InvalidConfigureArgumentsReturnType()
          })
        ]
      ]);
    });

    await withMocks(async ({ errorSpy, getExitCode }) => {
      // ? Will be handled by ConfigureErrorHandlingEpilogue
      await bf.runProgram(cjsCommandModulePath, {
        configureArguments: () => assert.fail()
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.objectContaining({ message: 'Failed' })]
      ]);
    });

    await withMocks(async ({ getExitCode, errorSpy }) => {
      // ? Will NOT be handled by ConfigureErrorHandlingEpilogue
      await bf.runProgram(cjsCommandModulePath, {
        configureExecutionContext: () => assert.fail()
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);
    });
  });

  it('exits with bf.FrameworkExitCode.Ok when graceful exit is requested extremely early', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode }) => {
      await bf.runProgram(cjsCommandModulePath, {
        configureExecutionContext: () => {
          throw new bf.GracefulEarlyExitError();
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

      await bf.runProgram(
        cjsCommandModulePath,
        bf.configureProgram(cjsCommandModulePath, {
          configureExecutionContext: () => {
            throw new bf.GracefulEarlyExitError();
          }
        })
      );

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });

  it('exits with bf.FrameworkExitCode.DefaultError upon string error type', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(cjsCommandModulePath, {
        configureArguments() {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw 'problems!';
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('exits with bf.FrameworkExitCode.DefaultError upon non-CliError error type', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(cjsCommandModulePath, {
        configureArguments() {
          throw new Error('problems!');
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('exits with bf.FrameworkExitCode.DefaultError upon non-Error error type', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(cjsCommandModulePath, {
        configureArguments() {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw {
            toString() {
              return 'wtf is this?';
            }
          };
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(
        cjsCommandModulePath,
        await bf.configureProgram(cjsCommandModulePath, {
          configureArguments() {
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw {
              toString() {
                return 'wtf is this?';
              }
            };
          }
        })
      );

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('exits with bf.FrameworkExitCode.DefaultError and outputs unhandled error text to stderr upon non-wrapped-Error error type', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, errorSpy }) => {
      await bf.runProgram(cjsCommandModulePath, {
        configureExecutionContext() {
          // ? Throw very early before Black Flag has a chance to wrap the error
          // ? or use configureErrorHandlingEpilogue.
          throw new Error('bad');
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);
    });
  });

  it('exits with specified exit code upon CliError error type', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(cjsCommandModulePath, {
        configureArguments() {
          throw new bf.CliError('problems!', { suggestedExitCode: 5 });
        }
      });

      expect(getExitCode()).toBe(5);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('sends help text to stderr when CliError::showHelp is true', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('one-file-throws-handler-showhelp-cjs'));

      expect(getExitCode()).not.toBe(0);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('Usage text for')],
        [],
        ['Problems!']
      ]);
    });
  });

  it('calls process.exit when CliError::dangerouslyFatal is true', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, exitSpy, getExitCode }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-throws-handler-fatal-cjs'))
      ).toReject();

      expect(getExitCode()).not.toBe(0);
      expect(exitSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});

describe('::CommandNotImplementedError', () => {
  it('works with and without arguments', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('one-file-log-handler-cjs'), {
        configureArguments() {
          const protoError = new Error('something');
          const error = new bf_util.CommandNotImplementedError(protoError);

          expect(error.cause).toBe(protoError);
          throw error;
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.NotImplemented);
      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('one-file-log-handler-cjs'), {
        configureArguments() {
          throw new bf_util.CommandNotImplementedError();
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.NotImplemented);
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});

describe('::GracefulEarlyExitError', () => {
  it('works with and without arguments', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode }) => {
      await bf.runProgram(getFixturePath('one-file-log-handler-cjs'), {
        configureArguments() {
          const protoError = new Error('something');
          const error = new bf.GracefulEarlyExitError(protoError);

          expect(error.cause).toBe(protoError);
          throw error;
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });

    await withMocks(async ({ getExitCode }) => {
      await bf.runProgram(getFixturePath('one-file-log-handler-cjs'), {
        configureArguments() {
          throw new bf.GracefulEarlyExitError();
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
    });
  });
});

describe('::CliError', () => {
  it('can wrap other errors', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('one-file-log-handler-cjs'), {
        configureArguments() {
          throw new bf.CliError(new Error('problems!'));
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('handles strange cause objects', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('one-file-log-handler-cjs'), {
        configureArguments() {
          throw new bf.CliError(undefined as any);
        }
      });

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(errorSpy.mock.calls).toStrictEqual([
        [capitalize(BfErrorMessage.Generic())]
      ]);
    });
  });

  it('sets correct properties given various inputs', async () => {
    expect.hasAssertions();
    expect(process.exitCode).toBeUndefined();
    await withMocks(async ({ errorSpy }) => {
      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-log-handler-cjs'),
        {
          configureArguments() {
            throw new bf.CliError('1');
          }
        }
      );

      await expect(execute()).rejects.toMatchObject({
        message: '1',
        cause: undefined,
        dangerouslyFatal: false,
        showHelp: false,
        suggestedExitCode: bf.FrameworkExitCode.DefaultError
      });

      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy }) => {
      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-log-handler-cjs'),
        {
          configureArguments() {
            throw new bf.CliError(new Error('2'));
          }
        }
      );

      await expect(execute()).rejects.toMatchObject({
        message: '2',
        cause: expect.any(Error),
        dangerouslyFatal: false,
        showHelp: false,
        suggestedExitCode: bf.FrameworkExitCode.DefaultError
      });

      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy }) => {
      const cause = new Error('3', { cause: '4' });
      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-log-handler-cjs'),
        {
          configureArguments() {
            throw new bf.CliError(cause);
          }
        }
      );

      await expect(execute()).rejects.toMatchObject({
        message: '3',
        cause,
        dangerouslyFatal: false,
        showHelp: false,
        suggestedExitCode: bf.FrameworkExitCode.DefaultError
      });

      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy }) => {
      const causeCause = new Error('5');
      const cause = new Error('4', { cause: causeCause });

      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-log-handler-cjs'),
        {
          configureArguments() {
            throw new bf.CliError(cause);
          }
        }
      );

      await expect(execute()).rejects.toMatchObject({
        message: cause.message,
        cause,
        dangerouslyFatal: false,
        showHelp: false,
        suggestedExitCode: bf.FrameworkExitCode.DefaultError
      });

      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy }) => {
      const cause = new Error('7');
      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-log-handler-cjs'),
        {
          configureArguments() {
            throw new bf.CliError(new Error('5', { cause: new Error('6') }), { cause });
          }
        }
      );

      await expect(execute()).rejects.toMatchObject({
        message: '5',
        cause,
        dangerouslyFatal: false,
        showHelp: false,
        suggestedExitCode: bf.FrameworkExitCode.DefaultError
      });

      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy }) => {
      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-log-handler-cjs'),
        {
          configureArguments() {
            throw new bf.CliError(new Error('6', { cause: new Error('7') }), {
              cause: '8'
            });
          }
        }
      );

      await expect(execute()).rejects.toMatchObject({
        message: '6',
        cause: '8',
        dangerouslyFatal: false,
        showHelp: false,
        suggestedExitCode: bf.FrameworkExitCode.DefaultError
      });

      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy }) => {
      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-log-handler-cjs'),
        {
          configureArguments() {
            throw new bf.CliError('7', {
              dangerouslyFatal: true,
              showHelp: true,
              suggestedExitCode: 500
            });
          }
        }
      );

      await expect(execute()).rejects.toMatchObject({
        message: '7',
        cause: undefined,
        dangerouslyFatal: true,
        showHelp: true,
        suggestedExitCode: 500
      });

      expect(errorSpy).toHaveBeenCalled();
    });
  });
});

describe('::isPreExecutionContext', () => {
  it('returns true iff obj is PreExecutionContext', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const preExecutionContext = await bf.configureProgram(
        getFixturePath('one-file-loose-cjs')
      );

      expect(bf_util.isPreExecutionContext(preExecutionContext)).toBeTrue();
      expect(bf_util.isPreExecutionContext({})).toBeFalse();
    });
  });
});

describe('::isArguments', () => {
  it('returns true iff obj is Arguments', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const Arguments = await (
        await bf.configureProgram(getFixturePath('one-file-loose-cjs'))
      ).execute(['--ok']);

      expect(bf_util.isArguments(Arguments)).toBeTrue();
      expect(bf_util.isArguments({})).toBeFalse();
    });
  });
});

describe('::isNullArguments', () => {
  it('returns true iff obj is NullArguments', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      const NullArguments = await (
        await bf.configureProgram(getFixturePath('one-file-loose-cjs'))
      ).execute(['--help']);

      expect(bf_util.isNullArguments(NullArguments)).toBeTrue();
      expect(bf_util.isArguments(NullArguments)).toBeTrue();
      expect(bf_util.isNullArguments({})).toBeFalse();
      expect(logSpy.mock.calls).toStrictEqual([[expect.stringContaining('--help')]]);
    });
  });
});

describe('<command module auto-discovery>', () => {
  it('discovers deeply nested commands files and nothing else', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const context = await bf.configureProgram(getFixturePath('nested-depth-cjs'));

      expect(Array.from(context.commands.keys())).toIncludeSameMembers([
        'test',
        'test good1',
        'test good1 good2',
        'test good1 good2 good',
        'test good1 good2 good command',
        'test good1 good2 good3',
        'test good1 good2 good3 command',
        'test good1 good',
        'test good1 good good',
        'test good1 good good command'
      ]);
    });

    await withMocks(async () => {
      const context = await bf.configureProgram(getFixturePath('nested-depth-esm'));

      expect(Array.from(context.commands.keys())).toIncludeSameMembers([
        'test',
        'test good1',
        'test good1 good2',
        'test good1 good2 good',
        'test good1 good2 good command',
        'test good1 good2 good3',
        'test good1 good2 good3 command',
        'test good1 good',
        'test good1 good good',
        'test good1 good good command'
      ]);
    });
  });

  it('supports function-exporting modules and object-exporting modules', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('different-exports-types-cjs')
      });

      await expect(run('exports-function --exports-function')).resolves.toStrictEqual(
        expect.objectContaining({
          exportsFunction: 1,
          handled_by: getFixturePath([
            'different-exports-types-cjs',
            'exports-function.js'
          ])
        })
      );

      await expect(run('exports-object positional')).resolves.toStrictEqual(
        expect.objectContaining({
          testPositional: 'positional',
          handled_by: getFixturePath([
            'different-exports-types-cjs',
            'exports-object.js'
          ])
        })
      );

      const result = await run('--help');
      assert(result);

      expect(logSpy.mock.calls).toStrictEqual([
        [
          expect.stringMatching(
            expectedCommandsRegex(['exports-function', 'exports-object'])
          )
        ]
      ]);

      const executionContext = result[bf.$executionContext] as ExecutionContext & {
        effected: true;
        affected: true;
      };

      expect(executionContext.affected).toBeTrue();
    });

    await withMocks(async ({ logSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('different-exports-types-esm')
      });

      await expect(run('exports-function --exports-function')).resolves.toStrictEqual(
        expect.objectContaining({
          exportsFunction: 1,
          handled_by: getFixturePath([
            'different-exports-types-esm',
            'exports-function.mjs'
          ])
        })
      );

      await expect(run('exports-object positional')).resolves.toStrictEqual(
        expect.objectContaining({
          testPositional: 'positional',
          handled_by: getFixturePath([
            'different-exports-types-esm',
            'exports-object.mjs'
          ])
        })
      );

      const result = await run('--help');
      assert(result);

      expect(logSpy.mock.calls).toStrictEqual([
        [
          expect.stringMatching(
            expectedCommandsRegex(['exports-function', 'exports-object'])
          )
        ]
      ]);

      const executionContext = result[bf.$executionContext] as ExecutionContext & {
        effected: true;
        affected: true;
      };

      expect(executionContext.affected).toBeTrue();
    });
  });

  it('coerces bad module exports into the empty object', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bad-exports-cjs'), '--help')
      ).resolves.toBeDefined();

      expect(logSpy).toHaveBeenCalledTimes(1);
    });

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bad-exports-esm'), '--help')
      ).resolves.toBeDefined();

      expect(logSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('supports "aliases" export at parent, child, and root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-cjs')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');
        const childResult = await run('n f --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringContaining('[aliases: parent, p]')
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringContaining('[aliases: child-1]')
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringContaining('[aliases: child-2]')
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringContaining('[aliases: child-3]')
        ]);

        expect(logSpy.mock.calls[2]).not.toStrictEqual([
          expect.stringContaining('Commands:')
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-esm')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');
        const childResult = await run('n f --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringContaining('[aliases: parent, p]')
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringContaining('[aliases: child-1]')
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringContaining('[aliases: child-2]')
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringContaining('[aliases: child-3]')
        ]);

        expect(logSpy.mock.calls[2]).not.toStrictEqual([
          expect.stringContaining('Commands:')
        ]);
      });
    }
  });

  it('supports "builder" export at parent, child, and root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-cjs')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');
        const childResult = await run('n f --help');
        const workingResult = await run('n f positional --child-option1');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();
        expect(bf_util.isNullArguments(workingResult)).toBeFalse();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(/\s+--option\s+Some description\s+\[boolean]$/)
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(/\s+--option2\s+\[boolean]$/)
        ]);

        expect(logSpy.mock.calls[2]).toStrictEqual([
          expect.stringMatching(/\s+--child-option1\s+\[boolean]|$/)
        ]);

        expect(logSpy).toHaveBeenCalledTimes(3);
        expect(workingResult).toContainEntry([
          'handled_by',
          getFixturePath(['nested-several-files-full-cjs', 'nested', 'first.js'])
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-esm')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');
        const childResult = await run('n f --help');
        const workingResult = await run('n f positional --child-option1');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();
        expect(bf_util.isNullArguments(workingResult)).toBeFalse();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(/\s+--option\s+Some description\s+\[boolean]$/)
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(/\s+--option2\s+\[boolean]$/)
        ]);

        expect(logSpy.mock.calls[2]).toStrictEqual([
          expect.stringMatching(/\s+--child-option1\s+\[boolean]|$/)
        ]);

        expect(logSpy).toHaveBeenCalledTimes(3);
        expect(workingResult).toContainEntry([
          'handled_by',
          getFixturePath(['nested-several-files-full-esm', 'nested', 'first.mjs'])
        ]);
      });
    }
  });

  it('supports "command" export (with positional arguments) at parent, child, and root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-cjs')
      });

      await withMocks(async () => {
        const rootResult = await run('positional');
        const parentResult = await run('n positional');
        const childResult = await run('n f positional');

        expect(rootResult).toContainEntries([
          ['test-positional', 'positional'],
          ['testPositional', 'positional']
        ]);

        expect(parentResult).toContainEntries([
          ['test-positional', 'positional'],
          ['testPositional', 'positional']
        ]);

        expect(childResult).toContainEntries([
          ['test-positional', 'positional'],
          ['testPositional', 'positional']
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-esm')
      });

      await withMocks(async () => {
        const rootResult = await run('positional');
        const parentResult = await run('n positional');
        const childResult = await run('n f positional');

        expect(rootResult).toContainEntries([
          ['test-positional', 'positional'],
          ['testPositional', 'positional']
        ]);

        expect(parentResult).toContainEntries([
          ['test-positional', 'positional'],
          ['testPositional', 'positional']
        ]);

        expect(childResult).toContainEntries([
          ['test-positional', 'positional'],
          ['testPositional', 'positional']
        ]);
      });
    }
  });

  it('supports root, child, and grandchild commands with explicitly-configured positional arguments', async () => {
    expect.hasAssertions();

    // * It's interesting, because HelperProgram will never have positional
    // * arguments, but it still needs to support having yargs::positional
    // * called on it so a single builder can be run on both HelperPrograms and
    // * EffectorPrograms, and so the correct help text gets generated.
    // * Thankfully, yargs allows calling yargs::positional on a yargs instance
    // * even if it has no positional arguments! Yay!

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-positionals-cjs')
      });

      await withMocks(async ({ logSpy }) => {
        await run('--help');
        await run('nested --help');
        await run('nested child --help');

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /Positionals:\n\s+dummy-positional1\s+Dummy description1\n\n/
            )
          ],
          [
            expect.stringMatching(
              /Positionals:\n\s+dummy-positional2\s+Dummy description2\n\n/
            )
          ],
          [
            expect.stringMatching(
              /Positionals:\n\s+dummy-positional3\s+Dummy description3\n\n/
            )
          ]
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-positionals-esm')
      });

      await withMocks(async ({ logSpy }) => {
        await run('--help');
        await run('nested --help');
        await run('nested child --help');

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /Positionals:\n\s+dummy-positional1\s+Dummy description1\n\n/
            )
          ],
          [
            expect.stringMatching(
              /Positionals:\n\s+dummy-positional2\s+Dummy description2\n\n/
            )
          ],
          [
            expect.stringMatching(
              /Positionals:\n\s+dummy-positional3\s+Dummy description3\n\n/
            )
          ]
        ]);
      });
    }
  });

  it('throws when "command" export is invalid', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('one-file-throws-command-cjs'))
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidCommandExport('test')
      });
    });

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('one-file-throws-command-esm'))
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidCommandExport('test')
      });
    });
  });

  it('supports "deprecated" export at parent, child, and root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-cjs')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(
            expectedCommandsRegex(
              ['n'],
              'nsf',
              String.raw`Parent program.+\s+\[deprecated]`
            )
          )
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(
            expectedCommandsRegex(
              [['f', String.raw`Child program.+\s+\[deprecated]`], 's', 't'],
              'nsf n',
              String.raw`Child program.+\s+\[(?!deprecated)[^\n]*]`
            )
          )
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-esm')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(
            expectedCommandsRegex(
              ['n'],
              'nsf',
              String.raw`Parent program.+\s+\[deprecated]`
            )
          )
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(
            expectedCommandsRegex(
              [['f', String.raw`Child program.+\s+\[deprecated]`], 's', 't'],
              'nsf n',
              String.raw`Child program.+\s+\[(?!deprecated)[^\n]*]`
            )
          )
        ]);
      });
    }
  });

  it('prints deprecation message when "deprecated" is a string', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-deprecation-msg-cjs')
      });

      await withMocks(async ({ logSpy, errorSpy }) => {
        await run('--help');

        expect(errorSpy).not.toHaveBeenCalled();

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('[deprecated: deprecation message 2]')]
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-deprecation-msg-esm')
      });

      await withMocks(async ({ logSpy, errorSpy }) => {
        await run('--help');

        expect(errorSpy).not.toHaveBeenCalled();

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('[deprecated: deprecation message 2]')]
        ]);
      });
    }
  });

  it('supports "description" export at parent, child, and root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-cjs')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(expectedCommandsRegex(['n'], 'nsf', 'Parent'))
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(expectedCommandsRegex(['f', 's', 't'], 'nsf n', 'Child'))
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-esm')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(expectedCommandsRegex(['n'], 'nsf', 'Parent'))
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(expectedCommandsRegex(['f', 's', 't'], 'nsf n', 'Child'))
        ]);
      });
    }
  });

  it('supports empty ("") "description" export at parent, child, and root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-empty-description-cjs')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('nested --help');
        const childResult = await run('nested child --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(/Commands:\n\s+test nested\n\nOptions:/)
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(/Commands:\n\s+test nested child\n\nOptions:/)
        ]);

        expect(logSpy.mock.calls[2]).toStrictEqual([
          expect.stringMatching(/^Usage: test nested child\n\nOptions:/)
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-empty-description-esm')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('nested --help');
        const childResult = await run('nested child --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(/Commands:\n\s+test nested\n\nOptions:/)
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(/Commands:\n\s+test nested child\n\nOptions:/)
        ]);

        expect(logSpy.mock.calls[2]).toStrictEqual([
          expect.stringMatching(/^Usage: test nested child\n\nOptions:/)
        ]);
      });
    }
  });

  it('supports "handler" export at parent, child, and root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-cjs')
      });

      await withMocks(async () => {
        const rootResult = await run('positional');
        const parentResult = await run('n positional');
        const childResult = await run('n f positional');

        expect(rootResult).toContainEntry([
          'handled_by',
          getFixturePath(['nested-several-files-full-cjs', 'index.js'])
        ]);

        expect(parentResult).toContainEntry([
          'handled_by',
          getFixturePath(['nested-several-files-full-cjs', 'nested', 'index.js'])
        ]);

        expect(childResult).toContainEntry([
          'handled_by',
          getFixturePath(['nested-several-files-full-cjs', 'nested', 'first.js'])
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-esm')
      });

      await withMocks(async () => {
        const rootResult = await run('positional');
        const parentResult = await run('n positional');
        const childResult = await run('n f positional');

        expect(rootResult).toContainEntry([
          'handled_by',
          getFixturePath(['nested-several-files-full-esm', 'index.mjs'])
        ]);

        expect(parentResult).toContainEntry([
          'handled_by',
          getFixturePath(['nested-several-files-full-esm', 'nested', 'index.mjs'])
        ]);

        expect(childResult).toContainEntry([
          'handled_by',
          getFixturePath(['nested-several-files-full-esm', 'nested', 'first.mjs'])
        ]);
      });
    }
  });

  it('supports "name" export at parent, child, and root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-cjs')
      });

      await withMocks(async () => {
        const rootResult = await run('positional');
        const parentResult = await run('parent positional');
        const childResult = await run('parent child-1 positional');

        expect(rootResult).toContainEntry(['$0', 'nsf']);
        expect(parentResult).toContainEntry(['$0', 'nsf n']);
        expect(childResult).toContainEntry(['$0', 'nsf n f']);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-esm')
      });

      await withMocks(async () => {
        const rootResult = await run('positional');
        const parentResult = await run('parent positional');
        const childResult = await run('parent child-1 positional');

        expect(rootResult).toContainEntry(['$0', 'nsf']);
        expect(parentResult).toContainEntry(['$0', 'nsf n']);
        expect(childResult).toContainEntry(['$0', 'nsf n f']);
      });
    }
  });

  it('supports "usage" export at parent, child, and root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-cjs')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');
        const childResult = await run('n f --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(/^USAGE: root program/)
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(/^USAGE: parent program/)
        ]);

        expect(logSpy.mock.calls[2]).toStrictEqual([
          expect.stringMatching(/^USAGE: child program/)
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-esm')
      });

      await withMocks(async ({ logSpy }) => {
        const rootResult = await run('--help');
        const parentResult = await run('n --help');
        const childResult = await run('n f --help');

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();

        expect(logSpy.mock.calls[0]).toStrictEqual([
          expect.stringMatching(/^USAGE: root program/)
        ]);

        expect(logSpy.mock.calls[1]).toStrictEqual([
          expect.stringMatching(/^USAGE: parent program/)
        ]);

        expect(logSpy.mock.calls[2]).toStrictEqual([
          expect.stringMatching(/^USAGE: child program/)
        ]);
      });
    }
  });

  it('supports random additions to the ExecutionContext from handlers', async () => {
    expect.hasAssertions();

    {
      const { execute, executionContext } = await bf.configureProgram(
        getFixturePath('nested-several-files-full-cjs')
      );

      await withMocks(async () => {
        await execute(['positional']);
        expect(executionContext).toContainEntry([
          'mutated_by',
          getFixturePath(['nested-several-files-full-cjs', 'index.js'])
        ]);
      });
    }

    {
      const { execute, executionContext } = await bf.configureProgram(
        getFixturePath('nested-several-files-full-esm')
      );

      await withMocks(async () => {
        await execute(['positional']);
        expect(executionContext).toContainEntry([
          'mutated_by',
          getFixturePath(['nested-several-files-full-esm', 'index.mjs'])
        ]);
      });
    }
  });

  it('supports files, directories, and package names with spaces', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-with-spaces-cjs')
      });

      await withMocks(async ({ logSpy, getExitCode }) => {
        const rootResult = await run('--help');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
        const parentResult = await run('spaced-name --help');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
        const childResult = await run('spaced-name bad-ly-name-d --help');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              expectedCommandsRegex(
                ['s-p-a-c-e-d-name', 'spaced-name'],
                'badly-named-package',
                ''
              )
            )
          ],
          [
            expect.stringMatching(
              expectedCommandsRegex(
                ['bad-ly-name-d'],
                'badly-named-package spaced-name',
                ''
              )
            )
          ],
          [
            expect.stringMatching(
              /^Usage: badly-named-package spaced-name bad-ly-name-d\n\nOptions:/
            )
          ]
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-with-spaces-esm')
      });

      await withMocks(async ({ logSpy, getExitCode }) => {
        const rootResult = await run('--help');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
        const parentResult = await run('spaced-name --help');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
        const childResult = await run('spaced-name bad-ly-name-d --help');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        expect(bf_util.isNullArguments(rootResult)).toBeTrue();
        expect(bf_util.isNullArguments(parentResult)).toBeTrue();
        expect(bf_util.isNullArguments(childResult)).toBeTrue();

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              expectedCommandsRegex(
                ['s-p-a-c-e-d-name', 'spaced-name'],
                'badly-named-package',
                ''
              )
            )
          ],
          [
            expect.stringMatching(
              expectedCommandsRegex(
                ['bad-ly-name-d'],
                'badly-named-package spaced-name',
                ''
              )
            )
          ],
          [
            expect.stringMatching(
              /^Usage: badly-named-package spaced-name bad-ly-name-d\n\nOptions:/
            )
          ]
        ]);
      });
    }
  });

  it('throws when files, directories, or package names have invalid characters', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('nested-bad-names-cjs'))
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidCharacters('[bad]', '|, <, >, [, ], {, or }')
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-bad-names-cjs', '[bad]']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidCharacters('[bad]', '|, <, >, [, ], {, or }')
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-bad-names-cjs', 'bad']))
      ).rejects.toMatchObject({ message: BfErrorMessage.InvalidCharacters('$0', '$0') });

      await expect(
        bf.configureProgram(getFixturePath(['nested-bad-names-cjs', 'bad2']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidCharacters('$111', '$1')
      });
    });

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('nested-bad-names-esm'))
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidCharacters('[bad]', '|, <, >, [, ], {, or }')
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-bad-names-esm', '[bad]']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidCharacters('[bad]', '|, <, >, [, ], {, or }')
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-bad-names-esm', 'bad']))
      ).rejects.toMatchObject({ message: BfErrorMessage.InvalidCharacters('$0', '$0') });

      await expect(
        bf.configureProgram(getFixturePath(['nested-bad-names-esm', 'bad2']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidCharacters('$111', '$1')
      });
    });
  });

  it('throws in configureProgram if no commands were discovered/loaded (root directory empty)', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('empty-dir'))
      ).rejects.toMatchObject({
        message: BfErrorMessage.NoConfigurationLoaded(getFixturePath('empty-dir'))
      });
    });
  });

  it('throws in configureProgram if no commands were discovered/loaded (no loadable extensions)', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('several-files-bad-ext'))
      ).rejects.toMatchObject({
        message: BfErrorMessage.NoConfigurationLoaded(
          getFixturePath('several-files-bad-ext')
        )
      });
    });
  });

  it('throws if given command module directory is not a directory', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(
          getFixturePath(['nested-several-files-full-cjs', 'index.js'])
        )
      ).rejects.toMatchObject({
        message: BfErrorMessage.BadConfigurationPath(
          getFixturePath(['nested-several-files-full-cjs', 'index.js'])
        )
      });
    });

    await withMocks(async () => {
      await expect(
        bf.configureProgram(
          getFixturePath(['nested-several-files-full-esm', 'index.js'])
        )
      ).rejects.toMatchObject({
        message: BfErrorMessage.BadConfigurationPath(
          getFixturePath(['nested-several-files-full-esm', 'index.js'])
        )
      });
    });
  });

  it('returns undefined and outputs unhandled error text to stderr with runProgram if configuration module directory is empty', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, errorSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('empty'), '--help')
      ).resolves.toBeUndefined();

      expect(getExitCode()).toBe(bf.FrameworkExitCode.AssertionFailed);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('UNHANDLED FRAMEWORK')]
      ]);
    });
  });

  it('delegates parsing and handling to deeply nested commands', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-depth-cjs')
      });

      await expect(run('good1 good2 good3 command --command')).resolves.toStrictEqual(
        expect.objectContaining({
          command: 1,
          handled_by: getFixturePath([
            'nested-depth-cjs',
            'good1',
            'good2',
            'good3',
            'command.js'
          ])
        })
      );

      await expect(run('good1 good2 good3 --good3')).resolves.toStrictEqual(
        expect.objectContaining({
          good3: 1,
          handled_by: getFixturePath([
            'nested-depth-cjs',
            'good1',
            'good2',
            'good3',
            'index.js'
          ])
        })
      );

      await expect(run('good1 good2 --good2')).resolves.toStrictEqual(
        expect.objectContaining({
          good2: 1,
          handled_by: getFixturePath(['nested-depth-cjs', 'good1', 'good2', 'index.js'])
        })
      );

      await expect(run('good1 --good1')).resolves.toStrictEqual(
        expect.objectContaining({
          good1: 1,
          handled_by: getFixturePath(['nested-depth-cjs', 'good1', 'index.js'])
        })
      );

      await expect(run('--nested-depth-cjs')).resolves.toStrictEqual(
        expect.objectContaining({
          nestedDepthCjs: 1,
          'nested-depth-cjs': 1,
          handled_by: getFixturePath(['nested-depth-cjs', 'index.js'])
        })
      );
    });

    await withMocks(async () => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-depth-esm')
      });

      await expect(run('good1 good2 good3 command --command')).resolves.toStrictEqual(
        expect.objectContaining({
          command: 1,
          handled_by: getFixturePath([
            'nested-depth-esm',
            'good1',
            'good2',
            'good3',
            'command.js'
          ])
        })
      );

      await expect(run('good1 good2 good3 --good3')).resolves.toStrictEqual(
        expect.objectContaining({
          good3: 1,
          handled_by: getFixturePath([
            'nested-depth-esm',
            'good1',
            'good2',
            'good3',
            'index.js'
          ])
        })
      );

      await expect(run('good1 good2 --good2')).resolves.toStrictEqual(
        expect.objectContaining({
          good2: 1,
          handled_by: getFixturePath(['nested-depth-esm', 'good1', 'good2', 'index.js'])
        })
      );

      await expect(run('good1 --good1')).resolves.toStrictEqual(
        expect.objectContaining({
          good1: 1,
          handled_by: getFixturePath(['nested-depth-esm', 'good1', 'index.js'])
        })
      );

      await expect(run('--nested-depth-esm')).resolves.toStrictEqual(
        expect.objectContaining({
          nestedDepthEsm: 1,
          'nested-depth-esm': 1,
          handled_by: getFixturePath(['nested-depth-esm', 'index.js'])
        })
      );
    });
  });

  it('supports --help with description and command in usage text across deep hierarchies', async () => {
    expect.hasAssertions();

    {
      await withMocks(async ({ logSpy }) => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-depth-cjs')
        });

        await run('--help');
        await run('good1 --help');
        await run('good1 good2 --help');
        await run('good1 good2 good3 --help');
        await run('good1 good2 good3 command --help');

        // * Make sure we're getting the correct entries under "Commands:"

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(expectedCommandsRegex(['good1']))],
          [
            expect.stringMatching(expectedCommandsRegex(['good', 'good2'], 'test good1'))
          ],
          [
            expect.stringMatching(
              expectedCommandsRegex(['good', 'good3'], 'test good1 good2')
            )
          ],
          [
            expect.stringMatching(
              expectedCommandsRegex(['command'], 'test good1 good2 good3')
            )
          ],
          [expect.not.stringContaining('Commands:')]
        ]);

        // * Make sure we're getting the correct help text next to "--help"

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')]
        ]);

        // * Make sure we're getting the correct command name

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(/^Usage: test\n/)],
          [expect.stringMatching(/^Usage: test good1\n/)],
          [expect.stringMatching(/^Usage: test good1 good2\n/)],
          [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
          [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)]
        ]);
      });
    }

    {
      await withMocks(async ({ logSpy }) => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-depth-esm')
        });

        await run('--help');
        await run('good1 --help');
        await run('good1 good2 --help');
        await run('good1 good2 good3 --help');
        await run('good1 good2 good3 command --help');

        // * Make sure we're getting the correct entries under "Commands:"

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(expectedCommandsRegex(['good1']))],
          [
            expect.stringMatching(expectedCommandsRegex(['good', 'good2'], 'test good1'))
          ],
          [
            expect.stringMatching(
              expectedCommandsRegex(['good', 'good3'], 'test good1 good2')
            )
          ],
          [
            expect.stringMatching(
              expectedCommandsRegex(['command'], 'test good1 good2 good3')
            )
          ],
          [expect.not.stringContaining('Commands:')]
        ]);

        // * Make sure we're getting the correct help text next to "--help"

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')]
        ]);

        // * Make sure we're getting the correct command name

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(/^Usage: test\n/)],
          [expect.stringMatching(/^Usage: test good1\n/)],
          [expect.stringMatching(/^Usage: test good1 good2\n/)],
          [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
          [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)]
        ]);
      });
    }
  });

  it('never adds a "help command" or a "version command", only options', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('one-file-index-cjs')
      });

      await withMocks(async ({ errorSpy, getExitCode }) => {
        await run('help');
        await run('version');

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        expect(errorSpy).toHaveBeenCalledTimes(6);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('one-file-index-esm')
      });

      await withMocks(async ({ errorSpy, getExitCode }) => {
        await run('help');
        await run('version');

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        expect(errorSpy).toHaveBeenCalledTimes(6);
      });
    }
  });

  it('throws if "help" or "version" are incorrectly configured in context.state using configureExecutionContext', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('one-file-index-cjs'), {
          configureExecutionContext(context) {
            // @ts-expect-error: doing bad things with friends
            context.state.globalHelpOption = {};
            return context;
          },
          configureErrorHandlingEpilogue() {
            /* silence is golden */
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidExecutionContextBadField('state.globalHelpOption')
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-index-cjs'), {
          configureExecutionContext(context) {
            // @ts-expect-error: doing bad things with friends
            context.state.globalHelpOption = { name: '' };
            return context;
          },
          configureErrorHandlingEpilogue() {
            /* silence is golden */
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidExecutionContextBadField('state.globalHelpOption')
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-index-cjs'), {
          configureExecutionContext(context) {
            // @ts-expect-error: doing bad things with friends
            context.state.globalVersionOption = {};
            return context;
          },
          configureErrorHandlingEpilogue() {
            /* silence is golden */
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidExecutionContextBadField(
          'state.globalVersionOption'
        )
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-index-cjs'), {
          configureExecutionContext(context) {
            // @ts-expect-error: doing bad things with friends
            context.state.globalVersionOption = { name: '' };
            return context;
          },
          configureErrorHandlingEpilogue() {
            /* silence is golden */
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidExecutionContextBadField(
          'state.globalVersionOption'
        )
      });
    });

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('one-file-index-esm'), {
          configureExecutionContext(context) {
            // @ts-expect-error: doing bad things with friends
            context.state.globalHelpOption = {};
            return context;
          },
          configureErrorHandlingEpilogue() {
            /* silence is golden */
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidExecutionContextBadField('state.globalHelpOption')
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-index-esm'), {
          configureExecutionContext(context) {
            // @ts-expect-error: doing bad things with friends
            context.state.globalHelpOption = { name: '' };
            return context;
          },
          configureErrorHandlingEpilogue() {
            /* silence is golden */
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidExecutionContextBadField('state.globalHelpOption')
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-index-esm'), {
          configureExecutionContext(context) {
            // @ts-expect-error: doing bad things with friends
            context.state.globalVersionOption = {};
            return context;
          },
          configureErrorHandlingEpilogue() {
            /* silence is golden */
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidExecutionContextBadField(
          'state.globalVersionOption'
        )
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-index-esm'), {
          configureExecutionContext(context) {
            // @ts-expect-error: doing bad things with friends
            context.state.globalVersionOption = { name: '' };
            return context;
          },
          configureErrorHandlingEpilogue() {
            /* silence is golden */
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.InvalidExecutionContextBadField(
          'state.globalVersionOption'
        )
      });
    });
  });

  it('outputs the same command full name in error help text as in non-error help text', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-depth-cjs')
      });

      await run('--help');
      await run('good1 --help');
      await run('good1 good2 --help');
      await run('good1 good2 good3 --help');
      await run('good1 good2 good3 command --help');

      // * Make sure we're getting the correct command name from stdout

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: test\n/)],
        [expect.stringMatching(/^Usage: test good1\n/)],
        [expect.stringMatching(/^Usage: test good1 good2\n/)],
        [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
        [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)]
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
      expect(errorSpy.mock.calls).toStrictEqual([]);

      await run('--x');
      await run('good1 --x');
      await run('good1 good2 --x');
      await run('good1 good2 good3 --x');
      await run('good1 good2 good3 command --x');

      // * Make sure we're getting the correct command name from stderr

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: test\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)],
        expect.anything(),
        expect.anything()
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });

    await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-depth-esm')
      });

      await run('--help');
      await run('good1 --help');
      await run('good1 good2 --help');
      await run('good1 good2 good3 --help');
      await run('good1 good2 good3 command --help');

      // * Make sure we're getting the correct command name from stdout

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: test\n/)],
        [expect.stringMatching(/^Usage: test good1\n/)],
        [expect.stringMatching(/^Usage: test good1 good2\n/)],
        [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
        [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)]
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
      expect(errorSpy.mock.calls).toStrictEqual([]);

      await run('--x');
      await run('good1 --x');
      await run('good1 good2 --x');
      await run('good1 good2 good3 --x');
      await run('good1 good2 good3 command --x');

      // * Make sure we're getting the correct command name from stderr

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: test\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)],
        expect.anything(),
        expect.anything()
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });
  });

  it('omits current command from "commands" list and accounts for other bugs in vanilla yargs when outputting help text', async () => {
    expect.hasAssertions();

    // * No positionals or aliases are mixed into the Command output section.

    await withMocks(async ({ logSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-cjs')
      });

      await run('--help');
      await run('n --help');
      await run('n f --help');

      expect(logSpy.mock.calls).toStrictEqual([
        [
          // ? First command in command list is direct child
          expect.stringMatching(
            /Commands:\n\s+nsf n\s+Parent program description text\s+\[aliases: parent, p] \[deprecated]\n\nOptions:/
          )
        ],
        [
          // ? First command in command list is direct child
          expect.stringMatching(
            /Commands:\n\s+nsf n f\s+Child program description text\s+\[aliases: child-1] \[deprecated]\n\s+nsf n s\s+Child program description text\s+\[aliases: child-2]\n\s+nsf n t\s+Child program description text\s+\[aliases: child-3]\n\nOptions:/
          )
        ],
        // ? Pure child command has no children to list
        [expect.not.stringContaining('Commands:')]
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full-esm')
      });

      await run('--help');
      await run('n --help');
      await run('n f --help');

      expect(logSpy.mock.calls).toStrictEqual([
        [
          // ? First command in command list is direct child
          expect.stringMatching(
            /Commands:\n\s+nsf n\s+Parent program description text\s+\[aliases: parent, p] \[deprecated]\n\nOptions:/
          )
        ],
        [
          // ? First command in command list is direct child
          expect.stringMatching(
            /Commands:\n\s+nsf n f\s+Child program description text\s+\[aliases: child-1] \[deprecated]\n\s+nsf n s\s+Child program description text\s+\[aliases: child-2]\n\s+nsf n t\s+Child program description text\s+\[aliases: child-3]\n\nOptions:/
          )
        ],
        // ? Pure child command has no children to list
        [expect.not.stringContaining('Commands:')]
      ]);
    });
  });

  it('outputs the same command full name in error help text as in non-error help text when commands have aliases', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-depth-cjs')
      });

      await run('--help');
      await run('good1 --help');
      await run('good1 good2 --help');
      await run('good1 good2 good3 --help');
      await run('good1 good2 good3 command --help');

      // * Make sure we're getting the correct command name from stdout

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: test\n/)],
        [expect.stringMatching(/^Usage: test good1\n/)],
        [expect.stringMatching(/^Usage: test good1 good2\n/)],
        [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
        [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)]
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
      expect(errorSpy.mock.calls).toStrictEqual([]);

      await run('--x');
      await run('good1 --x');
      await run('good1 good2 --x');
      await run('good1 good2 good3 --x');
      await run('good1 good2 good3 command --x');

      // * Make sure we're getting the correct command name from stderr

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: test\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)],
        expect.anything(),
        expect.anything()
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });

    await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-depth-esm')
      });

      await run('--help');
      await run('good1 --help');
      await run('good1 good2 --help');
      await run('good1 good2 good3 --help');
      await run('good1 good2 good3 command --help');

      // * Make sure we're getting the correct command name from stdout

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: test\n/)],
        [expect.stringMatching(/^Usage: test good1\n/)],
        [expect.stringMatching(/^Usage: test good1 good2\n/)],
        [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
        [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)]
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
      expect(errorSpy.mock.calls).toStrictEqual([]);

      await run('--x');
      await run('good1 --x');
      await run('good1 good2 --x');
      await run('good1 good2 good3 --x');
      await run('good1 good2 good3 command --x');

      // * Make sure we're getting the correct command name from stderr

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: test\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2 good3\n/)],
        expect.anything(),
        expect.anything(),
        [expect.stringMatching(/^Usage: test good1 good2 good3 command\n/)],
        expect.anything(),
        expect.anything()
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });
  });

  it('supports using configureExecutionContext and context.state.globalHelpOption to configure the help option across deep hierarchies', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--help')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--help', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = {
              name: 'info',
              description: 'Info description'
            };
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--info', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = {
              name: 'info',
              description: 'Info description'
            };
            return context;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--help', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = undefined;
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '-i', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = {
              name: 'i',
              description: 'Info description'
            };
            return context;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '-i', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = {
              name: 'info',
              description: 'Info description'
            };
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        [
          expect.stringMatching(
            /Options:\n\s+--help\s+Show help text\s+\[boolean]\n\s+--version\s+Show version number\s+\[boolean]$/
          )
        ],
        [
          expect.stringMatching(
            /Options:\n\s+--info\s+Info description\s+\[boolean]\n\s+--version\s+Show version number\s+\[boolean]$/
          )
        ],
        [
          expect.stringMatching(
            /Options:\n\s+-i\s+Info description\s+\[boolean]\n\s+--version\s+Show version number\s+\[boolean]$/
          )
        ]
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--help')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--help', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = {
              name: 'info',
              description: 'Info description'
            };
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--info', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = {
              name: 'info',
              description: 'Info description'
            };
            return context;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--help', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = undefined;
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '-i', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = {
              name: 'i',
              description: 'Info description'
            };
            return context;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '-i', {
          configureExecutionContext(context) {
            context.state.globalHelpOption = {
              name: 'info',
              description: 'Info description'
            };
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        [
          expect.stringMatching(
            /Options:\n\s+--help\s+Show help text\s+\[boolean]\n\s+--version\s+Show version number\s+\[boolean]$/
          )
        ],
        [
          expect.stringMatching(
            /Options:\n\s+--info\s+Info description\s+\[boolean]\n\s+--version\s+Show version number\s+\[boolean]$/
          )
        ],
        [
          expect.stringMatching(
            /Options:\n\s+-i\s+Info description\s+\[boolean]\n\s+--version\s+Show version number\s+\[boolean]$/
          )
        ]
      ]);
    });
  });

  it('supports using configureExecutionContext and context.state.globalVersionOption to configure the version option across deep hierarchies', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--version')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--version', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = {
              name: 'info',
              description: 'Info description',
              text: 'Custom 1.2.3\nVersion 4.5.6\nInfo 7.8.9-0'
            };
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--info', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = {
              name: 'info',
              description: 'Info description',
              text: 'Custom 1.2.3\nVersion 4.5.6\nInfo 7.8.9-0'
            };
            return context;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--version', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = undefined;
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--info', {
          configureArguments(argv, context) {
            context.state.globalVersionOption = {
              name: 'info',
              description: 'Info description',
              // @ts-expect-error: let's see what happens
              text: undefined
            };
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '-i', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = {
              name: 'info',
              description: 'Info description',
              text: 'version text'
            };
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '-i', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = {
              name: 'i',
              description: 'Info description',
              text: 'version text'
            };
            return context;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        ['1.0.0'],
        ['Custom 1.2.3\nVersion 4.5.6\nInfo 7.8.9-0'],
        ['???'],
        ['version text']
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--version')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--version', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = {
              name: 'info',
              description: 'Info description',
              text: 'Custom 1.2.3\nVersion 4.5.6\nInfo 7.8.9-0'
            };
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--info', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = {
              name: 'info',
              description: 'Info description',
              text: 'Custom 1.2.3\nVersion 4.5.6\nInfo 7.8.9-0'
            };
            return context;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--version', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = undefined;
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--info', {
          configureArguments(argv, context) {
            context.state.globalVersionOption = {
              name: 'info',
              description: 'Info description',
              // @ts-expect-error: let's see what happens
              text: undefined
            };
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '-i', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = {
              name: 'info',
              description: 'Info description',
              text: 'version text'
            };
            return context;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '-i', {
          configureExecutionContext(context) {
            context.state.globalVersionOption = {
              name: 'i',
              description: 'Info description',
              text: 'version text'
            };
            return context;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        ['1.0.0'],
        ['Custom 1.2.3\nVersion 4.5.6\nInfo 7.8.9-0'],
        ['???'],
        ['version text']
      ]);
    });
  });

  it('limits --version visibility to root command unless manually configured for other commands', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, logSpy, getExitCode }) => {
      await expect(
        bf.runProgram(getFixturePath('nested-several-files-empty-cjs'), '--version')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
      expect(errorSpy).not.toHaveBeenCalled();

      await expect(
        bf.runProgram(
          getFixturePath('nested-several-files-empty-cjs'),
          'nested --version'
        )
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        bf.runProgram(
          getFixturePath('nested-several-files-empty-cjs'),
          'nested first --version'
        )
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: /)],
        [],
        [capitalize(BfErrorMessage.InvalidSubCommandInvocation())],
        [expect.stringMatching(/^Usage: /)],
        [],
        ['Unknown argument: version']
      ]);

      expect(logSpy.mock.calls).toStrictEqual([['1.0.0']]);
    });

    await withMocks(async ({ errorSpy, logSpy, getExitCode }) => {
      await expect(
        bf.runProgram(getFixturePath('nested-several-files-empty-esm'), '--version')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
      expect(errorSpy).not.toHaveBeenCalled();

      await expect(
        bf.runProgram(
          getFixturePath('nested-several-files-empty-esm'),
          'nested --version'
        )
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        bf.runProgram(
          getFixturePath('nested-several-files-empty-esm'),
          'nested first --version'
        )
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage: /)],
        [],
        [capitalize(BfErrorMessage.InvalidSubCommandInvocation())],
        [expect.stringMatching(/^Usage: /)],
        [],
        ['Unknown argument: version']
      ]);

      expect(logSpy.mock.calls).toStrictEqual([['1.0.0']]);
    });
  });

  it('does not repeat help text when handling yargs errors in deeply nested commands', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(
        getFixturePath('nested-depth-cjs'),
        'good1 good2 good3 command --yelp'
      );

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        [],
        [expect.stringMatching('Unknown argument: yelp')]
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(
        getFixturePath('nested-depth-esm'),
        'good1 good2 good3 command --yelp'
      );

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        [],
        [expect.stringMatching('Unknown argument: yelp')]
      ]);

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });
  });

  it('ensures parent commands and child commands of the same name do not interfere', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await bf.runProgram(getFixturePath('nested-same-names-cjs'), '--help');

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(expectedCommandsRegex(['conflict'], 'conflict', ''))]
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      await bf.runProgram(getFixturePath('nested-same-names-esm'), '--help');

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(expectedCommandsRegex(['conflict'], 'conflict', ''))]
      ]);
    });
  });

  it("throws when adding a command that has the same name or alias as a sibling command's name or alias", async () => {
    expect.hasAssertions();

    // ! We must account for variations in order when walking the filesystem

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-cjs', 'alias-alias']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.DuplicateCommandName(
          'name1',
          'alias1',
          'alias',
          'alias1',
          'alias'
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-cjs', 'alias-name']))
      ).rejects.toMatchObject({
        message: expect.stringMatching(
          /of "name1-alias1" are.+"name1-alias1" \(name|alias\) conflicts with "name1-alias1" \(name|alias\)/
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-cjs', 'name-alias']))
      ).rejects.toMatchObject({
        message: expect.stringMatching(
          /of "test" are.+"name" \(name|alias\) conflicts with "name" \(name|alias\)/
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-cjs', 'name-name']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.DuplicateCommandName(
          'name',
          'name',
          'name',
          'name',
          'name'
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-cjs', 'self']))
      ).rejects.toMatchObject({
        message: expect.stringMatching(
          /the root command is.+"name-alias" \(name|alias\) conflicts with "name-alias" \(name|alias\)/
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-cjs', 'self-self']))
      ).rejects.toMatchObject({
        message: expect.stringMatching(
          /of "test" are.+"name-alias" \(name|alias\) conflicts with "name-alias" \(name|alias\)/
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-cjs', 'ext']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.DuplicateCommandName(
          'ext',
          'name',
          'name',
          'name',
          'name'
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-cjs', 'no-conflict']))
      ).resolves.toBeDefined();

      expect(logSpy.mock.calls).toStrictEqual([]);
    });

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-esm', 'alias-alias']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.DuplicateCommandName(
          'name1',
          'alias1',
          'alias',
          'alias1',
          'alias'
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-esm', 'alias-name']))
      ).rejects.toMatchObject({
        message: expect.stringMatching(
          /of "name1-alias1" are.+"name1-alias1" \(name|alias\) conflicts with "name1-alias1" \(name|alias\)/
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-esm', 'name-alias']))
      ).rejects.toMatchObject({
        message: expect.stringMatching(
          /of "test" are.+"name" \(name|alias\) conflicts with "name" \(name|alias\)/
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-esm', 'name-name']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.DuplicateCommandName(
          'name',
          'name',
          'name',
          'name',
          'name'
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-esm', 'self']))
      ).rejects.toMatchObject({
        message: expect.stringMatching(
          /the root command is.+"name-alias" \(name|alias\) conflicts with "name-alias" \(name|alias\)/
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-esm', 'self-self']))
      ).rejects.toMatchObject({
        message: expect.stringMatching(
          /of "test" are.+"name-alias" \(name|alias\) conflicts with "name-alias" \(name|alias\)/
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-esm', 'ext']))
      ).rejects.toMatchObject({
        message: BfErrorMessage.DuplicateCommandName(
          'ext',
          'name',
          'name',
          'name',
          'name'
        )
      });

      await expect(
        bf.configureProgram(getFixturePath(['nested-conflicting-esm', 'no-conflict']))
      ).resolves.toBeDefined();

      expect(logSpy.mock.calls).toStrictEqual([]);
    });
  });

  it('does the right thing when two files have the same name but different extensions', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await bf.runProgram(getFixturePath('nested-different-ext-cjs'), '--help');

      expect(logSpy.mock.calls).toStrictEqual([
        [
          expect.stringMatching(
            expectedCommandsRegex(
              [
                ['name', String.raw`\[aliases: alias1, alias2]`],
                ['name2', String.raw`\[aliases: alias4, alias5]`],
                ['no-conflict', String.raw`\[aliases: alias3]`]
              ],
              'name',
              ''
            )
          )
        ]
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      await bf.runProgram(getFixturePath('nested-different-ext-esm'), '--help');

      expect(logSpy.mock.calls).toStrictEqual([
        [
          expect.stringMatching(
            expectedCommandsRegex(
              [
                ['name', String.raw`\[aliases: alias1, alias2]`],
                ['name2', String.raw`\[aliases: alias4, alias5]`],
                ['no-conflict', String.raw`\[aliases: alias3]`]
              ],
              'name',
              ''
            )
          )
        ]
      ]);
    });
  });

  it('alpha-sorts commands that appear in help text', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await bf.runProgram(getFixturePath('nested-alphanumeric-cjs'), '--help');

      expect(logSpy.mock.calls).toStrictEqual([
        [
          expect.stringMatching(
            expectedCommandsRegex(['five', 'four', 'one', 'three', 'two'], 'alpha', '')
          )
        ]
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      await bf.runProgram(getFixturePath('nested-alphanumeric-esm'), '--help');

      expect(logSpy.mock.calls).toStrictEqual([
        [
          expect.stringMatching(
            expectedCommandsRegex(['five', 'four', 'one', 'three', 'two'], 'alpha', '')
          )
        ]
      ]);
    });
  });

  it('enables strictness constraints on effectors (and not helpers) by default', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--bad bad still good')
      ).resolves.toStrictEqual(
        expect.objectContaining({
          _: ['still', 'good'],
          bad: 'bad'
        })
      );
    });

    await withMocks(async () => {
      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--bad bad still good')
      ).resolves.toStrictEqual(
        expect.objectContaining({
          _: ['still', 'good'],
          bad: 'bad'
        })
      );
    });
  });

  it('allows yargs::strictX and yargs::demandOption method calls and options configurations on effectors that are ignored on helpers', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('one-file-strict-cjs')
      });

      await withMocks(async ({ errorSpy, logSpy, getExitCode }) => {
        await run('--bad bad not good');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        await run('--good');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        await run();
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        await run('--good --good1 --good2 --good3 --good4');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
        await run('--help');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.any(String)],
          [],
          [
            expect.stringContaining(
              'Missing required arguments: good4, good1, good2, good3, good'
            )
          ],
          [expect.any(String)],
          [],
          [
            expect.stringContaining(
              'Missing required arguments: good4, good1, good2, good3'
            )
          ],
          [expect.any(String)],
          [],
          [
            expect.stringContaining(
              'Missing required arguments: good4, good1, good2, good3, good'
            )
          ]
        ]);

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /Options:\n\s+--help\s+Show help text\s+\[boolean]\n\s+--version\s+Show version number\s+\[boolean]\n\s+--good1\s+\[boolean]\n\s+--good2\s+\[boolean]\n\s+--good3\s+\[boolean]\n\s+--good4\s+\[boolean]\n\s+--good\s+\[boolean]$/
            )
          ]
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('one-file-strict-esm')
      });

      await withMocks(async ({ errorSpy, logSpy, getExitCode }) => {
        await run('--bad bad not good');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        await run('--good');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        await run();
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
        await run('--good --good1 --good2 --good3 --good4');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);
        await run('--help');
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.any(String)],
          [],
          [
            expect.stringContaining(
              'Missing required arguments: good4, good1, good2, good3, good'
            )
          ],
          [expect.any(String)],
          [],
          [
            expect.stringContaining(
              'Missing required arguments: good4, good1, good2, good3'
            )
          ],
          [expect.any(String)],
          [],
          [
            expect.stringContaining(
              'Missing required arguments: good4, good1, good2, good3, good'
            )
          ]
        ]);

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /Options:\n\s+--help\s+Show help text\s+\[boolean]\n\s+--version\s+Show version number\s+\[boolean]\n\s+--good1\s+\[boolean]\n\s+--good2\s+\[boolean]\n\s+--good3\s+\[boolean]\n\s+--good4\s+\[boolean]\n\s+--good\s+\[boolean]$/
            )
          ]
        ]);
      });
    }
  });

  it('enables strictness constraints on childless parents and childless root', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('one-file-index-cjs'), '--bad');
      await bf.runProgram(
        getFixturePath('nested-one-file-index-empty-cjs'),
        'nested --bad'
      );

      expect(errorSpy).toHaveBeenCalledTimes(6);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('one-file-index-esm'), '--bad');
      await bf.runProgram(
        getFixturePath('nested-one-file-index-empty-esm'),
        'nested --bad'
      );

      expect(errorSpy).toHaveBeenCalledTimes(6);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });
  });

  it('allows for non-strict non-demanded childless parents/root with a handler and no parameters', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bare-cjs'))
      ).resolves.toSatisfy(bf_util.isArguments);
    });

    await withMocks(async () => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bare-esm'))
      ).resolves.toSatisfy(bf_util.isArguments);
    });
  });

  it('allows for childless root to handle --help and --version properly', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bare-cjs'), '--help')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-cjs'), '--version')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        ['1.0.0']
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bare-esm'), '--help')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-esm'), '--version')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        ['1.0.0']
      ]);
    });
  });

  it('ignores --help and --version when they occur after -- (double-dash)', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bare-cjs'), '-- --help')
      ).resolves.toSatisfy(bf_util.isArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-cjs'), '-- --version')
      ).resolves.toSatisfy(bf_util.isArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-cjs'), '-- --help --something-else')
      ).resolves.toSatisfy(bf_util.isArguments);

      await expect(
        bf.runProgram(
          getFixturePath('one-file-bare-cjs'),
          '-- --version --something-else'
        )
      ).resolves.toSatisfy(bf_util.isArguments);

      expect(logSpy.mock.calls).toBeEmpty();
    });

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bare-esm'), '-- --help')
      ).resolves.toSatisfy(bf_util.isArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-esm'), '-- --version')
      ).resolves.toSatisfy(bf_util.isArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-esm'), '-- --help --something-else')
      ).resolves.toSatisfy(bf_util.isArguments);

      await expect(
        bf.runProgram(
          getFixturePath('one-file-bare-esm'),
          '-- --version --something-else'
        )
      ).resolves.toSatisfy(bf_util.isArguments);

      expect(logSpy.mock.calls).toBeEmpty();
    });
  });

  it('does not ignore --help or --version when they occur before -- (double-dash)', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bare-cjs'), '--help --')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-cjs'), '--version --')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-cjs'), '--help -- --something-else')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(
          getFixturePath('one-file-bare-cjs'),
          '--version -- --something-else'
        )
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        ['1.0.0'],
        [expect.stringContaining('--help')],
        ['1.0.0']
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-bare-esm'), '--help --')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-esm'), '--version --')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-bare-esm'), '--help -- --something-else')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(
          getFixturePath('one-file-bare-esm'),
          '--version -- --something-else'
        )
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringContaining('--help')],
        ['1.0.0'],
        [expect.stringContaining('--help')],
        ['1.0.0']
      ]);
    });
  });

  it('does the right thing when the nearest package.json file is empty', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-empty-pkg-json-cjs'), '--help')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-empty-pkg-json-cjs'), '--version')
      ).resolves.toBeUndefined();

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(logSpy.mock.calls).toStrictEqual([[expect.stringContaining('--help')]]);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.not.stringContaining('--version')],
        [],
        [expect.stringContaining('version')]
      ]);
    });

    await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-empty-pkg-json-esm'), '--help')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-empty-pkg-json-esm'), '--version')
      ).resolves.toBeUndefined();

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
      expect(logSpy.mock.calls).toStrictEqual([[expect.stringContaining('--help')]]);
      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.not.stringContaining('--version')],
        [],
        [expect.stringContaining('version')]
      ]);
    });
  });

  it('sets helpOrVersionSet to true in builder on both passes if context.state.isHandlingHelpOption or context.state.isHandlingVersionOption is true', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-2nd-param-cjs'), '--help')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-2nd-param-cjs'), '--version')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-2nd-param-cjs'))
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        [true],
        [expect.any(String)],
        [true],
        [expect.any(String)],
        [false],
        [false] // ? helper then effector, unlike the above (helper only)
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-2nd-param-esm'), '--help')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-2nd-param-esm'), '--version')
      ).resolves.toSatisfy(bf_util.isNullArguments);

      await expect(
        bf.runProgram(getFixturePath('one-file-2nd-param-esm'))
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(logSpy.mock.calls).toStrictEqual([
        [true],
        [expect.any(String)],
        [true],
        [expect.any(String)],
        [false],
        [false] // ? helper then effector, unlike the above (helper only)
      ]);
    });
  });

  it('sets context.state.isGracefullyExiting to true in the configureExecutionEpilogue hook when exiting gracefully', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      let counter = 0;

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--help', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.isGracefullyExiting).toBeTrue();
            counter++;
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(1);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--version', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.isGracefullyExiting).toBeTrue();
            counter++;
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(2);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--okay', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.isGracefullyExiting).toBeFalse();
            counter++;
            return argv;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(3);
      expect(logSpy).toHaveBeenCalledTimes(2);
    });

    await withMocks(async ({ logSpy }) => {
      let counter = 0;

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--help', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.isGracefullyExiting).toBeTrue();
            counter++;
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(1);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--version', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.isGracefullyExiting).toBeTrue();
            counter++;
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(2);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--okay', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.isGracefullyExiting).toBeFalse();
            counter++;
            return argv;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(3);
      expect(logSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('sets context.state.didOutputHelpOrVersionText to true after help or version text has been output', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
      let counter = 0;

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--help', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.didOutputHelpOrVersionText).toBeTrue();
            counter++;
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(1);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--version', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.didOutputHelpOrVersionText).toBeTrue();
            counter++;
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(2);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-cjs'), '--okay', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.didOutputHelpOrVersionText).toBeFalse();
            counter++;
            return argv;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(3);
      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledTimes(0);

      await expect(
        bf.runProgram(getFixturePath('one-file-index-cjs'), '--bad', {
          configureErrorHandlingEpilogue(_, __, context) {
            expect(context.state.didOutputHelpOrVersionText).toBeTrue();
            counter++;
          }
        })
      ).resolves.toBeUndefined();

      expect(counter).toBe(4);
      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });

    await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
      let counter = 0;

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--help', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.didOutputHelpOrVersionText).toBeTrue();
            counter++;
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(1);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--version', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.didOutputHelpOrVersionText).toBeTrue();
            counter++;
            return argv;
          }
        })
      ).resolves.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(2);

      await expect(
        bf.runProgram(getFixturePath('one-file-loose-esm'), '--okay', {
          configureExecutionEpilogue(argv, context) {
            expect(context.state.didOutputHelpOrVersionText).toBeFalse();
            counter++;
            return argv;
          }
        })
      ).resolves.not.toSatisfy(bf_util.isNullArguments);

      expect(counter).toBe(3);
      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledTimes(0);

      await expect(
        bf.runProgram(getFixturePath('one-file-index-esm'), '--bad', {
          configureErrorHandlingEpilogue(_, __, context) {
            expect(context.state.didOutputHelpOrVersionText).toBeTrue();
            counter++;
          }
        })
      ).resolves.toBeUndefined();

      expect(counter).toBe(4);
      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);
    });
  });

  it('supports dynamic arguments (arguments that depend on other arguments)', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('one-file-dynamic-cjs'),
        configurationHooks: {
          configureExecutionContext(context) {
            context.state.globalVersionOption = undefined;
            return context;
          }
        }
      });

      await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
        await expect(
          run(['--lang', 'node', '--version=21.1'])
        ).resolves.toContainEntries([
          ['lang', 'node'],
          ['version', '21.1']
        ]);

        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        await expect(
          run(['--lang', 'python', '--version=21.1'])
        ).resolves.toBeUndefined();

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

        await expect(run('--help')).resolves.toSatisfy(bf_util.isNullArguments);
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /Options:\n\s+--help\s+Show help text\s+\[boolean]\n\s+--lang\s+\[choices: "node", "python"]\n\s+--version\s+\[string]$/
            )
          ]
        ]);

        expect(errorSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /Options:\n\s+--help\s+Show help text\s+\[boolean]\n\s+--lang\s+\[choices: "python"]\n\s+--version\s+\[choices: "3\.10", "3\.11", "3\.12"]$/
            )
          ],
          [],
          [
            expect.stringContaining(
              'Argument: version, Given: "21.1", Choices: "3.10", "3.11", "3.12"'
            )
          ]
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('one-file-dynamic-esm'),
        configurationHooks: {
          configureExecutionContext(context) {
            context.state.globalVersionOption = undefined;
            return context;
          }
        }
      });

      await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
        await expect(
          run(['--lang', 'node', '--version=21.1'])
        ).resolves.toContainEntries([
          ['lang', 'node'],
          ['version', '21.1']
        ]);

        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        await expect(
          run(['--lang', 'python', '--version=21.1'])
        ).resolves.toBeUndefined();

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

        await expect(run('--help')).resolves.toSatisfy(bf_util.isNullArguments);
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /Options:\n\s+--help\s+Show help text\s+\[boolean]\n\s+--lang\s+\[choices: "node", "python"]\n\s+--version\s+\[string]$/
            )
          ]
        ]);

        expect(errorSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /Options:\n\s+--help\s+Show help text\s+\[boolean]\n\s+--lang\s+\[choices: "python"]\n\s+--version\s+\[choices: "3\.10", "3\.11", "3\.12"]$/
            )
          ],
          [],
          [
            expect.stringContaining(
              'Argument: version, Given: "21.1", Choices: "3.10", "3.11", "3.12"'
            )
          ]
        ]);
      });
    }
  });

  it('does not pass undefined through argv when using "builder"', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('one-file-builder-object-literal-cjs')
      });

      await withMocks(async ({ errorSpy, getExitCode }) => {
        await expect(run(['--option', 'a'])).resolves.toContainEntries([
          ['option', 'a'],
          ['handled_by', expect.any(String)]
        ]);

        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        await expect(run(['--option', 'b'])).resolves.toContainEntries([
          ['option', 'b'],
          ['handled_by', expect.any(String)]
        ]);

        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        await expect(run()).resolves.toBeUndefined();

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.any(String)],
          [],
          [expect.stringContaining('Missing required argument: option')]
        ]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('one-file-builder-object-literal-esm')
      });

      await withMocks(async ({ errorSpy, getExitCode }) => {
        await expect(run(['--option', 'a'])).resolves.toContainEntries([
          ['option', 'a'],
          ['handled_by', expect.any(String)]
        ]);

        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        await expect(run(['--option', 'b'])).resolves.toContainEntries([
          ['option', 'b'],
          ['handled_by', expect.any(String)]
        ]);

        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        await expect(run()).resolves.toBeUndefined();

        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.any(String)],
          [],
          [expect.stringContaining('Missing required argument: option')]
        ]);
      });
    }
  });

  it('ensures PreExecutionContext::rootPrograms is PreExecutionContext.commands[0].programs and also referenced by the root command full name', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const { commands, rootPrograms } = await bf.configureProgram(
        getFixturePath('one-file-loose-cjs')
      );

      expect(commands.values().next().value?.programs).toBe(rootPrograms);
      expect(commands.get('test')?.programs).toBe(rootPrograms);
    });

    await withMocks(async () => {
      const { commands, rootPrograms } = await bf.configureProgram(
        getFixturePath('one-file-loose-esm')
      );

      expect(commands.values().next().value?.programs).toBe(rootPrograms);
      expect(commands.get('test')?.programs).toBe(rootPrograms);
    });
  });

  it('outputs and exits properly when CliError or non-CliError is thrown from handler', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-throws-handler-1-cjs'))
      ).resolves.toBeUndefined();

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        bf.runProgram(getFixturePath('one-file-throws-handler-2-cjs'))
      ).resolves.toBeUndefined();

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.objectContaining({ message: 'error thrown in handler' })],
        ['Error string thrown in handler']
      ]);
    });

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await expect(
        bf.runProgram(getFixturePath('one-file-throws-handler-1-esm'))
      ).resolves.toBeUndefined();

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      await expect(
        bf.runProgram(getFixturePath('one-file-throws-handler-2-esm'))
      ).resolves.toBeUndefined();

      expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

      expect(errorSpy.mock.calls).toStrictEqual([
        [expect.objectContaining({ message: 'error thrown in handler' })],
        ['Error string thrown in handler']
      ]);
    });
  });

  it('exits with bf.FrameworkExitCode.DefaultError when attempting to execute a non-existent sub-command of an unimplemented parent and/or root', async () => {
    expect.hasAssertions();

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-empty-cjs')
      });

      await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
        await expect(run(['does-not-exist'])).resolves.toBeUndefined();
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

        await expect(run(['nested', 'does-not-exist'])).resolves.toBeUndefined();
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

        // ? --help and --version should be more powerful than the impl-check
        await expect(run(['nested', 'does-not-exist', '--help'])).resolves.toSatisfy(
          bf_util.isNullArguments
        );
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--help')],
          [],
          [capitalize(BfErrorMessage.InvalidSubCommandInvocation())],
          [expect.stringContaining('--help')],
          [],
          [capitalize(BfErrorMessage.InvalidSubCommandInvocation())]
        ]);

        expect(logSpy.mock.calls).toStrictEqual([[expect.stringContaining('--help')]]);
      });
    }

    {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-empty-esm')
      });

      await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
        await expect(run(['does-not-exist'])).resolves.toBeUndefined();
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

        await expect(run(['nested', 'does-not-exist'])).resolves.toBeUndefined();
        expect(getExitCode()).toBe(bf.FrameworkExitCode.DefaultError);

        // ? --help and --version should be more powerful than the impl-check
        await expect(run(['nested', 'does-not-exist', '--help'])).resolves.toSatisfy(
          bf_util.isNullArguments
        );
        expect(getExitCode()).toBe(bf.FrameworkExitCode.Ok);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--help')],
          [],
          [capitalize(BfErrorMessage.InvalidSubCommandInvocation())],
          [expect.stringContaining('--help')],
          [],
          [capitalize(BfErrorMessage.InvalidSubCommandInvocation())]
        ]);

        expect(logSpy.mock.calls).toStrictEqual([[expect.stringContaining('--help')]]);
      });
    }
  });

  it('throws when an auto-discovered command file itself throws upon attempted import', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('one-file-throws-cjs'))
      ).rejects.toMatchObject({
        message: expect.stringContaining('error thrown upon importing this file')
      });
    });

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('one-file-throws-esm'))
      ).rejects.toMatchObject({
        message: expect.stringContaining('error thrown upon importing this file')
      });
    });
  });

  it('throws immediately when yargs::parseSync is called', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('one-file-loose-cjs'), {
          configureExecutionPrologue(rootPrograms) {
            // @ts-expect-error: on purpose
            rootPrograms.effector.parseSync();
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.UseParseAsyncInstead()
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-loose-cjs'), {
          configureExecutionPrologue(rootPrograms) {
            // @ts-expect-error: on purpose
            rootPrograms.helper.parseSync();
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.UseParseAsyncInstead()
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-loose-cjs'), {
          configureExecutionPrologue(rootPrograms) {
            // @ts-expect-error: on purpose
            rootPrograms.router.parseSync();
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.UseParseAsyncInstead()
      });
    });

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('one-file-loose-esm'), {
          configureExecutionPrologue(rootPrograms) {
            // @ts-expect-error: on purpose
            rootPrograms.effector.parseSync();
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.UseParseAsyncInstead()
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-loose-esm'), {
          configureExecutionPrologue(rootPrograms) {
            // @ts-expect-error: on purpose
            rootPrograms.helper.parseSync();
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.UseParseAsyncInstead()
      });

      await expect(
        bf.configureProgram(getFixturePath('one-file-loose-esm'), {
          configureExecutionPrologue(rootPrograms) {
            // @ts-expect-error: on purpose
            rootPrograms.router.parseSync();
          }
        })
      ).rejects.toMatchObject({
        message: BfErrorMessage.UseParseAsyncInstead()
      });
    });
  });
});
