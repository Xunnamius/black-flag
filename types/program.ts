import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase as _Arguments, Argv as _Program } from 'yargs';

import type { ExtendedDebugger } from 'multiverse/rejoinder';
import type { ConfigureArguments, ConfigureExecutionEpilogue } from 'types/configure';
import type { Configuration } from 'types/module';
import type { $executionContext } from 'universe/constant';

// ? Used by intellisense and in auto-generated documentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { runProgram } from 'universe/util';

/**
 * Represents the most generic form of {@link Arguments}.
 */
export type AnyArguments = Arguments<Record<string, unknown>>;

/**
 * Represents the parsed CLI arguments, plus `_` and `$0`, any (hidden)
 * arguments/properties specific to Black Flag, and an indexer falling back to
 * `unknown` for unrecognized arguments.
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
    'command' | 'showHelpOnFail' | 'version' | 'help' | 'exitProcess' | 'commandDir'
  > & {
    // ? Adds custom overload signatures that fixes the lack of implementation
    // ? signature exposure in the Argv type exposed by yargs

    /**
     * @see `yargs::command`
     */
    command: {
      (
        command: string[],
        description: Configuration<CustomCliArguments>['description'],
        builder:
          | ((yargs: _Program, helpOrVersionSet: boolean) => _Program)
          | Record<string, never>,
        handler: Configuration<CustomCliArguments>['handler'],
        // ? configureArguments already handles this use case, so...
        middlewares: [],
        deprecated: Configuration<CustomCliArguments>['deprecated']
      ): Program<CustomCliArguments>;
    };

    /**
     * Like `yargs::showHelpOnFail`, but with no second `message` parameter. If
     * you want to output some specific error message, use a configuration hook
     * or `yargs::epilogue`.
     *
     * @see `yargs::showHelpOnFail`
     */
    showHelpOnFail: (enabled: boolean) => Program<CustomCliArguments>;

    /**
     * @see `yargs::version`
     */
    version: {
      (version: string | false): Program<CustomCliArguments>;
    };

    /**
     * Identical to `yargs::command` except its execution is enqueued and
     * deferred until {@link Program.command_finalize_deferred} is called.
     *
     * @see `yargs::command`
     * @internal
     */
    command_deferred: Program<CustomCliArguments>['command'];

    /**
     * @see {@link Program.command_deferred}
     * @internal
     */
    command_finalize_deferred: () => void;
  };

/**
 * Represents an "effector" {@link Program} instance.
 */
export type EffectorProgram<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
> = Omit<
  Program<CustomCliArguments>,
  'command_deferred' | 'command_finalize_deferred' | 'parse' | 'parseSync' | 'argv'
>;

/**
 * Represents an "helper" {@link Program} instance.
 */
export type HelperProgram<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
> = Omit<
  Program<CustomCliArguments>,
  'command' | 'positional' | 'parse' | 'parseSync' | 'argv'
>;

/**
 * Represents an "router" {@link Program} instance.
 */
export type RouterProgram<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
> = Pick<Program<CustomCliArguments>, 'parseAsync' | 'command' | 'parsed'>;

/**
 * Represents valid {@link Configuration} module types that can be loaded.
 */
export type ProgramType = 'pure parent' | 'parent-child' | 'pure child';

/**
 * Represents the three program types that comprise any Black Flag command.
 */
export type ProgramDescriptor = 'effector' | 'helper' | 'router';

/**
 * Accepts a `Descriptor` type and maps it to one of the `XProgram` types.
 */
export type DescriptorToProgram<
  Descriptor extends ProgramDescriptor,
  CustomCliArguments extends Record<string, unknown> = EmptyObject
> = 'effector' extends Descriptor
  ? EffectorProgram<CustomCliArguments>
  : 'helper' extends Descriptor
    ? HelperProgram<CustomCliArguments>
    : RouterProgram<CustomCliArguments>;

/**
 * Represents the program types that represent every Black Flag command as
 * aptly-named values in an object.
 */
export type Programs<CustomCliArguments extends Record<string, unknown> = EmptyObject> = {
  [Descriptor in ProgramDescriptor]: DescriptorToProgram<Descriptor, CustomCliArguments>;
};

/**
 * Represents the meta information about a discovered command and its
 * corresponding {@link Configuration} object/file.
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
   * ever be one `RootConfiguration`, and it **MUST** be the first command
   * module auto-discovered and loaded (invariant).
   */
  type: ProgramType;
  /**
   * Absolute filesystem path to the loaded configuration file.
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
 * the parsed and validated arguments object returned by the root router
 * {@link Program} instance.
 *
 * **This function throws whenever an exception occurs**, making it not ideal as
 * an entry point for a CLI. See {@link runProgram} for a wrapper function that
 * handles exceptions and sets the exit code for you.
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
   * An object containing the effector, helper, and router {@link Program}
   * instances belonging to the root command.
   */
  programs: Programs;
  /**
   * Execute the root command, parsing any available CLI arguments and running
   * the appropriate handler, and return the resulting final parsed arguments
   * object.
   *
   * **This function throws whenever an exception occurs**, making it not ideal
   * as an entry point for a CLI. See {@link runProgram} for a wrapper function
   * that handles exceptions and sets the exit code for you.
   */
  execute: Executor;
};

/**
 * Represents a globally-accessible shared context object singleton.
 */
export type ExecutionContext = {
  /**
   * A Map consisting of auto-discovered {@link Program} instances and their
   * associated {@link ProgramMetadata} as singular object values with their
   * respective _full names_ as keys.
   *
   * Note that key-value pairs will always be iterated in insertion order,
   * implying the first pair in the Map will always be the root command.
   */
  commands: Map<string, { programs: Programs; metadata: ProgramMetadata }>;
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
     * Since it will be actively manipulated by each command in the arguments
     * list, **do not rely on `rawArgv` for anything other than checking
     * invariant satisfaction.**
     *
     * @default []
     */
    rawArgv: typeof process.argv;
    /**
     * The detected width of the terminal. This value is determined by yargs
     * when `configureProgram` is called.
     */
    initialTerminalWidth: number;
    /**
     * If `true`, Black Flag is currently in the process of handling a graceful
     * exit.
     *
     * Checking the value of this flag is useful in configuration hooks like
     * `configureExecutionEpilogue`, which are still executed when a
     * `GracefulEarlyExitError` is thrown. In almost every other context, this
     * will _always_ be `false`.
     *
     * @default false
     */
    isGracefullyExiting: boolean;
    /**
     * If `isHandlingHelpOption` is `true`, Black Flag is currently in the
     * process of getting yargs to generate help text for a child command.
     *
     * Checking the value of this property is useful when you want to know if
     * `--help` (or whatever your equivalent option is) was passed to the root
     * command. The value of `isHandlingHelpOption` is also used to determine
     * the value of `helpOrVersionSet` in commands' `builder` functions.
     *
     * We have to track this separately from yargs since we're stacking multiple
     * yargs instances and they all want to be the one that handles generating
     * help text.
     *
     * Note: setting `isHandlingHelpOption` to `true` manually will cause Black
     * Flag to output help text as if the user had specified `--help` (or an
     * equivalent) as one of their arguments.
     *
     * @default false
     */
    isHandlingHelpOption: boolean;
    /**
     * `globalHelpOption` replaces the functionality of the disabled vanilla
     * yargs `yargs::help` method. Set this to the value you want using the
     * `configureExecutionContext` configuration hook (any other hook is run too
     * late). `name`, if provided, must be >= 1 character in length. If `name`
     * is exactly one character in length, the help option will take the form of
     * `-${name}`, otherwise `--${name}`.
     *
     * Note: this property should not be accessed or mutated by end-developers
     * outside of the `configureExecutionContext` configuration hook. Doing so
     * will result in undefined behavior.
     *
     * @default { name: "help", description: defaultHelpTextDescription }
     */
    globalHelpOption: { name: string; description: string } | undefined;
    /**
     * If `true`, Black Flag will dump help text to stderr when an error occurs.
     * This is also set when `Program::showHelpOnFail` is called.
     *
     * @default true
     */
    showHelpOnFail: boolean;
    /**
     * Allows helper and effector programs to keep track of pre-pared arguments.
     *
     * Note: this property should not be accessed or mutated by end-developers.
     *
     * @default undefined
     */
    firstPassArgv: AnyArguments | undefined;

    [key: string]: unknown;
  };

  [key: string]: unknown;
};
