import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase as _Arguments, Argv as _Program } from 'yargs';

import type { ExtendedDebugger } from 'multiverse/rejoinder';
import type { ConfigureArguments, ConfigureExecutionEpilogue } from 'types/configure';
import type { Configuration } from 'types/module';
import type { $executionContext } from 'universe/constant';

/**
 * Represents the most generic form of {@link Arguments}.
 */
export type AnyArguments = Arguments<Record<string, unknown>>;

/**
 * Represents the shape of the parsed CLI arguments, plus `_` and `$0`, any
 * (hidden) arguments/properties specific to Black Flag, and an indexer falling
 * back to `unknown` for unrecognized arguments.
 */
export type Arguments<CustomCliArguments extends Record<string, unknown> = EmptyObject> =
  _Arguments<FrameworkArguments & CustomCliArguments>;

/**
 * Represents the most generic form of {@link Program}.
 */
export type AnyProgram = Program<Record<string, unknown>>;

/**
 * Represents a pre-configured yargs instance ready for argument parsing and
 * execution.
 *
 * `Program` is essentially a drop-in replacement for the `Argv` type exported
 * by yargs but with several differences and should be preferred.
 */
export type Program<CustomCliArguments extends Record<string, unknown> = EmptyObject> =
  Omit<
    _Program<FrameworkArguments & CustomCliArguments>,
    'command' | 'showHelpOnFail' | 'version'
  > & {
    // ? Adds custom overload signatures that fixes the lack of implementation
    // ? signature exposure in the Argv type exposed by yargs

    /**
     * @see `yargs::command`
     */
    command: _Program<CustomCliArguments>['command'] & {
      (
        command: string | string[],
        description: Configuration<CustomCliArguments>['description'],
        builder: Configuration<CustomCliArguments>['builder'],
        handler: Configuration<CustomCliArguments>['handler'],
        // ? configureArguments already handles this use case, so...
        middlewares: [],
        deprecated: Configuration<CustomCliArguments>['deprecated']
      ): Program<CustomCliArguments>;
    };

    /**
     * Like `yargs::showHelpOnFail`, but with no second `message` parameter. If
     * you want to output some specific error message, use a configuration hook.
     *
     * @see `yargs::showHelpOnFail`
     */
    showHelpOnFail: (enabled: boolean) => Program<CustomCliArguments>;

    /**
     * @see `yargs::version`
     */
    version: _Program<CustomCliArguments>['version'] & {
      (version: string | false): Program<CustomCliArguments>;
    };

    /**
     * Identical to `yargs::command` except its execution is enqueued and
     * deferred until {@link Program[command_finalize_deferred]} is called.
     *
     * @see `yargs::command`
     * @internal
     */
    command_deferred: Program<CustomCliArguments>['command'];

    /**
     * @see {@link Program[command_deferred]}
     * @internal
     */
    command_finalize_deferred: () => void;

    /**
     * Invokes `yargs::strict(enabled)`, `yargs::strictCommands(enabled)`, and
     * `yargs::strictOptions(enabled)` on behalf of the caller.
     *
     * This function allows you to bypass
     * `DISALLOWED_NON_SHADOW_PROGRAM_METHODS` and disable strictness on
     * non-shadow yargs instances. Note that **doing so will effectively break
     * Black Flag and result in undefined behavior**.
     *
     * @default true
     * @internal
     */
    strict_force: (enabled: boolean) => void;

    /**
     * Invokes `yargs::help` on behalf of the caller.
     *
     * This function allows you to bypass the global version of yargs::help that
     * Black Flag exposes by default.
     *
     * @default true
     * @internal
     */
    help_force: Program<CustomCliArguments>['help'];
  };

/**
 * Represents the meta information about a discovered {@link Program} instance
 * and its corresponding {@link Configuration} object/file.
 */
export type ProgramMetadata = {
  /**
   * The "type" of {@link Configuration} that was loaded, indicating which
   * interface to expect when interacting with `configuration`. The
   * possibilities are:
   *
   * - **root**: implements `RootConfiguration` (the only pure
   *   `ParentConfiguration`)
   * - **parent-child**: implements `ParentConfiguration`, `ChildConfiguration`
   * - **child**: implements `ChildConfiguration`
   *
   * Note that "root" `type` configurations are unique in that there will only
   * ever be one `RootConfiguration` instance, and it **MUST** be the first
   * command module auto-discovered and loaded (invariant).
   */
  type: 'root' | 'parent-child' | 'child';
  /**
   * Absolute filesystem path to the configuration file used to configure the
   * program.
   */
  filepath: string;
  /**
   * The basename of `filepath`.
   */
  filename: string;
  /**
   * The basename of `filepath` with the trailing extension trimmed.
   */
  filenameWithoutExtension: string;
  /**
   * The basename of the direct parent directory containing `filepath`.
   */
  parentDirName: string;
  /**
   * Each individual program is represented in memory as two distinct
   * {@link Program} instances: the "actual" command instance and a clone of
   * this instance, i.e. its "shadow". The actual command and its shadow clone
   * are identical except the actual command is never set to strict mode while
   * the shadow is set to strict mode by default.
   *
   * This facilitates the double-parsing necessary for both _dynamic options_
   * and _dynamic strictness_.
   *
   * Therefore: if you want to configure the instance responsible for proxying
   * control to child programs, operate on the actual instance. On the other
   * hand, if you want to configure the instance responsible for running a
   * program's actual `handler` function, you should operate on `shadow`.
   *
   * With dynamic options, Black Flag can accurately parse the given arguments
   * with the actual instance and then invoke the shadow clone afterwards,
   * feeding its `builder` function a proper `argv` parameter.
   *
   * With dynamic strictness, Black Flag can set both parent and child (shadow)
   * programs to strict mode while still facilitating the actual command
   * hierarchy where ancestor commands are not aware of the syntax of their
   * descendants, which vanilla yargs strict mode definitely does not support.
   */
  shadow: AnyProgram;
};

/**
 * Represents the CLI arguments/properties added by Black Flag rather than the
 * end developer.
 *
 * Instead of using this type directly, your project's custom arguments (e.g.
 * `MyCustomArgs`) should be wrapped with the {@link Arguments} generic type
 * (e.g. `Arguments<MyCustomArgs>`), which will extend `FrameworkArguments` for
 * you.
 */
export type FrameworkArguments = {
  [$executionContext]: ExecutionContext;
};

/**
 * This function accepts an optional `rawArgv` array that defaults to
 * `yargs::hideBin(process.argv)` and returns an arguments object representing
 * the parsed CLI input for the given root {@link Program}.
 *
 * **This function throws whenever an exception occurs** (including exceptions
 * representing a graceful exit), making it not ideal as an entry point for a
 * CLI. See `runProgram` for a wrapper function that handles exceptions and sets
 * the exit code for you.
 */
export type Executor = (
  /**
   * @default hideBin(process.argv)
   */
  rawArgv?: Parameters<ConfigureArguments>[0]
) => Promise<Awaited<ReturnType<ConfigureExecutionEpilogue>>>;

/**
 * Represents the pre-execution context that is the result of calling
 * `configureProgram`.
 */
export type PreExecutionContext<
  CustomContext extends ExecutionContext = ExecutionContext
> = CustomContext & {
  /**
   * The root yargs {@link Program}.
   */
  program: Program;
  /**
   * Execute `program`, parsing any available CLI arguments and running the
   * appropriate handler, and return the resulting final parsed arguments
   * object.
   *
   * **This function throws whenever an exception occurs** (including exceptions
   * representing a graceful exit), making it not ideal as an entry point for a
   * CLI. See `runProgram` for a wrapper function that handles exceptions and
   * sets the exit code for you.
   */
  execute: Executor;
};

/**
 * Represents a globally-accessible shared context object singleton.
 */
export type ExecutionContext = {
  /**
   * A Map consisting of auto-discovered {@link Program} instances and their
   * associated {@link ProgramMetadata} (including shadow {@link Program}
   * instances) as values with their respective _full names_ as keys.
   *
   * Note that key-value pairs will always be iterated in insertion order,
   * implying the first pair in the Map, if there are any pairs, will always be
   * the root program.
   */
  commands: Map<string, { program: AnyProgram; metadata: ProgramMetadata }>;
  /**
   * The {@link ExtendedDebugger} for the current runtime level.
   */
  debug: ExtendedDebugger;
  /**
   * The current state of the execution environment.
   */
  state: {
    /**
     * A subset of the original argv returned by {@link ConfigureArguments}. It
     * is used internally to give the final command in the arguments list the
     * chance to parse argv. Further, it is used to enforce the ordering
     * invariant on chained child program invocations. That is: all
     * non-positional arguments must appear _after_ the last command name in any
     * arguments list parsed by this program.
     *
     * For example:
     *  - Good (satisfies invariant): `rootcmd subcmd subsubcmd --help`
     *  - Bad (violation of invariant): `rootcmd --help subcmd subsubcmd`
     *
     * Since it will be actively manipulated by each command in the arguments
     * list, **do not rely on `rawArgv` for anything other than checking
     * invariant satisfaction.**
     */
    rawArgv: typeof process.argv;
    /**
     * The detected width of the terminal. This value is determined by yargs
     * when `configureProgram` is called.
     */
    initialTerminalWidth: number;
    /**
     * If `true`, Black Flag is currently in the process of handling a graceful
     * exit. Checking the value of this flag is useful in configuration hooks
     * like `configureExecutionEpilogue`, which are still executed when a
     * `GracefulEarlyExitError` is thrown.
     *
     * In almost every other case, this will always be `false`.
     *
     * @default false
     */
    isGracefullyExiting: boolean;
    /**
     * If `isHandlingHelpOption` is `true`, Black Flag is currently in the
     * process of getting yargs to generate help text for a child command.
     * Checking the value of this property is useful when you want to know if
     * `--help` (or whatever your equivalent option is) was passed to the root
     * command.
     *
     * We have to track this separately from yargs since we're stacking multiple
     * yargs instances and they all want to be the one that handles generating
     * help text.
     *
     * @default false
     */
    isHandlingHelpOption: boolean;
    /**
     * `globalHelpOption` caches the first argument passed to the `yargs::help`
     * method of the root program. This property is used as part of a strategy
     * to mimic yargs's short-circuiting when the `--help` parameter is
     * given and should not be tampered with or relied upon.
     *
     * @default "help"
     */
    globalHelpOption: string | undefined;

    [key: string]: unknown;
  };

  [key: string]: unknown;
};
