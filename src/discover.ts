import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { isNativeError, isPromise, isSymbolObject } from 'node:util/types';

import makeVanillaYargs from 'yargs/yargs';

import { suppressNodeWarnings } from 'multiverse/suppress-warnings';

import { defaultUsageText } from 'universe/constant';
import { capitalize, wrapExecutionContext } from 'universe/util';

import {
  AssertionFailedError,
  CliError,
  CommandNotImplementedError,
  ErrorMessage,
  GracefulEarlyExitError,
  isCliError,
  isCommandNotImplementedError
} from 'universe/error';

import type {
  EffectorProgram,
  ExecutionContext,
  HelperProgram,
  Program,
  ProgramDescriptor,
  ProgramMetadata,
  ProgramType,
  Programs,
  RouterProgram
} from 'types/program';

import type { PackageJson } from 'type-fest';
import type { Configuration, ImportedConfigurationModule } from 'types/module';
import type { Options } from 'yargs';

const hasSpacesRegExp = /\s+/;

// ! We disable ExperimentalWarning outputs because they're very annoying and
// ! hard to deal with
suppressNodeWarnings('ExperimentalWarning');

/**
 * Recursively scans the filesystem for valid index files starting at
 * `basePath`, which can be a regular filesystem path or a `'file://...'`-style
 * URL. Upon encountering such a file, it is imported along with each valid
 * sibling file in the same directory, treating the raw results as
 * {@link ImportedConfigurationModule} objects. These are translated into
 * {@link Configuration} objects, which are then used to create and configure
 * corresponding {@link Program} instances. Finally, these generated
 * {@link Program} instances are wired together hierarchically as a well-ordered
 * tree of commands. This allows end users to invoke child commands through
 * their respective parent commands, starting with the root command.
 *
 * What are considered "valid" files are those files with one of the following
 * extensions (listed in precedence order): `.js`, `.mjs`, `.cjs`, `.ts`,
 * `.mts`, `.cts`.
 *
 * @returns An object with a `result` property containing the result of the
 * effector program that was executed. Due to the tree-like nature of execution,
 * `result` will not be available when the promise returned by
 * `discoverCommands` is resolved but it will be populated with a value when
 * `PreExecutionContext::execute` is called.
 */
export async function discoverCommands(
  basePath: string,
  context: ExecutionContext
): Promise<void> {
  // ! Invariant: first command to be discovered, if any, is the root command.
  let alreadyLoadedRootCommand = false;

  const basePath_ = basePath?.startsWith?.('file://')
    ? url.fileURLToPath(basePath)
    : basePath;

  const debug = context.debug.extend('discover');
  const debug_load = debug.extend('load');

  debug('ensuring base path directory exists and is readable: "%O"', basePath_);

  try {
    await fs.access(basePath_, fs.constants.R_OK);
    if (!(await fs.stat(basePath_)).isDirectory()) {
      // ? This will be caught and re-thrown as an AssertionFailedError 👍🏿
      throw new Error('path is not a directory');
    }
  } catch (error) {
    debug.error('failed due to invalid base path "%O": %O', basePath_, error);
    throw new AssertionFailedError(
      ErrorMessage.AssertionFailureBadConfigurationPath(basePath_)
    );
  }

  debug('searching upwards for nearest package.json file starting at %O', basePath_);

  const pkg = {
    path: await (await import('pkg-up')).pkgUp({ cwd: basePath_ }),
    name: undefined as string | undefined,
    version: undefined as string | undefined
  };

  if (pkg.path) {
    debug('loading package.json file from %O', pkg.path);

    try {
      const { name, version }: PackageJson = (
        await import(pkg.path, { assert: { type: 'json' } })
      ).default;

      pkg.name = name;
      pkg.version = version;
    } catch (error) {
      /* istanbul ignore next */
      debug.warn('load failed: attempt to import %O failed: %O', pkg.path, error);
    }
  } else {
    debug.warn('search failed: no package.json file found');
  }

  debug('relevant cli package.json data discovered: %O', pkg);

  if (context.state.globalVersionOption) {
    if (!context.state.globalVersionOption.text) {
      context.state.globalVersionOption.text = pkg.version || '';
    }

    if (!context.state.globalVersionOption.text) {
      context.state.globalVersionOption = undefined;
      debug.warn(
        'disabled built-in version option (globalVersionOption=undefined) since no version info available'
      );
    }
  }

  debug('beginning configuration module auto-discovery at %O', basePath_);

  await discover(basePath_);

  debug('configuration module auto-discovery completed');

  if (context.commands.size) {
    debug_load.message(
      '%O commands loaded: %O',
      context.commands.size,
      context.commands.keys()
    );
    debug_load.message('%O', context.commands);
  } else {
    throw new AssertionFailedError(
      ErrorMessage.AssertionFailureNoConfigurationLoaded(basePath_)
    );
  }

  return;

  // *** *** ***

  async function discover(
    configPath: string,
    lineage: string[] = [],
    grandparentPrograms: Programs | undefined = undefined,
    grandparentMeta: ProgramMetadata | undefined = undefined
  ): Promise<void> {
    const isRootCommand = !alreadyLoadedRootCommand;
    const parentType: ProgramType = isRootCommand ? 'pure parent' : 'parent-child';

    const depth = lineage.length;

    debug('initial parent lineage: %O', lineage);
    debug('is root (aka "pure parent") command: %O', isRootCommand);

    assert(
      grandparentPrograms === undefined || !isRootCommand,
      ErrorMessage.GuruMeditation()
    );

    const { configuration: parentConfig, metadata: parentMeta } = await loadConfiguration(
      ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts'].map((extension) =>
        path.join(configPath, `index.${extension}`)
      ),
      context
    );

    if (!parentConfig) {
      debug.warn(
        `skipped ${parentType} configuration (depth: %O) due to missing or unloadable index file in directory %O`,
        depth,
        configPath
      );

      return;
    }

    ensureConfigurationDoesNotConflictWithReservedNames(parentConfig, lineage.join(' '));

    lineage = [...lineage, parentConfig.name];
    const parentConfigFullName = lineage.join(' ');

    debug('updated parent lineage: %O', lineage);
    debug('command full name: %O', parentConfigFullName);

    const parentPrograms = await makeCommandPrograms(
      parentConfig,
      parentMeta,
      parentConfigFullName,
      parentType
    );

    context.commands.set(parentConfigFullName, {
      programs: parentPrograms,
      metadata: parentMeta
    });

    debug(`added ${parentType} command mapping to ExecutionContext::commands`);

    linkChildRouterToParentRouter(
      parentPrograms.router,
      parentConfig,
      parentConfigFullName,
      grandparentPrograms?.router
    );

    addChildCommandToParentHelper(
      parentConfig,
      parentConfigFullName,
      grandparentPrograms?.helper
    );

    if (grandparentMeta) {
      grandparentMeta.hasChildren = true;
    }

    debug_load(
      `discovered ${parentType} configuration (depth: %O) for command %O`,
      depth,
      parentConfigFullName
    );

    const configDir = await fs.opendir(configPath);

    for await (const entry of configDir) {
      const isPotentialChildConfigOfCurrentParent =
        /.*(?<!index)\.(?:js|mjs|cjs|ts|mts|cts)$/.test(entry.name);

      const entryFullPath = path.join(entry.path, entry.name);

      debug('saw potential child configuration file: %O', entryFullPath);

      if (entry.isDirectory()) {
        debug('file is actually a directory, recursing');
        await discover(entryFullPath, lineage, parentPrograms, parentMeta);
      } else if (isPotentialChildConfigOfCurrentParent) {
        debug('attempting to load file');

        const { configuration: childConfig, metadata: childMeta } =
          await loadConfiguration(entryFullPath, context);

        /* istanbul ignore next */
        if (!childConfig) {
          debug.error(
            `failed to load pure child configuration (depth: %O) due to missing or invalid file %O`,
            depth,
            entryFullPath
          );

          throw new AssertionFailedError(ErrorMessage.ConfigLoadFailure(entryFullPath));
        }

        const childConfigFullName = `${parentConfigFullName} ${childConfig.name}`;

        debug('pure child full name (lineage): %O', childConfigFullName);

        ensureConfigurationDoesNotConflictWithReservedNames(
          childConfig,
          parentConfigFullName
        );

        const childPrograms = await makeCommandPrograms(
          childConfig,
          childMeta,
          childConfigFullName,
          'pure child'
        );

        context.commands.set(childConfigFullName, {
          programs: childPrograms,
          metadata: childMeta
        });

        debug(`added pure child command mapping to ExecutionContext::commands`);

        linkChildRouterToParentRouter(
          childPrograms.router,
          childConfig,
          childConfigFullName,
          parentPrograms.router
        );

        addChildCommandToParentHelper(
          childConfig,
          childConfigFullName,
          parentPrograms.helper
        );

        parentMeta.hasChildren = true;

        debug_load(
          `discovered pure child configuration (depth: %O) for command %O`,
          depth + 1,
          childConfigFullName
        );
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
    context: ExecutionContext
  ) {
    const isRootProgram = !alreadyLoadedRootCommand;

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
        debug_('attempting to load configuration file: %O', maybeConfigPath);

        let maybeImportedConfig: ImportedConfigurationModule | undefined = undefined;

        try {
          // eslint-disable-next-line no-await-in-loop
          maybeImportedConfig = await import(maybeConfigPath);
        } catch (error) {
          if (
            isModuleNotFoundSystemError(error) &&
            (error.moduleName?.endsWith(maybeConfigPath) ||
              error.url?.endsWith(maybeConfigPath))
          ) {
            debug_.warn(
              'a recoverable failure occurred while attempting to load configuration: %O',
              `${error}`
            );
          } else {
            throw error;
          }
        }

        if (maybeImportedConfig) {
          const meta = {
            hasChildren: false,
            filename: path.basename(maybeConfigPath),
            filepath: maybeConfigPath,
            parentDirName: path.basename(path.dirname(maybeConfigPath))
          } as ProgramMetadata;

          meta.filenameWithoutExtension = meta.filename.split('.').slice(0, -1).join('.');

          const isParentProgram = meta.filenameWithoutExtension === 'index';

          meta.type = isRootProgram
            ? 'pure parent'
            : isParentProgram
              ? 'parent-child'
              : 'pure child';

          debug_('configuration file metadata (w/o reservedCommandNames): %O', meta);

          // ? ESM <=> CJS interop. If there's a default property, we'll use it.
          if (maybeImportedConfig.default) {
            maybeImportedConfig = maybeImportedConfig.default;
          }

          // ? ESM <=> CJS interop, again. See:
          // ? test/fixtures/several-files-cjs-esm/nested/first.cjs
          /* istanbul ignore next */
          if (maybeImportedConfig.default) {
            maybeImportedConfig = maybeImportedConfig.default;
          }

          let rawConfig: Partial<Configuration>;

          if (typeof maybeImportedConfig === 'function') {
            debug_('configuration returned a function');
            // eslint-disable-next-line no-await-in-loop
            rawConfig = await maybeImportedConfig(context);
          } else {
            debug_('configuration returned an object (or something coerced into {})');
            rawConfig =
              !!maybeImportedConfig && typeof maybeImportedConfig === 'object'
                ? maybeImportedConfig
                : {};
          }

          // ? Ensure configuration namespace is copied by value!
          rawConfig = Object.assign({}, rawConfig);

          const command = (rawConfig.command ?? '$0').trim() as '$0';

          meta.isImplemented = rawConfig.handler !== undefined || command !== '$0';

          const finalConfig: Configuration = {
            aliases: rawConfig.aliases?.map((str) => replaceSpaces(str).trim()) || [],
            builder: rawConfig.builder || {},
            command,
            deprecated: rawConfig.deprecated ?? false,
            // ? This property is trimmed below
            description: rawConfig.description ?? '',
            handler(...args) {
              debug_.extend('handler')(
                'executing real handler function for %O',
                finalConfig.name
              );

              return (rawConfig.handler || defaultCommandHandler)(...args);
            },
            name: replaceSpaces(
              rawConfig.name ||
                (isRootProgram && pkg.name
                  ? pkg.name
                  : isParentProgram
                    ? meta.parentDirName
                    : meta.filenameWithoutExtension)
            ).trim(),
            // ? This property is trimmed below
            usage: rawConfig.usage || defaultUsageText
          };

          finalConfig.usage = capitalize(finalConfig.usage).trim();

          finalConfig.description =
            typeof finalConfig.description === 'string'
              ? capitalize(finalConfig.description).trim()
              : finalConfig.description;

          debug_.message('successfully loaded configuration object: %O', finalConfig);
          debug_('validating loaded configuration object for correctness');

          for (const name of [finalConfig.name, ...finalConfig.aliases]) {
            /* istanbul ignore next */
            if (hasSpacesRegExp.test(name)) {
              throw new AssertionFailedError(
                ErrorMessage.InvalidCharacters(name, 'space(s)')
              );
            }

            if (name.includes('$0')) {
              throw new AssertionFailedError(ErrorMessage.InvalidCharacters(name, '$0'));
            }

            if (name.includes('$1')) {
              throw new AssertionFailedError(ErrorMessage.InvalidCharacters(name, '$1'));
            }

            if (
              name.includes('|') ||
              name.includes('<') ||
              name.includes('>') ||
              name.includes('[') ||
              name.includes(']') ||
              name.includes('{') ||
              name.includes('}')
            ) {
              throw new AssertionFailedError(
                ErrorMessage.InvalidCharacters(name, '|, <, >, [, ], {, or }')
              );
            }
          }

          if (
            finalConfig.command !== '$0' &&
            (!finalConfig.command.startsWith('$0') ||
              !finalConfig.command.startsWith('$0 '))
          ) {
            throw new AssertionFailedError(
              ErrorMessage.AssertionFailureInvalidCommandExport(finalConfig.name)
            );
          }

          debug_('configuration is valid!');

          // ? The first configuration loaded is gonna be the root every time!
          alreadyLoadedRootCommand = true;

          meta.reservedCommandNames = [finalConfig.name, ...finalConfig.aliases];
          debug_('metadata reserved command names: %O', meta.reservedCommandNames);

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
   * Throws if `config.name` or `config.aliases` conflicts with existing names
   * and/or aliases.
   */
  function ensureConfigurationDoesNotConflictWithReservedNames(
    config: Configuration,
    parentFullName: string
  ) {
    let checkCount = 0;

    [config.name, ...config.aliases].forEach((reservedName, index, reservedNames) => {
      [...reservedNames.slice(0, index), ...reservedNames.slice(index + 1)].forEach(
        (reservedName_, index_) => {
          checkCount++;
          if (reservedName === reservedName_) {
            /* istanbul ignore next */
            throw new AssertionFailedError(
              ErrorMessage.AssertionFailureDuplicateCommandName(
                parentFullName,
                reservedName,
                index === 0 ? 'name' : 'alias',
                reservedName_,
                index !== 0 && index_ === 0 ? 'name' : 'alias'
              )
            );
          }
        }
      );
    });

    assert(typeof parentFullName === 'string', ErrorMessage.GuruMeditation());

    context.commands.forEach((command, commandName) => {
      const splitCommandName = commandName.split(' ');
      const seenParentFullName = splitCommandName.slice(0, -1).join(' ');
      const seenName = splitCommandName.at(-1);

      if (seenParentFullName === parentFullName) {
        command.metadata.reservedCommandNames.forEach((reservedName, index) => {
          assert(index !== 0 || seenName === reservedName, ErrorMessage.GuruMeditation());

          checkCount++;
          if (reservedName === config.name) {
            /* istanbul ignore next */
            throw new AssertionFailedError(
              ErrorMessage.AssertionFailureDuplicateCommandName(
                parentFullName,
                config.name,
                'name',
                reservedName,
                index === 0 ? 'name' : 'alias'
              )
            );
          }

          config.aliases.forEach((aliasName) => {
            checkCount++;
            if (reservedName === aliasName) {
              /* istanbul ignore next */
              throw new AssertionFailedError(
                ErrorMessage.AssertionFailureDuplicateCommandName(
                  parentFullName,
                  aliasName,
                  'alias',
                  reservedName,
                  index === 0 ? 'name' : 'alias'
                )
              );
            }
          });
        });
      }
    });

    debug('no reserved name conflicts detected (%O checks performed)', checkCount);
  }

  /**
   * Returns a {@link Programs} object with fully-configured programs.
   */
  async function makeCommandPrograms(
    config: Configuration,
    meta: ProgramMetadata,
    fullName: string,
    type: ProgramType
  ): Promise<Programs> {
    const debug_ = debug.extend('make');

    if (type === 'pure parent' && config.aliases.length) {
      debug_.warn(
        'root command aliases will be ignored during routing and will not appear in help text: %O',
        config.aliases
      );
    }

    const programs = {
      effector: await makePartiallyConfiguredProgram('effector'),
      helper: await makePartiallyConfiguredProgram('helper'),
      router: await makePartiallyConfiguredProgram('router')
    };

    if (type === 'pure parent' && context.state.globalVersionOption?.name?.length) {
      const { name: versionOptionName, description: versionOptionDescription } =
        context.state.globalVersionOption;

      assert(versionOptionName.length, ErrorMessage.GuruMeditation());

      [programs.helper, programs.effector].forEach((program) =>
        program.option(versionOptionName, {
          boolean: true,
          description: versionOptionDescription
        })
      );

      // * Black Flag's custom help option functionality is configured by
      // * makePartiallyConfiguredProgram below rather than here.
    }

    // * Enable strict mode by default.

    // ? Note that the strictX and demandX functions are permanently disabled on
    // ? helper programs. The effector will handle the stricter validation step.
    //programs.helper.strict(true);
    programs.effector.strict(true);

    // * Configure usage text.

    const usageText = config.usage
      .replaceAll('$000', config.command)
      .replaceAll('$1', config.description || '')
      .trim();

    programs.helper.usage(usageText);
    programs.effector.usage(usageText);

    // * Configure the script's name.

    programs.helper.scriptName(fullName);
    programs.effector.scriptName(fullName);

    // * Allow output text to span the entire screen.

    programs.helper.wrap(context.state.initialTerminalWidth);
    programs.effector.wrap(context.state.initialTerminalWidth);

    // * Finish configuring custom error handling, which is responsible for
    // * outputting help text to stderr before rethrowing a wrapped error.

    programs.helper.fail(customFailHandler(programs.helper, 'helper'));
    programs.effector.fail(customFailHandler(programs.effector, 'effector'));

    // * Link router program to helper program

    programs.router.command(
      ['$0'],
      '[routed-1]',
      {},
      async function () {
        debug.extend('router*')('control reserved; calling HelperProgram::parseAsync');
        await programs.helper.parseAsync(
          context.state.rawArgv,
          wrapExecutionContext(context)
        );
      },
      [],
      false
    );

    // * Link helper program to effector program

    programs.helper.command_deferred(
      // ! This next line excludes aliases and positionals in an attempt to
      // ! address yargs bugs around help text output. See the docs for details.
      ['$0'],
      config.description,
      makeVanillaYargsBuilder(programs.helper, config, 'first-pass'),
      async (parsedArgv) => {
        const debug_ = debug.extend('helper');
        debug_('entered wrapper handler function for %O', config.name);
        assert(context.state.firstPassArgv === undefined, ErrorMessage.GuruMeditation());

        if (context.state.isHandlingHelpOption) {
          debug_(
            'sending help text to stdout (triggered by the %O option)',
            /* istanbul ignore next */
            context.state.globalHelpOption?.name || '???'
          );

          // ! Notice the helper program is ALWAYS the one outputting help text.
          programs.helper.showHelp('log');
          context.state.didOutputHelpOrVersionText = true;

          debug_('gracefully exited wrapper handler function for %O', config.name);
          throw new GracefulEarlyExitError();
        } else if (type === 'pure parent' && context.state.isHandlingVersionOption) {
          debug_(
            'sending version text to stdout (triggered by the %O option)',
            /* istanbul ignore next */
            context.state.globalVersionOption?.name || '???'
          );

          // eslint-disable-next-line no-console
          console.log(context.state.globalVersionOption?.text || '???');
          context.state.didOutputHelpOrVersionText = true;

          debug_('gracefully exited wrapper handler function for %O', config.name);
          throw new GracefulEarlyExitError();
        } else {
          if (!meta.isImplemented && meta.hasChildren) {
            debug_.message(
              'short-circuited effector: command is both unimplemented and has children'
            );
            throw new CommandNotImplementedError();
          }

          context.state.firstPassArgv = parsedArgv;

          const localArgv = await programs.effector.parseAsync(
            context.state.rawArgv,
            wrapExecutionContext(context)
          );

          assert(
            context.state.deepestParseResult === undefined,
            ErrorMessage.GuruMeditation()
          );

          context.state.deepestParseResult = localArgv;

          debug_(
            'context.state.deepestParseResult set to EffectorProgram::parseAsync result: %O',

            localArgv
          );

          debug_('exited wrapper handler function for %O', config.name);
        }
      },
      [],
      config.deprecated
    );

    // * Configure effector to execute the real command handler via a "default
    // * command" (yargs parlance) wrapper.

    programs.effector.command(
      [config.command, ...config.aliases],
      config.description,
      makeVanillaYargsBuilder(programs.effector, config, 'second-pass'),
      config.handler,
      [],
      config.deprecated
    );

    // * Finished!

    debug_(
      'created and fully configured the effector, helper, and router programs for %O command %O',
      type,
      fullName
    );

    return programs;

    function customFailHandler(
      program: HelperProgram | EffectorProgram,
      descriptor: ProgramDescriptor
    ) {
      return function (message?: string | null, error?: Error) {
        const debug_ = debug.extend(`${descriptor}*`);
        debug_.message('entered failure handler for command %O', fullName);

        // ? If a failure happened but error is not defined, it was *probably*
        // ? a yargs-specific error (e.g. argument validation failure).
        // ! Is there a better way to differentiate between Yargs-specific
        // ! errors and third-party errors? Or is `!error` the best we can do?
        const isProbablyVanillaYargsError = !error;

        debug_('message: %O', message);
        debug_('error.message: %O', error?.message);
        debug_('error is native error: %O', isNativeError(error));
        debug_('will show help on fail: %O', context.state.showHelpOnFail);
        debug_('is probably vanilla yargs error: %O', isProbablyVanillaYargsError);
        debug_(
          'did output help or version text: %O',
          context.state.didOutputHelpOrVersionText
        );

        assert(!meta.hasChildren || type !== 'pure child', ErrorMessage.GuruMeditation());

        // ? Only helpers of "parous" parents should send help text to stderr
        const isParousParentHelperHandlingCommandNotImplementedError =
          meta.hasChildren &&
          descriptor === 'helper' &&
          isCommandNotImplementedError(error);

        debug_(
          'is parous parent helper handling CommandNotImplementedError: %O',
          isParousParentHelperHandlingCommandNotImplementedError
        );

        if (
          context.state.showHelpOnFail &&
          !context.state.didOutputHelpOrVersionText &&
          (isProbablyVanillaYargsError ||
            isParousParentHelperHandlingCommandNotImplementedError)
        ) {
          debug_(
            `sending help text to stderr (triggered by ${error ? 'black flag' : 'yargs'})`
          );
          // ! Note how only the most specific program gets to generate help
          // ! text.
          program.showHelp('error');
          context.state.didOutputHelpOrVersionText = true;

          if (isParousParentHelperHandlingCommandNotImplementedError) {
            debug_(
              'exited failure handler: set finalError to CliError(InvalidCommandInvocation)'
            );

            context.state.finalError = new CliError(
              ErrorMessage.InvalidCommandInvocation()
            );
          }
        }

        if (context.state.finalError === undefined) {
          if (isCliError(error)) {
            debug_('exited failure handler: set finalError to error as-is');
            context.state.finalError = error;
          } else {
            debug_(
              'exited failure handler: set finalError to error wrapped with CliError'
            );
            context.state.finalError = new CliError(
              /* istanbul ignore next */
              error || message || ErrorMessage.GuruMeditation()
            );
          }
        } else {
          debug_('exited failure handler: finalError unchanged');
        }

        throw context.state.finalError;
      };
    }
  }

  /**
   * Returns a partially-configured {@link EffectorProgram} instance.
   */
  async function makePartiallyConfiguredProgram(
    descriptor: 'effector'
  ): Promise<EffectorProgram>;
  /**
   * Returns a partially-configured {@link HelperProgram} instance.
   */
  async function makePartiallyConfiguredProgram(
    descriptor: 'helper'
  ): Promise<HelperProgram>;
  /**
   * Returns a partially-configured {@link RouterProgram} instance.
   */
  async function makePartiallyConfiguredProgram(
    descriptor: 'router'
  ): Promise<RouterProgram>;
  async function makePartiallyConfiguredProgram(
    descriptor: ProgramDescriptor
  ): Promise<unknown> {
    const debug_ = debug.extend('make');
    const deferredCommandArgs: Parameters<Program['command']>[] = [];

    debug_('creating new proto-%O program (awaiting full configuration)', descriptor);

    const alphaSort = (await import('alpha-sort')).default;
    const vanillaYargs = makeVanillaYargs();

    // * Disable built-in help functionality; we only want a --help option, not
    // * a command, so we disable the yargs::help function at Proxy level too.

    vanillaYargs.help(false);

    // * Disable built-in version functionality; we only want a --version
    // * option, not a command, so we disable the yargs::version function at
    // * Proxy level too.

    vanillaYargs.version(false);

    // * For router programs, disable just about everything. For other program
    // * types, configure Black Flag's custom default help option.

    if (descriptor === 'router') {
      vanillaYargs
        .scriptName('[router]')
        .usage('[router]')
        .strict(false)
        .exitProcess(false)
        .fail(false);
    } else if (context.state.globalHelpOption?.name?.length) {
      const { name: helpOptionName, description: helpOptionDescription } =
        context.state.globalHelpOption;

      assert(helpOptionName.length, ErrorMessage.GuruMeditation());

      vanillaYargs.option(helpOptionName, {
        boolean: true,
        description: helpOptionDescription
      });

      // * Black Flag's custom version option functionality is configured by the
      // * calling function rather than here (since we need to know the type).
    }

    // * For helper programs, disable strictness here since it cannot be done
    // * elsewhere as easily.

    if (descriptor === 'helper') {
      vanillaYargs.strict(false);
    }

    // * Disable exit-on-error functionality.

    vanillaYargs.exitProcess(false);

    // * Begin configuring custom error handling.

    vanillaYargs.showHelpOnFail(false);

    // * We defer the rest of the setup until we enter a scope with more
    // * information available.

    return new Proxy(vanillaYargs, {
      get(target, property: unknown, proxy: Program) {
        const isSymbolOrOwnProperty =
          typeof property === 'string' &&
          (isSymbolObject(property) ||
            Object.hasOwn(vanillaYargs, property) ||
            Object.hasOwn(Object.getPrototypeOf(vanillaYargs), property));

        if (['help', 'version'].includes(property as string)) {
          return function () {
            throw new AssertionFailedError(
              ErrorMessage.AssertionFailureInvocationNotAllowed(property as string)
            );
          };
        }

        if (property === 'parseSync') {
          return function () {
            throw new AssertionFailedError(
              ErrorMessage.AssertionFailureUseParseAsyncInstead()
            );
          };
        }

        if (property === 'argv') {
          debug_.warn(
            `discarded attempted access to disabled "${property}" magic property on %O program`,
            descriptor
          );

          // * Although it's tempting to do more, issuing a debug warning is
          // * all that can be done here. Move along.

          // ? Why go through all this trouble? Jest likes to make "deep
          // ? cyclical copies" of objects from time to time, especially WHEN
          // ? ERRORS ARE THROWN. These deep copies necessarily require
          // ? recursively accessing every property of the object... including
          // ? magic properties like ::argv, which causes ::parse to be called
          // ? multiple times AFTER AN ERROR ALREADY OCCURRED, which leads to
          // ? undefined behavior and heisenbugs. Yuck.
          return void 'disabled by Black Flag (use parseAsync instead)';
        }

        if (descriptor === 'helper' && typeof property === 'string') {
          if (property.startsWith('strict') || property.startsWith('demand')) {
            // * Although it's tempting to do more, issuing a debug warning is
            // * all that can be done here. Move along.

            return function () {
              debug_(
                `discarded attempted access to disabled method "${property}" on %O program`,
                descriptor
              );

              return proxy;
            };
          }

          // * Our goal with the below is to prevent option configurations like
          // * `demandOption` from hurting the helper while still applying it
          // * to the effector.

          if (property === 'option' || property === 'options') {
            return function (...args: unknown[]) {
              /* istanbul ignore next */
              if (!args.length) {
                // ? Not our problem
                target.options(...(args as Parameters<typeof target.options>));
                return proxy;
              }

              const options = (
                args.length === 1
                  ? args[0]
                  : { [args[0] as string]: args[1] || /* istanbul ignore next */ {} }
              ) as Record<string, Options>;

              Object.entries(options).forEach(([option, optionConfiguration]) => {
                if ('demandOption' in optionConfiguration) {
                  debug_(
                    `discarded attempted mutation of disabled yargs option configuration key "demandOption" (for the %O option) on %O program`,
                    option,
                    descriptor
                  );

                  delete optionConfiguration.demandOption;
                }
              });

              target.options(options);
              return proxy;
            };
          }
        }

        if (descriptor === 'router') {
          if (isSymbolOrOwnProperty && !['parseAsync', 'command'].includes(property)) {
            return typeof target[property as keyof typeof target] === 'function'
              ? function () {
                  throw new AssertionFailedError(
                    ErrorMessage.AssertionFailureInvocationNotAllowed(property)
                  );
                }
              : void 'disabled by Black Flag (do not access routers directly)';
          }
        } else {
          // ? What are command_deferred and command_finalize_deferred? Well,
          // ? when generating help text, yargs will enumerate commands and
          // ? options in the order that they were added to the instance.
          // ? Unfortunately, since we're relying on the filesystem to
          // ? asynchronously reveal its contents to us, commands will be added
          // ? in unpredictable OS-specific orders. We don't like that, we want
          // ? our commands to always appear in the same order no matter what OS
          // ? the CLI is invoked on. So, we replace ::command with
          // ? ::command_deferred, which adds its parameters to an internal
          // ? list, and ::command_finalize_deferred, which sorts said list and
          // ? enumerates the result, calling the real ::command as it goes. As
          // ? for preserving the sort order of options within the builder
          // ? function, that's an exercise left to the end developer :)

          if (property === 'command_deferred') {
            return function (...args: Parameters<Program['command']>) {
              debug_('::command call was deferred for %O program', descriptor);
              deferredCommandArgs.push(args);
              return proxy;
            };
          }

          if (property === 'command_finalize_deferred') {
            return function () {
              debug_(
                'began alpha-sorting deferred command calls for %O program',
                descriptor
              );

              // ? Sort in alphabetical order with naturally sorted numbers.
              const sort = alphaSort({ natural: true });

              deferredCommandArgs.sort(([firstCommands], [secondCommands]) => {
                const firstCommand = [firstCommands].flat()[0];
                const secondCommand = [secondCommands].flat()[0];

                // ? Ensure the root command is added first (though it probably
                // ? doesn't matter either way).
                /* istanbul ignore next */
                return firstCommand.startsWith('$0')
                  ? -1
                  : secondCommand.startsWith('$0')
                    ? 1
                    : sort(firstCommand, secondCommand);
              });

              debug_(
                'calling ::command with %O deferred argument tuples for %O program',
                deferredCommandArgs.length,
                descriptor
              );

              for (const args of deferredCommandArgs) {
                (target as unknown as Program).command(...args);
              }

              return proxy;
            };
          }

          if (property === 'showHelpOnFail') {
            return function (enabled: boolean) {
              context.state.showHelpOnFail = enabled;
              return proxy;
            };
          }
        }

        // ! This line (and any line like it) has to be gated behind the if
        // ! statements above or terrrrrible things will happen!
        const value: unknown = target[property as keyof typeof target];

        if (isSymbolOrOwnProperty && typeof value === 'function') {
          return function (...args: unknown[]) {
            // ? This is "this-recovering" code.
            const returnValue = value.apply(target, args);
            // ? Whenever we'd return a yargs instance, return the wrapper
            // ? program instead.
            return isPromise(returnValue)
              ? returnValue.then((realReturnValue) => maybeReturnProxy(realReturnValue))
              : maybeReturnProxy(returnValue);
          };
        }

        return value;

        function maybeReturnProxy(returnValue: unknown) {
          return returnValue === target ? proxy : returnValue;
        }
      }
    });
  }

  /**
   * Links `parentRouter` to `childRouter` such that calling
   * `RouterProgram::parseAsync` with the proper argument will result in
   * execution control being handed off to `childRouter`.
   *
   * If `parentRouter` is undefined, this function is a no-op.
   */
  function linkChildRouterToParentRouter(
    childRouter: RouterProgram,
    childConfig: Configuration,
    childFullName: string,
    parentRouter?: RouterProgram
  ) {
    parentRouter?.command(
      [childConfig.name, ...childConfig.aliases],
      '[routed-2]',
      {},
      async function () {
        const debug_ = debug.extend('router');
        const givenName = context.state.rawArgv.shift();

        /* istanbul ignore next */
        if (debug_.enabled) {
          const splitName = childFullName.split(' ');
          debug_.message(
            'entered router handler function bridging %O ==> %O',
            splitName.slice(0, -1).join(' '),
            splitName.at(-1)
          );

          debug_('shifted given name off rawArgv: %O', givenName);
          debug_('new context.state.rawArgv: %O', context.state.rawArgv);
          debug_("relinquishing control to child command's router program");
        }

        // ? Only the root command handles the built-in version option, so if
        // ? we've made it this far, we must not be handling the version option
        // ? as a built-in even if it's in argv.
        context.state.isHandlingVersionOption = false;

        await childRouter.parseAsync(
          context.state.rawArgv,
          wrapExecutionContext(context)
        );
      },
      [],
      childConfig.deprecated
    );

    if (parentRouter) {
      debug(
        "linked child command %O router program to its parent command's router program",
        childFullName
      );
    }
  }

  /**
   * Adds an entry to a parent command's helper program (via `command_deferred`)
   * for purely cosmetic (help text output) purposes. Attempting to actually
   * execute the handler for this entry, which should never happen with valid
   * use of Black Flag, will throw.
   *
   * If `parentHelper` is undefined, this function is a no-op.
   */
  function addChildCommandToParentHelper(
    childConfig: Configuration,
    childFullName: string,
    parentHelper?: HelperProgram
  ) {
    parentHelper?.command_deferred(
      // ! We use config.name instead of config.command on purpose here to
      // ! address yargs bugs around help text output. See the docs for details.
      [childConfig.name, ...childConfig.aliases],
      childConfig.description,
      makeVanillaYargsBuilder(parentHelper, childConfig, 'first-pass'),
      /* istanbul ignore next */
      async (_parsedArgv) => {
        throw new AssertionFailedError(
          ErrorMessage.AssertionFailureReachedTheUnreachable()
        );
      },
      [],
      childConfig.deprecated
    );

    if (parentHelper) {
      debug(
        "added an entry for child command %O to its parent command's helper program",
        childFullName
      );
    }
  }

  /**
   * Returns a builder function consumable by a vanilla yargs instance or that
   * acts as an adapter to Black Flag's more powerful builder API.
   */
  function makeVanillaYargsBuilder(
    program: EffectorProgram | HelperProgram,
    config: Configuration,
    pass: 'first-pass' | 'second-pass'
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Extract<Parameters<Program['command']>[2], Function> {
    return (vanillaYargs, helpOrVersionSet) => {
      const debug_ = debug.extend(pass === 'first-pass' ? 'helper' : 'effector');
      debug_(`entered wrapper builder function (${pass}) for %O`, config.name);

      assert(
        pass === 'first-pass'
          ? context.state.firstPassArgv === undefined
          : context.state.firstPassArgv !== undefined,
        ErrorMessage.GuruMeditation()
      );

      try {
        const blackFlagBuilderResult =
          typeof config.builder === 'function'
            ? config.builder(
                program as EffectorProgram,
                context.state.isHandlingHelpOption ||
                  context.state.isHandlingVersionOption ||
                  helpOrVersionSet,
                context.state.firstPassArgv
              )
            : config.builder;

        if (blackFlagBuilderResult && blackFlagBuilderResult !== program) {
          // ? Use program here instead of vanillaYargs since we want our
          // ? version of the ::options method.
          program.options(
            blackFlagBuilderResult as Parameters<typeof vanillaYargs.options>[0]
          );
        }

        debug_(
          `exited wrapper builder function (${pass}) for %O (no errors)`,
          config.name
        );
      } catch (error) {
        debug_.warn(
          `exited wrapper builder function (${pass}) for %O (with error)`,
          config.name
        );

        throw error;
      } finally {
        context.state.firstPassArgv = undefined;
      }

      return vanillaYargs;
    };
  }
}

/**
 * The default handler used when a {@link Configuration} is missing a
 * `handler` export.
 */
function defaultCommandHandler() {
  throw new CommandNotImplementedError();
}

/**
 * Replace all the ASCII#32 space characters in a string with hyphens.
 */
function replaceSpaces(str: string) {
  return str.replaceAll(' ', '-');
}

/**
 * Type-guard for Node's "MODULE_NOT_FOUND" and "ERR_MODULE_NOT_FOUND" so-called
 * `SystemError`s. Funny story: CJS uses "MODULE_NOT_FOUND" while ESM uses
 * "ERR_MODULE_NOT_FOUND" and the two error types share very few properties.
 */
function isModuleNotFoundSystemError(error: unknown): error is Error & {
  code: 'MODULE_NOT_FOUND' | 'ERR_MODULE_NOT_FOUND';
  url?: string;
  moduleName?: string;
} {
  return (
    isNativeError(error) &&
    'code' in error &&
    ((error.code === 'ERR_MODULE_NOT_FOUND' && 'url' in error) ||
      (error.code === 'MODULE_NOT_FOUND' && 'moduleName' in error))
  );
}
