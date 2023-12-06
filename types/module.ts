import type { EmptyObject, Promisable } from 'type-fest';
import type { Options as _Options, Argv as _Program } from 'yargs';

import type { Arguments, ExecutionContext, Program } from 'types/program';

/**
 * The most generic implementation type of {@link Configuration}.
 */
export type AnyConfiguration = Configuration<Record<string, unknown>>;

/**
 * A replacement for the `CommandModule` type that comes with yargs.
 * Auto-discovered configuration modules must implement this interface or a
 * subtype of this interface.
 */
export type Configuration<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
> = {
  /**
   * An array of `command` aliases [as
   * interpreted](https://github.com/yargs/yargs/pull/647) by
   * [yargs](https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases).
   *
   * Note that positional arguments defined in aliases are ignored.
   *
   * @default []
   */
  aliases: string[];
  /**
   * An object containing yargs options configuration or a function that will
   * receive and return the current yargs instance.
   *
   * **If `builder` is a function, it cannot be async or return a promise** due
   * to a yargs bug present at time of writing. However, a {@link Configuration}
   * module can export an async function, so hoist any async logic out of the
   * builder function to work around this bug for now.
   *
   * @default {}
   */
  builder:
    | { [key: string]: _Options }
    | ((
        yargs: Program<CustomCliArguments>,
        helpOrVersionSet: boolean,
        argv?: Arguments<CustomCliArguments>
      ) => Program<CustomCliArguments> | _Program);
  /**
   * The command as interpreted by yargs. May contain positional arguments.
   *
   * It is usually unnecessary to change or use this property.
   *
   * @default "$0"
   */
  command: '$0' | `$0 ${string}`;
  /**
   * If truthy, the command will be considered "deprecated" by yargs. If
   * `deprecated` is a string, it will additionally be treated as a deprecation
   * message and printed.
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
   * The name of the command. **Must not contain any spaces** or any characters
   * that yargs does not consider valid for a command name. An error will be
   * thrown if spaces are present.
   *
   * Defaults to the filename, excluding its extension, containing the
   * configuration, or the directory name if the filename without extension is
   * "index".
   */
  name: string;
  /**
   * Set a usage message shown at the top of the command's help text. The string
   * `$0` will be replaced with the _full name_ of the command.
   *
   * @default "Usage: $0"
   */
  usage: string;
};

/**
 * A partial extension to the {@link Configuration} interface for root
 * configurations. This type was designed for use in external ESM/CJS module
 * files that will eventually get imported via auto-discovery.
 */
export type RootConfiguration<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
> = Partial<ParentConfiguration<CustomCliArguments>>;

/**
 * A partial extension to the {@link Configuration} interface for non-root
 * parent configurations. This type was designed for use in external ESM/CJS
 * module files that will eventually get imported via auto-discovery.
 */
export type ParentConfiguration<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
> = Partial<Configuration<CustomCliArguments>>;

/**
 * A partial extension to the {@link Configuration} interface for child
 * configurations. This type was designed for use in external ESM/CJS module
 * files that will eventually get imported via auto-discovery.
 */
export type ChildConfiguration<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
> = Partial<Configuration<CustomCliArguments>>;

/**
 * The shape of a Configuration object imported from a CJS/ESM module external
 * to the CLI framework (e.g. importing an auto-discovered config module from a
 * file).
 */
export type ImportedConfigurationModule<
  CustomCliArguments extends Record<string, unknown> = EmptyObject
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
