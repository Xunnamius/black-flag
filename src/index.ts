import assert from 'node:assert';
import { isPromise } from 'node:util/types';

import { name as pkgName } from 'package';
import { hideBin } from 'yargs/helpers';
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

import type { EmptyObject, Promisable } from 'type-fest';

/**
 * @internal
 */
export const rootDebugLogger = createDebugLogger({ namespace: pkgName });
const debug = rootDebugLogger.extend('index');

/**
 * Create and return a {@link PreExecutionContext} containing a fully-configured
 * {@link Program} instance with the provided configuration hooks and an
 * {@link Executor} function.
 *
 * Command auto-discovery will occur at `commandModulePath`, if defined;
 * otherwise, command auto-discovery is disabled.
 *
 * If command auto-discovery is disabled, `PreExecutionContext::program` will be
 * set to the return value of {@link makeProgram}; i.e. a semi-functional
 * lightly-decorated yargs instance. It is therefore not useful to invoke this
 * function with auto-discovery disabled outside of a testing environment.
 *
 * On the other hand, an exception will occur if no commands are loadable from
 * the given `commandModulePath`, if defined.
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
  configurationHooks?: Promisable<ConfigureHooks<CustomContext>>
): Promise<PreExecutionContext<CustomContext>>;
/**
 * Create and return a {@link PreExecutionContext} containing a semi-functional
 * lightly-decorated yargs instance (the return value of {@link makeProgram}).
 *
 * When called in this form, command auto-discovery is disabled. It is therefore
 * not useful to invoke this call signature outside of a testing environment.
 *
 * **This function throws whenever an exception occurs** (including exceptions
 * representing a graceful exit), making it not ideal as an entry point for a
 * CLI. See `runProgram` for a wrapper function that handles exceptions and sets
 * the exit code for you.
 */
export async function configureProgram<
  CustomContext extends ExecutionContext = ExecutionContext
>(
  configurationHooks?: Promisable<ConfigureHooks<CustomContext>>
): Promise<PreExecutionContext<CustomContext>>;
export async function configureProgram<
  CustomContext extends ExecutionContext = ExecutionContext
>(
  ...args:
    | [configurationHooks?: Promisable<ConfigureHooks<CustomContext>>]
    | [
        commandModulePath?: string,
        configurationHooks?: Promisable<ConfigureHooks<CustomContext>>
      ]
): Promise<PreExecutionContext<CustomContext>> {
  debug('configureProgram was invoked');

  const rootProgram = await makeProgram();

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
    Object.assign(configurationHooks, await args[1]);
  } else {
    commandModulePath = '';
    Object.assign(configurationHooks, await args[0], await args[1]);
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
        initialTerminalWidth: rootProgram.terminalWidth(),
        isGracefullyExiting: false,
        isHandlingHelpOption: false,
        globalHelpOption: 'help'
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

  if (!context.commands.size) {
    debug.newline();
    debug.error('BLACK FLAG INITIALIZATION FAILED! No commands were loaded!');
    debug.warn(
      'black flag initialization failed: the yargs instance returned by this invocation of configureProgram is non-configured and only partially initialized. IT IS NOT SUITABLE FOR USE OUTSIDE OF A TESTING ENVIRONMENT!'
    );
    debug.newline();
  }

  debug('entering configureExecutionPrologue');

  await configurationHooks.configureExecutionPrologue(rootProgram, context);

  debug('exited configureExecutionPrologue');

  let alreadyInvoked = false;
  const parseAndExecuteWithErrorHandling: Executor = async (argv_) => {
    debug('execute was invoked');

    if (alreadyInvoked) {
      // * The documentation and issues literature is ambivalent on what level
      // * of support exists for calling yargs::parse multiple times, but our
      // * unit tests don't lie. It doesn't work. So let's formalize this
      // * invariant.
      // *
      // * Since this error is thrown outside the primary try/catch block, this
      // * assertion failure cannot be handled by
      // * configureErrorHandlingEpilogue.
      throw new AssertionFailedError(
        ErrorMessage.AssertionFailureCannotExecuteMultipleTimes()
      );
    }

    alreadyInvoked = true;

    try {
      debug('raw argv: %O', argv_);
      debug('entering configureArguments');

      const argv = await configurationHooks.configureArguments(
        argv_?.length ? argv_ : hideBin(process.argv),
        context
      );

      debug('exited configureArguments');

      if (!Array.isArray(argv)) {
        throw new AssertionFailedError(
          ErrorMessage.InvalidConfigureArgumentsReturnType()
        );
      }

      if (context.state.globalHelpOption) {
        const helpFlag = `${context.state.globalHelpOption.length > 1 ? '--' : '-'}${
          context.state.globalHelpOption
        }`;

        const targetIndex = argv.indexOf(helpFlag);

        if (targetIndex >= 0) {
          context.state.isHandlingHelpOption = true;
          argv.splice(targetIndex, 1);
        } else {
          context.state.isHandlingHelpOption = false;
        }
      } else {
        context.state.globalHelpOption = undefined;
      }

      debug('context.state.globalHelpOption: %O', context.state.globalHelpOption);
      debug(
        'context.state.isHandlingHelpOption determination: %O',
        context.state.isHandlingHelpOption
      );

      debug('configured argv (initialRawArgv): %O', argv);

      context.state.rawArgv = argv;

      debug('calling ::parseAsync on root program');

      try {
        const result = await rootProgram.parseAsync(argv, wrapExecutionContext(context));
        // * Note that we're doing something clever with how we use
        // * deepestParseResultWrapper.result here and in discoverCommands. This
        // * cleverness necessitates splitting this and the above line into two
        // * separate statements. Combining them "breaks" the ||= operation. My
        // * diagnosis is: it's because the `result` in
        // * deepestParseResultWrapper.result gets resolved "too early".
        // * Interestingly, this "bug" only shows itself when using makeRunner,
        // * not runProgram or via manual execution. This is likely the result
        // * of makeRunner, which is not an async function, having to use
        // * Promise.resolve(...).then(...).
        // *
        // * This is likely a consequence of JavaScript's asynchronicity and the
        // * event loop and not an actual "bug" :)
        deepestParseResultWrapper.result ||= result;
      } catch (error) {
        if (isGracefulEarlyExitError(error)) {
          debug.message('caught graceful early exit "error" in try block');
          debug.warn(
            'though runtime was gracefully interrupted, configureExecutionEpilogue will still be called (with context.isGracefullyExiting === true)'
          );
        } else {
          throw error;
        }
      }

      // ? If commands were auto-discovered, a handler was likely executed.
      // ? Return the result from the handler of the deepest command. If no
      // ? commands were auto-discovered, then return as is the result of
      // ? calling `parseAsync` on the root program. If an error occurred while
      // ? executing `parseAsync` and we've reached this point, then we must be
      // ? attempting a graceful exit, so return a result that reflects that.
      const finalArgv: AnyArguments = deepestParseResultWrapper.result || {
        $0: '',
        _: [],
        [$executionContext]: asUnenumerable({
          ...context,
          isGracefullyExiting: true
        })
      };

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

  context.commands.forEach((wrapper, command) => {
    debug('calling ::command_finalize_deferred for %O', command);
    wrapper.program.command_finalize_deferred();
  });

  debug('configureProgram invocation succeeded');

  return {
    program: rootProgram,
    execute: parseAndExecuteWithErrorHandling,
    ...asEnumerable(context)
  };
}

/**
 * Returns a non-configured "semi-broken" {@link Program} instance, which is
 * just a lightly-decorated yargs instance.
 *
 * **You probably don't want to use this function.** If you want to make a new
 * `Program` instance with auto-discovered commands, configuration hooks,
 * metadata tracking, and support for other Black Flag features, you want
 * `runProgram` or `configureProgram`, both of which call `makeProgram`
 * internally.
 *
 * Among other things, this function is sugar for `return (await
 * import('yargs/yargs')).default()`. Note that the returned yargs instance has
 * its magical `::argv` property disabled via a [this-recovering `Proxy`
 * object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#no_private_property_forwarding).
 * The instance also exposes several new internal methods.
 */
export async function makeProgram<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
>({ isShadowClone = false } = {}) {
  const debug_ = debug.extend('make');
  const descriptor = isShadowClone ? 'SHADOW' : 'non-shadow';
  const deferredCommandArgs: Parameters<Program<CustomCliArguments>['command']>[] = [];

  debug_('created new %O Program instance', descriptor);

  const alphaSort = (await import('alpha-sort')).default;
  const vanillaYargs = yargs() as unknown as Program<CustomCliArguments>;

  return new Proxy(vanillaYargs, {
    get(target, property: keyof Program<CustomCliArguments>, proxy) {
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
          return proxy;
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

          return proxy;
        };
      }

      if (property === 'strict_force') {
        return function (enabled = true) {
          debug_(
            'forced strict, strictCommands, and strictOptions to %O for %O Program instance',
            enabled,
            descriptor
          );

          target.strict(enabled);
          target.strictCommands(enabled);
          target.strictOptions(enabled);

          return proxy;
        };
      }

      if (property === 'help_force') {
        return function (...args: Parameters<typeof target.help>) {
          debug_('forced help(...%O) for %O Program instance', args, descriptor);
          target.help(...args);
          return proxy;
        };
      }

      if (property === 'parseSync') {
        throw new AssertionFailedError(ErrorMessage.UseParseAsyncInstead());
      }

      if (
        property === 'argv' ||
        (!isShadowClone && DISALLOWED_NON_SHADOW_PROGRAM_METHODS.includes(property))
      ) {
        if (debug_.enabled) {
          debug_.warn(
            `trapped attempted access to disabled %O::${property} property on non-shadow yargs instance`,
            descriptor
          );

          // * Kept here as a reminder that we don't want to do this. Why?
          // * Because the double parsing from dynamic options might trigger
          // * parallel calls to a disallowed function that would fail on the
          // * non-shadow instance but would SUCCEED on the shadow instance and
          // * everything would function as intended to the end dev as a result.
          // *
          // * Warnings should not be issued about success.
          // if (!emittedWarning) {
          //   // ? Make it obvious when something does something we don't like
          //   process.emitWarning(
          //     `trapped attempted access to disabled "${property}" property on non-shadow yargs instance. See the Black Flag documentation for more info.`,
          //     { code: 'BLACKFLAG_DISABLED_PROP_WARNING' }
          //   );
          //   emittedWarning = true;
          // }
        }

        // ? Why go through all this trouble? Because, Jest likes to make "deep
        // ? cyclical copies" of objects from time to time, especially WHEN
        // ? ERRORS ARE THROWN. These deep copies necessarily require
        // ? recursively accessing every property of the object... including
        // ? magic properties like ::argv, which causes ::parse to be called
        // ? multiple times AFTER AN ERROR ALREADY OCCURRED, which leads to
        // ? undefined behavior and heisenbugs. Yuck.
        return property === 'argv'
          ? void 'disabled by Black Flag (use parseAsync instead)'
          : () => void 'disabled by Black Flag (use metadata.shadow instead)';
      }

      const value: unknown = target[property];

      if (value instanceof Function) {
        return function (...args: unknown[]) {
          // ? This is "this-recovering" code.
          const returnValue = value.apply(target, args);
          // ? Whenever we'd return a yargs instance, return a Black Flag
          // ? instance instead.
          return isPromise(returnValue)
            ? returnValue.then((realReturnValue) => maybeReturnProxy(realReturnValue))
            : maybeReturnProxy(returnValue);
        };
      }

      return value;

      function maybeReturnProxy(returnValue: unknown) {
        returnValue === target ? proxy : returnValue;
      }
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
