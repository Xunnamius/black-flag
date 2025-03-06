import assert from 'node:assert';
import { isNativeError } from 'node:util/types';

import { createDebugLogger } from 'rejoinder';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import {
  $executionContext,
  defaultHelpOptionName,
  defaultHelpTextDescription,
  defaultVersionOptionName,
  defaultVersionTextDescription,
  FrameworkExitCode,
  globalDebuggerNamespace,
  nullArguments$0
} from 'universe:constant.ts';

import { discoverCommands } from 'universe:discover.ts';

import {
  AssertionFailedError,
  BfErrorMessage,
  CliError,
  isCliError,
  isCommandNotImplementedError,
  isGracefulEarlyExitError
} from 'universe:error.ts';

import {
  capitalize,
  getDeepestErrorCause,
  isArguments,
  isAssertionSystemError,
  isPreExecutionContext,
  wrapExecutionContext
} from 'universe:util.ts';

import type { Merge, Promisable } from 'type-fest';

import type {
  ConfigurationHooks,
  ConfigureErrorHandlingEpilogue
} from 'universe:types/configure.ts';

import type {
  Arguments,
  ExecutionContext,
  Executor,
  NullArguments,
  PreExecutionContext,
  // ? Used by intellisense and in auto-generated documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program
} from 'universe:types/program.ts';

const coreDebug = createDebugLogger({ namespace: globalDebuggerNamespace });

/**
 * The available call signature parameters of the {@link runProgram} function.
 */
export type RunProgramParameters =
  // * Call signature 1
  | [commandModulePath: string]
  // * Call signature 2
  | [commandModulePath: string, configurationHooks: Promisable<ConfigurationHooks>]
  // * Call signature 3
  | [commandModulePath: string, preExecutionContext: Promisable<PreExecutionContext>]
  // * Call signature 4
  | [commandModulePath: string, argv: string | string[]]
  // * Call signature 5
  | [
      commandModulePath: string,
      argv: string | string[],
      configurationHooks: Promisable<ConfigurationHooks>
    ]
  // * Call signature 6
  | [
      commandModulePath: string,
      argv: string | string[],
      preExecutionContext: Promisable<PreExecutionContext>
    ];

/**
 * The return type of the {@link runProgram} function.
 */
export type RunProgramReturnType<CustomCliArguments extends Record<string, unknown>> =
  Promise<NullArguments | Arguments<CustomCliArguments> | undefined>;

/**
 * The available call signature parameters of the low-order function returned by
 * {@link makeRunner}.
 */
export type FactoriedRunProgramParameters = RunProgramParameters extends [
  infer _,
  ...infer Tail
]
  ? Tail
  : [];

/**
 * Create and return a {@link PreExecutionContext} containing fully-configured
 * {@link Program} instances and an {@link Executor} entry point function.
 *
 * Command auto-discovery will occur at `commandModulePath`. An exception will
 * occur if no commands are loadable from the given `commandModulePath`.
 *
 * **This function throws whenever an exception occurs**, making it not ideal as
 * an entry point for a CLI, but perhaps useful during testing. See
 * {@link runProgram} for a wrapper function that handles exceptions and sets
 * the exit code automatically.
 */
export async function configureProgram(
  /**
   * Command auto-discovery will occur at `commandModulePath`. An exception will
   * occur if no commands are loadable from the given `commandModulePath`.
   *
   * `'file://...'`-style URLs are also accepted.
   */
  commandModulePath: string,
  configurationHooks?: Promisable<ConfigurationHooks>
): Promise<PreExecutionContext> {
  try {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    const confDebug = coreDebug.extend('conf');

    confDebug('configureProgram was invoked');

    const finalConfigurationHooks: Required<ConfigurationHooks> = {
      configureArguments: (rawArgv) => rawArgv,
      configureExecutionPrologue: noopConfigurationHook,
      configureExecutionEpilogue: (argv) => argv,
      configureExecutionContext: (context) => context,
      configureErrorHandlingEpilogue: defaultErrorHandlingEpilogueConfigurationHook,
      ...Object.fromEntries(
        // ? Overwrite defaults with any defined configuration hooks
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        Object.entries((await configurationHooks) || {}).filter(([, v]) => !!v)
      )
    };

    confDebug('command module auto-discovery path: %O', commandModulePath);
    confDebug('configuration hooks: %O', finalConfigurationHooks);
    confDebug('entering configureExecutionContext');

    const context = asUnenumerable(
      await finalConfigurationHooks.configureExecutionContext({
        commands: new Map(),
        debug: coreDebug,
        state: {
          rawArgv: [],
          initialTerminalWidth: yargs().terminalWidth(),
          showHelpOnFail: true,
          firstPassArgv: undefined,
          deepestParseResult: undefined,
          isGracefullyExiting: false,
          didAlreadyHandleError: false,
          isHandlingHelpOption: false,
          isHandlingVersionOption: false,
          didOutputHelpOrVersionText: false,
          finalError: undefined,
          globalHelpOption: {
            name: defaultHelpOptionName,
            description: defaultHelpTextDescription
          },
          globalVersionOption: {
            name: defaultVersionOptionName,
            description: defaultVersionTextDescription,
            text: ''
          }
        }
      })
    );

    confDebug('exited configureExecutionContext');
    confDebug('configured execution context: %O', asEnumerable(context));

    assert(context, BfErrorMessage.InvalidConfigureExecutionContextReturnType());

    assert(
      context.state.globalHelpOption === undefined ||
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        context.state.globalHelpOption.name?.length,
      BfErrorMessage.InvalidExecutionContextBadField('state.globalHelpOption')
    );

    assert(
      context.state.globalVersionOption === undefined ||
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        context.state.globalVersionOption.name?.length,
      BfErrorMessage.InvalidExecutionContextBadField('state.globalVersionOption')
    );

    confDebug.message(
      'to save space, ExecutionContext will be unenumerable from this point on'
    );

    await discoverCommands(commandModulePath, context);

    const { programs: rootPrograms } = getRootCommand();

    confDebug('entering configureExecutionPrologue');

    await finalConfigurationHooks.configureExecutionPrologue(rootPrograms, context);

    confDebug('exited configureExecutionPrologue');
    confDebug('finalizing deferred command registrations');

    context.commands.forEach((command, fullName) => {
      confDebug(
        'calling HelperProgram::command_finalize_deferred for command %O',
        fullName
      );
      command.programs.helper.command_finalize_deferred();
    });

    confDebug('configureProgram invocation succeeded');

    let alreadyInvoked = false;
    const parseAndExecuteWithErrorHandling: Executor = async (argv_) => {
      confDebug('execute was invoked');

      // * The documentation and issues literature is ambivalent on what level
      // * of support exists for calling yargs::parse multiple times, but our
      // * unit tests don't lie. It doesn't work. So let's formalize this
      // * invariant.
      // *
      // * Since this error is thrown outside the primary try/catch block, this
      // * assertion failure cannot be handled by
      // * configureErrorHandlingEpilogue.
      if (alreadyInvoked) {
        throw new AssertionFailedError(BfErrorMessage.CannotExecuteMultipleTimes());
      }

      alreadyInvoked = true;

      try {
        confDebug('raw argv: %O', argv_);
        confDebug('entering configureArguments');

        const argv = await finalConfigurationHooks.configureArguments(
          argv_?.length ? argv_ : hideBin(process.argv),
          context
        );

        confDebug('exited configureArguments');

        assert(
          Array.isArray(argv),
          BfErrorMessage.InvalidConfigureArgumentsReturnType()
        );

        // * We track this so that the --help and --version flags are ignored if
        // * they occur after -- in the arguments array.
        const doubleDashIndex = argv.indexOf('--');
        const hasDoubleDash = doubleDashIndex !== -1;

        if (context.state.globalHelpOption) {
          const helpOption = context.state.globalHelpOption.name;
          const helpFlag = `${helpOption.length > 1 ? '--' : '-'}${helpOption}`;
          const helpFlagIndex = argv.indexOf(helpFlag);
          context.state.isHandlingHelpOption =
            helpFlagIndex !== -1 && (!hasDoubleDash || helpFlagIndex < doubleDashIndex);
        } else {
          confDebug.warn(
            'disabled built-in help option since context.state.globalHelpOption was falsy'
          );
        }

        confDebug(
          'context.state.isHandlingHelpOption determination: %O',
          context.state.isHandlingHelpOption
        );

        if (context.state.globalVersionOption) {
          const versionOption = context.state.globalVersionOption.name;
          const versionFlag = `${versionOption.length > 1 ? '--' : '-'}${versionOption}`;
          const versionFlagIndex = argv.indexOf(versionFlag);
          context.state.isHandlingVersionOption =
            versionFlagIndex !== -1 &&
            (!hasDoubleDash || versionFlagIndex < doubleDashIndex);
        } else {
          confDebug.warn(
            'disabled built-in version option since context.state.globalVersionOption was falsy'
          );
        }

        confDebug(
          'context.state.isHandlingVersionOption determination: %O',
          context.state.isHandlingVersionOption
        );

        confDebug('configured argv (initialRawArgv): %O', argv);

        context.state.rawArgv = argv;

        confDebug('calling ::parseAsync on root program');

        try {
          // * Note how we discard the result of RouterProgram::parseAsync
          await rootPrograms.router.parseAsync(argv, wrapExecutionContext(context));
        } catch (error_) {
          const error = context.state.finalError ?? error_;

          if (error !== error_) {
            confDebug.warn(
              'root router parse warning: context.state.finalError !== caught error (caught error was discarded)'
            );
          }

          if (isGracefulEarlyExitError(error)) {
            confDebug.message(
              'caught graceful early exit "error" in PreExecutionContext::execute'
            );

            context.state.isGracefullyExiting = true;

            confDebug.warn(
              'though runtime was gracefully interrupted, configureExecutionEpilogue will still be called and the program will exit normally'
            );
          } else {
            throw error;
          }
        }

        context.state.deepestParseResult ||= makeNullParseResult(context);
        const finalArgv = context.state.deepestParseResult;

        confDebug('final parsed argv: %O', finalArgv);
        confDebug(
          'context.state.isGracefullyExiting: %O',
          context.state.isGracefullyExiting
        );
        confDebug('entering configureExecutionEpilogue');

        const result = await finalConfigurationHooks.configureExecutionEpilogue(
          finalArgv,
          context
        );

        confDebug('exited configureExecutionEpilogue');
        confDebug('execution epilogue returned: %O', result);

        assert(
          isArguments(result),
          BfErrorMessage.InvalidConfigureExecutionEpilogueReturnType()
        );

        confDebug('final execution context: %O', asEnumerable(context));
        confDebug('execution complete (no errors)');
        confDebug.newline();

        return result;
      } catch (error) {
        confDebug.error('caught fatal error (type %O): %O', typeof error, error);

        context.state.deepestParseResult ||= makeNullParseResult(context);
        const finalArgv = context.state.deepestParseResult;

        confDebug('final parsed argv: %O', finalArgv);

        if (isGracefulEarlyExitError(error)) {
          confDebug.message(
            'caught (and released) graceful early exit "error" in catch block'
          );
        } else {
          assert(finalArgv[$executionContext], BfErrorMessage.GuruMeditation());

          let message = BfErrorMessage.Generic();
          let exitCode = FrameworkExitCode.DefaultError;
          const { isAssertionSystemError } = await import('universe:util.ts');

          if (typeof error === 'string') {
            message = error;
          } else if (isNativeError(error)) {
            message = error.message;
            exitCode = isAssertionSystemError(error)
              ? FrameworkExitCode.AssertionFailed
              : isCliError(error)
                ? error.suggestedExitCode
                : FrameworkExitCode.DefaultError;
          } else {
            message = String(error);
          }

          confDebug('theoretical error message: %O', message);
          confDebug('theoretical exit code: %O', exitCode);
          confDebug('entering configureErrorHandlingEpilogue');

          await finalConfigurationHooks.configureErrorHandlingEpilogue(
            { message, error, exitCode },
            finalArgv,
            context
          );

          confDebug('exited configureErrorHandlingEpilogue');
          confDebug('final execution context: %O', asEnumerable(context));

          if (!isCliError(error)) {
            confDebug('wrapping error with CliError');

            // eslint-disable-next-line no-ex-assign
            error = new CliError(isNativeError(error) ? error : message, {
              suggestedExitCode: exitCode
            });
          }
        }

        context.state.didAlreadyHandleError = true;

        confDebug.warn('forwarding error to top-level error handler');
        throw error;
      }
    };

    return {
      rootPrograms,
      execute: parseAndExecuteWithErrorHandling,
      executionContext: context,
      ...asEnumerable(context)
    };

    function getRootCommand() {
      const root = context.commands.get(context.commands.keys().next().value!);
      assert(root, BfErrorMessage.GuruMeditation());
      return root;
    }
  } catch (error) {
    if (isAssertionSystemError(error)) {
      throw new AssertionFailedError(error);
    }

    throw error;
  }
}

/**
 * A "high-order" factory function that returns a "low-order" {@link runProgram}
 * function that can be called multiple times while only having to provide a
 * subset of the required parameters.
 *
 * This is useful when unit/integration testing a CLI, which will likely require
 * multiple calls to `runProgram(...)`.
 *
 * **BE AWARE**: when an exception (e.g. bad CLI arguments) occurs in the
 * low-order function, `process.exitCode` is set to the appropriate value, the
 * {@link ConfigureErrorHandlingEpilogue} hook is triggered, and either
 * `NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
 * is returned. Otherwise, upon success, `Arguments` is returned.
 *
 * In other words: **the promise returned by the low-order function will never
 * reject and no exception will ever be thrown.** Keep this in mind when writing
 * unit tests and see {@link runProgram} for more details.
 *
 * Ideally, testing for the presence of errors should be done by capturing
 * output sent to `process.stderr` (e.g. `console.error`)—or by interrogating
 * whichever error handling method was implemented in
 * {@link ConfigureErrorHandlingEpilogue}—since that is what end-users will see
 * and experience. That said, if it would be more optimal to test against an
 * actual thrown error, set `makeRunner`'s `errorHandlingBehavior` option to
 * `'throw'`.
 */
export function makeRunner<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  options: {
    /**
     * @see {@link runProgram}
     */
    commandModulePath: string;
    /**
     * This is a special option exclusive to `makeRunner` that determines how
     * errors will be surfaced, which can be useful during testing.
     *
     * In production and during testing, Black Flag surfaces errors via
     * `process.stderr` (e.g. `console.error`), or whichever error handling
     * method was implemented in {@link ConfigureErrorHandlingEpilogue}. This is
     * the default behavior, and is what end-users will see and experience.
     *
     * However, by setting this option to `'throw'` instead of `'default'`,
     * exceptions that would normally cause {@link runProgram} to return
     * `undefined` (including framework errors) or `NullArguments` (such as
     * `GracefulEarlyExitError`) will instead be thrown after they are handled
     * by Black Flag.
     *
     * **Asserting expectations against how the CLI will actually behave in
     * production, which is what end-users will actually experience, should be
     * preferred over testing against an artificially surfaced error**. However,
     * surfacing errors in test cases that are failing unexpectedly can be
     * crucial when debugging. Discretion is advised.
     *
     * @default 'default'
     */
    errorHandlingBehavior?: 'default' | 'throw';
  } & (
    | {
        /**
         * The {@link ConfigurationHooks} to be used by each low-order
         * invocation by default. Each low-order function can provide its own
         * {@link ConfigurationHooks} argument, which will be merged on top of
         * this option. A low-order function supplying a
         * {@link PreExecutionContext} argument instead will completely override
         * this option.
         *
         * Note: this option cannot be used with `preExecutionContext`.
         *
         * @see {@link runProgram}
         */
        configurationHooks?: Promisable<ConfigurationHooks>;
        preExecutionContext?: undefined;
      }
    | {
        /**
         * The {@link PreExecutionContext} to be used by each low-order
         * invocation. Each low-order function can provide its own
         * {@link PreExecutionContext} or {@link ConfigurationHooks} argument,
         * both of which which will completely override this option.
         *
         * Note: this option cannot be used with `configurationHooks`.
         *
         * @see {@link runProgram}
         */
        preExecutionContext?: Promisable<PreExecutionContext>;
        configurationHooks?: undefined;
      }
  )
): (...args: FactoriedRunProgramParameters) => RunProgramReturnType<CustomCliArguments> {
  const makerDebug = coreDebug.extend('makeRunner');
  makerDebug('returning curried runProgram function');

  return async function run(...args) {
    const runDebug = coreDebug.extend('runProgram@');

    runDebug('runProgram wrapper (curried) was invoked');
    runDebug('options: %O', options);

    const {
      commandModulePath,
      configurationHooks: highConfigurationHooks,
      preExecutionContext: highPreExecutionContext,
      errorHandlingBehavior = 'default'
    } = options;

    assert(
      // ? TypeScript (understandably) acting beyond its knowledge here...
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      highConfigurationHooks === undefined || highPreExecutionContext === undefined,
      BfErrorMessage.BadParameterCombination()
    );

    const lowParameters: RunProgramParameters = [commandModulePath, ...args];

    const derivedLowParameters = await deriveRunProgramParametersFromArgs(
      lowParameters,
      {
        // ? If we're passed a rejected Promise as an argument/option, it will
        // ? not cause any problems yet...
        awaitPromisedParameters: false
      }
    );

    const { argv: lowArgv, hooksOrContext: lowHooksOrContext } = derivedLowParameters;

    if (!lowHooksOrContext) {
      // * The call sig is missing a ConfigurationHooks/PreExecutionContext
      // * instance. Let's append the one from on high.
      (lowParameters as unknown[]).push(
        highConfigurationHooks || highPreExecutionContext || {}
      );
    } else if (highConfigurationHooks || highPreExecutionContext) {
      // * The call sig already ends with a ConfigurationHooks or
      // * PreExecutionContext instance. Let's augment/replace it.
      (lowParameters as unknown[])[lowParameters.length - 1] = Promise.resolve(
        lowHooksOrContext
      ).then(async (lowLastArg) => {
        if (!isPreExecutionContext(lowLastArg) && highConfigurationHooks) {
          // * High-order hooks are merged with their low-order counterparts
          // * with the low-order hooks taking precedence.
          return {
            ...(await highConfigurationHooks),
            ...lowLastArg
          };
        }

        // * The low-order parameter completely replaces the high-order one.
        return lowLastArg;
      });
    }

    runDebug(
      'invoking low-order runner with the following arguments: %O',
      lowParameters
    );

    if (errorHandlingBehavior === 'throw') {
      // ? The final element of lowParameters might be a Promise, and it might
      // ? be a rejected promise if we were passed a rejected high order arg.
      // ? We need to account for this like we did for derivedLowParameters.
      const lastLowParameter = lowParameters.at(-1);
      assert(lastLowParameter, BfErrorMessage.GuruMeditation());

      const hooksOrContext = (await runBadProgramIfPromiseRejects(
        lastLowParameter,
        lowParameters
      )) as ConfigurationHooks | PreExecutionContext;

      const preExecutionContext = isPreExecutionContext(hooksOrContext)
        ? hooksOrContext
        : await runBadProgramIfPromiseRejects(
            configureProgram(commandModulePath, hooksOrContext),
            lowParameters
          );

      const promisedResult = lowArgv
        ? runProgram<CustomCliArguments>(commandModulePath, lowArgv, preExecutionContext)
        : runProgram<CustomCliArguments>(commandModulePath, preExecutionContext);

      const result = await promisedResult;

      if (preExecutionContext.state.finalError !== undefined) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw preExecutionContext.state.finalError;
      }

      return result;
    } else {
      return runProgram<CustomCliArguments>(...lowParameters);
    }
  };
}

/**
 * Invokes the dynamically imported
 * `configureProgram(commandModulePath).execute()` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an exception occurs,
 * `process.exitCode` is set to the appropriate value, the
 * {@link ConfigureErrorHandlingEpilogue} hook is triggered, and either
 * `NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
 * is returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other exception occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(...args: [commandModulePath: string]): RunProgramReturnType<CustomCliArguments>;
/**
 * Invokes the dynamically imported `configureProgram(commandModulePath,
 * configurationHooks).execute()` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an exception occurs,
 * `process.exitCode` is set to the appropriate value, the
 * {@link ConfigureErrorHandlingEpilogue} hook is triggered, and either
 * `NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
 * is returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other exception occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    configurationHooks: Promisable<ConfigurationHooks>
  ]
): RunProgramReturnType<CustomCliArguments>;
/**
 * Invokes the `preExecutionContext.execute()` function.
 *
 * **WARNING: reusing the same `preExecutionContext` with multiple invocations
 * of `runProgram` will cause successive invocations to fail.** This is because
 * yargs does not support calling `yargs::parseAsync` more than once. If this is
 * unacceptable, do not pass `runProgram` a `preExecutionContext` property.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an exception occurs,
 * `process.exitCode` is set to the appropriate value, the
 * {@link ConfigureErrorHandlingEpilogue} hook is triggered, and either
 * `NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
 * is returned.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other exception occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    preExecutionContext: Promisable<PreExecutionContext>
  ]
): RunProgramReturnType<CustomCliArguments>;
/**
 * Invokes the dynamically imported
 * `configureProgram(commandModulePath).execute(argv)` function. If `argv` is a
 * string, `argv = argv.split(' ')` is applied first.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an exception occurs,
 * `process.exitCode` is set to the appropriate value, the
 * {@link ConfigureErrorHandlingEpilogue} hook is triggered, and either
 * `NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
 * is returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other exception occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [commandModulePath: string, argv: string | string[]]
): RunProgramReturnType<CustomCliArguments>;
/**
 * Invokes the dynamically imported `configureProgram(commandModulePath,
 * configurationHooks).execute(argv)` function. If `argv` is a string, `argv =
 * argv.split(' ')` is applied first.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an exception occurs,
 * `process.exitCode` is set to the appropriate value, the
 * {@link ConfigureErrorHandlingEpilogue} hook is triggered, and either
 * `NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
 * is returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other exception occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    argv: string | string[],
    configurationHooks: Promisable<ConfigurationHooks>
  ]
): RunProgramReturnType<CustomCliArguments>;
/**
 * Invokes the `preExecutionContext.execute(argv)` function. If `argv` is a
 * string, `argv = argv.split(' ')` is applied first.
 *
 * **WARNING: reusing the same `preExecutionContext` with multiple invocations
 * of `runProgram` will cause successive invocations to fail.** This is because
 * yargs does not support calling `yargs::parseAsync` more than once. If this is
 * unacceptable, do not pass `runProgram` a `preExecutionContext` property.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an exception occurs,
 * `process.exitCode` is set to the appropriate value, the
 * {@link ConfigureErrorHandlingEpilogue} hook is triggered, and either
 * `NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
 * is returned.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other exception occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    argv: string | string[],
    preExecutionContext: Promisable<PreExecutionContext>
  ]
): RunProgramReturnType<CustomCliArguments>;
/**
 * Run the given program with the given configuration.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an exception occurs,
 * `process.exitCode` is set to the appropriate value, the
 * {@link ConfigureErrorHandlingEpilogue} hook is triggered, and either
 * `NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
 * is returned.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other exception occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(...args: RunProgramParameters): RunProgramReturnType<CustomCliArguments>;
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(...args: RunProgramParameters): RunProgramReturnType<CustomCliArguments> {
  const runDebug = coreDebug.extend('runProgram');
  runDebug('runProgram was invoked');

  let parameters:
    | Awaited<DeriveRunProgramParametersFromArgsReturnType<true>>
    | undefined = undefined;

  try {
    parameters = await deriveRunProgramParametersFromArgs(args);
    const { argv, commandModulePath, configurationHooks } = parameters;

    runDebug(
      parameters.preExecutionContext
        ? 'using provided preExecutionContext'
        : 'invoking configureProgram'
    );

    parameters.preExecutionContext ||= await configureProgram(
      commandModulePath,
      configurationHooks
    );

    const { preExecutionContext } = parameters;

    runDebug('invoking preExecutionContext.execute');

    const executeArguments = Array.isArray(argv)
      ? argv
      : typeof argv === 'string'
        ? argv.split(' ')
        : undefined;

    const parsedArgv = (await preExecutionContext.execute(
      executeArguments
    )) as Arguments<CustomCliArguments>;

    process.exitCode = FrameworkExitCode.Ok;

    runDebug('exit code set to %O', process.exitCode);
    runDebug('runProgram invocation succeeded');
    return parsedArgv;
  } catch (error) {
    const { preExecutionContext } = parameters || {};

    runDebug.error(
      `handling irrecoverable exception from ${
        preExecutionContext ? '::execute' : '::configureProgram'
      }: %O`,
      error
    );

    // * Note that framework errors are always considered assertion failures
    process.exitCode = isCliError(error)
      ? error.suggestedExitCode
      : /* istanbul ignore next */
        isAssertionSystemError(error)
        ? FrameworkExitCode.AssertionFailed
        : FrameworkExitCode.DefaultError;

    runDebug('exit code (tentatively) set to %O', process.exitCode);

    if (preExecutionContext) {
      preExecutionContext.state.finalError = error;

      runDebug(
        'preExecutionContext.state.finalError set to %O',
        preExecutionContext.state.finalError
      );
    }

    if (isGracefulEarlyExitError(error)) {
      runDebug.message(
        'the exception resulted in a graceful exit (maybe with parse result)'
      );

      return preExecutionContext?.state.deepestParseResult as
        | Arguments<CustomCliArguments>
        | undefined;
    }

    if (!preExecutionContext?.state.didAlreadyHandleError) {
      process.exitCode = FrameworkExitCode.AssertionFailed;
      runDebug.message('exit code set to %O', process.exitCode);
      // eslint-disable-next-line no-console
      console.error(BfErrorMessage.FrameworkError(error));
    }

    runDebug('runProgram invocation "succeeded" (via error handler)');

    if (isCliError(error) && error.dangerouslyFatal) {
      runDebug.warn(
        'error has dangerouslyFatal flag enabled; process.exit will be called'
      );
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit();
    }

    return undefined;
  }
}

/**
 * Creates a `NullArguments` instance.
 */
function makeNullParseResult(context: ExecutionContext): NullArguments {
  coreDebug.warn('generated a NullArguments parse result');
  return {
    $0: nullArguments$0,
    _: [],
    [$executionContext]: context
  };
}

/**
 * Takes an object and rewrites its property descriptors so that its properties
 * are no longer enumerable. This leads to less needlessly-verbose object logs
 * in debug output.
 */
function asUnenumerable<T extends object | undefined>(context: T): T {
  if (!context) {
    return context;
  }

  const unenumerableContext = {} as T;
  const allOwnKeys = (Object.getOwnPropertyNames(context) as (string | symbol)[]).concat(
    ...Object.getOwnPropertySymbols(context)
  );

  for (const key of allOwnKeys) {
    Object.defineProperty(unenumerableContext, key, {
      enumerable: false,
      configurable: true,
      // @ts-expect-error: TypeScript isn't smart enough to figure this out yet
      value: context[key],
      writable: true
    });
  }

  return unenumerableContext;
}

/**
 * Takes an object and rewrites its property descriptors so that its properties
 * are guaranteed enumerable. This is used when we actually do want to show
 * verbose object logs in debug output.
 */
function asEnumerable<T extends object | undefined>(context: T): T {
  if (!context) {
    return context;
  }

  const enumerable = {} as T;
  const allOwnKeys = (Object.getOwnPropertyNames(context) as (string | symbol)[]).concat(
    ...Object.getOwnPropertySymbols(context)
  );

  for (const key of allOwnKeys) {
    Object.defineProperty(enumerable, key, {
      enumerable: true,
      configurable: true,
      // @ts-expect-error: TypeScript isn't smart enough to figure this out yet
      value: context[key],
      writable: true
    });
  }

  return enumerable;
}

async function defaultErrorHandlingEpilogueConfigurationHook(
  ...[
    { error },
    _,
    {
      state: { didOutputHelpOrVersionText }
    }
  ]: Parameters<ConfigureErrorHandlingEpilogue>
) {
  if (didOutputHelpOrVersionText) {
    /* istanbul ignore next */
    if (!isCommandNotImplementedError(error)) {
      // eslint-disable-next-line no-console
      console.error();
      outputErrorMessage();
    }
  } else {
    outputErrorMessage();
  }

  function outputErrorMessage() {
    const deepestError = getDeepestErrorCause(error);
    // eslint-disable-next-line no-console
    console.error(
      error === deepestError && isCliError(deepestError)
        ? // ? Messages coming from yargs are typically already capitalized, but
          // ? not always, and not all "cli" messages come directly from yargs
          capitalize(deepestError.message)
        : // ? If this message is probably coming from somewhere deeper than
          // ? Black Flag, such as end-dev code, output the entire stack trace
          deepestError
    );
  }
}

function noopConfigurationHook() {
  //
}

type DeriveRunProgramParametersFromArgsReturnType<Await extends boolean> = Promise<
  [
    {
      commandModulePath: string;
      argv: string | string[] | undefined;
      configurationHooks: ConfigurationHooks | undefined;
      preExecutionContext: PreExecutionContext | undefined;
    }
  ] extends [infer T]
    ? Await extends true
      ?
          | Merge<T, { configurationHooks: undefined }>
          | Merge<T, { preExecutionContext: undefined }>
      : Omit<T, 'configurationHooks' | 'preExecutionContext'> & {
          hooksOrContext:
            | Promisable<PreExecutionContext | ConfigurationHooks>
            | undefined;
        }
    : never
>;

async function deriveRunProgramParametersFromArgs(
  args: RunProgramParameters,
  options?: { awaitPromisedParameters?: true }
): DeriveRunProgramParametersFromArgsReturnType<true>;
async function deriveRunProgramParametersFromArgs(
  args: RunProgramParameters,
  options?: { awaitPromisedParameters?: false }
): DeriveRunProgramParametersFromArgsReturnType<false>;
async function deriveRunProgramParametersFromArgs(
  args: RunProgramParameters,
  { awaitPromisedParameters = true }: { awaitPromisedParameters?: boolean } = {}
): DeriveRunProgramParametersFromArgsReturnType<boolean> {
  const result: Awaited<DeriveRunProgramParametersFromArgsReturnType<true>> &
    Awaited<DeriveRunProgramParametersFromArgsReturnType<false>> = {
    commandModulePath: args[0],
    argv: undefined,
    configurationHooks: undefined,
    preExecutionContext: undefined,
    hooksOrContext: undefined
  };

  if (typeof args[1] === 'string' || Array.isArray(args[1])) {
    // * Must be call sig 4, 5, or 6
    result.argv = args[1];

    if (args[2]) {
      // * Must be call sig 5 or 6
      if (awaitPromisedParameters) {
        const argument2 = await args[2];
        if (isPreExecutionContext(argument2)) {
          // * Must be call sig 6
          result.preExecutionContext = argument2;
        } else {
          // * Must be call sig 5
          result.configurationHooks = argument2;
        }
      } else {
        result.hooksOrContext = args[2];
      }
    }
  } else if (args[1]) {
    // * Must be call sig 2 or 3
    if (awaitPromisedParameters) {
      const argument1 = await args[1];
      if (isPreExecutionContext(argument1)) {
        // * Must be call sig 3
        result.preExecutionContext = argument1;
      } else {
        // * Must be call sig 2
        result.configurationHooks = argument1;
      }
    } else {
      result.hooksOrContext = args[1];
    }
  } // * else, must be call sig 1

  return result;
}

/**
 * Maybe one of the promises we've been given is misbehaving. If so, we'll let
 * the low-order runner throw it for us. And if that doesn't deal with it, then
 * we'll rethrow the error ourselves after. This gives Black Flag a chance to
 * handle it (which is especially useful for early errors) and ensures
 * {@link makeRunner}'s low-order function behavior is consistent with
 * {@link runProgram}'s when `errorHandlingBehavior` is set to `'throw'`.
 *
 * In summary, this function ensures a pleasant testing experience :)
 */
async function runBadProgramIfPromiseRejects<T>(
  maybePromise: Promisable<T>,
  lowParameters: RunProgramParameters
): Promise<T> {
  try {
    return await maybePromise;
  } catch (error) {
    // ? Hopefully this invocation of runProgram throws for us, but if it
    // ? doesn't, we'll just re-throw the caught error ourselves.
    await runProgram(...lowParameters);
    throw error;
  }
}
