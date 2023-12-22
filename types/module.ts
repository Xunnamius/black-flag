import type { Promisable } from 'type-fest';
import type { Options as _Options, Argv as _Program } from 'yargs';

import type { Arguments, EffectorProgram, ExecutionContext } from 'types/program';

/**
 * A replacement for the `CommandModule` type that comes with yargs.
 * Auto-discovered configuration modules must implement this interface or a
 * subtype of this interface.
 */
export type Configuration<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
> = {
  /**
   * An array of `command` aliases [as
   * interpreted](https://github.com/yargs/yargs/pull/647) by
   * [yargs](https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases).
   *
   * **WARNING: positional arguments ARE NOT ALLOWED HERE** and including them
   * will lead to strange behavior! If you want to add positional arguments,
   * export {@link Configuration.command} instead.
   *
   * Note: when a command file is interpreted as a {@link RootConfiguration},
   * `aliases` is effectively ignored.
   *
   * @default []
   */
  aliases: string[];
  /**
   * An object containing yargs options configuration or a function that will
   * receive the current Black Flag program. Unlike with vanilla yargs, you do
   * not need to return anything at all; "returning" `undefined`/`void` is
   * equivalent. If you return something other than the `blackFlag` parameter,
   * such as an object of options, it will be passed to `yargs::options` for
   * you.
   *
   * Note 1: **if `builder` is a function, it cannot be async or return a
   * promise** due to a yargs bug present at time of writing. However, a
   * {@link Configuration} module can export an async function, so hoist any
   * async logic out of the builder function to work around this bug for now.
   *
   * Note 2: if positional arguments are given and your command accepts them
   * (i.e. provided via {@link Configuration.command} and configured via
   * `yargs::positional`), they are only accessible from `argv?._` (`builder`'s
   * third parameter). This is because positional arguments, while fully
   * supported by Black Flag, **are parsed and validated _after_ `builder` is
   * first invoked** and so aren't available until a little later.
   *
   * @default {}
   */
  builder:
    | { [key: string]: _Options }
    | ((
        blackFlag: Omit<
          EffectorProgram<CustomCliArguments>,
          | 'parseAsync'
          | 'fail'
          | 'command'
          | 'command_deferred'
          | 'command_finalize_deferred'
        >,
        helpOrVersionSet: boolean,
        argv?: Arguments<CustomCliArguments>
      ) =>
        | void
        | EffectorProgram<CustomCliArguments>
        | { [key: string]: _Options }
        | _Program);
  /**
   * The command as interpreted by yargs. May contain positional arguments.
   *
   * It is usually unnecessary to change or use this property if you're not
   * using positional arguments. If you want to change your command's name, use
   * {@link Configuration.name}. If you want to change the usage text, use
   * {@link Configuration.usage}.
   *
   * @default "$0"
   */
  command: '$0' | `$0 ${string}`;
  /**
   * If truthy, the command will be considered "deprecated" by yargs. If
   * `deprecated` is a string, it will additionally be treated as a deprecation
   * message that will appear alongside the command in help text.
   *
   * @default false
   */
  deprecated: string | boolean;
  /**
   * The description for the command in help text. If `false`, the command will
   * be considered "hidden" by yargs.
   *
   * @default ""
   */
  description: string | false;
  /**
   * A function called when this command is invoked. It will receive an object
   * of parsed arguments.
   *
   * If `undefined`, a `CommandNotImplementedError` will be thrown.
   *
   * @default undefined
   */
  handler: (args: Arguments<CustomCliArguments>) => Promisable<void>;
  /**
   * The name of the command. Any spaces will be replaced with hyphens.
   * Including a character that yargs does not consider valid for a
   * command name will result in an error.
   *
   * Defaults to the filename containing the configuration, excluding its
   * extension, or the directory name (with spaces replaced) if the
   * filename without extension is "index".
   */
  name: string;
  /**
   * Set a usage message shown at the top of the command's help text.
   *
   * Several replacements are made to the `usage` string before it is output. In
   * order:
   *
   * - `$000` will be replaced by the entire command itself (including full
   *   canonical name and parameters).
   * - `$1` will be replaced by the description of the command.
   * - `$0` will be replaced with the full canonical name of the command.
   *
   * @default "Usage: $000\n\n$1"
   */
  usage: string;
};

/**
 * A partial extension to the {@link Configuration} interface for root
 * configurations. This type was designed for use in external ESM/CJS module
 * files that will eventually get imported via auto-discovery.
 */
export type RootConfiguration<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
> = Partial<ParentConfiguration<CustomCliArguments>>;

/**
 * A partial extension to the {@link Configuration} interface for non-root
 * parent configurations. This type was designed for use in external ESM/CJS
 * module files that will eventually get imported via auto-discovery.
 */
export type ParentConfiguration<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
> = Partial<Configuration<CustomCliArguments>>;

/**
 * A partial extension to the {@link Configuration} interface for child
 * configurations. This type was designed for use in external ESM/CJS module
 * files that will eventually get imported via auto-discovery.
 */
export type ChildConfiguration<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
> = Partial<Configuration<CustomCliArguments>>;

/**
 * Represents a Configuration object imported from a CJS/ESM module external to
 * the CLI framework (e.g. importing an auto-discovered config module from a
 * file).
 */
export type ImportedConfigurationModule<
  CustomCliArguments extends Record<string, unknown> = Record<string, unknown>
> = (
  | ((
      context: ExecutionContext
    ) => Promisable<
      Partial<
        | RootConfiguration<CustomCliArguments>
        | ParentConfiguration<CustomCliArguments>
        | ChildConfiguration<CustomCliArguments>
      >
    >)
  | Partial<
      | RootConfiguration<CustomCliArguments>
      | ParentConfiguration<CustomCliArguments>
      | ChildConfiguration<CustomCliArguments>
    >
) &
  (
    | { __esModule?: false; default?: ImportedConfigurationModule<CustomCliArguments> }
    | { __esModule: true }
  );
