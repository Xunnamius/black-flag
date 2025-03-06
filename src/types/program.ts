import type { ExtendedDebugger } from 'rejoinder';
import type { ArgumentsCamelCase as _Arguments, Argv as _Program } from 'yargs';

import type {
  // ? Used by intellisense and in auto-generated documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  runProgram
} from 'universe';

import type { $executionContext, nullArguments$0 } from 'universe:constant.ts';
import type { ConfigureArguments } from 'universe:types/configure.ts';
import type { Configuration } from 'universe:types/module.ts';

/**
 * Represents the parsed CLI arguments, plus `_` and `$0`, any (hidden)
 * arguments/properties specific to Black Flag, and an indexer falling back to
 * `unknown` for unrecognized arguments.
 */
export type Arguments<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext = ExecutionContext
> = _Arguments<FrameworkArguments<CustomExecutionContext> & CustomCliArguments>;

/**
 * Represents an empty or "null" `Arguments` object devoid of useful data.
 *
 * This result type is fed to certain configuration hooks and returned by
 * various `Arguments`-returning functions when an exceptional event prevents
 * yargs from returning a real `Arguments` parse result.
 */
export type NullArguments<
  CustomExecutionContext extends ExecutionContext = ExecutionContext
> = {
  $0: typeof nullArguments$0;
  _: [];
} & FrameworkArguments<CustomExecutionContext>;

/**
 * Represents a pre-configured yargs instance ready for argument parsing and
 * execution.
 *
 * `Program` is essentially a drop-in replacement for the `Argv` type exported
 * by yargs but with several differences and should be preferred.
 */
export type Program<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext = ExecutionContext
> = Omit<
  _Program<FrameworkArguments<CustomExecutionContext> & CustomCliArguments>,
  | 'command'
  | 'onFinishCommand'
  | 'showHelpOnFail'
  | 'version'
  | 'help'
  | 'exitProcess'
  | 'commandDir'
  | 'parse'
  | 'parsed'
  | 'parseSync'
  | 'argv'
> & {
  // ? Adds custom overload signatures that fixes the lack of implementation
  // ? signature exposure in the Argv type exposed by yargs

  /**
   * @see {@link _Program.command}
   * @internal
   */
  command: (
    command: string[],
    description: Configuration<
      CustomCliArguments,
      CustomExecutionContext
    >['description'],
    builder:
      | ((yargs: _Program, helpOrVersionSet: boolean) => _Program)
      | Record<string, never>,
    handler: Configuration<CustomCliArguments, CustomExecutionContext>['handler'],
    // ? configureArguments already handles this use case, so...
    middlewares: [],
    deprecated: Configuration<CustomCliArguments, CustomExecutionContext>['deprecated']
  ) => Program<CustomCliArguments, CustomExecutionContext>;

  /**
   * Like `yargs::showHelpOnFail` except (1) it also determines if help text is
   * shown when executing an unimplemented parent command and (2) it has no
   * second `message` parameter. If you want to output some specific error
   * message, use a configuration hook or `yargs::epilogue`.
   *
   * Invoking this method will affect all programs in your command hierarchy,
   * not just the program on which it was invoked.
   *
   * @see {@link _Program.showHelpOnFail}
   */
  showHelpOnFail: (
    enabled: boolean
  ) => Program<CustomCliArguments, CustomExecutionContext>;

  /**
   * Identical to `yargs::command` except its execution is enqueued and
   * deferred until {@link Program.command_finalize_deferred} is called.
   *
   * @see {@link _Program.command}
   * @internal
   */
  command_deferred: Program<CustomCliArguments, CustomExecutionContext>['command'];

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
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext = ExecutionContext
> = Omit<
  Program<CustomCliArguments, CustomExecutionContext>,
  'command_deferred' | 'command_finalize_deferred'
>;

/**
 * Represents an "helper" {@link Program} instance.
 */
export type HelperProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext = ExecutionContext
> = Omit<
  Program<CustomCliArguments, CustomExecutionContext>,
  'demand' | 'demandCommand' | 'command'
>;

/**
 * Represents an "router" {@link Program} instance.
 */
export type RouterProgram<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext = ExecutionContext
> = Pick<Program<CustomCliArguments, CustomExecutionContext>, 'parseAsync' | 'command'>;

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
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext = ExecutionContext
> = 'effector' extends Descriptor
  ? EffectorProgram<CustomCliArguments, CustomExecutionContext>
  : 'helper' extends Descriptor
    ? HelperProgram<CustomCliArguments, CustomExecutionContext>
    : RouterProgram<CustomCliArguments, CustomExecutionContext>;

/**
 * Represents the program types that represent every Black Flag command as
 * aptly-named values in an object.
 */
export type Programs<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext = ExecutionContext
> = {
  [Descriptor in ProgramDescriptor]: DescriptorToProgram<
    Descriptor,
    CustomCliArguments,
    CustomExecutionContext
  >;
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
  /**
   * The names "reserved" by this command. When a name is reserved by a command,
   * no other sibling command (i.e. a command with the same parent command) can
   * use that name as an name or alias. When attempting to add a command that
   * uses the same name as its sibling, an error with be thrown.
   *
   * All commands attempt to reserve their `name` and `aliases` exports upon
   * discovery.
   *
   * **Invariant: `name` must be at index 0; `...aliases` must start at index
   * 1.**
   */
  reservedCommandNames: string[];
  /**
   * If `true`, this command exported neither a `command` string nor a `handler`
   * function. Black Flag therefore considers this command "unimplemented".
   *
   * When executed, unimplemented commands will show help text before throwing a
   * context-specific error.
   */
  isImplemented: boolean;
  /**
   * If `true`, this command is a "pure parent" or "parent-child" that has at
   * least one child command.
   */
  hasChildren: boolean;
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
export type FrameworkArguments<
  CustomExecutionContext extends ExecutionContext = ExecutionContext
> = {
  [$executionContext]: CustomExecutionContext;
};

/**
 * This function accepts an optional `rawArgv` array that defaults to
 * `yargs::hideBin(process.argv)` and returns an `Arguments` object representing
 * the arguments parsed and validated by yargs (i.e.
 * `context.state.deepestParseResult`).
 *
 * **This function throws whenever\* an exception occurs**, making it not ideal
 * as an entry point for a CLI. See {@link runProgram} for a wrapper function
 * that handles exceptions and sets the exit code for you.
 *
 * Note: when the special `GracefulEarlyExitError` exception is thrown _from
 * within a command's handler or builder_, `Executor` will set
 * `context.state.deepestParseResult` to `NullArguments` and
 * `context.state.isGracefullyExiting` to `true`. Further, `Executor` **will
 * not** re-throw the exception in this special case, returning `NullArguments`
 * instead.
 */
export type Executor = (
  /**
   * @default hideBin(process.argv)
   */
  rawArgv?: Parameters<ConfigureArguments>[0]
) => Promise<Arguments>;

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
  rootPrograms: Programs;
  /**
   * Execute the root command, parsing any available CLI arguments and running
   * the appropriate handler, and return the resulting final parsed arguments
   * object.
   *
   * **This function throws whenever\* an exception occurs**, making it not
   * ideal as an entry point for a CLI. See {@link runProgram} for a wrapper
   * function that handles exceptions and sets the exit code for you.
   *
   * Note: when the special `GracefulEarlyExitError` exception is thrown _from
   * within a command's handler or builder (or certain hooks)_, `Executor` will
   * set `context.state.deepestParseResult` to `NullArguments` and
   * `context.state.isGracefullyExiting` to `true`. Further, `Executor` **will
   * not** re-throw the exception in this special case, returning
   * `NullArguments` instead.
   */
  execute: Executor;
  /**
   * A reference to the global context singleton passed to all other
   * configuration hooks, command builders, and command handlers. This object
   * recursively contains some of the same entries as its enclosing
   * `PreExecutionContext`.
   */
  executionContext: CustomContext;
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
   * Note that the insertion order of these entries is for all intents and
   * purposes non-deterministic with the exception of the first entry, which
   * will always be the root command. This is because Black Flag inserts entries
   * as they are encountered while walking the filesystem. **This means you can
   * NEVER rely on insertion order remaining consistent between OSes,
   * filesystems, or even Node.js versions.**
   *
   * This property is used internally by Black Flag.
   */
  commands: Map<string, { programs: Programs; metadata: ProgramMetadata }>;
  /**
   * The {@link ExtendedDebugger} for the current runtime level.
   *
   * This property is used internally by Black Flag.
   */
  debug: ExtendedDebugger;
  /**
   * The current state of the execution environment.
   *
   * This property is used internally by Black Flag.
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
     * If `true`, Black Flag already handled whatever error has made its way to
     * the highest error handling layer (typically through the
     * `configureErrorHandlingEpilogue` hook).
     *
     * Otherwise, if the error is unhandled by the time this property is
     * checked, a framework error will occur.
     *
     * This property is ignored when no error has occurred.
     */
    didAlreadyHandleError: boolean;
    /**
     * If `isHandlingHelpOption` is `true`, Black Flag is currently in the
     * process of getting yargs to generate help text for some command.
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
     * Note: setting `isHandlingHelpOption` to `true` manually via
     * `configureExecutionContext` will cause Black Flag to output help text as
     * if the user had specified `--help` (or the equivalent) as one of their
     * arguments.
     *
     * @default false
     */
    isHandlingHelpOption: boolean;
    /**
     * `globalHelpOption` replaces the functionality of the disabled vanilla
     * yargs `yargs::help` method. Set this to the value you want using the
     * `configureExecutionContext` configuration hook (any other hook is run too
     * late).
     *
     * `name`, if provided, must be >= 1 character in length. If `name`
     * is exactly one character in length, the help option will take the form of
     * `-${name}`, otherwise `--${name}`.
     *
     * Note: this property should not be relied upon or mutated by
     * end-developers outside of the `configureExecutionContext` configuration
     * hook. Doing so will result in undefined behavior.
     *
     * @default { name: "help", description: defaultHelpTextDescription }
     */
    globalHelpOption: { name: string; description: string } | undefined;
    /**
     * If `isHandlingVersionOption` is `true`, Black Flag is currently in the
     * process of getting yargs to generate version text for some command.
     *
     * Checking the value of this property is useful when you want to know if
     * `--version` (or whatever your equivalent option is) was passed to the
     * root command. The value of `isHandlingVersionOption` is also used to
     * determine the value of `helpOrVersionSet` in commands' `builder`
     * functions.
     *
     * We have to track this separately from yargs since we're stacking multiple
     * yargs instances and they all want to be the one that handles generating
     * version text.
     *
     * Note: setting `isHandlingVersionOption` to `true` manually via
     * `configureExecutionContext` will cause Black Flag to output version text
     * as if the user had specified `--version` (or the equivalent) as one of
     * their arguments.
     *
     * @default false
     */
    isHandlingVersionOption: boolean;
    /**
     * `globalVersionOption` replaces the functionality of the disabled vanilla
     * yargs `yargs::version` method. Set this to the value you want using the
     * `configureExecutionContext` configuration hook (any other hook is run too
     * late).
     *
     * `name`, if provided, must be >= 1 character in length. If `name` is
     * exactly one character in length, the version option will take the form of
     * `-${name}`, otherwise `--${name}`. `text`, if provided, will be the
     * version text sent to stdout and defaults to the "version" property in the
     * nearest `package.json`.
     *
     * Note: this property should not be relied upon or mutated by
     * end-developers outside of the `configureExecutionContext` configuration
     * hook. Doing so will result in undefined behavior.
     *
     * @default { name: "version", description: defaultVersionTextDescription, text: `${packageJson.version}` }
     */
    globalVersionOption: { name: string; description: string; text: string } | undefined;
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
     * Note: this property should not be relied upon or mutated by
     * end-developers.
     *
     * @default undefined
     */
    firstPassArgv: Arguments | undefined;
    /**
     * Stores the result of the latest call to `EffectorProgram::parseAsync`.
     *
     * This is necessary because, with our depth-first multi-yargs architecture,
     * the parse job done by shallower programs in the chain must not mutate the
     * result of the deepest call to `EffectorProgram::parseAsync` in the
     * execution chain.
     *
     * Note: this property should not be relied upon or mutated by
     * end-developers.
     *
     * @default undefined
     */
    deepestParseResult: Arguments | undefined;
    /**
     * If `true`, Black Flag sent either help or version text to stdout or
     * stderr.
     *
     * @default false
     */
    didOutputHelpOrVersionText: boolean;
    /**
     * Contains the final error that will be communicated to the user, if
     * defined. Ideally we wouldn't have to track this and we could just rely on
     * yargs's exception handling plumbing, but there are trap doors where yargs
     * will simply swallow errors and do other weird stuff.
     *
     * Instead of trying to deal with all that, we'll just handle it ourselves.
     *
     * This property is also leveraged by `makeRunner`'s `errorHandlingBehavior`
     * option.
     *
     * @default undefined
     */
    finalError: unknown;

    [key: string]: unknown;
  };

  [key: string]: unknown;
};
