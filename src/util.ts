import assert from 'node:assert';

import { FrameworkExitCode } from 'universe/constant';
import { ErrorMessage, isCliError, isGracefulEarlyExitError } from 'universe/error';

import type {
  EmptyObject,
  Promisable,
  RequiredDeep,
  UnionToIntersection
} from 'type-fest';
import type { ConfigureHooks } from 'types/configure';
import type { Arguments, ExecutionContext, PreExecutionContext } from 'types/program';

// * Lots of repeated types in this file. Why? Because typedoc gets mad if we
// * don't.

/**
 * A factory function that returns a {@link runProgram} function that can be
 * called multiple times while only having to provide a subset of the required
 * parameters at initialization.
 *
 * This is useful when unit/integration testing your CLI, which will likely
 * require multiple calls to `runProgram(...)`.
 */
export function makeRunner<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>(
  options?: {
    /**
     * @see {@link runProgram}
     */
    commandModulePath?: string | undefined;
  } & (
    | {
        /**
         * @see {@link runProgram}
         *
         * Note: cannot be used with `configurationHooks`.
         */
        configurationHooks?: Promisable<ConfigureHooks<ExecutionContext>>;
      }
    | {
        /**
         * @see {@link runProgram}
         *
         * Node: cannot be used with `preExecutionContext`.
         */
        preExecutionContext?: Promisable<PreExecutionContext<ExecutionContext>>;
      }
  )
) {
  return <
    T extends
      | [commandModulePath?: string]
      | [
          commandModulePath: string | undefined,
          configurationHooks: Promisable<ConfigureHooks<CustomContext>>
        ]
      | [
          commandModulePath: string | undefined,
          preExecutionContext: PreExecutionContext<CustomContext>
        ]
      | [commandModulePath: string | undefined, argv: string | string[]]
      | [
          commandModulePath: string | undefined,
          argv: string | string[],
          configurationHooks: Promisable<ConfigureHooks<CustomContext>>
        ]
      | [
          commandModulePath: string | undefined,
          argv: string | string[],
          preExecutionContext: PreExecutionContext<CustomContext>
        ]
  >(
    ...args: T extends [infer _, ...infer Tail] ? Tail : []
  ) => {
    const { commandModulePath, configurationHooks, preExecutionContext } =
      (options as UnionToIntersection<RequiredDeep<typeof options>> | undefined) || {};

    const parameters: unknown[] = [commandModulePath, ...args];
    const hasAdditionalConfig = !!(configurationHooks || preExecutionContext);

    if (
      hasAdditionalConfig &&
      (args.length === 0 ||
        (args.length === 1 && (typeof args[0] === 'string' || Array.isArray(args[0]))))
    ) {
      assert(
        !!configurationHooks !== !!preExecutionContext,
        ErrorMessage.AssertionFailureBadParameterCombination()
      );

      // ? Specifying hooks or a context at the runProgram level will override
      // ? configurationHooks/PreExecutionContext. However, if no override is
      // ? provided, configurationHooks/PreExecutionContext will be used by
      // ? default with respect to the call signature.
      parameters.push(configurationHooks || preExecutionContext);
    }

    return runProgram<CustomContext, CustomCliArguments>(
      ...(parameters as Parameters<typeof runProgram<CustomContext, CustomCliArguments>>)
    );
  };
}

/**
 * Invokes the dynamically imported `configureProgram().execute()` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * no matter what.** Instead, when an error is caught, `process.exitCode` is set
 * to the appropriate value and `undefined` is returned.
 */
export async function runProgram<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>(
  ...args: [commandModulePath?: string]
): Promise<Arguments<CustomCliArguments> | undefined>;
/**
 * Invokes the dynamically imported
 * `configureProgram(configurationHooks).execute()` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * no matter what.** Instead, when an error is caught, `process.exitCode` is set
 * to the appropriate value and `undefined` is returned.
 */
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>(
  ...args: [
    commandModulePath: string | undefined,
    configurationHooks: Promisable<ConfigureHooks<CustomContext>>
  ]
): Promise<Arguments<CustomCliArguments> | undefined>;
/**
 * Invokes the `preExecutionContext.execute()` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * no matter what.** Instead, when an error is caught, `process.exitCode` is set
 * to the appropriate value and `undefined` is returned.
 */
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>(
  ...args: [
    commandModulePath: string | undefined,
    preExecutionContext: PreExecutionContext<CustomContext>
  ]
): Promise<Arguments<CustomCliArguments> | undefined>;
/**
 * Invokes the dynamically imported `configureProgram().execute(argv)` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * no matter what.** Instead, when an error is caught, `process.exitCode` is set
 * to the appropriate value and `undefined` is returned.
 */
export async function runProgram<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>(
  ...args: [commandModulePath: string | undefined, argv: string | string[]]
): Promise<Arguments<CustomCliArguments>>;
/**
 * Invokes the dynamically imported
 * `configureProgram(configurationHooks).execute(argv)` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * no matter what.** Instead, when an error is caught, `process.exitCode` is set
 * to the appropriate value and `undefined` is returned.
 */
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>(
  ...args: [
    commandModulePath: string | undefined,
    argv: string | string[],
    configurationHooks: Promisable<ConfigureHooks<CustomContext>>
  ]
): Promise<Arguments<CustomCliArguments>>;
/**
 * Invokes the `preExecutionContext.execute(argv)` function.
 *
 * This function is suitable for a CLI entry point since it will **never throw
 * no matter what.** Instead, when an error is caught, `process.exitCode` is set
 * to the appropriate value and `undefined` is returned.
 */
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>(
  ...args: [
    commandModulePath: string | undefined,
    argv: string | string[],
    preExecutionContext: PreExecutionContext<CustomContext>
  ]
): Promise<Arguments<CustomCliArguments>>;
export async function runProgram<
  CustomContext extends ExecutionContext,
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>(
  ...args:
    | [commandModulePath?: string]
    | [
        commandModulePath: string | undefined,
        configurationHooks: Promisable<ConfigureHooks<CustomContext>>
      ]
    | [
        commandModulePath: string | undefined,
        preExecutionContext: PreExecutionContext<CustomContext>
      ]
    | [commandModulePath: string | undefined, argv: string | string[]]
    | [
        commandModulePath: string | undefined,
        argv: string | string[],
        configurationHooks: Promisable<ConfigureHooks<CustomContext>>
      ]
    | [
        commandModulePath: string | undefined,
        argv: string | string[],
        preExecutionContext: PreExecutionContext<CustomContext>
      ]
): Promise<Arguments<CustomCliArguments> | undefined> {
  const commandModulePath = args[0];
  let argv: string | string[] | undefined = undefined;
  let configurationHooks: ConfigureHooks<CustomContext> | undefined = undefined;
  let preExecutionContext: PreExecutionContext<CustomContext> | undefined = undefined;

  if (typeof args[1] === 'string' || Array.isArray(args[1])) {
    // * Must be 4, 5, or 6
    argv = args[1];

    if (args[2]) {
      // * Must be 5 or 6
      if ('execute' in args[2] && 'program' in args[2]) {
        // * Must be 6
        preExecutionContext = args[2];
      } else {
        // * Must be 5
        configurationHooks = await args[2];
      }
    }
  } else if (args[1]) {
    // * Must be 2 or 3
    if ('execute' in args[1] && 'program' in args[1]) {
      // * Must be 3
      preExecutionContext = args[1];
    } else {
      // * Must be 2
      configurationHooks = await args[1];
    }
  }

  try {
    preExecutionContext ||= await (
      await import('universe/index')
    ).configureProgram(commandModulePath, configurationHooks);

    const parsedArgv = (await preExecutionContext.execute(
      Array.isArray(argv) ? argv : typeof argv === 'string' ? argv.split(' ') : undefined
    )) as Arguments<CustomCliArguments>;

    process.exitCode = FrameworkExitCode.Ok;

    return parsedArgv;
  } catch (error) {
    process.exitCode = isCliError(error)
      ? error.suggestedExitCode
      : FrameworkExitCode.DefaultError;

    if (isGracefulEarlyExitError(error)) {
      return (preExecutionContext?.program.parsed || { argv: {} })
        .argv as Arguments<CustomCliArguments>;
    }

    return undefined;
  }
}
