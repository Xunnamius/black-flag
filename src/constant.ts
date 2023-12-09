import type { Argv } from 'yargs';

/**
 * A symbol allowing access to the `ExecutionContext` object "hidden" within
 * each `Arguments` instance.
 */
export const $executionContext = Symbol('execution-context');

/**
 * Hard-coded default program `usage` text provided to yargs instances via
 * `.usage(...)` after string interpolation where "$000", "$0", and "$1" are
 * replaced with a command's usage DSL, name (extracted from usage DSL), and
 * description (respectively).
 */
export const DEFAULT_USAGE_TEXT = 'Usage: $000\n\n$1';

/**
 * These are `Program` instance properties that Black Flag will suppress upon
 * invocation/access if and only if said program is not a shadow clone.
 */
export const DISALLOWED_NON_SHADOW_PROGRAM_METHODS: readonly (keyof Argv)[] = [
  'strict',
  'strictCommands',
  'strictOptions'
];

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
   * The exit code used when executing an unimplemented child program.
   */
  NotImplemented = 2,
  /**
   * The exit code used when a sanity check fails. If your CLI is spitting out
   * this code, that's a hint to re-run things in debug mode (example:
   * `DEBUG='*' npx jest`) since an error is being silently swallowed.
   *
   * In most cases, this exit code is indicative of improper use of Black Flag.
   */
  AssertionFailed = 3
}
