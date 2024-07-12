import { isNativeError } from 'node:util/types';

import {
  AppError,
  ErrorMessage as NamedErrorMessage,
  makeNamedError
} from 'named-app-errors';

import { FrameworkExitCode } from 'universe/constant';

// ? This import is referenced in a type comment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { runProgram } from 'universe/util';

// TODO: replace a lot of all that follows with the official package(s),
// TODO: including the symbol use below

// TODO: the [$type] property of these classes should be an array of symbols
// TODO: instead of an array of strings since two classes could have the same
// TODO: name!

// TODO: Need to ensure isXError functions deal with inheritance/extends
export const $type = Symbol.for('object-type-hint');

/**
 * Type guard for {@link CliError}.
 */
// TODO: make-named-error should create and return this function automatically
export function isCliError(parameter: unknown): parameter is CliError {
  return (
    isNativeError(parameter) &&
    $type in parameter &&
    Array.isArray(parameter[$type]) &&
    parameter[$type].includes(CliError.name)
  );
}

/**
 * Type guard for {@link GracefulEarlyExitError}.
 */
// TODO: make-named-error should create and return this function automatically
export function isGracefulEarlyExitError(
  parameter: unknown
): parameter is GracefulEarlyExitError {
  return (
    isNativeError(parameter) &&
    $type in parameter &&
    Array.isArray(parameter[$type]) &&
    parameter[$type].includes(GracefulEarlyExitError.name)
  );
}

/**
 * Type guard for {@link CommandNotImplementedError}.
 */
// TODO: make-named-error should create and return this function automatically
export function isCommandNotImplementedError(
  parameter: unknown
): parameter is CommandNotImplementedError {
  return (
    isNativeError(parameter) &&
    $type in parameter &&
    Array.isArray(parameter[$type]) &&
    parameter[$type].includes(CommandNotImplementedError.name)
  );
}

/**
 * Options available when constructing a new `CliError` object.
 */
export type CliErrorOptions = {
  /**
   * The exit code that will be returned when the application exits, given
   * nothing else goes wrong in the interim.
   *
   * @default FrameworkExitCode.DefaultError
   */
  suggestedExitCode?: number;
  /**
   * If `true`, help text will be sent to stderr _before this exception finishes
   * bubbling_. Where the exception is thrown will determine which instance is
   * responsible for error text generation.
   *
   * @default false
   */
  showHelp?: boolean;
  /**
   * This option is similar in intent to yargs's `exitProcess()` function,
   * except applied more granularly.
   *
   * Normally, {@link runProgram} never throws and never calls `process.exit`,
   * instead setting `process.exitCode` when an error occurs.
   *
   * However, it is at times prudent to kill Node.js as soon as possible after
   * error handling happens. For example: the execa library struggles to abort
   * concurrent subcommand promises in a timely manner, and doesn't prevent them
   * from dumping output to stdout even after Black Flag has finished executing.
   * To work around this, we can set `dangerouslyFatal` to `true`, forcing Black
   * Flag to call `process.exit` immediately after error handling completes.
   *
   * More generally, enabling `dangerouslyFatal` is a quick way to get rid of
   * strange behavior that can happen when your microtask queue isn't empty
   * (i.e. the event loop still has work to do) by the time Black Flag's error
   * handling code completes. **However, doing this without proper consideration
   * of _why_ you still have hanging promises and/or other microtasks adding
   * work to the event loop can lead to faulty/glitchy/flaky software and
   * heisenbugs.** You will also have to specially handle `process.exit` when
   * running unit/integration tests and executing command handlers within other
   * command handlers. Tread carefully.
   */
  dangerouslyFatal?: boolean;
  /**
   * By default, if an {@link Error} object is passed to `CliError`, that
   * `Error` instance will be passed through as `CliError.cause` and that
   * instance's `Error.message` will be passed through as `CliError.message`.
   *
   * Use this option to override this default behavior and instead set
   * `CliError.cause` manually.
   */
  cause?: ErrorOptions['cause'];
};

/**
 * Represents a CLI-specific error with suggested exit code and other
 * properties. As `CliError` has built-in support for cause chaining, this class
 * can be used as a simple wrapper around other errors.
 */
// TODO: this should use the new type of more-generic error from the new version
// TODO: of the X-app-errors pages
export class CliError extends AppError implements NonNullable<CliErrorOptions> {
  suggestedExitCode = FrameworkExitCode.DefaultError;
  showHelp = false;
  dangerouslyFatal = false;
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = ['CliError'];
  /**
   * Represents a CLI-specific error, optionally with suggested exit code and
   * other context.
   */
  constructor(reason: Error | string, options?: CliErrorOptions);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(
    reason: Error | string,
    options: CliErrorOptions,
    message: string,
    superOptions: ErrorOptions
  );
  constructor(
    reason: Error | string,
    options: CliErrorOptions = {},
    message: string | undefined = undefined,
    superOptions: ErrorOptions = {}
  ) {
    const { suggestedExitCode, showHelp, dangerouslyFatal } = options;
    let { cause } = options;

    message =
      message ??
      (typeof reason === 'string' ? reason : reason?.message) ??
      ErrorMessage.Generic();

    if (!('cause' in options)) {
      cause = typeof reason === 'string' ? undefined : reason;
    }

    super(message, { cause, ...superOptions });

    if (suggestedExitCode !== undefined) {
      this.suggestedExitCode = suggestedExitCode;
    }

    if (showHelp !== undefined) {
      this.showHelp = showHelp;
    }

    if (dangerouslyFatal !== undefined) {
      this.dangerouslyFatal = dangerouslyFatal;
    }
  }
}
makeNamedError(CliError, 'CliError');

/**
 * Represents trying to execute a CLI command that has not yet been implemented.
 */
// TODO: replace with named-app-error (or whatever it's called now) class
export class CommandNotImplementedError extends CliError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = ['CommandNotImplementedError', 'CliError'];
  /**
   * Represents trying to execute a CLI command that has not yet been
   * implemented.
   */
  constructor() {
    super(ErrorMessage.CommandNotImplemented(), {
      suggestedExitCode: FrameworkExitCode.NotImplemented
    });
  }
}
makeNamedError(CommandNotImplementedError, 'CommandNotImplementedError');

/**
 * Represents an exceptional event that should result in the immediate
 * termination of the application but with an exit code indicating success
 * (`0`).
 */
// TODO: replace with named-app-error (or whatever it's called now) class
export class GracefulEarlyExitError extends CliError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = ['GracefulEarlyExitError', 'CliError'];
  /**
   * Represents an exceptional event that should result in the immediate
   * termination of the application but with an exit code indicating success
   * (`0`).
   */
  constructor() {
    super(ErrorMessage.GracefulEarlyExit(), {
      suggestedExitCode: FrameworkExitCode.Ok,
      // * Is ignored by runProgram anyway
      dangerouslyFatal: false
    });
  }
}
makeNamedError(GracefulEarlyExitError, 'GracefulEarlyExitError');

/**
 * Represents a failed sanity check.
 */
// TODO: replace with named-app-error (or whatever it's called now) class
export class AssertionFailedError extends CliError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = ['AssertionFailedError', 'CliError'];
  /**
   * Represents a failed sanity check.
   */
  constructor(message: string) {
    super(message, {
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}
makeNamedError(AssertionFailedError, 'AssertionFailedError');

/**
 * A collection of possible error and warning messages emitted by Black Flag.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...NamedErrorMessage,
  Generic() {
    return 'an error occurred that caused this software to crash';
  },
  CommandNotImplemented() {
    return 'this command is currently unimplemented';
  },
  InvalidSubCommandInvocation() {
    return 'invalid sub-command: you must call this with a valid sub-command argument';
  },
  FrameworkError(error: unknown) {
    return `UNHANDLED FRAMEWORK EXCEPTION: an error occurred due to a misconfiguration. This is typically due to developer error and as such cannot be fixed by end-users. Please report this incident to the developer of this application.\nError: ${error}`;
  },
  GracefulEarlyExit() {
    return 'execution is ending exceptionally early, which is not a bad thing!';
  },
  ConfigLoadFailure(path: string) {
    return `failed to load configuration from file: ${path}`;
  },
  InvalidConfigureArgumentsReturnType() {
    return 'configureArguments must return typeof process.argv';
  },
  InvalidConfigureExecutionContextReturnType() {
    return 'configureExecutionContext must return ExecutionContext';
  },
  InvalidCharacters(str: string, violation: string) {
    return `string "${str}" contains one or more illegal characters: ${violation}`;
  },
  AssertionFailureDuplicateCommandName(
    parentFullName: string | undefined,
    name1: string,
    type1: 'name' | 'alias',
    name2: string,
    type2: 'name' | 'alias'
  ) {
    return (
      (parentFullName
        ? `one or more child commands of "${parentFullName}" are`
        : `the root command is`) +
      ` attempting to register conflicting command names and/or aliases: "${name1}" (${type1}) conflicts with "${name2}" (${type2})`
    );
  },
  AssertionFailureConfigureExecutionEpilogue() {
    return 'configureExecutionEpilogue must return Arguments';
  },
  AssertionFailureInvalidCommandExport(name: string) {
    return `the ${name}'s command export must start with either "$0" or "$0 "`;
  },
  AssertionFailureNoConfigurationLoaded(path: string) {
    return `auto-discovery failed to find any valid configuration files or directories at path: ${path}`;
  },
  AssertionFailureBadConfigurationPath(path: unknown) {
    return `auto-discovery failed because configuration module path is unreadable or does not exist: "${path}"`;
  },
  AssertionFailureInvocationNotAllowed(name: string) {
    return `invocation of method "${name}" is not allowed here. See documentation for details`;
  },
  AssertionFailureCannotExecuteMultipleTimes() {
    return 'yargs does not support safely calling "parse"/"parseAsync" more than once on the same instance. See documentation for details';
  },
  AssertionFailureBadParameterCombination() {
    return 'cannot provide both "configurationHooks" and "preExecutionContext" properties';
  },
  AssertionFailureUseParseAsyncInstead() {
    return '"parseSync" is not supported. Use "parseAsync" instead';
  },
  AssertionFailureReachedTheUnreachable() {
    return 'an unreachable block of code was somehow reached';
  }
};
