/**
 * A symbol allowing access to the `ExecutionContext` object "hidden" within
 * each `Arguments` instance.
 */
export const $executionContext = Symbol('execution-context');

/**
 * Hard-coded default command `usage` text provided to programs via
 * `.usage(...)` after string interpolation. "$000", "$0", and "$1" are replaced
 * with a command's usage DSL (`command` export), name (`name` export), and
 * description (`description` export) respectively.
 */
export const defaultUsageText = 'Usage: $000\n\n$1';

/**
 * Hard-coded default command `description` text provided used in string
 * interpolation and elsewhere.
 */
export const defaultHelpTextDescription = 'Show help text';

/**
 * Hard-coded default option name for dumping help text to stdout. For example:
 * `--${defaultHelpOptionName}`.
 */
export const defaultHelpOptionName = 'help';

/**
 * Well-known exit codes shared across CLI implementations.
 */
export enum FrameworkExitCode {
  /**
   * The exit code used when execution succeeds and exits gracefully.
   */
  Ok = 0,
  /**
   * Hard-coded default fallback exit code when fatal errors occur.
   */
  DefaultError = 1,
  /**
   * The exit code used when executing an unimplemented child command.
   */
  NotImplemented = 2,
  /**
   * The exit code used when a sanity check fails. If your CLI is spitting out
   * this code, that's a hint to re-run things in debug mode (example:
   * `DEBUG='black-flag*' npx jest`) since an error is being suppressed.
   *
   * In most cases, this exit code is indicative of improper use of Black Flag.
   */
  AssertionFailed = 3
}
