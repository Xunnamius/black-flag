import assert from 'node:assert';

import alphaSort from 'alpha-sort';
import { name as pkgName } from 'package';
import yargs from 'yargs/yargs';

import { createDebugLogger } from 'multiverse/rejoinder';

import { discoverCommands } from 'universe/discover';

import {
  AssertionFailedError,
  CliError,
  ErrorMessage,
  isCliError,
  isGracefulEarlyExitError
} from 'universe/error';

import {
  $executionContext,
  DISALLOWED_NON_SHADOW_PROGRAM_METHODS,
  FrameworkExitCode
} from 'universe/constant';

import type { ConfigureHooks } from 'types/configure';

import type {
  AnyArguments,
  ExecutionContext,
  Executor,
  PreExecutionContext,
  Program
} from 'types/program';

import type { EmptyObject } from 'type-fest';

const rootDebugLogger = createDebugLogger({ namespace: pkgName });
const debug = rootDebugLogger.extend('index');

/**
 * Create and return a {@link PreExecutionContext} containing a fully-configured
 * {@link Program} instance with the provided configuration hooks and an
 * {@link Executor} function.
 *
 * Command auto-discovery will occur at `commandModulePath`, if defined.
 *
 * **This function throws whenever an exception occurs** (including exceptions
 * representing a graceful exit), making it not ideal as an entry point for a
 * CLI. See `runProgram` for a wrapper function that handles exceptions and sets
 * the exit code for you.
 */
export async function configureProgram<
  CustomContext extends ExecutionContext = ExecutionContext
>(
  commandModulePath?: string,
  configurationHooks?: ConfigureHooks<CustomContext>
): Promise<PreExecutionContext<CustomContext>>;
/**
 * Create and return a {@link PreExecutionContext} containing a fully-configured
 * {@link Program} instance with default configuration hooks and an
 * {@link Executor} function.
 *
 * When called in this form, command auto-discovery is disabled.
 *
 * **This function throws whenever an exception occurs** (including exceptions
 * representing a graceful exit), making it not ideal as an entry point for a
 * CLI. See `runProgram` for a wrapper function that handles exceptions and sets
 * the exit code for you.
 */
export async function configureProgram<
  CustomContext extends ExecutionContext = ExecutionContext
>(
  configurationHooks?: ConfigureHooks<CustomContext>
): Promise<PreExecutionContext<CustomContext>>;
export async function configureProgram<
  CustomContext extends ExecutionContext = ExecutionContext
>(
  ...args:
    | [configurationHooks?: ConfigureHooks<CustomContext>]
    | [commandModulePath?: string, configurationHooks?: ConfigureHooks<CustomContext>]
): Promise<PreExecutionContext<CustomContext>> {
  debug('configureProgram was invoked');

  const rootProgram = makeProgram();

  let commandModulePath: string;

  const configurationHooks: Required<ConfigureHooks<CustomContext>> = {
    configureExecutionContext(context) {
      return context as CustomContext;
    },
    configureArguments(rawArgv) {
      return rawArgv;
    },
    configureExecutionPrologue: noopConfigurationHook,
    configureExecutionEpilogue(argv) {
      return argv;
    },
    configureErrorHandlingEpilogue({ message }) {
      // eslint-disable-next-line no-console
      console.error(message);
    }
  };

  if (typeof args[0] === 'string') {
    commandModulePath = args[0];
    Object.assign(configurationHooks, args[1]);
  } else {
    commandModulePath = '';
    Object.assign(configurationHooks, args[0], args[1]);
  }

  debug('command module auto-discovery path: %O', commandModulePath);
  debug('configuration hooks: %O', configurationHooks);

  debug('entering configureExecutionContext');

  // ? Redundancy for extra type safety (config fns could be redefined later)
  const context = asUnenumerable(
    await configurationHooks.configureExecutionContext({
      commands: new Map(),
      debug: rootDebugLogger,
      state: {
        rawArgv: [],
        initialTerminalWidth: rootProgram.terminalWidth()
      }
    })
  );

  debug('exited configureExecutionContext');
  debug('configured execution context: %O', asEnumerable(context));

  if (!context) {
    throw new CliError(ErrorMessage.InvalidConfigureExecutionContextReturnType());
  }

  debug.message(
    'to save space, ExecutionContext will be unenumerable from this point on'
  );

  const deepestParseResultWrapper: Awaited<ReturnType<typeof discoverCommands>> =
    commandModulePath
      ? await discoverCommands(commandModulePath, rootProgram, context)
      : { result: undefined };

  if (!commandModulePath) {
    debug.warn('skipped command auto-discovery entirely due to call signature');
  }

  debug('entering configureExecutionPrologue');

  await configurationHooks.configureExecutionPrologue(rootProgram, context);

  debug('exited configureExecutionPrologue');

  const parseAndExecuteWithErrorHandling: Executor = async (argv_) => {
    debug('execute was invoked');

    try {
      debug('raw argv: %O', argv_);

      debug('entering configureArguments');

      const argv = await configurationHooks.configureArguments(
        argv_?.length ? argv_ : process.argv,
        context
      );

      debug('exited configureArguments');

      if (!Array.isArray(argv)) {
        throw new AssertionFailedError(
          ErrorMessage.InvalidConfigureArgumentsReturnType()
        );
      }

      debug('configured argv (initialRawArgv): %O', argv);

      context.state.rawArgv = argv;

      debug('calling ::parseAsync on root program');

      try {
        deepestParseResultWrapper.result ||= await rootProgram.parseAsync(
          argv,
          wrapExecutionContext(context)
        );
      } catch (error) {
        if (isGracefulEarlyExitError(error)) {
          debug.message('caught graceful early exit "error" in try block');
          debug.warn(
            'though runtime was gracefully interrupted, configureExecutionEpilogue will still be called'
          );
        } else {
          throw error;
        }
      }

      // ? If commands were auto-discovered, a handler was likely executed.
      // ? Return the result from the handler of the deepest command. If no
      // ? commands were auto-discovered, then return as is the result of
      // ? calling `parseAsync` on the root program, falling back to `{}`.
      const finalArgv = deepestParseResultWrapper.result || ({} as AnyArguments);

      debug('final parsed argv: %O', finalArgv);
      debug('entering configureExecutionEpilogue');

      const result = await configurationHooks.configureExecutionEpilogue(
        finalArgv,
        context
      );

      debug('exited configureExecutionEpilogue');
      debug('execution epilogue returned: %O', result);

      if (!result) {
        throw new AssertionFailedError(
          ErrorMessage.AssertionFailureConfigureExecutionEpilogue()
        );
      }

      debug('final execution context: %O', asEnumerable(context));
      debug('execution complete');
      debug.newline();

      return result;
    } catch (error) {
      const debug_error = debug.extend('catch');

      debug_error.error('caught fatal error (type %O): %O', typeof error, error);

      const argv = (rootProgram.parsed || { argv: {} }).argv as Parameters<
        typeof configurationHooks.configureErrorHandlingEpilogue
      >[1];

      debug_error(
        'potentially-parsed argv (may be incomplete due to error state): %O',
        argv
      );

      if (isGracefulEarlyExitError(error)) {
        debug.message('caught graceful early exit "error" in catch block');
        debug.warn('error will be forwarded to top-level error handler');
      } else {
        // ? Ensure [$executionContext] always exists
        argv[$executionContext] ??= asUnenumerable(context);

        let message = ErrorMessage.Generic();
        let exitCode = FrameworkExitCode.DefaultError;

        if (typeof error === 'string') {
          message = error;
        } else if (isCliError(error)) {
          message = error.message;
          exitCode = error.suggestedExitCode;
        } else if (error) {
          message = `${error}`;
        }

        debug_error('final error message: %O', message);
        debug_error('final exit code: %O', exitCode);

        debug_error('entering configureErrorHandlingEpilogue');

        await configurationHooks.configureErrorHandlingEpilogue(
          { message, error, exitCode },
          argv,
          context
        );

        debug_error('exited configureErrorHandlingEpilogue');

        debug_error('final execution context: %O', asEnumerable(context));
        debug_error('error handling complete');
        debug_error.newline();
      }

      throw error;
    }
  };

  debug('finalizing deferred command registrations');

  context.commands.forEach((wrapper) => wrapper.program.command_finalize_deferred());

  debug('configureProgram invocation succeeded');

  return {
    program: rootProgram,
    execute: parseAndExecuteWithErrorHandling,
    ...asEnumerable(context)
  };
}

/**
 * Returns an non-configured {@link Program} instance, which is just a
 * lightly-decorated yargs instance.
 *
 * **If you want to make a new `Program` instance with auto-discovered commands,
 * configuration hooks, metadata tracking, and support for other Black Flag
 * features, you probably want `runProgram` or `configureProgram`, both of which
 * call `makeProgram` internally.**
 *
 * Among other things, this function is sugar for `return (await
 * import('yargs/yargs')).default()`. Note that the returned yargs instance has
 * its magical `::argv` property disabled via a [this-recovering `Proxy`
 * object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#no_private_property_forwarding).
 * The instance also exposes two new methods: `command_deferred` and
 * `command_finalize_deferred`.
 */
export function makeProgram<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>({ isShadowClone = false } = {}) {
  const debug_ = debug.extend('make');
  const descriptor = isShadowClone ? 'SHADOW' : 'non-shadow';
  const deferredCommandArgs: Parameters<Program<CustomCliArguments>['command']>[] = [];

  debug_('created new %O Program instance', descriptor);

  return new Proxy(yargs() as unknown as Program<CustomCliArguments>, {
    get(target, property: keyof Program<CustomCliArguments>) {
      // ? What are command_deferred and command_finalize_deferred? Well,
      // ? when generating help text, yargs will enumerate commands and options
      // ? in the order that they were added to the instance. Unfortunately,
      // ? since we're relying on the filesystem to asynchronously reveal its
      // ? contents to us, commands will be added in unpredictable OS-specific
      // ? orders. We don't like that, we want our commands to always appear in
      // ? the same order no matter what OS the CLI is invoked on. So, we
      // ? replace ::command with ::command_deferred, which adds its parameters
      // ? to an internal list, and ::command_finalize_deferred, which sorts
      // ? said list and enumerates the result, calling the real ::command as it
      // ? goes. As for preserving the sort order of options within the builder
      // ? function, that's an exercise left to the end developer :)

      if (property === 'command_deferred') {
        return function (...args: Parameters<Program<CustomCliArguments>['command']>) {
          debug_('::command call was deferred for %O Program instance', descriptor);
          deferredCommandArgs.push(args);
          return target;
        };
      }

      if (property === 'command_finalize_deferred') {
        return function () {
          debug_(
            'began alpha-sorting deferred command calls for %O Program instance',
            descriptor
          );

          // ? Sort in alphabetical order with naturally sorted numbers
          const sort = alphaSort({ natural: true });

          deferredCommandArgs.sort(([firstCommands], [secondCommands]) => {
            const firstCommand = [firstCommands].flat()[0];
            const secondCommand = [secondCommands].flat()[0];

            // ? If they do, then we accidentally called this on a child instead
            // ? of a parent...
            assert(!firstCommand.startsWith('$0'));
            assert(!secondCommand.startsWith('$0'));

            return sort(firstCommand, secondCommand);
          });

          debug_(
            'calling ::command with %O deferred argument tuples for %O Program instance...',
            deferredCommandArgs.length,
            descriptor
          );

          for (const args of deferredCommandArgs) {
            target.command(...args);
          }
        };
      }

      if (property === 'strict_force') {
        return function (enabled = true) {
          debug_(
            'forced strict, strictCommands, and strictOptions for %O Program instance',
            descriptor
          );
          target.strict(enabled);
          target.strictCommands(enabled);
          target.strictOptions(enabled);
        };
      }

      if (
        property === 'argv' ||
        (!isShadowClone && DISALLOWED_NON_SHADOW_PROGRAM_METHODS.includes(property))
      ) {
        debug_.warn(
          `trapped attempted access to disabled %O::${property} property`,
          descriptor
        );

        // ? Why go through all this trouble? Because, Jest likes to make "deep
        // ? cyclical copies" of objects from time to time, especially WHEN
        // ? ERRORS ARE THROWN. These deep copies necessarily require
        // ? recursively accessing every property of the object... including
        // ? disabled properties on non-shadow instances like ::strict, or magic
        // ? properties like ::argv, which causes ::parse to be called multiple
        // ? times AFTER AN ERROR ALREADY OCCURRED, which leads to undefined
        // ? behavior and heisenbugs. Yuck.
        return property === 'argv' ? undefined : () => undefined;
      }

      const value: unknown = target[property];

      if (value instanceof Function) {
        return function (...args: unknown[]) {
          // ? "this-recovering" code
          return value.apply(target, args);
        };
      }

      return value;
    }
  });
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
 * Takes an object and rewrites its property descriptors so that its properties
 * are no longer enumerable. This leads to less needlessly-verbose object logs
 * in debug output.
 */
function asUnenumerable<T extends object>(context: T) {
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
function asEnumerable<T extends object>(context: T) {
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

function noopConfigurationHook() {}
