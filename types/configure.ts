import type { Promisable } from 'type-fest';

import type { Arguments, ExecutionContext, Program } from 'types/program';
import type { $executionContext } from 'universe/constant';

/**
 * This function is called once towards the beginning of the execution of
 * `configureProgram` and should return what will become the global
 * {@link ExecutionContext} singleton.
 */
export type ConfigureExecutionContext<
  CustomContext extends ExecutionContext = ExecutionContext
> = (context: ExecutionContext) => Promisable<CustomContext>;

/**
 * This function is called once towards the end of the execution of
 * `configureProgram`, after all commands have been discovered but before any
 * have been executed, and should apply any final configurations to the yargs
 * instances that constitute the command line interface.
 *
 * All commands and sub-commands known to Black Flag are available in the
 * {@link ExecutionContext.commands} map, which can be accessed from the
 * `context` parameter or from the {@link Arguments} object returned by
 * {@link Program.parseAsync} et al.
 *
 * This function is the complement of {@link ConfigureExecutionEpilogue}.
 */
export type ConfigureExecutionPrologue<
  CustomContext extends ExecutionContext = ExecutionContext
> = (program: Program, context: CustomContext) => Promisable<void>;

/**
 * This function is called once towards the beginning of the execution of
 * `PreExecutionContext::execute` and should return a `process.argv`-like array.
 *
 * This is where yargs middleware and other argument pre-processing can be
 * implemented.
 */
export type ConfigureArguments<
  CustomContext extends ExecutionContext = ExecutionContext
> = (
  rawArgv: typeof process.argv,
  context: CustomContext
) => Promisable<typeof process.argv>;

/**
 * This function is called once after CLI argument parsing completes and either
 * (1) handler execution succeeds or (2) a `GracefulEarlyExitError` is thrown.
 * The value returned by this function is used as the return value of the
 * `PreExecutionContext::execute` method.
 *
 * This function is the complement of {@link ConfigureExecutionPrologue}.
 *
 * Note that throwing a `GracefulEarlyExitError` from within this function,
 * while triggering an early exit as desired, will _not_ result in
 * `ConfigureErrorHandlingEpilogue` being invoked.
 */
export type ConfigureExecutionEpilogue<
  CustomContext extends ExecutionContext = ExecutionContext
> = (argv: Arguments, context: CustomContext) => Promisable<Arguments>;

/**
 * This function is called once at the very end of the error handling process
 * after an error has occurred.
 *
 * Note that this function is _always_ called whenever there is an error,
 * regardless of which other functions have already been called. The only
 * exceptions to this are if (1) the error occurs within
 * `configureErrorHandlingEpilogue` itself or (2) the error is an instance of
 * `GracefulEarlyExitError`.
 */
export type ConfigureErrorHandlingEpilogue<
  CustomContext extends ExecutionContext = ExecutionContext
> = (
  meta: { error: unknown; message: string; exitCode: number },
  argv: Omit<Partial<Arguments>, typeof $executionContext> & {
    // ? Ensure $executionContext is required
    [$executionContext]: ExecutionContext;
  },
  context: CustomContext
) => Promisable<void>;

/**
 * An object containing zero or more configuration hooks. See each hook type
 * definition for details.
 */
export type ConfigureHooks<CustomContext extends ExecutionContext = ExecutionContext> = {
  configureExecutionContext?: ConfigureExecutionContext<CustomContext>;
  configureExecutionPrologue?: ConfigureExecutionPrologue<CustomContext>;
  configureArguments?: ConfigureArguments<CustomContext>;
  configureExecutionEpilogue?: ConfigureExecutionEpilogue<CustomContext>;
  configureErrorHandlingEpilogue?: ConfigureErrorHandlingEpilogue<CustomContext>;
};
