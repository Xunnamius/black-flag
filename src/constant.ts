/**
 * The project-wide namespace that appears in debugger output.
 */
export const globalDebuggerNamespace = 'bf';

/**
 * The `NullArguments::$0` constant value.
 */
export const nullArguments$0 =
  '<NullArguments: no parse result available due to exception>';

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
 * Hard-coded default option name for dumping help text to stdout. For example:
 * `--${defaultHelpOptionName}`.
 */
export const defaultHelpOptionName = 'help';

/**
 * Hard-coded default help option description text.
 */
export const defaultHelpTextDescription = 'Show help text';

/**
 * Hard-coded default option name for dumping version text to stdout. For
 * example: `--${defaultVersionOptionName}`.
 */
export const defaultVersionOptionName = 'version';

/**
 * Hard-coded default version option description text.
 */
export const defaultVersionTextDescription = 'Show version number';

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
   * The exit code used when a sanity check fails. This includes (but is not
   * limited to) all _framework errors_.
   *
   * If your CLI is spitting out this code, deeper insight can be had by
   * re-running things in debug mode (i.e. `DEBUG='bf:*' npx jest` or `DEBUG='*'
   * npx jest`).
   *
   * In most (but not all) cases, this exit code is indicative of improper use
   * of Black Flag by the developer.
   */
  AssertionFailed = 3
}
