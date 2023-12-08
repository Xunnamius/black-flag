/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jest/no-conditional-in-test */

// * These tests ensure index exports function as expected

import { $executionContext, FrameworkExitCode } from 'universe/constant';
import * as discover from 'universe/discover';
import { CliError, ErrorMessage } from 'universe/error';

import * as bf from 'universe/exports/index';
import * as bf_util from 'universe/exports/util';

import { expectedCommandsRegex, getFixturePath } from 'testverse/helpers';
import { withMocks } from 'testverse/setup';

import { makeExpect } from 'multiverse/expect-with-context';
import type { Arguments, ExecutionContext } from 'types/program';

describe('::configureProgram', () => {
  it('returns PreExecutionContext', async () => {
    expect.hasAssertions();
    await withMocks(async () => {
      const { program, execute, commands, debug, state, ...rest } =
        await bf.configureProgram();

      expect(program).toBeObject();
      expect(execute).toBeFunction();
      expect(commands).toBeDefined();
      expect(debug).toBeFunction();
      expect(state).toBeObject();
      expect(state).toHaveProperty('rawArgv');
      expect(state).toHaveProperty('initialTerminalWidth');
      expect(rest).toBeEmpty();
    });
  });

  it('creates new instance when called with 0 arguments', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      expect((await bf.configureProgram()).program).toBeObject();
    });
  });

  it('creates executable instance with default configuration hooks when called with 0 arguments', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy, exitSpy, errorSpy }) => {
      await expect(
        (await bf.configureProgram()).execute(['--help'])
      ).rejects.toBeDefined();

      expect(exitSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^[^-]+--help[^-]+--version[^-]+$/)]
      ]);
    });
  });

  it('does not attempt command auto-discovery when called without commandModulePath', async () => {
    expect.hasAssertions();

    const discoverSpy = jest
      .spyOn(discover, 'discoverCommands')
      .mockImplementation(() => undefined as any);

    await withMocks(async () => {
      await bf.configureProgram();
      await bf.configureProgram({});
      expect(discoverSpy.mock.calls).toHaveLength(0);
    });
  });

  it('attempts command auto-discovery when called with commandModulePath', async () => {
    expect.hasAssertions();

    const discoverSpy = jest
      .spyOn(discover, 'discoverCommands')
      .mockImplementation(() => undefined as any);

    await withMocks(async () => {
      await bf.configureProgram('/does-not-exist');
      await bf.configureProgram('/does-not-exist', {});
      expect(discoverSpy.mock.calls).toHaveLength(2);
    });
  });

  it('supports alternative call signatures', async () => {
    expect.hasAssertions();

    const config: bf.ConfigureHooks = {
      configureExecutionPrologue(program) {
        program.usage('custom usage message');
      }
    };

    const promisedConfig = Promise.resolve(config);

    await withMocks(async ({ logSpy }) => {
      await expect(
        (await bf.configureProgram(getFixturePath('one-file-index'))).execute(['--help'])
      ).resolves.toBeDefined();

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^Usage text for root program one-file-index\n/)]
      ]);
    });

    await withMocks(async ({ logSpy }) => {
      await expect(
        (await bf.configureProgram(getFixturePath('one-file-index'), config)).execute([
          '--help'
        ])
      ).resolves.toBeDefined();

      await expect(
        (
          await bf.configureProgram(getFixturePath('one-file-index'), promisedConfig)
        ).execute(['--help'])
      ).resolves.toBeDefined();

      expect(logSpy.mock.calls).toStrictEqual([
        [
          expect.stringMatching(
            /^Usage text for root program one-file-index\ncustom usage message\n/
          )
        ],
        [
          expect.stringMatching(
            /^Usage text for root program one-file-index\ncustom usage message\n/
          )
        ]
      ]);
    });

    await withMocks(async ({ logSpy, exitSpy, errorSpy }) => {
      await expect(
        (await bf.configureProgram(config)).execute(['--help'])
      ).rejects.toBeDefined();

      await expect(
        (await bf.configureProgram(promisedConfig)).execute(['--help'])
      ).rejects.toBeDefined();

      expect(errorSpy).toHaveBeenCalled();

      expect(logSpy.mock.calls).toStrictEqual([
        [expect.stringMatching(/^custom usage message\n/)],
        [expect.stringMatching(/^custom usage message\n/)]
      ]);

      expect(exitSpy.mock.calls).toStrictEqual([[0], [0]]);
    });
  });

  it('returns a non-strict "safe mode" instance if command auto-discovery is disabled or no commands were discovered', async () => {
    expect.hasAssertions();

    await withMocks(async ({ logSpy, errorSpy, exitSpy }) => {
      await expect(
        (await bf.configureProgram()).execute(['--help'])
      ).rejects.toBeDefined();

      expect(logSpy.mock.calls).toHaveLength(1);
      expect(errorSpy.mock.calls).toHaveLength(1);
      expect(exitSpy.mock.calls).toStrictEqual([[0]]);

      // ? "safe mode" instance is non-strict, so badness works by default
      await expect(
        (await bf.configureProgram()).execute(['--bad'])
      ).resolves.toBeDefined();

      expect(logSpy.mock.calls).toHaveLength(1);
      expect(errorSpy.mock.calls).toHaveLength(1);
      expect(exitSpy.mock.calls).toStrictEqual([[0]]);
    });

    await withMocks(async ({ logSpy, errorSpy, exitSpy }) => {
      await expect(
        (await bf.configureProgram(getFixturePath('empty-dir'))).execute(['--help'])
      ).rejects.toBeDefined();

      expect(logSpy.mock.calls).toHaveLength(1);
      expect(errorSpy.mock.calls).toHaveLength(1);

      // ? "safe mode" instance is non-strict, so badness works by default
      await expect(
        (await bf.configureProgram(getFixturePath('empty-dir'))).execute(['--bad'])
      ).resolves.toBeDefined();

      expect(logSpy.mock.calls).toHaveLength(1);
      expect(errorSpy.mock.calls).toHaveLength(1);
      expect(exitSpy.mock.calls).toStrictEqual([[0]]);
    });
  });

  it('uses "name" from package.json, directory, or filename without extension as program name if no name is provided', async () => {
    expect.hasAssertions();

    await withMocks(async () => {
      const context = await bf.configureProgram(
        getFixturePath('nested-several-empty-files')
      );

      expect(Array.from(context.commands.keys())).toStrictEqual([
        'fake-name',
        'fake-name nested',
        'fake-name nested first',
        'fake-name nested second',
        'fake-name nested third'
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

      expect(Array.from(context.commands.keys())).toStrictEqual(['fake-name-no-version']);

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
        bf.configureProgram(undefined, {
          configureExecutionContext: () => undefined as any
        })
      ).rejects.toMatchObject({
        message: expect.stringMatching(/ExecutionContext/)
      });
    });
  });

  // * Note that tests using getFixturePath and others that avoid black flag's
  // * "safe mode" will not throw/reject when --help (a valid arg) is passed
  // * since normal black flag instances are properly configured.
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
            (await bf.configureProgram(config)).execute()
          ).resolves.toBeDefined();

          await expect(
            (await bf.configureProgram(config)).execute(['3'])
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
        const { execute } = await bf.configureProgram({
          configureArguments() {
            return expectedArgv;
          },
          configureExecutionEpilogue(argv) {
            expect(argv._).toStrictEqual(expectedArgv);
            return expectedResult;
          }
        });

        await expect(execute()).resolves.toBe(expectedResult);
      });
    });

    it('passes around context singleton', async () => {
      expect.hasAssertions();

      let expectedContext: ExecutionContext;

      await withMocks(async () => {
        const { execute } = await bf.configureProgram({
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
        });

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

        expect(logSpy.mock.calls).toStrictEqual([
          expect.arrayContaining([expect.stringContaining('--help')])
        ]);

        expect(errorSpy.mock.calls).toHaveLength(0);

        await expect(
          (await bf.configureProgram(getFixturePath('one-file-index'))).execute(['--bad'])
        ).rejects.toBeDefined();

        expect(logSpy.mock.calls).toHaveLength(1);
        expect(errorSpy.mock.calls).toStrictEqual([
          expect.arrayContaining([expect.stringContaining('--help')]),
          [],
          ['Unknown argument: bad']
        ]);
      });
    });

    it('outputs error messages to console.error via default handler if no error handling configuration hook is provided', async () => {
      expect.hasAssertions();

      const { execute } = await bf.configureProgram({
        configureArguments: () => undefined as any
      });

      await withMocks(async ({ errorSpy }) => {
        await expect(execute(['--help'])).rejects.toBeDefined();
        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(/typeof process\.argv/)]
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
          configureExecutionPrologue(program) {
            program.strict_force(true);
            program.exitProcess(false);
            callOrder.push('configureExecutionPrologue');
          }
        };

        await expect(
          (await bf.configureProgram(config)).execute()
        ).resolves.toBeDefined();

        await expect(
          (await bf.configureProgram(config)).execute(['--help'])
        ).resolves.toBeDefined();

        await expect(
          (await bf.configureProgram(config)).execute(['--bad'])
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

    it('throws if configureArguments returns falsy', async () => {
      expect.hasAssertions();

      const { execute } = await bf.configureProgram({
        configureArguments: () => undefined as any
      });

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
    it('supports function modules and object modules', async () => {
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

    it('supports all configuration options at root, parent, and child levels', async () => {
      expect.hasAssertions();
    });

    it('supports random additions to the ExecutionContext', async () => {
      expect.hasAssertions();
    });

    it('supports grandchild commands with positional arguments', async () => {
      expect.hasAssertions();
    });

    it('ignores empty command configuration root directory (safe mode)', async () => {
      expect.hasAssertions();

      await withMocks(async ({ logSpy, errorSpy, exitSpy, getExitCode }) => {
        await bf.runProgram(getFixturePath('empty'), '--help');

        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Options:'));
        expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('Commands:'));

        // ? Safe mode yargs instance is not configured properly, so we can test
        // ? for the consequences of passing "--help" to it:

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

    it('supports --help with proper description on deeply nested commands', async () => {
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

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringMatching(expectedCommandsRegex(['good1']))],
          [
            expect.stringMatching(
              expectedCommandsRegex(['good', 'good2'], 'fake-name good1')
            )
          ],
          [
            expect.stringMatching(
              expectedCommandsRegex(['good', 'good3'], 'fake-name good1 good2')
            )
          ],
          [
            expect.stringMatching(
              expectedCommandsRegex(['command'], 'fake-name good1 good2 good3')
            )
          ],
          [expect.not.stringContaining('Commands:')]
        ]);

        expect(logSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')],
          [expect.stringContaining('Show help text')]
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
        const run = bf_util.makeRunner({
          commandModulePath: getFixturePath('nested-depth')
        });

        await run('good1 good2 good3 command --yelp');

        expect(errorSpy.mock.calls).toStrictEqual([
          expect.arrayContaining([expect.stringContaining('--help')]),
          [],
          [expect.stringMatching('Unknown argument: yelp')]
        ]);

        expect(getExitCode()).toBe(1);
      });
    });

    it('supports command aliases (parent, child, and root)', async () => {
      expect.hasAssertions();
    });

    it('supports command aliases case-sensitively', async () => {
      expect.hasAssertions();
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

    it('allows custom strictness settings on shadow instances (dynamic strictness)', async () => {
      expect.hasAssertions();
    });

    it('disables yargs::strict, yargs::strictOptions, yargs::strictCommands only on non-shadow instances', async () => {
      expect.hasAssertions();
    });

    it('accepts ::strict_force(false) calls', async () => {
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

    it('throws when auto-discovered command configuration contains invalid "command" property', async () => {
      expect.hasAssertions();
    });
  });
});

describe('::runProgram and util::makeRunner', () => {
  const commandModulePath = getFixturePath('log-handler');

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

  it('::runProgram supports "safe mode" and commandModulePath call signatures', async () => {
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
    it('supports "safe mode" signatures', async () => {
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
    const commandModulePath = getFixturePath('log-handler');

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
