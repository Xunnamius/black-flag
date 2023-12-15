/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jest/no-conditional-in-test */

// * These tests ensure all exports function as expected

import { $executionContext, FrameworkExitCode } from 'universe/constant';
import { CliError, ErrorMessage } from 'universe/error';

import * as bf from 'universe/exports/index';
import * as bf_util from 'universe/exports/util';

import { expectedCommandsRegex, getFixturePath } from 'testverse/helpers';
import { withMocks } from 'testverse/setup';

import type { Arguments, ExecutionContext } from 'types/program';

describe('::configureProgram', () => {
  it('returns PreExecutionContext with expected properties and values', async () => {
    expect.hasAssertions();
    await withMocks(async () => {
      const { programs, execute, commands, debug, state, ...rest } =
        await bf.configureProgram(getFixturePath('one-file-index'));

      expect(programs).toBeObject();
      expect(programs).toContainAllKeys(['effector', 'helper', 'router']);
      expect(execute).toBeFunction();
      expect(commands).toBeDefined();
      expect(debug).toBeFunction();
      expect(state).toBeObject();
      expect(state).toContainAllKeys([
        'rawArgv',
        'initialTerminalWidth',
        'isGracefullyExiting',
        'isHandlingHelpOption',
        'globalHelpOption',
        'showHelpOnFail',
        'firstPassArgv'
      ]);
      expect(rest).toBeEmpty();
    });
  });

  it('uses default configuration hooks when none are provided', async () => {
    expect.hasAssertions();
  });

  it('uses default configuration hooks when provided hooks are explicitly undefined', async () => {
    expect.hasAssertions();
  });

  it('returns "null" parse result when data is unavailable', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy }) => {
      await expect(
        (await bf.configureProgram(getFixturePath('empty-index-file'))).execute([
          '--help'
        ])
      ).resolves.toStrictEqual({
        $0: '<no parse result available>',
        _: [],
        [$executionContext]: expect.anything()
      });

      expect(logSpy).toHaveBeenCalled();
    });
  });

  it('throws when called with undefined or non-existent commandModulePath', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      // @ts-expect-error: testing bad call
      await expect(bf.configureProgram()).rejects.toMatchObject({
        message: ErrorMessage.AssertionFailureBadConfigurationPath(undefined)
      });

      await expect(bf.configureProgram('')).rejects.toMatchObject({
        message: ErrorMessage.AssertionFailureBadConfigurationPath('')
      });

      await expect(bf.configureProgram('/does-not-exist')).rejects.toMatchObject({
        message: ErrorMessage.AssertionFailureBadConfigurationPath('/does-not-exist')
      });

      // @ts-expect-error: testing bad call
      await expect(bf.configureProgram({})).rejects.toMatchObject({
        message: ErrorMessage.AssertionFailureBadConfigurationPath({})
      });

      await expect(bf.configureProgram('', {})).rejects.toMatchObject({
        message: ErrorMessage.AssertionFailureBadConfigurationPath('')
      });
    });
  });

  it('uses "name" from package.json, directory, or filename without extension as program name if no name is provided', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const context = await bf.configureProgram(
        getFixturePath('nested-several-empty-files')
      );

      expect(Array.from(context.commands.keys())).toStrictEqual([
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

    const pkgUpNamespace = await import('pkg-up');
    jest
      .spyOn(pkgUpNamespace, 'pkgUp')
      .mockImplementation(() => Promise.resolve(undefined));

    await withMocks(async () => {
      const context = await bf.configureProgram(
        getFixturePath('nested-several-empty-files')
      );

      expect(Array.from(context.commands.keys())).toStrictEqual([
        'nested-several-empty-files',
        'nested-several-empty-files nested',
        'nested-several-empty-files nested first',
        'nested-several-empty-files nested second',
        'nested-several-empty-files nested third'
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

  it('throws when configureExecutionContext returns falsy', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      await expect(
        bf.configureProgram(getFixturePath('empty-index-file'), {
          configureExecutionContext: () => undefined as any
        })
      ).rejects.toMatchObject({
        message: expect.stringMatching(/ExecutionContext/)
      });
    });
  });

  it('throws when calling disallowed methods on programs', async () => {
    expect.hasAssertions();
  });

  describe('::execute', () => {
    it('calls hideBin on process.argv only if no argv argument provided', async () => {
      expect.hasAssertions();

      let succeeded = 0;

      await withMocks(
        async () => {
          const config: bf.ConfigureHooks = {
            configureArguments(argv) {
              expect(argv).toStrictEqual(['3']);
              succeeded++;
              return argv;
            }
          };

          await expect(
            (
              await bf.configureProgram(getFixturePath('one-file-no-strict'), config)
            ).execute()
          ).resolves.toBeDefined();

          await expect(
            (
              await bf.configureProgram(getFixturePath('one-file-no-strict'), config)
            ).execute(['3'])
          ).resolves.toBeDefined();
        },
        {
          simulatedArgv: ['1', '2', '3'],
          options: { replaceEntireArgv: true }
        }
      );

      expect(succeeded).toBe(2);
    });

    it('passes around configured arguments and returns epilogue result', async () => {
      expect.hasAssertions();

      const expectedArgv = ['a', 'b', 'c'];
      const expectedResult = { something: 'else' } as unknown as Arguments;

      await withMocks(async () => {
        const { execute } = await bf.configureProgram(
          getFixturePath('one-file-no-strict'),
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
          getFixturePath('one-file-no-strict'),
          {
            configureArguments(argv, context) {
              expect(context).toBe(expectedContext);
              return argv;
            },
            configureExecutionEpilogue(argv, context) {
              expect(argv[$executionContext]).toBe(expectedContext);
              expect(context).toBe(expectedContext);
              return argv;
            },
            configureErrorHandlingEpilogue(_meta, argv, context) {
              expect(argv[$executionContext]).toBe(expectedContext);
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
        expect(result[$executionContext]).toBe(expectedContext);
      });
    });

    it('outputs explicit help text to stdout and implicit to stderr with expected exit codes', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy, errorSpy }) => {
        await expect(
          (await bf.configureProgram(getFixturePath('one-file-index'))).execute([
            '--help'
          ])
        ).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([[expect.stringContaining('--help')]]);

        expect(errorSpy.mock.calls).toHaveLength(0);

        await expect(
          (await bf.configureProgram(getFixturePath('one-file-index'))).execute(['--bad'])
        ).rejects.toBeDefined();

        expect(logSpy.mock.calls).toHaveLength(1);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--help')],
          [],
          ['Unknown argument: bad']
        ]);
      });
    });

    it('replaces "$000", "$0", and "$1" in default usage text when outputting help text', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy, errorSpy }) => {
        await expect(
          (await bf.configureProgram(getFixturePath('one-file-default-usage'))).execute([
            '--help'
          ])
        ).resolves.toBeDefined();

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /^Usage: custom-name <custom-param-1\|custom-param-2> \[custom-param-3\.\.]\n\nCustom-description/
            )
          ]
        ]);

        expect(errorSpy.mock.calls).toHaveLength(0);

        await expect(
          (await bf.configureProgram(getFixturePath('one-file-default-usage'))).execute([
            '--bad'
          ])
        ).rejects.toBeDefined();

        expect(logSpy.mock.calls).toHaveLength(1);
        expect(errorSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              /^Usage: custom-name <custom-param-1\|custom-param-2> \[custom-param-3\.\.]\n\nCustom-description/
            )
          ],
          [],
          ['Unknown argument: bad']
        ]);
      });
    });

    it('outputs error messages to console.error via default handler if no error handling configuration hook is provided', async () => {
      expect.hasAssertions();

      const { execute } = await bf.configureProgram(getFixturePath('one-file-index'), {
        configureErrorHandlingEpilogue: undefined
      });

      await withMocks(async ({ errorSpy }) => {
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
        const config: bf.ConfigureHooks = {
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
          (await bf.configureProgram(getFixturePath('one-file-index'), config)).execute()
        ).resolves.toBeDefined();

        await expect(
          (await bf.configureProgram(getFixturePath('one-file-index'), config)).execute([
            '--help'
          ])
        ).resolves.toBeDefined();

        await expect(
          (await bf.configureProgram(getFixturePath('one-file-index'), config)).execute([
            '--bad'
          ])
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
      const configureExecutionEpilogueSpy = jest.fn(() => ({}) as Arguments);

      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-throws-handler-graceful'),
        {
          configureErrorHandlingEpilogue: configureErrorHandlingEpilogueSpy,
          configureExecutionEpilogue: configureExecutionEpilogueSpy
        }
      );

      await withMocks(async () => {
        await expect(execute()).resolves.toBeDefined();

        expect(configureErrorHandlingEpilogueSpy).not.toHaveBeenCalled();
        expect(configureExecutionEpilogueSpy).toHaveBeenCalledTimes(1);
      });
    });

    it("calls configureErrorHandlingEpilogue when configureExecutionEpilogue throws unless it's a GracefulEarlyExitError", async () => {
      expect.hasAssertions();

      const configureErrorHandlingEpilogueSpy = jest.fn();

      const { execute } = await bf.configureProgram(getFixturePath('one-file-index'), {
        configureErrorHandlingEpilogue: configureErrorHandlingEpilogueSpy,
        configureExecutionEpilogue: () => {
          throw new Error('badness');
        }
      });

      await withMocks(async () => {
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

    it('passes the correct programs into builder', async () => {
      expect.hasAssertions();
    });

    it('supports returning program from builder', async () => {
      expect.hasAssertions();
    });

    it('supports returning undefined from builder', async () => {
      expect.hasAssertions();
    });

    it('allows returning a plain object from builder instead of program', async () => {
      expect.hasAssertions();
    });

    it('supports calling showHelpOnFail', async () => {
      expect.hasAssertions();
    });

    it('throws if configureArguments returns falsy', async () => {
      expect.hasAssertions();

      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-no-strict'),
        { configureArguments: () => undefined as any }
      );

      await withMocks(async ({ errorSpy }) => {
        await expect(execute(['--help'])).rejects.toMatchObject({
          message: expect.stringMatching(/typeof process\.argv/)
        });

        expect(errorSpy).toHaveBeenCalled();
      });
    });

    it('throws if configureExecutionEpilogue returns falsy', async () => {
      expect.hasAssertions();

      const { execute } = await bf.configureProgram({
        configureExecutionEpilogue: () => undefined as any
      });

      await withMocks(async ({ errorSpy }) => {
        await expect(execute(['--vex'])).rejects.toMatchObject({
          message: expect.stringMatching(/Arguments/)
        });

        expect(errorSpy).toHaveBeenCalled();
      });
    });

    it('throws if invoked more than once', async () => {
      expect.hasAssertions();

      const { execute } = await bf.configureProgram();

      await withMocks(async () => {
        await expect(execute()).resolves.toBeDefined();
        await expect(execute()).rejects.toMatchObject({
          message: ErrorMessage.AssertionFailureCannotExecuteMultipleTimes()
        });
      });
    });

    it("does the right thing when a command's builder throws", async () => {
      expect.hasAssertions();

      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-throws-builder')
      );

      await withMocks(async ({ errorSpy }) => {
        await expect(execute()).rejects.toBeDefined();

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('error thrown in builder')]
        ]);
      });
    });

    it("does the right thing when a command's handler throws", async () => {
      expect.hasAssertions();

      const { execute } = await bf.configureProgram(
        getFixturePath('one-file-throws-handler')
      );

      await withMocks(async ({ errorSpy }) => {
        await expect(execute()).rejects.toBeDefined();

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('error thrown in handler')]
        ]);
      });
    });
  });

  describe('<command module auto-discovery>', () => {
    it('discovers deeply nested commands files and nothing else', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        const context = await bf.configureProgram(getFixturePath('nested-depth'));

        expect(Array.from(context.commands.keys())).toStrictEqual([
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
          commandModulePath: getFixturePath('different-module-types')
        });

        await expect(run('exports-function --exports-function')).resolves.toStrictEqual(
          expect.objectContaining({
            exportsFunction: 1,
            handled_by: getFixturePath(['different-module-types', 'exports-function.js'])
          })
        );

        await expect(run('exports-object positional')).resolves.toStrictEqual(
          expect.objectContaining({
            testPositional: 'positional',
            handled_by: getFixturePath(['different-module-types', 'exports-object.js'])
          })
        );

        const result = await run('--help');

        expect(logSpy.mock.calls).toStrictEqual([
          [
            expect.stringMatching(
              expectedCommandsRegex([
                'exports-function',
                'exports-object test-positional'
              ])
            )
          ]
        ]);

        const executionContext = result[$executionContext] as ExecutionContext & {
          effected: true;
          affected: true;
        };

        expect(executionContext.affected).toBeTrue();
      });
    });

    // TODO: extra attention: left off here before latest round of changes
    it('supports "aliases" export at parent, child, and root', async () => {
      expect.hasAssertions();

      const run = await bf_util.makeRunner({
        commandModulePath: getFixturePath('nested-several-files-full')
      });

      await withMocks(async () => {
        const argv1 = await run('--help');
        const argv2 = await run('n --help');
        const argv3 = await run('n f --help');
      });
    });

    it('supports "aliases" export case-sensitively', async () => {
      expect.hasAssertions();
    });

    it('supports "builder" export at parent, child, and root', async () => {
      expect.hasAssertions();
    });

    it('supports "command" export at parent, child, and root', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        const argv = await bf.runProgram(
          getFixturePath('nested-several-files-full'),
          'positional-arg'
        );

        expect(argv).toContainEntries([
          ['testPositional', 'positional-arg'],
          ['test-positional', 'positional-arg']
        ]);
      });
    });

    it('throws when "command" export is invalid', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        await bf.configureProgram(getFixturePath('one-file-throws-command'));
      });
    });

    it('supports "deprecated" export at parent, child, and root', async () => {
      expect.hasAssertions();
    });

    it('supports "description" export at parent, child, and root', async () => {
      expect.hasAssertions();
    });

    it('supports "handler" export at parent, child, and root', async () => {
      expect.hasAssertions();
    });

    it('supports "name" export at parent, child, and root', async () => {
      expect.hasAssertions();
    });

    it('supports "usage" export at parent, child, and root', async () => {
      expect.hasAssertions();
    });

    it('supports "$1" interpolation in "usage" export', async () => {
      expect.hasAssertions();
    });

    it('supports "$1" interpolation in usage even when description is false export', async () => {
      expect.hasAssertions();
    });

    it('supports random additions to the ExecutionContext from handlers', async () => {
      expect.hasAssertions();
    });

    it('supports grandchild commands with positional arguments', async () => {
      expect.hasAssertions();
    });

    it('ignores empty command configuration root directory (returns semi-broken instance)', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy, errorSpy, exitSpy, getExitCode }) => {
        await bf.runProgram(getFixturePath('empty'), '--help');

        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Options:'));
        expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('Commands:'));
        expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('Commands:'));

        // ? The semi-broken yargs instance is not configured properly, so we
        // ? can test for the consequences of passing "--help" to it:

        expect(getExitCode()).toBe(1);
        expect(exitSpy.mock.calls).toStrictEqual([[0]]);
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('process.exit(0)')]
        ]);
      });
    });

    it('delegates parsing and handling to deeply nested commands', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-depth')
        });

        await expect(run('good1 good2 good3 command --command')).resolves.toStrictEqual(
          expect.objectContaining({
            command: 1,
            handled_by: getFixturePath([
              'nested-depth',
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
              'nested-depth',
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
            handled_by: getFixturePath(['nested-depth', 'good1', 'good2', 'index.js'])
          })
        );

        await expect(run('good1 --good1')).resolves.toStrictEqual(
          expect.objectContaining({
            good1: 1,
            handled_by: getFixturePath(['nested-depth', 'good1', 'index.js'])
          })
        );

        await expect(run('--nested-depth')).resolves.toStrictEqual(
          expect.objectContaining({
            nestedDepth: 1,
            'nested-depth': 1,
            handled_by: getFixturePath(['nested-depth', 'index.js'])
          })
        );
      });
    });

    it('supports --help with proper description and command full name across deep hierarchies', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy }) => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-depth')
        });

        await run('--help');
        await run('good1 --help');
        await run('good1 good2 --help');
        await run('good1 good2 good3 --help');
        await run('good1 good2 good3 command --help');

        // * Make sure we're getting the correct entries under "Commands:"

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(expectedCommandsRegex(['good1']))],
          [expect.stringMatching(expectedCommandsRegex(['good', 'good2'], 'test good1'))],
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
    });

    it('outputs the same command full name in error help text as in non-error help text', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-depth')
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

        expect(getExitCode()).toBe(0);
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

        expect(getExitCode()).toBe(1);
      });
    });

    // TODO: extra attention:
    it('supports --help with proper description and command full name across deep aliased hierarchies', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy }) => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-several-files-full')
        });

        await run('--help');
        await run('parent --help');
        await run('parent child-1 --help');
        await run('parent child-2 --help');
        await run('parent child-3 --help');

        // // * Make sure we're getting the correct entries under "Commands:"

        // expect(logSpy.mock.calls).toStrictEqual([
        //   [expect.stringMatching(expectedCommandsRegex(['n'], 'nsf'))],
        //   [expect.stringMatching(expectedCommandsRegex(['f', 's', 't'], 'nsf n'))],
        //   [expect.not.stringContaining('Commands:')],
        //   [expect.not.stringContaining('Commands:')],
        //   [expect.not.stringContaining('Commands:')]
        // ]);

        // // * Make sure we're getting the correct help text next to "--help"

        // expect(logSpy.mock.calls).toStrictEqual([
        //   [expect.stringContaining('Show help text')],
        //   [expect.stringContaining('Show help text')],
        //   [expect.stringContaining('Show help text')],
        //   [expect.stringContaining('Show help text')],
        //   [expect.stringContaining('Show help text')]
        // ]);

        // // * Make sure we're getting the correct command name

        // expect(logSpy.mock.calls).toStrictEqual([
        //   [expect.stringMatching(/^Usage: nsf\n/)],
        //   [expect.stringMatching(/^Usage: nsf n\n/)],
        //   [expect.stringMatching(/^Usage: nsf good1 good2\n/)],
        //   [expect.stringMatching(/^Usage: nsf good1 good2 good3\n/)],
        //   [expect.stringMatching(/^Usage: nsf good1 good2 good3 command\n/)]
        // ]);

        // // * Make sure the correct aliases are reported alongside their commands
      });
    });

    // TODO: extra attention:
    it('outputs the same command full name in error help text as in non-error help text when commands have aliases', async () => {
      expect.hasAssertions();
      expect(true).toBeFalse();
      await withMocks(async ({ logSpy, errorSpy, getExitCode }) => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-depth')
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

        expect(getExitCode()).toBe(0);
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

        expect(getExitCode()).toBe(1);
      });
    });

    // TODO: extra attention:
    it('supports using yargs::help to configure global help options across deep hierarchies', async () => {
      expect.hasAssertions();

      // TODO: also supports help(false), help(''), help(true), help('help') (no
      // TODO: change), and help('info')

      expect(true).toBeFalse();

      await withMocks(async ({ logSpy }) => {
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-depth')
        });

        await run('--help');
        await run('good1 --help');
        await run('good1 good2 --help');
        await run('good1 good2 good3 --help');
        await run('good1 good2 good3 command --help');

        // * Make sure we're getting the correct entries under "Commands:"

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(expectedCommandsRegex(['good1']))],
          [expect.stringMatching(expectedCommandsRegex(['good', 'good2'], 'test good1'))],
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
    });

    it('supports --version only for root command unless manually configured', async () => {
      expect.hasAssertions();
      // TODO: exits gracefully
    });

    it('does not repeat help text when handling yargs errors in deeply nested commands', async () => {
      expect.hasAssertions();

      await withMocks(async ({ errorSpy, getExitCode }) => {
        await bf.runProgram(
          getFixturePath('nested-depth'),
          'good1 good2 good3 command --yelp'
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('--help')],
          [],
          [expect.stringMatching('Unknown argument: yelp')]
        ]);

        expect(getExitCode()).toBe(1);
      });
    });

    it('ensures parent commands and child commands of the same name do not interfere', async () => {
      expect.hasAssertions();
    });

    it('disables yargs::argv magic getter only on non-shadow instances', async () => {
      expect.hasAssertions();
    });

    it('alpha-sorts commands that appear in help text', async () => {
      expect.hasAssertions();
    });

    it('enables strictness constraints on all commands', async () => {
      expect.hasAssertions();
    });

    it('enables strictness constraints on childless parents and childless root', async () => {
      expect.hasAssertions();
    });

    it('allows for childless root with a handler and no parameters/arguments', async () => {
      expect.hasAssertions();
    });

    it('allows for childless root to handle --help and --version properly', async () => {
      expect.hasAssertions();
    });

    it('allows custom strictness settings on shadow instances (dynamic strictness)', async () => {
      expect.hasAssertions();
    });

    it('disables yargs::strict, yargs::strictOptions, yargs::strictCommands only on non-shadow instances', async () => {
      expect.hasAssertions();
    });

    it('replaces all yargs::help methods with a reference to the same global function', async () => {
      expect.hasAssertions();
      // TODO: X.help() === Y.help() for all X,Y in context.commands
    });

    it('does the right thing when the nearest package.json file is empty', async () => {
      expect.hasAssertions();
    });

    it('sets helpOrVersionSet to true in shadow and non-shadow builder if context.state.isHandlingHelpOption is true', async () => {
      expect.hasAssertions();
    });

    it('supports both CJS and ESM configuration files', async () => {
      expect.hasAssertions();
      // TODO: also supports something like module.exports.default = undefined
    });

    it('supports both empty ("") and false Configuration::description values', async () => {
      expect.hasAssertions();
    });

    it('capitalizes descriptions and custom usage text', async () => {
      expect.hasAssertions();
    });

    it('supports dynamic arguments (arguments that depend on other arguments)', async () => {
      expect.hasAssertions();
      // TODO: use choices
    });

    it('ensures PreExecutionContext::program is PreExecutionContext.commands[0].program', async () => {
      expect.hasAssertions();
    });

    it('behaves properly when CliError or non-CliError is thrown from handler', async () => {
      expect.hasAssertions();
    });

    it('throws when an auto-discovered command file itself throws upon attempted import', async () => {
      expect.hasAssertions();

      await withMocks(async () => {
        await expect(
          bf.configureProgram(getFixturePath('one-file-throws'))
        ).rejects.toMatchObject({
          message: expect.stringContaining('error thrown upon importing this file')
        });
      });
    });

    it('throws when existence invariant is violated', async () => {
      expect.hasAssertions();
    });

    it('throws when a configuration file unexpectedly fails to load', async () => {
      expect.hasAssertions();
    });

    it('throws immediately when yargs::parseSync is called', async () => {
      expect.hasAssertions();
    });
  });
});

describe('::runProgram and util::makeRunner', () => {
  const commandModulePath = getFixturePath('one-file-log-handler');

  const configurationHooks: bf.ConfigureHooks = {
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

  it('::runProgram supports semi-broken and commandModulePath call signatures', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode, logSpy, warnSpy }) => {
      await bf.runProgram();

      expect(logSpy).toHaveBeenCalledTimes(0);
      expect(warnSpy).toHaveBeenCalledTimes(0);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await bf.runProgram(commandModulePath);

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(0);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await bf.runProgram(commandModulePath, '--help');

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(warnSpy).toHaveBeenCalledTimes(0);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await bf.runProgram(commandModulePath, ['--help']);

      expect(logSpy).toHaveBeenCalledTimes(3);
      expect(warnSpy).toHaveBeenCalledTimes(0);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await bf.runProgram(commandModulePath, configurationHooks);

      expect(logSpy).toHaveBeenCalledTimes(4);
      expect(warnSpy.mock.calls).toStrictEqual([[1]]);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await bf.runProgram(commandModulePath, promisedConfigurationHooks);

      expect(logSpy).toHaveBeenCalledTimes(5);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2]]);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await bf.runProgram(
        commandModulePath,
        await bf.configureProgram(commandModulePath, configurationHooks)
      );

      expect(logSpy).toHaveBeenCalledTimes(6);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1]]);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await bf.runProgram(commandModulePath, '--help', configurationHooks);

      expect(logSpy).toHaveBeenCalledTimes(7);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1]]);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await bf.runProgram(commandModulePath, ['--help'], promisedConfigurationHooks);

      expect(logSpy).toHaveBeenCalledTimes(8);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2]]);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await bf.runProgram(
        commandModulePath,
        '--help',
        await bf.configureProgram(commandModulePath, promisedConfigurationHooks)
      );

      expect(logSpy).toHaveBeenCalledTimes(9);
      expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2], [2]]);
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);
    });
  });

  describe('::makeRunner supports all call signatures', () => {
    it('supports semi-broken signatures', async () => {
      expect.hasAssertions();

      await withMocks(async ({ warnSpy, logSpy, getExitCode }) => {
        await expect(bf_util.makeRunner()()).resolves.toBeDefined();

        expect(logSpy).toHaveBeenCalledTimes(0);
        expect(warnSpy).toHaveBeenCalledTimes(0);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await expect(bf_util.makeRunner({ configurationHooks })()).resolves.toBeDefined();

        expect(logSpy).toHaveBeenCalledTimes(0);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await expect(
          bf_util.makeRunner({
            preExecutionContext: await bf.configureProgram(
              commandModulePath,
              configurationHooks
            )
          })(['--log-handler'])
        ).resolves.toBeDefined();

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledTimes(2);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await expect(
          bf_util.makeRunner({
            commandModulePath,
            preExecutionContext: await bf.configureProgram(
              commandModulePath,
              promisedConfigurationHooks
            )
          })(['--log-handler'])
        ).resolves.toBeDefined();

        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(warnSpy).toHaveBeenCalledTimes(3);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);
      });
    });

    it('supports commandModulePath signatures', async () => {
      expect.hasAssertions();

      await withMocks(async ({ getExitCode, logSpy, warnSpy }) => {
        const run = bf_util.makeRunner({ commandModulePath });

        await run();

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 1 }));

        expect(warnSpy.mock.calls).toStrictEqual([]);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await run('--help');

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 2 }));

        expect(warnSpy.mock.calls).toStrictEqual([]);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await run(['--help']);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 3 }));

        expect(warnSpy.mock.calls).toStrictEqual([]);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await run(configurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 4 }));

        expect(warnSpy.mock.calls).toStrictEqual([[1]]);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await run(promisedConfigurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 5 }));

        expect(warnSpy.mock.calls).toStrictEqual([[1], [2]]);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await run(await bf.configureProgram(commandModulePath, configurationHooks));

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 6 }));

        expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1]]);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await run(['--help'], configurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 7 }));

        expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1]]);
        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await run(['--help'], promisedConfigurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 8 }));

        expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2]]);

        expect(getExitCode()).toBe(FrameworkExitCode.Ok);

        await run(
          '--help',
          await bf.configureProgram(commandModulePath, promisedConfigurationHooks)
        );

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 9 }));

        expect(warnSpy.mock.calls).toStrictEqual([[1], [2], [1], [1], [2], [2]]);

        expect(getExitCode()).toBe(FrameworkExitCode.Ok);
      });
    });

    it('supports local args overwriting given defaults', async () => {
      expect.hasAssertions();

      await withMocks(async ({ getExitCode, logSpy, warnSpy }) => {
        const run = bf_util.makeRunner({
          commandModulePath,
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

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 1 }));
        expectedWarnSpy.push([1], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run('--help');

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 2 }));
        expectedWarnSpy.push([1], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(['--help']);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 3 }));
        expectedWarnSpy.push([1], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(configurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 4 }));
        expectedWarnSpy.push([1], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(promisedConfigurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 5 }));
        expectedWarnSpy.push([2], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(
          await bf.configureProgram(commandModulePath, promisedConfigurationHooks)
        );

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 6 }));
        expectedWarnSpy.push([2]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(['--help'], configurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 7 }));
        expectedWarnSpy.push([1], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(['--help'], promisedConfigurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 8 }));
        expectedWarnSpy.push([2], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(
          '--help',
          await bf.configureProgram(commandModulePath, promisedConfigurationHooks)
        );

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 9 }));
        expectedWarnSpy.push([2]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);
      });

      await withMocks(async ({ getExitCode, logSpy, warnSpy }) => {
        const run = bf_util.makeRunner({
          commandModulePath,
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

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 1 }));
        expectedWarnSpy.push([4], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run('--help');

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 2 }));
        expectedWarnSpy.push([4], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(['--help']);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 3 }));
        expectedWarnSpy.push([4], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(configurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 4 }));
        expectedWarnSpy.push([1], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(promisedConfigurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 5 }));
        expectedWarnSpy.push([2], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(await bf.configureProgram(commandModulePath, configurationHooks));

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 6 }));
        expectedWarnSpy.push([1]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(['--help'], configurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 7 }));
        expectedWarnSpy.push([1], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(['--help'], promisedConfigurationHooks);

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 8 }));
        expectedWarnSpy.push([2], [3]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);

        await run(
          '--help',
          await bf.configureProgram(commandModulePath, promisedConfigurationHooks)
        );

        expect(logSpy.mock.calls).toStrictEqual(expect.objectContaining({ length: 9 }));
        expectedWarnSpy.push([2]);
        expect(warnSpy.mock.calls).toStrictEqual(expectedWarnSpy);
        expect(getExitCode()).toStrictEqual(FrameworkExitCode.Ok);
      });
    });
  });

  it('throws in runner form if ::makeRunner is given both preExecutionContext and configurationHooks', async () => {
    expect.hasAssertions();
    const commandModulePath = getFixturePath('one-file-log-handler');

    expect(() =>
      bf_util.makeRunner({
        commandModulePath,
        configurationHooks: {},
        preExecutionContext: {} as unknown as bf.PreExecutionContext
      })()
    ).toThrow(ErrorMessage.AssertionFailureBadParameterCombination());
  });

  it('exits with FrameworkExitCode.Ok upon success', async () => {
    expect.hasAssertions();

    await withMocks(async ({ getExitCode }) => {
      await bf.runProgram();
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);
    });

    await withMocks(async ({ getExitCode }) => {
      const run = bf_util.makeRunner();

      await run();
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);

      await run();
      expect(getExitCode()).toBe(FrameworkExitCode.Ok);
    });
  });

  it('exits with FrameworkExitCode.NotImplemented when command provides no handler', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('not-implemented'), 'cmd');

      expect(getExitCode()).toBe(FrameworkExitCode.NotImplemented);
      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('not-implemented')
      });

      await run('cmd');

      expect(getExitCode()).toBe(FrameworkExitCode.NotImplemented);
      expect(errorSpy).toHaveBeenCalledTimes(1);

      await run('cmd');

      expect(getExitCode()).toBe(FrameworkExitCode.NotImplemented);
      expect(errorSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('exits with FrameworkExitCode.Ok when given --help argument even when command provides no handler', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy, getExitCode }) => {
      await bf.runProgram(getFixturePath('not-implemented'), 'nested --help');

      expect(getExitCode()).toBe(FrameworkExitCode.Ok);
      expect(logSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ logSpy, getExitCode }) => {
      const run = bf_util.makeRunner({
        commandModulePath: getFixturePath('not-implemented')
      });

      await run('nested --help');

      expect(getExitCode()).toBe(FrameworkExitCode.Ok);
      expect(logSpy).toHaveBeenCalledTimes(1);

      await run('nested --help');

      expect(getExitCode()).toBe(FrameworkExitCode.Ok);
      expect(logSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('exits with FrameworkExitCode.AssertionFailed when sanity check fails', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(undefined, { configureArguments: () => undefined as any });

      expect(getExitCode()).toBe(FrameworkExitCode.AssertionFailed);
      expect(errorSpy).toHaveBeenCalled();
    });

    await withMocks(async ({ errorSpy, getExitCode }) => {
      const run = bf_util.makeRunner();

      await run({ configureArguments: () => undefined as any });

      expect(getExitCode()).toBe(FrameworkExitCode.AssertionFailed);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('exits with FrameworkExitCode.DefaultError upon string error type', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(undefined, {
        configureArguments() {
          throw 'problems!';
        }
      });

      expect(getExitCode()).toBe(FrameworkExitCode.DefaultError);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('exits with FrameworkExitCode.DefaultError upon non-CliError error type', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(undefined, {
        configureArguments() {
          throw new Error('problems!');
        }
      });

      expect(getExitCode()).toBe(FrameworkExitCode.DefaultError);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('exits with specified exit code upon CliError error type', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(undefined, {
        configureArguments() {
          throw new CliError('problems!', { suggestedExitCode: 5 });
        }
      });

      expect(getExitCode()).toBe(5);
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});

describe('::CliError', () => {
  it('can wrap other errors', async () => {
    expect.hasAssertions();

    await withMocks(async ({ errorSpy, getExitCode }) => {
      await bf.runProgram(undefined, {
        configureArguments() {
          throw new CliError(new Error('problems!'));
        }
      });

      expect(getExitCode()).toBe(1);
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
