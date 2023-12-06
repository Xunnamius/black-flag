import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';

import { makeProgram, wrapExecutionContext } from 'universe/index';

import {
  AssertionFailedError,
  CliError,
  CommandNotImplementedError,
  ErrorMessage,
  GracefulEarlyExitError,
  isCliError
} from 'universe/error';

import type {
  AnyArguments,
  AnyProgram,
  Arguments,
  ExecutionContext,
  ProgramMetadata
} from 'types/program';

import type {
  AnyConfiguration,
  Configuration,
  ImportedConfigurationModule
} from 'types/module';

import { DEFAULT_USAGE_TEXT } from 'universe/constant';

import type { PackageJson } from 'type-fest';

const hasSpacesRegExp = /\s+/;

/**
 * An internal mapping between program instances and their shadow clones.
 *
 * @internal
 */
export const shadowPrograms = new WeakMap<AnyProgram, AnyProgram>();

/**
 * Recursively scans the filesystem for _JavaScript_ index files starting at
 * `basePath`. Upon encountering such a file, it is imported along with each
 * sibling _JavaScript_ file in the same directory, treating the raw results as
 * {@link ImportedConfigurationModule} objects. These are translated into
 * {@link Configuration} objects, which are then used to create and configure
 * corresponding {@link Program} instances. Finally, these generated
 * {@link Program} instances are wired together hierarchically as a well-ordered
 * tree of commands. This allows end users to invoke child programs through
 * their respective parent programs, starting with the root program.
 *
 * For example, suppose we had a root program called `root` with two child
 * commands in the same directory: `create` and `retrieve`. Further suppose the
 * `create` program had its own child commands: `zone` and `account`. Then each
 * command could be invoked from the CLI like so:
 *
 * @example
 * ```text
 * root
 * root create
 * root create zone
 * root create account
 * root retrieve
 * ```
 *
 * Note how the `create` program is both a child program/command _and_ a parent
 * program simultaneously. This is referred to internally (e.g. debugging
 * output) as a "parent-child".
 *
 * Supported extensions in precedence order: `.js`, `.mjs`, `.cjs`, `.ts`,
 * `.mts`, `.cts`.
 *
 * @returns An object with a `result` property containing the result of the very
 * first program that finishes executing. Due to the tree-like nature of
 * execution, `result` will not be available when the promise returned by
 * `discoverCommands` is resolved.
 */
export async function discoverCommands(
  basePath: string,
  rootProgram: AnyProgram,
  context: ExecutionContext
): Promise<{
  /**
   * Stores the result of the latest call to `Program::parseAsync`, hence the
   * need for passing around a reference to the object containing this result.
   *
   * This is necessary because, with our depth-first multi-yargs architecture,
   * the parse job done by shallower yargs instances in the chain must not
   * mutate the result of the deepest call to `Program::parse*` in the execution
   * chain.
   */
  result: Arguments | undefined;
}> {
  // ! Invariant: first program to be discovered, if any, is the root program.
  let alreadyLoadedRootProgram = false;

  const debug = context.debug.extend('discover');
  const debug_load = debug.extend('load');

  const deepestParseResult: Awaited<ReturnType<typeof discoverCommands>> = {
    result: undefined
  };

  debug('searching upwards for nearest package.json file starting at %O', basePath);

  const pkg = {
    path: await (await import('pkg-up')).pkgUp({ cwd: basePath }),
    name: undefined as string | undefined,
    version: undefined as string | undefined
  };

  if (pkg.path) {
    debug('loading package.json file from %O', pkg.path);

    try {
      const { name, version }: PackageJson = await import(pkg.path, {
        assert: { type: 'json' }
      });

      pkg.name = name;
      pkg.version = version;
    } catch (error) {
      debug.warn('load failed: attempt to import %O failed: %O', pkg.path, error);
    }
  } else {
    debug.warn('search failed: no package.json file found');
  }

  debug('relevant cli package.json data discovered: %O', pkg);
  debug('beginning configuration module auto-discovery at %O', basePath);

  await discover(basePath);

  debug('configuration module auto-discovery completed');

  if (context.commands.size) {
    debug_load.message(
      '%O commands loaded: %O',
      context.commands.size,
      context.commands.keys()
    );
    debug_load.message('%O', context.commands);
  } else {
    debug_load.warn('auto-discovery failed to find any loadable configuration!');
  }

  return deepestParseResult;

  async function discover(
    configPath: string,
    lineage: string[] = [],
    previousParentProgram: AnyProgram | undefined = undefined
  ): Promise<void> {
    const isRootProgram = !alreadyLoadedRootProgram;
    const parentType = isRootProgram ? 'root' : 'parent-child';

    const depth = lineage.length;

    debug('initial parent lineage: %O', lineage);
    debug('is root program: %O', isRootProgram);

    const parentProgram = isRootProgram ? rootProgram : await makeProgram();
    const { configuration: parentConfig, metadata: parentMeta } = await loadConfiguration(
      ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts'].map((extension) =>
        path.join(configPath, `index.${extension}`)
      ),
      parentProgram,
      context
    );

    if (!parentConfig) {
      debug.warn(
        `skipped ${parentType} configuration (depth: %O) due to missing index file in directory %O`,
        depth,
        configPath
      );

      return;
    }

    lineage = [...lineage, parentConfig.name];
    const parentConfigFullName = lineage.join(' ');

    debug('updated parent lineage: %O', lineage);
    debug('program full name: %O', parentConfigFullName);

    await (isRootProgram
      ? configureRootProgram(parentProgram, parentConfig, parentConfigFullName)
      : configureParentProgram(
          parentProgram,
          parentConfig,
          parentConfigFullName,
          previousParentProgram
        ));

    debug_load(
      `discovered ${parentType} configuration (depth: %O) for program %O`,
      depth,
      parentConfigFullName
    );

    context.commands.set(parentConfigFullName, {
      program: parentProgram as AnyProgram,
      metadata: parentMeta
    });

    debug(`added ${parentType} program to ExecutionContext::commands`);

    const configDir = await fs.opendir(configPath);

    for await (const entry of configDir) {
      const isPotentialChildConfigOfCurrentParent =
        /.*(?<!index)\.(?:js|mjs|cjs|ts|mts|cts)$/.test(entry.name);

      const entryFullPath = path.join(entry.path, entry.name);

      debug('saw potential child configuration file: %O', entryFullPath);

      if (entry.isDirectory()) {
        debug('file is actually a directory, recursing...');
        await discover(entryFullPath, lineage, parentProgram);
      } else if (isPotentialChildConfigOfCurrentParent) {
        debug('attempting to load file...');

        const childProgram = await makeProgram();
        const { configuration: childConfig, metadata: childMeta } =
          await loadConfiguration(entryFullPath, childProgram, context);

        if (!childConfig) {
          debug.error(
            `failed to load child configuration (depth: %O) due to missing or invalid file %O`,
            depth,
            entryFullPath
          );

          throw new AssertionFailedError(ErrorMessage.ConfigLoadFailure(entryFullPath));
        }

        const childConfigFullName = `${parentConfigFullName} ${childConfig.name}`;

        debug('child full name (lineage): %O', childConfigFullName);

        await configureChildProgram(
          childProgram,
          childConfig,
          childConfigFullName,
          parentProgram
        );

        debug_load(
          `discovered child configuration (depth: %O) for command %O`,
          depth + 1,
          childConfigFullName
        );

        context.commands.set(childConfigFullName, {
          program: childProgram as AnyProgram,
          metadata: childMeta
        });

        debug('added child program to ExecutionContext::commands');
      } else {
        debug(
          'file was ignored (only non-index sibling JS files are considered at this stage)'
        );
      }
    }
  }

  /**
   * Accepts one or more file paths and returns the parsed configuration and
   * associated metadata of the first file that is both readable and exports a
   * {@link Configuration} object.
   */
  async function loadConfiguration(
    configPath: string | string[],
    program: AnyProgram,
    context: ExecutionContext
  ) {
    const isRootProgram = !alreadyLoadedRootProgram;

    const debug_ = debug.extend('load-configuration');
    const maybeConfigPaths = [configPath]
      .flat()
      .map((p) => p.trim())
      .filter(Boolean);

    debug_(
      'loading new configuration from the first readable path: %O',
      maybeConfigPaths
    );

    while (maybeConfigPaths.length) {
      try {
        const maybeConfigPath = maybeConfigPaths.shift()!;
        const meta = {
          get shadow() {
            const shadow = shadowPrograms.get(program);
            assert(shadow !== undefined);
            return shadow;
          }
        } as ProgramMetadata;

        meta.filename = path.basename(maybeConfigPath);
        meta.filenameWithoutExtension = meta.filename.split('.').slice(0, -1).join('.');
        meta.filepath = maybeConfigPath;
        meta.parentDirName = path.basename(path.dirname(maybeConfigPath));

        const isParentProgram = meta.filenameWithoutExtension === 'index';

        meta.type = isRootProgram ? 'root' : isParentProgram ? 'parent-child' : 'child';

        debug_('attempting to load configuration file %O', meta.filename);

        debug_('configuration file absolute path: %O', maybeConfigPath);
        debug_('configuration file metadata: %O', meta);

        let maybeImportedConfig: ImportedConfigurationModule | undefined =
          // eslint-disable-next-line no-await-in-loop
          await import(maybeConfigPath).catch((error) => {
            debug_.warn(
              'a recoverable failure occurred while attempting to load configuration: %O',
              `${error}`
            );
          });

        if (maybeImportedConfig) {
          let rawConfig: Partial<Configuration>;

          if (!maybeImportedConfig.__esModule) {
            maybeImportedConfig = maybeImportedConfig.default;
          }

          if (typeof maybeImportedConfig === 'function') {
            debug_('configuration returned a function');
            // eslint-disable-next-line no-await-in-loop
            rawConfig = await maybeImportedConfig(context);
          } else {
            debug_('configuration returned an object');
            rawConfig = maybeImportedConfig || {};
          }

          // ? Ensure configuration namespace is copied by value!
          rawConfig = Object.assign({}, rawConfig);

          const finalConfig: Configuration = {
            aliases: rawConfig.aliases?.map((str) => str.trim()) || [],
            builder: rawConfig.builder || {},
            command: (rawConfig.command ?? '$0').trim() as '$0',
            deprecated: rawConfig.deprecated ?? false,
            // ? This property is trimmed below
            description: rawConfig.description ?? '',
            handler(...args) {
              debug_('triggered shadow (real) handler function of %O', finalConfig.name);
              return (rawConfig.handler || defaultHandler)(...args);
            },
            name: (
              rawConfig.name ||
              (isRootProgram && pkg.name
                ? pkg.name
                : isParentProgram
                  ? meta.parentDirName
                  : meta.filenameWithoutExtension)
            ).trim(),
            // ? This property is trimmed below
            usage: rawConfig.usage || DEFAULT_USAGE_TEXT
          };

          finalConfig.usage = capitalize(finalConfig.usage).trim();

          finalConfig.description =
            typeof finalConfig.description === 'string'
              ? capitalize(finalConfig.description).trim()
              : finalConfig.description;

          debug_.message('successfully loaded configuration object: %O', finalConfig);
          debug_('validating loaded configuration object for correctness...');

          for (const name of [finalConfig.name, ...finalConfig.aliases]) {
            if (hasSpacesRegExp.test(name)) {
              throw new AssertionFailedError(
                ErrorMessage.InvalidCharacters(name, 'space(s)')
              );
            }

            if (name.includes('$0')) {
              throw new AssertionFailedError(ErrorMessage.InvalidCharacters(name, '$0'));
            }

            if (
              name.includes('<') ||
              name.includes('>') ||
              name.includes('[') ||
              name.includes(']')
            ) {
              throw new AssertionFailedError(
                ErrorMessage.InvalidCharacters(name, '<, >, [, or ]')
              );
            }
          }

          if (
            finalConfig.command !== '$0' &&
            (!finalConfig.command.startsWith('$0') ||
              !finalConfig.command.startsWith('$0 '))
          ) {
            throw new AssertionFailedError(
              ErrorMessage.AssertionFailureNamingInvariant(finalConfig.name)
            );
          }

          debug_('configuration is valid!');

          alreadyLoadedRootProgram = true;

          return { configuration: finalConfig, metadata: meta };
        }
      } catch (error) {
        debug_.error(
          'an irrecoverable failure occurred while loading configuration: %O',
          `${error}`
        );

        throw error;
      }
    }

    return { configuration: undefined, metadata: undefined };
  }

  /**
   * Configures the root (or _pure_ parent) program. Specifically, this
   * function:
   *
   * - Calls {@link configureParentProgram}
   * - Enables built-in `--version` support unless `package.json::version` is
   *   not available
   */
  async function configureRootProgram(
    program: AnyProgram,
    config: AnyConfiguration,
    fullName: string
  ): Promise<void> {
    await configureParentProgram(program, config, fullName);

    const shadowProgram = shadowPrograms.get(program);
    assert(shadowProgram !== undefined);

    // ? Only the root program should recognize the --version flag

    program.version(pkg.version || false);
    shadowProgram.version(pkg.version || false);

    debug('%O was additionally configured as: %O', config.name, 'root (pure parent)');
  }

  /**
   * Configures a parent (or parent-child) program. Specifically, this function:
   *
   * - Disables built-in `--help` magic and replaces it with a custom solution
   * - Calls {@link configureProgram}
   * - Calls {@link proxyParentToChild}
   *
   * And for parent-child programs (i.e. non-root parents) specifically:
   *
   * - Registers a proxy command (including aliases) to `parentProgram`
   */
  async function configureParentProgram(
    program: AnyProgram,
    config: AnyConfiguration,
    fullName: string,
    parentParentProgram?: AnyProgram
  ): Promise<void> {
    const shadowProgram = await makeProgram({ isShadowClone: true });

    // ? Swap out --help support for something that plays nice with the
    // ? existence of child programs
    const helpConfig = { description: 'Show help text', boolean: true };
    program.help(false).option('help', helpConfig);
    shadowProgram.help(false).option('help', helpConfig);

    const handler = config.handler;
    config.handler = async (parsedArgv) => {
      if (parsedArgv.help) {
        debug(
          '%O %O Program %O selected for special handling of %O command',
          'non-shadow',
          !!parentParentProgram ? 'parent-child' : 'pure parent (root)',
          config.name,
          'help'
        );

        program.showHelp('log');
        throw new GracefulEarlyExitError();
      } else {
        return handler?.(parsedArgv);
      }
    };

    await configureProgram(program, config, fullName);
    await configureProgram(shadowProgram, config, fullName);

    proxyParentToChild(program, config, fullName, shadowProgram, parentParentProgram);

    debug(
      '%O was additionally configured as: %O',
      config.name,
      !!parentParentProgram ? 'parent-child' : 'pure parent (root)'
    );
  }

  /**
   * Configures a _pure_ child program. Specifically, this function:
   *
   * - Calls {@link configureProgram}
   * - Calls {@link proxyParentToChild}
   * - Enables built-in `--help` magic
   */
  async function configureChildProgram(
    program: AnyProgram,
    config: AnyConfiguration,
    fullName: string,
    parentProgram: AnyProgram
  ): Promise<void> {
    const shadowProgram = await makeProgram({ isShadowClone: true });

    await configureProgram(program, config, fullName);
    await configureProgram(shadowProgram, config, fullName);

    proxyParentToChild(program, config, fullName, shadowProgram, parentProgram);

    // ? Only child programs should use the built-in --help magic

    program.help(true);
    shadowProgram.help(true);

    debug('%O was additionally configured as: %O', config.name, 'pure child');
  }

  /**
   * Configures a program with settings universal to all program types.
   * Specifically, this function:
   *
   * - Disables built-in `--version` support
   * - Configures usage help text template
   * - Configures script name
   * - Disables built-in exit-on-error behavior (we handle errors ourselves)
   * - Allow output to span entire terminal width
   * - Disable built-in error/help reporting (we'll handle it ourselves)
   */
  async function configureProgram(
    program: AnyProgram,
    config: AnyConfiguration,
    fullName: string
  ) {
    // ? Only the root program should recognize the --version flag

    program.version(false);

    // ? Configure usage help text

    program.usage(config.usage ?? DEFAULT_USAGE_TEXT);

    // ? Configure the script's name

    program.scriptName(fullName);

    // ? Disable exit-on-error functionality

    program.exitProcess(false);

    // ? Allow output text to span the entire screen

    program.wrap(context.state.initialTerminalWidth);

    // ? We'll report on any errors manually

    let showHelpOnFail = true;
    program.showHelpOnFail(false);
    program.showHelpOnFail = (enabled) => {
      showHelpOnFail = enabled;
      return program;
    };

    // ? Make yargs stop being so noisy when exceptional stuff happens

    program.fail((message: string | null, error) => {
      const debug_ = debug.extend('fail');
      debug_.message('entered failure handler for %O', fullName);

      debug_('message: %O', message);
      debug_('error.message (instanceof Error): %O', error?.message);

      if (!error && showHelpOnFail) {
        debug_('showing help text via console.error...');
        // ? If there's no error object, it's probably a yargs-specific error
        program.showHelp('error');
        // eslint-disable-next-line no-console
        console.error();
      }

      if (isCliError(error)) {
        debug_('re-throwing error as-is');
        throw error;
      } else {
        debug_('re-throwing error/message wrapped with CliError');
        throw new CliError(error || message);
      }
    });
  }

  /**
   * Adds a default command to `program` and a sub-command to `parentProgram`,
   * if provided. Specifically, this function:
   *
   * - Registers a default command + aliases to `program`
   * - Registering a mapping between `program` <=> `shadowProgram`
   * - Disables strict mode and strict commands/options on `program`
   * - Enables strict mode and strict commands/options on `shadowProgram`
   * - Registers a proxy command + aliases linking `parentProgram` <=> `program`
   */
  function proxyParentToChild(
    program: AnyProgram,
    config: AnyConfiguration,
    fullName: string,
    shadowProgram: AnyProgram,
    parentProgram?: AnyProgram
  ) {
    // ? Register a default command (and shadow-command)

    let shadowArgv: AnyArguments | undefined = undefined;
    const debug_ = debug.extend('proxy:deep');

    program.command(
      [config.command, ...config.aliases],
      config.description,
      config.builder,
      async (parsedArgv) => {
        debug('entered non-shadow handler function for %O', config.name);
        assert(shadowArgv === undefined);

        shadowArgv = parsedArgv;
        const localArgv = await shadowProgram.parseAsync(
          context.state.rawArgv,
          wrapExecutionContext(context)
        );

        const isDeepestParseResult = !deepestParseResult.result;
        deepestParseResult.result ??= localArgv;

        debug_('is deepest parse result: %O', isDeepestParseResult);
        debug_(
          `%O Program::parseAsync result${
            !isDeepestParseResult ? ' (discarded)' : ''
          }: %O`,
          'SHADOW',
          localArgv
        );

        debug('exited non-shadow handler function for %O', config.name);
      },
      [],
      config.deprecated
    );

    shadowProgram.command(
      [config.command, ...config.aliases],
      config.description,
      (yargs_, helpOrVersionSet) => {
        debug('entered shadow builder function for %O', config.name);
        assert(shadowArgv !== undefined);

        try {
          const yargs =
            typeof config.builder === 'function'
              ? config.builder(yargs_, helpOrVersionSet, shadowArgv)
              : yargs_.options(config.builder);

          debug('exited shadow builder function for %O', config.name);
          return yargs;
        } finally {
          shadowArgv = undefined;
        }
      },
      config.handler,
      [],
      config.deprecated
    );

    shadowPrograms.set(program, shadowProgram);

    // ? Disable strict, strictCommands, and strictOptions modes for
    // ? non-shadow; enable for actual

    program.strict_force(false);
    shadowProgram.strict_force(true);

    // ? For child programs, register the same command with the parent, but use
    // ? a proxy handler

    parentProgram?.command_deferred(
      [config.command.replace('$0', config.name), ...config.aliases],
      config.description,
      config.builder,
      proxyHandler(program, config, fullName),
      [],
      config.deprecated
    );
  }

  /**
   * A proxy handler used to bridge nested commands between parent and child
   * yargs instances, similar in intent to a reverse-proxy in networking.
   */
  function proxyHandler(
    childProgram: AnyProgram,
    childConfig: AnyConfiguration,
    fullName: string
  ) {
    return async function (_parsed: Arguments) {
      const debug_ = debug.extend('proxy');
      const givenName = context.state.rawArgv.shift();
      const acceptableNames = [childConfig.name, ...childConfig.aliases];

      if (debug_.enabled) {
        const splitName = fullName.split(' ');
        debug_.message(
          'entered proxy handler function bridging %O ==> %O',
          splitName.slice(0, -1).join(' '),
          splitName.at(-1)
        );
      }

      debug_('ordering invariant: %O must be one of: %O', givenName, acceptableNames);

      const rawArgvSatisfiesArgumentOrderingInvariant =
        givenName && acceptableNames.includes(givenName);

      if (!rawArgvSatisfiesArgumentOrderingInvariant) {
        debug_.error('ordering invariant violated!');

        throw new AssertionFailedError(ErrorMessage.AssertionFailureOrderingInvariant());
      }

      debug_('invariant satisfied');
      debug_('calling ::parseAsync on child program');

      await childProgram.parseAsync(context.state.rawArgv, wrapExecutionContext(context));
    };
  }
}

/**
 * The default handler used when a {@link Configuration} is missing a
 * `handler` export.
 */
function defaultHandler() {
  throw new CommandNotImplementedError();
}

/**
 * Uppercase the first letter of a string.
 */
function capitalize(str: string) {
  return (str.at(0)?.toUpperCase() || '') + str.slice(1);
}
