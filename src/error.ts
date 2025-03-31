import { isNativeError } from 'node:util/types';

import {
  AppError,
  ErrorMessage as NamedErrorMessage,
  makeNamedError
} from 'named-app-errors';

import { FrameworkExitCode } from 'universe:constant.ts';

import type {
  // ? This import is referenced in a type comment
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  runProgram
} from 'universe';

import type { ExecutionContext } from 'universe:types/program.ts';

/**
 * Type guard for the internal Yargs `YError`.
 */
export function isYargsError(
  parameter: unknown
): parameter is Error & { name: 'YError' } {
  return isNativeError(parameter) && parameter.name === 'YError';
}

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
   * If `showHelp` is set to a string that isn't `"default"`, help text will be
   * sent to stderr. Note that help text is always sent _before this exception
   * finishes bubbling up to `ConfigureErrorHandlingEpilogue`_.
   *
   * Specifically, if `showHelp` is set to `"full"`, the full help text will be
   * sent to stderr, including the entire `usage` string. If set to `"short"`
   * (or `true`), the same help text will be sent to stderr except only the
   * first line of usage will be included. In either case, help text will be
   * sent to stderr regardless of the value of
   * [ExecutionContext.state.showHelpOnFail](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md#showhelponfail).
   *
   * Alternatively, if set to `"default"`, the value of
   * [ExecutionContext.state.showHelpOnFail](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md#showhelponfail)
   * will be used. And if set to `false`, no help text will be sent to stderr
   * due to this error regardless of the value of
   * [ExecutionContext.state.showHelpOnFail](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md#showhelponfail).
   *
   * Note that, regardless of this `showHelp`, help text is always output when a
   * parent command is invoked that (1) has one or more child commands and (2)
   * lacks its own handler implementation or implements a handler that throws
   * {@link CommandNotImplementedError}.
   *
   * @default "default"
   */
  showHelp?:
    | Extract<ExecutionContext['state']['showHelpOnFail'], object>['outputStyle']
    | 'default'
    | boolean;
  /**
   * This option is similar in intent to Yargs's `exitProcess()` function,
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
   *
   * @default false
   */
  dangerouslyFatal?: boolean;
  /**
   * By default, if an `Error` object is passed to `CliError`, that
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
export class CliError
  extends AppError
  implements Required<Omit<CliErrorOptions, 'cause'>>, Pick<CliErrorOptions, 'cause'>
{
  suggestedExitCode = FrameworkExitCode.DefaultError;
  showHelp = 'default' as NonNullable<Exclude<CliErrorOptions['showHelp'], true>>;
  dangerouslyFatal = false;
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = ['CliError'];
  /**
   * Represents a CLI-specific error, optionally with suggested exit code and
   * other context.
   */
  constructor(reason?: Error | string, options?: CliErrorOptions);
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
    reason: Error | string | undefined,
    options: CliErrorOptions = {},
    message: string | undefined = undefined,
    superOptions: ErrorOptions = {}
  ) {
    const { suggestedExitCode, showHelp, dangerouslyFatal } = options;
    let { cause } = options;

    message =
      message ??
      (typeof reason === 'string' ? reason : reason?.message) ??
      BfErrorMessage.Generic();

    if (!('cause' in options)) {
      cause = typeof reason === 'string' ? undefined : reason;
    }

    super(message, { cause, ...superOptions });

    if (suggestedExitCode !== undefined) {
      this.suggestedExitCode = suggestedExitCode;
    }

    if (showHelp !== undefined) {
      this.showHelp = showHelp === true ? 'short' : showHelp;
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
  override [$type] = ['CommandNotImplementedError', 'CliError'];
  /**
   * Represents trying to execute a CLI command that has not yet been
   * implemented.
   */
  constructor(error?: Error, options?: CliErrorOptions) {
    super(error ? error.message : BfErrorMessage.CommandNotImplemented(), {
      ...(error ? { cause: error } : {}),
      showHelp: false,
      ...options,
      suggestedExitCode: FrameworkExitCode.NotImplemented
    });
  }
}
makeNamedError(CommandNotImplementedError, 'CommandNotImplementedError');

/**
 * Represents an exceptional event that should result in the immediate
 * termination of the application but with an exit code indicating success
 * (`0`).
 *
 * Note that {@link CliErrorOptions.dangerouslyFatal}, if given, is always
 * ignored.
 */
// TODO: replace with named-app-error (or whatever it's called now) class
export class GracefulEarlyExitError extends CliError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  override [$type] = ['GracefulEarlyExitError', 'CliError'];
  /**
   * Represents an exceptional event that should result in the immediate
   * termination of the application but with an exit code indicating success
   * (`0`).
   *
   * Note that {@link CliErrorOptions.dangerouslyFatal}, if given, is always
   * ignored.
   */
  constructor(reason?: Error | string, options?: CliErrorOptions) {
    super(
      reason
        ? typeof reason === 'string'
          ? reason
          : reason.message
        : BfErrorMessage.GracefulEarlyExit(),
      {
        ...(reason
          ? { cause: typeof reason === 'string' ? new Error(reason) : reason }
          : {}),
        showHelp: false,
        ...options,
        suggestedExitCode: FrameworkExitCode.Ok,
        // * Is ignored by runProgram anyway
        dangerouslyFatal: false
      }
    );
  }
}
makeNamedError(GracefulEarlyExitError, 'GracefulEarlyExitError');

/**
 * Represents a failed sanity check.
 */
// TODO: replace with named-app-error (or whatever it's called now) class
export class AssertionFailedError extends CliError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  override [$type] = ['AssertionFailedError', 'CliError'];
  /**
   * Represents a failed sanity check.
   */
  constructor(error: Error, options?: CliErrorOptions);
  constructor(message: string, options?: CliErrorOptions);
  constructor(errorOrMessage?: Error | string, options?: CliErrorOptions);
  /**
   * Represents a failed sanity check.
   */
  constructor(errorOrMessage?: Error | string, options?: CliErrorOptions) {
    super(
      typeof errorOrMessage === 'string' ? errorOrMessage : errorOrMessage?.message,
      {
        showHelp: false,
        ...options,
        suggestedExitCode: FrameworkExitCode.AssertionFailed,
        cause: errorOrMessage
      }
    );
  }
}
makeNamedError(AssertionFailedError, 'AssertionFailedError');

/**
 * A collection of possible error and warning messages emitted by Black Flag.
 */
/* istanbul ignore next */
export const BfErrorMessage = {
  GuruMeditation: NamedErrorMessage.GuruMeditation,
  BuilderCalledOnInvalidPass(pass: 'first-pass' | 'second-pass') {
    return `a builder function was invoked during Black Flag's ${pass.replace('-', ' ')} when it expected to be invoked during its ${pass === 'first-pass' ? 'second pass' : 'first pass'} instead`;
  },
  BuilderCannotBeAsync(commandName: string) {
    return `command "${commandName}" exported an asynchronous builder function, which triggers buggy behavior in Yargs. Black Flag supports exporting an asynchronous default function in CJS files and top-level await in ESM files, so hoist any async logic out of this command's builder. See the documentation for details`;
  },
  Generic() {
    return 'an error occurred that caused this software to crash';
  },
  CommandNotImplemented() {
    return 'this command is currently unimplemented';
  },
  InvalidSubCommandInvocation() {
    return 'invalid subcommand: you must call this with a valid subcommand argument';
  },
  FrameworkError(error: unknown) {
    return `UNHANDLED FRAMEWORK EXCEPTION: an error occurred due to a misconfiguration. This is typically due to developer error and as such cannot be fixed by end-users. Please report this incident to the developer of this application. For more information about this error, rerun the command with the DEBUG='bf:*' or DEBUG='*' environment variable set.\n\nException details: ${
      isNativeError(error) ? error.stack || error : String(error)
    }`;
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
  InvalidConfigureExecutionEpilogueReturnType() {
    return 'configureExecutionEpilogue must return Arguments';
  },
  InvalidConfigureExecutionContextReturnType() {
    return 'configureExecutionContext must return ExecutionContext';
  },
  InvalidExecutionContextBadField(fieldName: string) {
    return `encountered invalid or impossible value for ExecutionContext field "${fieldName}"`;
  },
  InvalidCharacters(str: string, violation: string) {
    return `string "${str}" contains one or more illegal characters: ${violation}`;
  },
  PathIsNotDirectory() {
    return 'path is not a directory';
  },
  DuplicateCommandName(
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
  InvalidCommandExportBadStart(name: string) {
    return `the ${name}'s command export must start with either "$0" or "$0 "`;
  },
  InvalidCommandExportBadPositionals(name: string) {
    return `the ${name}'s command export must be a valid Yargs command DSL string. See: https://github.com/yargs/yargs/blob/main/docs/advanced.md#positional-arguments for examples`;
  },
  NoConfigurationLoaded(path: string) {
    return `auto-discovery failed to find any valid configuration files or directories at path: ${path}`;
  },
  BadConfigurationPath(path: unknown) {
    return `auto-discovery failed because configuration module path is unreadable or does not exist: "${String(path)}"`;
  },
  InvocationNotAllowed(name: string) {
    return `invocation of method "${name}" is not allowed here. See documentation for details`;
  },
  CannotExecuteMultipleTimes() {
    return 'Yargs does not support safely calling "parse"/"parseAsync" more than once on the same instance. See documentation for details';
  },
  BadParameterCombination() {
    return 'must provide exactly one of the following options: configurationHooks, preExecutionContext';
  },
  UseParseAsyncInstead() {
    return '"parseSync" is not supported. Use "parseAsync" instead';
  }
};
