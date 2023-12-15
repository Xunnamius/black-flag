import assert from 'node:assert';

import { FrameworkExitCode } from 'universe/constant';
import { rootDebugLogger } from 'universe/index';

import {
  AssertionFailedError,
  ErrorMessage,
  isCliError,
  isGracefulEarlyExitError
} from 'universe/error';

import type { Promisable } from 'type-fest';
import type { ConfigurationHooks } from 'types/configure';

import type { Arguments, ExecutionContext, PreExecutionContext } from 'types/program';

const debug = rootDebugLogger.extend('util');

// * Lots of repeated un-DRY-ed types in this file. Why? Because typedoc gets
// * mad if we don't.

/**
 * A factory function that returns a {@link runProgram} function that can be
 * called multiple times while only having to provide a subset of the required
 * parameters at initialization.
 *
 * This is useful when unit/integration testing your CLI, which will likely
 * require multiple calls to `runProgram(...)`.
 *
 * Note: when an exception (e.g. bad arguments) occurs in the low-order
 * `runProgram` function, `undefined` will be returned unless you've configured
 * Black Flag to return something else. **The promise will not reject and no
 * exception will be thrown.** Keep this in mind when writing your unit tests.
 * See {@link runProgram} for more details on this.
 */
export function makeRunner<
  CustomContext extends ExecutionContext,
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
        configurationHooks?: Promisable<ConfigurationHooks<ExecutionContext>>;
        preExecutionContext?: undefined;
      }
    | {
        /**
         * Note: cannot be used with `configurationHooks`.
         *
         * @see {@link runProgram}
         */
        preExecutionContext?: Promisable<PreExecutionContext<ExecutionContext>>;
        configurationHooks?: undefined;
      }
  )
) {
  debug.extend('makeRunner')('returning curried runProgram function');

  return <
    T extends
      | [commandModulePath: string]
      | [
          commandModulePath: string,
          configurationHooks: Promisable<ConfigurationHooks<CustomContext>>
        ]
      | [
          commandModulePath: string,
          preExecutionContext: Promisable<PreExecutionContext<CustomContext>>
        ]
      | [commandModulePath: string, argv: string | string[]]
      | [
          commandModulePath: string,
          argv: string | string[],
          configurationHooks: Promisable<ConfigurationHooks<CustomContext>>
        ]
      | [
          commandModulePath: string,
          argv: string | string[],
          preExecutionContext: Promisable<PreExecutionContext<CustomContext>>
        ]
  >(
    ...args: T extends [infer _, ...infer Tail] ? Tail : []
  ) => {
    const debug_ = debug.extend('runProgram*');
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

    return runProgram<CustomContext, CustomCliArguments>(
      ...(parameters as Parameters<typeof runProgram<CustomContext, CustomCliArguments>>)
    );
  };
}

/**
 * Invokes the dynamically imported `configureProgram().execute()` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and `undefined` is
 * returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 */
export async function runProgram<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [commandModulePath: string]
): Promise<Arguments<CustomCliArguments> | undefined>;
/**
 * Invokes the dynamically imported
 * `configureProgram(configurationHooks).execute()` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and `undefined` is
 * returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 */
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    configurationHooks: Promisable<ConfigurationHooks<CustomContext>>
  ]
): Promise<Arguments<CustomCliArguments> | undefined>;
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
 * `process.exitCode` is set to the appropriate value and `undefined` is
 * returned.
 */
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    preExecutionContext: Promisable<PreExecutionContext<CustomContext>>
  ]
): Promise<Arguments<CustomCliArguments> | undefined>;
/**
 * Invokes the dynamically imported `configureProgram().execute(argv)` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and `undefined` is
 * returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 */
export async function runProgram<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [commandModulePath: string, argv: string | string[]]
): Promise<Arguments<CustomCliArguments>>;
/**
 * Invokes the dynamically imported
 * `configureProgram(configurationHooks).execute(argv)` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and `undefined` is
 * returned.
 *
 * Note: It is always safe to invoke this form of `runProgram` as many times as
 * desired.
 */
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    argv: string | string[],
    configurationHooks: Promisable<ConfigurationHooks<CustomContext>>
  ]
): Promise<Arguments<CustomCliArguments>>;
/**
 * Invokes the `preExecutionContext.execute(argv)` function.
 *
 * **WARNING: reusing the same `preExecutionContext` with multiple invocations
 * of `runProgram` will cause successive invocations to fail.** This is because
 * yargs does not support calling `yargs::parseAsync` more than once. If this is
 * unacceptable, do not pass `runProgram` a `preExecutionContext` property.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * or reject no matter what.** Instead, when an error is caught,
 * `process.exitCode` is set to the appropriate value and `undefined` is
 * returned.
 */
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args: [
    commandModulePath: string,
    argv: string | string[],
    preExecutionContext: Promisable<PreExecutionContext<CustomContext>>
  ]
): Promise<Arguments<CustomCliArguments>>;
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
>(
  ...args:
    | [commandModulePath: string]
    | [
        commandModulePath: string,
        configurationHooks: Promisable<ConfigurationHooks<CustomContext>>
      ]
    | [
        commandModulePath: string,
        preExecutionContext: Promisable<PreExecutionContext<CustomContext>>
      ]
    | [commandModulePath: string, argv: string | string[]]
    | [
        commandModulePath: string,
        argv: string | string[],
        configurationHooks: Promisable<ConfigurationHooks<CustomContext>>
      ]
    | [
        commandModulePath: string,
        argv: string | string[],
        preExecutionContext: Promisable<PreExecutionContext<CustomContext>>
      ]
): Promise<Arguments<CustomCliArguments> | undefined> {
  const debug_ = debug.extend('runProgram');
  debug_('runProgram was invoked');

  const commandModulePath = args[0];
  let argv: string | string[] | undefined = undefined;
  let configurationHooks: ConfigurationHooks<CustomContext> | undefined = undefined;
  let preExecutionContext: PreExecutionContext<CustomContext> | undefined = undefined;

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

  try {
    debug_(
      preExecutionContext
        ? 'using provided preExecutionContext'
        : 'invoking configureProgram'
    );

    preExecutionContext ||= await (
      await import('universe/index')
    ).configureProgram(commandModulePath, configurationHooks);

    debug_('invoking preExecutionContext.execute');

    const parsedArgv = (await preExecutionContext.execute(
      Array.isArray(argv) ? argv : typeof argv === 'string' ? argv.split(' ') : undefined
    )) as Arguments<CustomCliArguments>;

    process.exitCode = FrameworkExitCode.Ok;

    debug_('runProgram invocation succeeded');

    return parsedArgv;
  } catch (error) {
    debug_.error('handling irrecoverable exception: %O', `${error}`);

    process.exitCode = isCliError(error)
      ? error.suggestedExitCode
      : FrameworkExitCode.DefaultError;

    debug_.error('exit code set to %O', process.exitCode);

    if (isGracefulEarlyExitError(error)) {
      debug_.message('the exception resulted in a graceful exit');
      return (preExecutionContext?.programs.router.parsed || { argv: {} })
        .argv as Arguments<CustomCliArguments>;
    }

    debug_('runProgram invocation "succeeded" (via error handler)');

    return undefined;
  }
}

/**
 * Type-guard for {@link PreExecutionContext}.
 */
export function isPreExecutionContext(obj: unknown): obj is PreExecutionContext {
  return !!obj && typeof obj === 'object' && 'execute' in obj && 'programs' in obj;
}
