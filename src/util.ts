import assert from 'node:assert';
import { isNativeError } from 'node:util/types';

import { $executionContext, FrameworkExitCode } from 'universe/constant';
import { getRootDebugLogger } from 'universe/debug';

import {
  configureProgram,
  defaultErrorHandlingEpilogueConfigurationHook
} from 'universe/index';

import {
  AssertionFailedError,
  ErrorMessage,
  isCliError,
  isGracefulEarlyExitError
} from 'universe/error';

import type { Promisable } from 'type-fest';

import type { ConfigurationHooks } from 'types/configure';

import type {
  Arguments,
  ExecutionContext,
  NullArguments,
  PreExecutionContext
} from 'types/program';

const debug = getRootDebugLogger().extend('util');

// * Lots of repeated un-DRY-ed types in this file. Why? Because typedoc gets
// * mad if we don't.

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
  debug.extend('makeRunner')('returning curried runProgram function');

  return <
    T extends
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
  >(
    ...args: T extends [infer _, ...infer Tail] ? Tail : []
  ) => {
    const debug_ = debug.extend('runProgram@');
    debug_('runProgram wrapper (curried) was invoked');

    const { commandModulePath, configurationHooks, preExecutionContext } = options as {
      [P in keyof typeof options]: NonNullable<(typeof options)[P]>;
    };

    const parameters: unknown[] = [commandModulePath, ...args];
    const hasAdditionalConfig = !!(configurationHooks || preExecutionContext);

    if (hasAdditionalConfig) {
      if (!!configurationHooks === !!preExecutionContext) {
        throw new AssertionFailedError(
          ErrorMessage.AssertionFailureBadParameterCombination()
        );
      }

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
            const highOrderConfigurationHooks = await Promise.resolve(configurationHooks);
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

    debug_('calling runProgram with the following arguments: %O', parameters);

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  ...args: [commandModulePath: string, configurationHooks: Promisable<ConfigurationHooks>]
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const debug_ = debug.extend('runProgram');
  debug_('runProgram was invoked');

  const commandModulePath = args[0];
  let argv: string | string[] | undefined = undefined;
  let configurationHooks: ConfigurationHooks | undefined = undefined;
  let preExecutionContext: PreExecutionContext | undefined = undefined;
  let successfullyHandledErrorViaConfigurationHook = false;
  let alreadyDidErrorHandling = false;

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
      ErrorMessage.GuruMeditation()
    );

    debug_(
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

    debug_('invoking preExecutionContext.execute');

    const executeArguments = Array.isArray(argv)
      ? argv
      : typeof argv === 'string'
        ? argv.split(' ')
        : undefined;

    const parsedArgv = (await preExecutionContext.execute(
      executeArguments
    )) as Arguments<CustomCliArguments>;

    process.exitCode = FrameworkExitCode.Ok;

    debug_('runProgram invocation succeeded');
    return parsedArgv;
  } catch (error) {
    if (alreadyDidErrorHandling) {
      debug_.warn(
        `discarding exception from ${
          preExecutionContext ? '::execute' : '::configureProgram'
        } because error handling already happened: %O`,
        error
      );

      debug_.message(
        'note that seeing the above message may be a code smell. Check the documentation on CliError::dangerouslyFatal for more information'
      );
    }

    alreadyDidErrorHandling = true;

    debug_.error(
      `handling irrecoverable exception from ${
        preExecutionContext ? '::execute' : '::configureProgram'
      }: %O`,
      error
    );

    process.exitCode = isCliError(error)
      ? error.suggestedExitCode
      : isAssertionSystemError(error)
        ? FrameworkExitCode.AssertionFailed
        : FrameworkExitCode.DefaultError;

    debug_.error('exit code set to %O', process.exitCode);

    if (isGracefulEarlyExitError(error)) {
      debug_.message(
        'the exception resulted in a graceful exit (maybe with parse result)'
      );

      return preExecutionContext?.state.deepestParseResult as
        | Arguments<CustomCliArguments>
        | undefined;
    }

    if (!successfullyHandledErrorViaConfigurationHook) {
      // eslint-disable-next-line no-console
      console.error(ErrorMessage.FrameworkError(error));
    }

    debug_('runProgram invocation "succeeded" (via error handler)');

    if (isCliError(error) && error.dangerouslyFatal) {
      debug_.warn('error has dangerouslyFatal flag enabled; process.exit will be called');
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit();
    }

    return undefined;
  }
}

/**
 * Type-guard for {@link PreExecutionContext}.
 */
export function isPreExecutionContext(obj: unknown): obj is PreExecutionContext {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'execute' in obj &&
    'rootPrograms' in obj &&
    'executionContext' in obj
  );
}

/**
 * Type-guard for {@link NullArguments}.
 */
export function isNullArguments(obj: unknown): obj is NullArguments {
  return (
    isArguments(obj) &&
    obj.$0 === '<NullArguments: no parse result available due to exception>' &&
    obj._.length === 0
  );
}

/**
 * Type-guard for {@link Arguments}.
 */
export function isArguments(obj: unknown): obj is Arguments {
  return (
    !!obj &&
    typeof obj === 'object' &&
    '$0' in obj &&
    typeof obj.$0 === 'string' &&
    '_' in obj &&
    Array.isArray(obj._)
  );
}

/**
 * Type-guard for Node's "ERR_ASSERTION" so-called `SystemError`.
 */
export function isAssertionSystemError(error: unknown): error is NodeJS.ErrnoException & {
  generatedMessage: boolean;
  code: 'ERR_ASSERTION';
  actual?: unknown;
  expected?: unknown;
  operator: string;
} {
  return (
    isNativeError(error) &&
    'code' in error &&
    error.code === 'ERR_ASSERTION' &&
    'actual' in error &&
    'expected' in error &&
    'operator' in error
  );
}

/**
 * Creates an object with a "hidden" `[$executionContext]` property.
 *
 * @internal
 */
export function wrapExecutionContext(context: ExecutionContext) {
  return { [$executionContext]: context };
}

/**
 * Uppercase the first letter of a string.
 */
export function capitalize(str: string) {
  return (str.at(0)?.toUpperCase() || '') + str.slice(1);
}
