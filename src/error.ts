import { isNativeError } from 'node:util/types';

import {
  AppError,
  ErrorMessage as NamedErrorMessage,
  makeNamedError
} from 'named-app-errors';

import { FrameworkExitCode } from 'universe/constant';

// TODO: replace a lot of all that follows with the official package(s),
// TODO: including the symbol use below

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
 * Options available when constructing a new `CliError` object.
 */
export type CliErrorOptions = {
  /**
   * The exit code that will be returned when the program exits, given nothing
   * else goes wrong in the interim.
   *
   * @default FrameworkExitCode.DefaultError
   */
  suggestedExitCode?: number;
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
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = ['CliError'];
  /**
   * Represents a CLI-specific error, optionally with suggested exit code and
   * other context.
   */
  constructor(cause: Error | string, options?: CliErrorOptions);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(
    cause: Error | string,
    options: CliErrorOptions,
    message: string,
    superOptions: ErrorOptions
  );
  constructor(
    cause: Error | string,
    { suggestedExitCode }: CliErrorOptions = {},
    message: string | undefined = undefined,
    superOptions: ErrorOptions = {}
  ) {
    super(message ?? (typeof cause === 'string' ? cause : cause.message), {
      cause,
      ...superOptions
    });

    if (suggestedExitCode !== undefined) {
      this.suggestedExitCode = suggestedExitCode;
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
   * Represents trying to execute a CLI command that has not yet been implemented.
   */
  constructor() {
    super(ErrorMessage.NotImplemented(), {
      suggestedExitCode: FrameworkExitCode.NotImplemented
    });
  }
}
makeNamedError(CommandNotImplementedError, 'CommandNotImplementedError');

/**
 * Represents an exceptional event that should result in the immediate
 * termination of the program but with an exit code indicating success (`0`).
 */
// TODO: replace with named-app-error (or whatever it's called now) class
export class GracefulEarlyExitError extends CliError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = ['GracefulEarlyExitError', 'CliError'];
  /**
   * Represents trying to execute a CLI command that has not yet been implemented.
   */
  constructor() {
    super(ErrorMessage.GracefulEarlyExit(), { suggestedExitCode: FrameworkExitCode.Ok });
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
  AssertionFailureConfigureExecutionEpilogue() {
    return 'configureExecutionEpilogue must return Arguments';
  },
  AssertionFailureExistenceInvariant() {
    return 'existence variant violated: failed to acquire first parse result';
  },
  AssertionFailureOrderingInvariant() {
    return 'flags, switches, and other such parameters must appear after the final command name in your arguments list, not before';
  },
  AssertionFailureNamingInvariant(name: string) {
    return `the ${name}::command must start with either "$0" or "$0 "`;
  },
  InvalidConfigureArgumentsReturnType() {
    return 'configureArguments must return typeof process.argv';
  },
  InvalidConfigureExecutionContextReturnType() {
    return 'configureExecutionContext must return ExecutionContext';
  },
  GracefulEarlyExit() {
    return 'execution is ending exceptionally early, which is not a bad thing!';
  },
  ConfigLoadFailure(path: string) {
    return `failed to load configuration from file: ${path}`;
  },
  InvalidCharacters(str: string, violation: string) {
    return `string "${str}" contains one or more illegal characters: ${violation}`;
  },
  AssertionFailureInvocationNotAllowed(name: string) {
    return `method "${name}" can only be called on this program's shadow instance. See documentation for details`;
  },
  AssertionFailureCannotExecuteMultipleTimes() {
    return 'yargs does not support safely calling "parse" more than once on the same instance. See documentation for details';
  }
};
