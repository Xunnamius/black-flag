import assert from 'node:assert';

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
  FrameworkExitCode,
  defaultHelpTextDescription
} from 'universe/constant';

import type { ConfigurationHooks } from 'types/configure';

import type {
  Arguments,
  ExecutionContext,
  Executor,
  PreExecutionContext,
  // ? Used by intellisense and in auto-generated documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program
} from 'types/program';

import type { Promisable } from 'type-fest';

// ? Used by intellisense and in auto-generated documentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { runProgram } from 'universe/util';

/**
 * @internal
 */
export const rootDebugLogger = createDebugLogger({ namespace: pkgName });
const debug = rootDebugLogger.extend('index');

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
export async function configureProgram<
  CustomContext extends ExecutionContext = ExecutionContext
>(
  commandModulePath: string,
  configurationHooks?: Promisable<ConfigurationHooks<CustomContext>>
): Promise<PreExecutionContext<CustomContext>> {
  debug('configureProgram was invoked');

  const finalConfigurationHooks = Object.assign(
    {},
    ((await configurationHooks) || {}) as Required<ConfigurationHooks<CustomContext>>
  );

  finalConfigurationHooks.configureArguments ??= (rawArgv) => rawArgv;
  finalConfigurationHooks.configureExecutionPrologue ??= noopConfigurationHook;
  finalConfigurationHooks.configureExecutionEpilogue ??= (argv) => argv;

  finalConfigurationHooks.configureExecutionContext ??= (context) => {
    return context as CustomContext;
  };

  finalConfigurationHooks.configureErrorHandlingEpilogue ??= ({ message }) => {
    // eslint-disable-next-line no-console
    console.error(message);
  };

  debug('command module auto-discovery path: %O', commandModulePath);
  debug('configuration hooks: %O', finalConfigurationHooks);
  debug('entering configureExecutionContext');

  const context = asUnenumerable(
    await finalConfigurationHooks.configureExecutionContext({
      commands: new Map(),
      debug: rootDebugLogger,
      state: {
        rawArgv: [],
        initialTerminalWidth: yargs().terminalWidth(),
        isGracefullyExiting: false,
        isHandlingHelpOption: false,
        globalHelpOption: { name: 'help', description: defaultHelpTextDescription },
        showHelpOnFail: true,
        firstPassArgv: undefined
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

  const deepestParseResultWrapper = await discoverCommands(commandModulePath, context);

  const { programs: rootPrograms } = getRootCommand();

  debug('entering configureExecutionPrologue');

  await finalConfigurationHooks.configureExecutionPrologue(rootPrograms, context);

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

      const argv = await finalConfigurationHooks.configureArguments(
        argv_?.length ? argv_ : hideBin(process.argv),
        context
      );

      debug('exited configureArguments');

      if (!Array.isArray(argv)) {
        throw new AssertionFailedError(
          ErrorMessage.InvalidConfigureArgumentsReturnType()
        );
      }

      debug('context.state.globalHelpOption: %O', context.state.globalHelpOption);

      assert(
        context.state.globalHelpOption === undefined ||
          context.state.globalHelpOption.name.length,
        ErrorMessage.GuruMeditation()
      );

      if (context.state.globalHelpOption) {
        const helpOption = context.state.globalHelpOption.name;
        const helpFlag = `${helpOption.length > 1 ? '--' : '-'}${helpOption}`;
        const targetIndex = argv.indexOf(helpFlag);
        context.state.isHandlingHelpOption = targetIndex >= 0;
      }

      debug(
        'context.state.isHandlingHelpOption determination: %O',
        context.state.isHandlingHelpOption
      );

      debug('configured argv (initialRawArgv): %O', argv);

      context.state.rawArgv = argv;

      debug('calling ::parseAsync on root program');

      try {
        const result = await rootPrograms.router.parseAsync(
          argv,
          wrapExecutionContext(context)
        );
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
          debug.message(
            'caught graceful early exit "error" in PreExecutionContext::execute'
          );

          context.state.isGracefullyExiting = true;

          debug.warn(
            'though runtime was gracefully interrupted, configureExecutionEpilogue will still be called and the program will exit normally'
          );
        } else {
          throw error;
        }
      }

      // ? Return the result from the handler of the deepest command. Otherwise,
      // ? return a "null result" indicating that no parse data is available.
      const finalArgv: Arguments = deepestParseResultWrapper.result || {
        $0: '<no parse result available>',
        _: [],
        [$executionContext]: asUnenumerable(context)
      };

      debug('final parsed argv: %O', finalArgv);
      debug('context.state.isGracefullyExiting: %O', context.state.isGracefullyExiting);
      debug('entering configureExecutionEpilogue');

      const result = await finalConfigurationHooks.configureExecutionEpilogue(
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

      const argv = (rootPrograms.router.parsed || { argv: {} }).argv as Parameters<
        typeof finalConfigurationHooks.configureErrorHandlingEpilogue
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

        debug_error('penultimate error message: %O', message);
        debug_error('penultimate exit code: %O', exitCode);

        debug_error('entering configureErrorHandlingEpilogue');

        await finalConfigurationHooks.configureErrorHandlingEpilogue(
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

  context.commands.forEach((command, fullName) => {
    debug('calling HelperProgram::command_finalize_deferred for command %O', fullName);
    command.programs.helper.command_finalize_deferred();
  });

  debug('configureProgram invocation succeeded');

  return {
    programs: rootPrograms,
    execute: parseAndExecuteWithErrorHandling,
    ...asEnumerable(context)
  };

  function getRootCommand() {
    const root = context.commands.get(context.commands.keys().next().value);
    assert(root !== undefined, ErrorMessage.GuruMeditation());
    return root;
  }
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
