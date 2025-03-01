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

import type { Promisable } from 'type-fest';

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
 * Create and return a {@link PreExecutionContext} containing fully-configured
 * {@link Program} instances and an {@link Executor} entry point function.
 *
 * Command auto-discovery will occur at `commandModulePath`. An exception will
 * occur if no commands are loadable from the given `commandModulePath`.
 *
 * **This function throws whenever an exception occurs**, making it not ideal as
 * an entry point for a CLI. See {@link runProgram} for a wrapper function that
 * handles exceptions and sets the exit code for you.
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
          const error = context.state.finalError || error_;

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
 * A high-order factory function that returns a "low-order" {@link runProgram}
 * function that can be called multiple times while only having to provide a
 * subset of the required parameters at initialization.
 *
 * This is useful when unit/integration testing your CLI, which will likely
 * require multiple calls to `runProgram(...)`.
 *
 * Note: when an exception (e.g. bad arguments) occurs in the low-order
 * function, `undefined` will be returned if `configureProgram` threw or
 * `NullArguments` if `execute` threw. Otherwise, upon success, `Arguments` is
 * returned as expected. That is: **the promise returned by the low-order
 * function will never reject and no exception will ever be thrown.** Keep this
 * in mind when writing your unit tests and see {@link runProgram} for more
 * details.
 */
export function makeRunner<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  options: {
    /**
     * @see {@link runProgram}
     */
    commandModulePath: string;
  } & (
    | {
        /**
         * Note: cannot be used with `preExecutionContext`.
         *
         * @see {@link runProgram}
         */
        configurationHooks?: Promisable<ConfigurationHooks>;
        preExecutionContext?: undefined;
      }
    | {
        /**
         * Note: cannot be used with `configurationHooks`.
         *
         * @see {@link runProgram}
         */
        preExecutionContext?: Promisable<PreExecutionContext>;
        configurationHooks?: undefined;
      }
  )
) {
  const makerDebug = coreDebug.extend('makeRunner');
  makerDebug('returning curried runProgram function');

  return (
    ...args:
      | [commandModulePath: string]
      | [commandModulePath: string, configurationHooks: Promisable<ConfigurationHooks>]
      | [commandModulePath: string, preExecutionContext: Promisable<PreExecutionContext>]
      | [commandModulePath: string, argv: string | string[]]
      | [
          commandModulePath: string,
          argv: string | string[],
          configurationHooks: Promisable<ConfigurationHooks>
        ]
      | [
          commandModulePath: string,
          argv: string | string[],
          preExecutionContext: Promisable<PreExecutionContext>
        ] extends [infer _, ...infer Tail]
      ? Tail
      : []
  ) => {
    const runDebug = coreDebug.extend('runProgram@');
    runDebug('runProgram wrapper (curried) was invoked');

    const { commandModulePath, configurationHooks, preExecutionContext } = options as {
      [P in keyof typeof options]: NonNullable<(typeof options)[P]>;
    };

    const parameters: unknown[] = [commandModulePath, ...args];
    const hasAdditionalConfig = !!(configurationHooks || preExecutionContext);

    if (hasAdditionalConfig) {
      assert(
        !!configurationHooks !== !!preExecutionContext,
        BfErrorMessage.BadParameterCombination()
      );

      const isCallSig1 = args.length === 0;
      const isCallSig4 =
        args.length === 1 && (typeof args[0] === 'string' || Array.isArray(args[0]));

      if (isCallSig1 || isCallSig4) {
        // ? When not provided, configurationHooks / PreExecutionContext are
        // ? used by default with respect to call signature.
        parameters.push(configurationHooks || preExecutionContext);
      } else {
        // ? Otherwise, the call sig ends with a ConfigurationHooks or
        // ? PreExecutionContext instance.
        parameters[parameters.length - 1] = Promise.resolve(
          args.at(-1) as Exclude<(typeof args)[0], string | string[]>
        ).then(async (lastArgument) => {
          if (configurationHooks && !isPreExecutionContext(lastArgument)) {
            const highOrderConfigurationHooks =
              await Promise.resolve(configurationHooks);
            const lowOrderConfigurationHooks = lastArgument;

            // ? Custom config hooks at the runProgram level are merged with
            // ? configurationHooks from the makeRunner level. Since either of
            // ? these could be promises, we must act accordingly.
            return {
              ...highOrderConfigurationHooks,
              ...lowOrderConfigurationHooks
            };
          }

          return lastArgument;
        });
      }
    }

    runDebug('calling runProgram with the following arguments: %O', parameters);

    return runProgram<CustomCliArguments>(
      ...(parameters as Parameters<typeof runProgram<CustomCliArguments>>)
    );
  };
}

/**
 * Invokes the dynamically imported
 * `configureProgram(commandModulePath).execute()` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and either `NullArguments`
 * (only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other error occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [commandModulePath: string]
): Promise<NullArguments | Arguments<CustomCliArguments> | undefined>;
/**
 * Invokes the dynamically imported `configureProgram(commandModulePath,
 * configurationHooks).execute()` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and either `NullArguments`
 * (only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other error occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    configurationHooks: Promisable<ConfigurationHooks>
  ]
): Promise<NullArguments | Arguments<CustomCliArguments> | undefined>;
/**
 * Invokes the `preExecutionContext.execute()` function.
 *
 * **WARNING: reusing the same `preExecutionContext` with multiple invocations
 * of `runProgram` will cause successive invocations to fail.** This is because
 * yargs does not support calling `yargs::parseAsync` more than once. If this is
 * unacceptable, do not pass `runProgram` a `preExecutionContext` property.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and either `NullArguments`
 * (only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other error occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    preExecutionContext: Promisable<PreExecutionContext>
  ]
): Promise<NullArguments | Arguments<CustomCliArguments> | undefined>;
/**
 * Invokes the dynamically imported
 * `configureProgram(commandModulePath).execute(argv)` function. If `argv` is a
 * string, `argv = argv.split(' ')` is applied first.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and either `NullArguments`
 * (only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other error occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [commandModulePath: string, argv: string | string[]]
): Promise<NullArguments | Arguments<CustomCliArguments>>;
/**
 * Invokes the dynamically imported `configureProgram(commandModulePath,
 * configurationHooks).execute(argv)` function. If `argv` is a string, `argv =
 * argv.split(' ')` is applied first.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and either `NullArguments`
 * (only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other error occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    argv: string | string[],
    configurationHooks: Promisable<ConfigurationHooks>
  ]
): Promise<NullArguments | Arguments<CustomCliArguments>>;
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
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and either `NullArguments`
 * (only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.
 *
 * @returns `NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
 * if any other error occurs, or `Arguments` otherwise.
 */
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    argv: string | string[],
    preExecutionContext: Promisable<PreExecutionContext>
  ]
): Promise<NullArguments | Arguments<CustomCliArguments>>;
export async function runProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args:
    | [commandModulePath: string]
    | [commandModulePath: string, configurationHooks: Promisable<ConfigurationHooks>]
    | [commandModulePath: string, preExecutionContext: Promisable<PreExecutionContext>]
    | [commandModulePath: string, argv: string | string[]]
    | [
        commandModulePath: string,
        argv: string | string[],
        configurationHooks: Promisable<ConfigurationHooks>
      ]
    | [
        commandModulePath: string,
        argv: string | string[],
        preExecutionContext: Promisable<PreExecutionContext>
      ]
): Promise<NullArguments | Arguments<CustomCliArguments> | undefined> {
  const runDebug = coreDebug.extend('runProgram');
  runDebug('runProgram was invoked');

  const commandModulePath = args[0];
  let argv: string | string[] | undefined = undefined;
  let configurationHooks: ConfigurationHooks | undefined = undefined;
  let preExecutionContext: PreExecutionContext | undefined = undefined;
  let successfullyHandledErrorViaConfigurationHook = false as boolean;

  try {
    if (typeof args[1] === 'string' || Array.isArray(args[1])) {
      // * Must be call sig 4, 5, or 6
      argv = args[1];

      if (args[2]) {
        // * Must be call sig 5 or 6
        const argument2 = await args[2];
        if (isPreExecutionContext(argument2)) {
          // * Must be call sig 6
          preExecutionContext = argument2;
        } else {
          // * Must be call sig 5
          configurationHooks = argument2;
        }
      }
    } else if (args[1]) {
      // * Must be call sig 2 or 3
      const argument1 = await args[1];
      if (isPreExecutionContext(argument1)) {
        // * Must be call sig 3
        preExecutionContext = argument1;
      } else {
        // * Must be call sig 2
        configurationHooks = argument1;
      }
    } // * else, must be call sig 1

    assert(
      !preExecutionContext || !!configurationHooks !== !!preExecutionContext,
      BfErrorMessage.GuruMeditation()
    );

    runDebug(
      preExecutionContext
        ? 'using provided preExecutionContext'
        : 'invoking configureProgram'
    );

    preExecutionContext ||= await configureProgram(
      commandModulePath,
      Promise.resolve(configurationHooks).then((givenHooks) => {
        return {
          ...givenHooks,
          configureErrorHandlingEpilogue(...args) {
            successfullyHandledErrorViaConfigurationHook = true;
            return (
              givenHooks?.configureErrorHandlingEpilogue ||
              defaultErrorHandlingEpilogueConfigurationHook
            )(...args);
          }
        };
      })
    );

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

    runDebug('runProgram invocation succeeded');
    return parsedArgv;
  } catch (error) {
    runDebug.error(
      `handling irrecoverable exception from ${
        preExecutionContext ? '::execute' : '::configureProgram'
      }: %O`,
      error
    );

    process.exitCode = isCliError(error)
      ? error.suggestedExitCode
      : /* istanbul ignore next */
        isAssertionSystemError(error)
        ? FrameworkExitCode.AssertionFailed
        : FrameworkExitCode.DefaultError;

    runDebug.error('exit code set to %O', process.exitCode);

    if (isGracefulEarlyExitError(error)) {
      runDebug.message(
        'the exception resulted in a graceful exit (maybe with parse result)'
      );

      return preExecutionContext?.state.deepestParseResult as
        | Arguments<CustomCliArguments>
        | undefined;
    }

    if (!successfullyHandledErrorViaConfigurationHook) {
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
        : // ? If this message is coming from somewhere deeper than Black Flag,
          // ? such as the end-dev's code, output the entire error + stack trace
          deepestError
    );
  }
}

function noopConfigurationHook() {
  //
}
