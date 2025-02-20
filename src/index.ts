import assert from 'node:assert';
import { isNativeError } from 'node:util/types';

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { getRootDebugLogger } from 'universe:debug.ts';
import { discoverCommands } from 'universe:discover.ts';
import { capitalize, wrapExecutionContext } from 'universe:util.ts';

import {
  AssertionFailedError,
  CliError,
  ErrorMessage,
  isCliError,
  isCommandNotImplementedError,
  isGracefulEarlyExitError
} from 'universe:error.ts';

import {
  $executionContext,
  FrameworkExitCode,
  defaultHelpOptionName,
  defaultHelpTextDescription,
  defaultVersionOptionName,
  defaultVersionTextDescription
} from 'universe:constant.ts';

import type { Promisable } from 'type-fest';
import type {
  ConfigurationHooks,
  ConfigureErrorHandlingEpilogue
} from 'typeverse:configure.ts';

import type {
  ExecutionContext,
  Executor,
  NullArguments,
  PreExecutionContext,
  // ? Used by intellisense and in auto-generated documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program
} from 'typeverse:program.ts';

// ? Used by intellisense and in auto-generated documentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { runProgram } from 'universe:util.ts';

const debug = getRootDebugLogger().extend('index');

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
  /**
   * Command auto-discovery will occur at `commandModulePath`. An exception will
   * occur if no commands are loadable from the given `commandModulePath`.
   *
   * `'file://...'`-style URLs are also accepted.
   */
  commandModulePath: string,
  configurationHooks?: Promisable<ConfigurationHooks>
): Promise<PreExecutionContext> {
  debug('configureProgram was invoked');

  const finalConfigurationHooks = Object.assign(
    {},
    ((await configurationHooks) || {}) as Required<ConfigurationHooks>
  );

  finalConfigurationHooks.configureArguments ??= (rawArgv) => rawArgv;
  finalConfigurationHooks.configureExecutionPrologue ??= noopConfigurationHook;
  finalConfigurationHooks.configureExecutionEpilogue ??= (argv) => argv;

  finalConfigurationHooks.configureExecutionContext ??= (context) => {
    return context as CustomContext;
  };

  finalConfigurationHooks.configureErrorHandlingEpilogue ??=
    defaultErrorHandlingEpilogueConfigurationHook;

  debug('command module auto-discovery path: %O', commandModulePath);
  debug('configuration hooks: %O', finalConfigurationHooks);
  debug('entering configureExecutionContext');

  const context = asUnenumerable(
    await finalConfigurationHooks.configureExecutionContext({
      commands: new Map(),
      debug: getRootDebugLogger(),
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

  debug('exited configureExecutionContext');
  debug('configured execution context: %O', asEnumerable(context));

  if (!context) {
    throw new CliError(ErrorMessage.InvalidConfigureExecutionContextReturnType());
  }

  debug.message(
    'to save space, ExecutionContext will be unenumerable from this point on'
  );

  await discoverCommands(commandModulePath, context);

  const { programs: rootPrograms } = getRootCommand();

  debug('entering configureExecutionPrologue');

  await finalConfigurationHooks.configureExecutionPrologue(rootPrograms, context);

  debug('exited configureExecutionPrologue');

  debug('finalizing deferred command registrations');

  context.commands.forEach((command, fullName) => {
    debug('calling HelperProgram::command_finalize_deferred for command %O', fullName);
    command.programs.helper.command_finalize_deferred();
  });

  debug('configureProgram invocation succeeded');

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
      debug('context.state.globalVersionOption: %O', context.state.globalVersionOption);

      assert(
        context.state.globalHelpOption === undefined ||
          context.state.globalHelpOption.name?.length,
        'bad context.state.globalHelpOption'
      );

      assert(
        context.state.globalVersionOption === undefined ||
          context.state.globalVersionOption.name?.length,
        'bad context.state.globalVersionOption'
      );

      // * We track this so that the --help and --version flags are ignored if
      // * they occur after -- in the arguments array.
      const doubleDashIndex = argv.indexOf('--');
      const hasDoubleDash = doubleDashIndex >= 0;

      if (context.state.globalHelpOption) {
        const helpOption = context.state.globalHelpOption.name;
        const helpFlag = `${helpOption.length > 1 ? '--' : '-'}${helpOption}`;
        const helpFlagIndex = argv.indexOf(helpFlag);
        context.state.isHandlingHelpOption =
          helpFlagIndex >= 0 && (!hasDoubleDash || helpFlagIndex < doubleDashIndex);
      } else {
        debug.warn(
          'disabled built-in help option since context.state.globalHelpOption was falsy'
        );
      }

      debug(
        'context.state.isHandlingHelpOption determination: %O',
        context.state.isHandlingHelpOption
      );

      if (context.state.globalVersionOption) {
        const versionOption = context.state.globalVersionOption.name;
        const versionFlag = `${versionOption.length > 1 ? '--' : '-'}${versionOption}`;
        const versionFlagIndex = argv.indexOf(versionFlag);
        context.state.isHandlingVersionOption =
          versionFlagIndex >= 0 &&
          (!hasDoubleDash || versionFlagIndex < doubleDashIndex);
      } else {
        debug.warn(
          'disabled built-in version option since context.state.globalVersionOption was falsy'
        );
      }

      debug(
        'context.state.isHandlingVersionOption determination: %O',
        context.state.isHandlingVersionOption
      );

      debug('configured argv (initialRawArgv): %O', argv);

      context.state.rawArgv = argv;

      debug('calling ::parseAsync on root program');

      try {
        // * Note how we discard the result of RouterProgram::parseAsync
        await rootPrograms.router.parseAsync(argv, wrapExecutionContext(context));
      } catch (error_) {
        const error = context.state.finalError || error_;

        if (error !== error_) {
          debug.warn(
            'root router parse warning: context.state.finalError !== caught error (caught error was discarded)'
          );
        }

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

      context.state.deepestParseResult ||= makeNullParseResult(context);
      const finalArgv = context.state.deepestParseResult;

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
      debug('execution complete (no errors)');
      debug.newline();

      return result;
    } catch (error) {
      const debug_error = debug.extend('catch');

      debug_error.error('caught fatal error (type %O): %O', typeof error, error);

      context.state.deepestParseResult ||= makeNullParseResult(context);
      const finalArgv = context.state.deepestParseResult;

      debug_error('final parsed argv: %O', finalArgv);

      if (isGracefulEarlyExitError(error)) {
        debug.message(
          'caught (and released) graceful early exit "error" in catch block'
        );
      } else {
        // ? Ensure [$executionContext] always exists
        finalArgv[$executionContext] ??= context;

        let message = ErrorMessage.Generic();
        let exitCode = FrameworkExitCode.DefaultError;
        const { isAssertionSystemError } = await import('universe:util.ts');

        if (typeof error === 'string') {
          message = error;
        } else if (isNativeError(error)) {
          message = error.message;
          exitCode =
            isAssertionSystemError(error) || isAssertionSystemError(error.cause)
              ? FrameworkExitCode.AssertionFailed
              : isCliError(error)
                ? error.suggestedExitCode
                : FrameworkExitCode.DefaultError;
        } else {
          message = `${error}`;
        }

        debug_error('theoretical error message: %O', message);
        debug_error('theoretical exit code: %O', exitCode);

        debug_error('entering configureErrorHandlingEpilogue');

        await finalConfigurationHooks.configureErrorHandlingEpilogue(
          { message, error, exitCode },
          finalArgv,
          context
        );

        debug_error('exited configureErrorHandlingEpilogue');

        debug_error('final execution context: %O', asEnumerable(context));

        if (!isCliError(error)) {
          debug_error('wrapping error with CliError');

          // eslint-disable-next-line no-ex-assign
          error = new CliError(message, { suggestedExitCode: exitCode });
        }
      }

      debug_error.warn('forwarding error to top-level error handler');
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
    assert(root !== undefined, ErrorMessage.GuruMeditation());
    return root;
  }
}

/**
 * @internal
 */
export function defaultErrorHandlingEpilogueConfigurationHook(
  ...[
    { message, error },
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
    // eslint-disable-next-line no-console
    console.error(capitalize(message));
  }
}

/**
 * Creates a `NullArguments` instance.
 */
function makeNullParseResult(context: ExecutionContext): NullArguments {
  debug.warn('generated a NullArguments parse result');
  return {
    $0: '<NullArguments: no parse result available due to exception>',
    _: [],
    [$executionContext]: context
  };
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
