import assert from 'node:assert';
import fs from 'node:fs/promises';
import { basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isNativeError, isPromise } from 'node:util/types';

import { toAbsolutePath, toDirname, toPath } from '@-xun/fs';
import makeVanillaYargs from 'yargs/yargs';

import { defaultUsageText } from 'universe:constant.ts';

import {
  AssertionFailedError,
  BfErrorMessage,
  CliError,
  CommandNotImplementedError,
  GracefulEarlyExitError,
  isCliError,
  isCommandNotImplementedError
} from 'universe:error.ts';

import { capitalize, wrapExecutionContext } from 'universe:util.ts';

import type { AbsolutePath } from '@-xun/fs';
import type { Arrayable, PackageJson } from 'type-fest';
import type { Options } from 'yargs';

import type {
  Configuration,
  ImportedConfigurationModule
} from 'universe:types/module.ts';

import type {
  EffectorProgram,
  ExecutionContext,
  HelperProgram,
  Program,
  ProgramDescriptor,
  ProgramMetadata,
  Programs,
  ProgramType,
  RouterProgram
} from 'universe:types/program.ts';

const hasSpacesRegExp = /\s+/;
// ! MUST NEVER BE GLOBAL (RegExp g flag)
const isValidYargsCommandDslRegExp = /^\$0( ((<[^>]*>)|(\[[^\]]*\])))*$/;
const alphaSort = new Intl.Collator(undefined, { numeric: true });

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
  basePath_: unknown,
  context: ExecutionContext
): Promise<void> {
  // ! Invariant: first command to be discovered, if any, is the root command.
  let alreadyLoadedRootCommand = false;

  if (!basePath_ || typeof basePath_ !== 'string') {
    throw new AssertionFailedError(BfErrorMessage.BadConfigurationPath(basePath_));
  }

  const basePath = toAbsolutePath(
    basePath_.startsWith('file://') ? fileURLToPath(basePath_) : basePath_
  );

  const discoverDebug = context.debug.extend('discover');
  const discoveredDebug = discoverDebug.extend('discovered');

  discoverDebug('ensuring base path directory exists and is readable: "%O"', basePath);

  try {
    await fs.access(basePath, fs.constants.R_OK);
    if (!(await fs.stat(basePath)).isDirectory()) {
      // ? This will be caught and re-thrown as an AssertionFailedError 👍🏿
      throw new Error(BfErrorMessage.PathIsNotDirectory());
    }
  } catch (error) {
    discoverDebug.error('failed due to invalid base path "%O": %O', basePath, error);
    throw new AssertionFailedError(BfErrorMessage.BadConfigurationPath(basePath));
  }

  discoverDebug(
    'searching upwards for nearest package.json file starting at %O',
    basePath
  );

  const package_ = {
    path: await (await import('package-up')).packageUp({ cwd: basePath }),
    name: undefined as string | undefined,
    version: undefined as string | undefined
  };

  if (package_.path) {
    discoverDebug('loading package.json file from %O', package_.path);

    try {
      const { name, version }: PackageJson = JSON.parse(
        await fs.readFile(package_.path, 'utf8')
      );

      package_.name = name;
      package_.version = version;
    } catch (error) {
      /* istanbul ignore next */
      discoverDebug.warn(
        'load failed: attempt to import %O failed: %O',
        package_.path,
        error
      );
    }
  } else {
    discoverDebug.warn('search failed: no package.json file found');
  }

  discoverDebug('relevant cli package.json data discovered: %O', package_);

  if (context.state.globalVersionOption) {
    if (!context.state.globalVersionOption.text) {
      context.state.globalVersionOption.text = package_.version || '';
    }

    if (!context.state.globalVersionOption.text) {
      context.state.globalVersionOption = undefined;
      discoverDebug.warn(
        'disabled built-in version option (globalVersionOption=undefined) since no version info available'
      );
    }
  }

  discoverDebug('beginning configuration module auto-discovery at %O', basePath);

  await discover(basePath);

  discoverDebug('configuration module auto-discovery completed');

  if (context.commands.size) {
    discoveredDebug.message(
      '%O commands loaded: %O',
      context.commands.size,
      context.commands.keys()
    );
    discoveredDebug.message('%O', context.commands);
  } else {
    throw new AssertionFailedError(BfErrorMessage.NoConfigurationLoaded(basePath));
  }

  return;

  // *** *** ***

  async function discover(
    configPath: AbsolutePath,
    lineage: string[] = [],
    grandparentPrograms: Programs | undefined = undefined,
    grandparentMeta: ProgramMetadata | undefined = undefined
  ): Promise<void> {
    const isRootCommand = !alreadyLoadedRootCommand;
    const parentType: ProgramType = isRootCommand ? 'pure parent' : 'parent-child';

    const depth = lineage.length;

    discoverDebug('initial parent lineage: %O', lineage);
    discoverDebug('is root (aka "pure parent") command: %O', isRootCommand);

    assert(
      grandparentPrograms === undefined || !isRootCommand,
      BfErrorMessage.GuruMeditation()
    );

    const { configuration: parentConfig, metadata: parentMeta } =
      await loadConfiguration(
        ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts'].map((extension) =>
          toPath(configPath, `index.${extension}`)
        )
      );

    if (!parentConfig) {
      discoverDebug.warn(
        `skipped ${parentType} configuration (depth: %O) due to missing or unloadable index file in directory %O`,
        depth,
        configPath
      );

      return;
    }

    ensureConfigurationDoesNotConflictWithReservedNames(parentConfig, lineage.join(' '));

    lineage = [...lineage, parentConfig.name];
    const parentConfigFullName = lineage.join(' ');

    discoverDebug('updated parent lineage: %O', lineage);
    discoverDebug('command full name: %O', parentConfigFullName);

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

    discoverDebug(`added ${parentType} command mapping to ExecutionContext::commands`);

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

    discoveredDebug(
      `discovered ${parentType} configuration (depth: %O) for command %O`,
      depth,
      parentConfigFullName
    );

    const configDir = await fs.opendir(configPath);

    for await (const entry of configDir) {
      const isPotentialChildConfigOfCurrentParent =
        /.*(?<!index)\.(?:js|mjs|cjs|ts|mts|cts)$/.test(entry.name) &&
        !entry.name.endsWith('.d.ts');

      const entryFullPath = toPath(toAbsolutePath(entry.parentPath), entry.name);

      discoverDebug('saw potential child configuration file: %O', entryFullPath);

      if (entry.isDirectory()) {
        discoverDebug('file is actually a directory, recursing');
        await discover(entryFullPath, lineage, parentPrograms, parentMeta);
      } else if (isPotentialChildConfigOfCurrentParent) {
        discoverDebug('attempting to load file');

        const { configuration: childConfig, metadata: childMeta } =
          await loadConfiguration(entryFullPath);

        /* istanbul ignore next */
        if (!childConfig) {
          discoverDebug.error(
            `failed to load pure child configuration (depth: %O) due to missing or invalid file %O`,
            depth,
            entryFullPath
          );

          throw new AssertionFailedError(
            BfErrorMessage.ConfigLoadFailure(entryFullPath)
          );
        }

        const childConfigFullName = `${parentConfigFullName} ${childConfig.name}`;

        discoverDebug('pure child full name (lineage): %O', childConfigFullName);

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

        discoverDebug(`added pure child command mapping to ExecutionContext::commands`);

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

        discoveredDebug(
          `discovered pure child configuration (depth: %O) for command %O`,
          depth + 1,
          childConfigFullName
        );
      } else {
        discoverDebug(
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
  async function loadConfiguration(configPath: Arrayable<AbsolutePath>) {
    const isRootProgram = !alreadyLoadedRootCommand;
    const loadDebug = discoverDebug.extend('load-configuration');

    const maybeConfigPaths = [configPath]
      .flat()
      .map((p) => p.trim())
      .filter(Boolean);

    loadDebug(
      'loading new configuration from the first readable path: %O',
      maybeConfigPaths
    );

    while (maybeConfigPaths.length) {
      try {
        const maybeConfigPath = maybeConfigPaths.shift()!;
        const maybeConfigFileURL = pathToFileURL(maybeConfigPath).toString();

        loadDebug(
          'attempting to load configuration file url: %O (real path: %O)',
          maybeConfigFileURL,
          maybeConfigPath
        );

        // eslint-disable-next-line no-await-in-loop
        const maybeImportedConfig = await (async () => {
          try {
            // TODO: Defer importing the command/config until later (will require
            // TODO: major refactor)
            return (await import(maybeConfigFileURL)) as ImportedConfigurationModule;
          } catch (error) {
            if (
              isUnknownFileExtensionSystemError(error) ||
              (isModuleNotFoundSystemError(error) &&
                (error.moduleName?.endsWith(maybeConfigPath) ||
                  /* istanbul ignore next */
                  // ? Just match url against url and avoid escape issues (#174)
                  error.url === maybeConfigFileURL.toString()))
            ) {
              loadDebug.warn(
                'a recoverable failure occurred while attempting to load configuration: %O',
                error
              );
            } else {
              throw error;
            }
          }
        })();

        loadDebug('maybeImportedConfig: %O', maybeImportedConfig);

        if (maybeImportedConfig) {
          const meta: ProgramMetadata = {
            filename: basename(maybeConfigPath),
            filepath: maybeConfigFileURL,
            hasChildren: false,
            parentDirName: basename(toDirname(maybeConfigPath)),

            // ? The following properties are protected from being accessed too
            // ? early since some of their values are determined elsewhere

            /* istanbul ignore next */
            get filenameWithoutExtension() {
              return assert.fail(BfErrorMessage.GuruMeditation());
            },

            set filenameWithoutExtension(
              v: ProgramMetadata['filenameWithoutExtension']
            ) {
              // @ts-expect-error: deletions will continue until moral improves
              delete meta.filenameWithoutExtension;
              meta.filenameWithoutExtension = v;
            },

            /* istanbul ignore next */
            get fullUsageText() {
              return assert.fail(BfErrorMessage.GuruMeditation());
            },

            set fullUsageText(v: ProgramMetadata['fullUsageText']) {
              // @ts-expect-error: deletions will continue until moral improves
              delete meta.fullUsageText;
              meta.fullUsageText = v;
            },

            /* istanbul ignore next */
            get isImplemented() {
              return assert.fail(BfErrorMessage.GuruMeditation());
            },

            set isImplemented(v: ProgramMetadata['isImplemented']) {
              // @ts-expect-error: deletions will continue until moral improves
              delete meta.isImplemented;
              meta.isImplemented = v;
            },

            /* istanbul ignore next */
            get reservedCommandNames() {
              return assert.fail(BfErrorMessage.GuruMeditation());
            },

            set reservedCommandNames(v: ProgramMetadata['reservedCommandNames']) {
              // @ts-expect-error: deletions will continue until moral improves
              delete meta.reservedCommandNames;
              meta.reservedCommandNames = v;
            },

            /* istanbul ignore next */
            get type() {
              return assert.fail(BfErrorMessage.GuruMeditation());
            },

            set type(v: ProgramMetadata['type']) {
              // @ts-expect-error: deletions will continue until moral improves
              delete meta.type;
              meta.type = v;
            }
          };

          meta.filenameWithoutExtension = meta.filename
            .split('.')
            .slice(0, -1)
            .join('.');

          const isParentProgram = meta.filenameWithoutExtension === 'index';

          meta.type = isRootProgram
            ? 'pure parent'
            : isParentProgram
              ? 'parent-child'
              : 'pure child';

          loadDebug('configuration file metadata (w/o reservedCommandNames): %O', meta);

          let importedConfig = maybeImportedConfig;

          // ? ESM <=> CJS interop. If there's a default property, we'll use it
          // ? (covered by integration tests)
          /* istanbul ignore next */
          if (importedConfig.default) {
            importedConfig = importedConfig.default;
          }

          // ? ESM <=> CJS interop, again. See:
          // ? test/fixtures/several-files-cjs-esm/nested/first.cjs
          // ? (covered by integration tests)
          /* istanbul ignore next */
          if (importedConfig.default) {
            importedConfig = importedConfig.default;
          }

          let rawConfig: Partial<Configuration>;

          if (typeof importedConfig === 'function') {
            loadDebug('configuration returned a function');
            // TODO: Defer invoking default export until later (will require
            // TODO: major refactor)
            // eslint-disable-next-line no-await-in-loop
            rawConfig = await importedConfig(context);
          } else {
            loadDebug('configuration returned an object (or something coerced into {})');
            rawConfig = typeof importedConfig === 'object' ? importedConfig : {};
          }

          // ? Ensure configuration namespace is copied by value!
          rawConfig = { ...rawConfig };

          const command = (rawConfig.command ?? '$0').trim() as NonNullable<
            typeof rawConfig.command
          >;

          meta.isImplemented = rawConfig.handler !== undefined || command !== '$0';
          const handlerDebug = loadDebug.extend('handler');

          const finalConfig: Configuration = {
            aliases: rawConfig.aliases?.map((str) => replaceSpaces(str).trim()) || [],
            builder: rawConfig.builder || {},
            command,
            deprecated: rawConfig.deprecated ?? false,
            // ? This property is trimmed below
            description: rawConfig.description ?? '',
            handler(...args) {
              handlerDebug('executing real handler function for %O', finalConfig.name);

              return (rawConfig.handler || defaultCommandHandler)(...args);
            },
            name: replaceSpaces(
              rawConfig.name ||
                (isRootProgram && package_.name
                  ? package_.name
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

          loadDebug.message('successfully loaded configuration object: %O', finalConfig);
          loadDebug('validating loaded configuration object for correctness');

          for (const name of [finalConfig.name, ...finalConfig.aliases]) {
            /* istanbul ignore next */
            if (hasSpacesRegExp.test(name)) {
              throw new AssertionFailedError(
                BfErrorMessage.InvalidCharacters(name, 'space(s)')
              );
            }

            if (name.includes('$0')) {
              throw new AssertionFailedError(
                BfErrorMessage.InvalidCharacters(name, '$0')
              );
            }

            if (name.includes('$1')) {
              throw new AssertionFailedError(
                BfErrorMessage.InvalidCharacters(name, '$1')
              );
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
                BfErrorMessage.InvalidCharacters(name, '|, <, >, [, ], {, or }')
              );
            }
          }

          if (
            finalConfig.command !== '$0' &&
            (!finalConfig.command.startsWith('$0') ||
              !finalConfig.command.startsWith('$0 '))
          ) {
            throw new AssertionFailedError(
              BfErrorMessage.InvalidCommandExportBadStart(finalConfig.name)
            );
          }

          // ! This check should occur AFTER the bad start check (above)
          if (!isValidYargsCommandDslRegExp.test(finalConfig.command)) {
            throw new AssertionFailedError(
              BfErrorMessage.InvalidCommandExportBadPositionals(finalConfig.name)
            );
          }

          loadDebug('configuration is valid!');

          // ? The first configuration loaded is gonna be the root every time!
          alreadyLoadedRootCommand = true;

          meta.reservedCommandNames = [finalConfig.name, ...finalConfig.aliases];
          loadDebug('metadata reserved command names: %O', meta.reservedCommandNames);

          return { configuration: finalConfig, metadata: meta };
        }
      } catch (error) {
        loadDebug.error(
          'an irrecoverable failure occurred while loading configuration: %O',
          error
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
              BfErrorMessage.DuplicateCommandName(
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

    assert(typeof parentFullName === 'string', BfErrorMessage.GuruMeditation());

    context.commands.forEach((command, commandName) => {
      const splitCommandName = commandName.split(' ');
      const seenParentFullName = splitCommandName.slice(0, -1).join(' ');
      const seenName = splitCommandName.at(-1);

      if (seenParentFullName === parentFullName) {
        command.metadata.reservedCommandNames.forEach((reservedName, index) => {
          assert(
            index !== 0 || seenName === reservedName,
            BfErrorMessage.GuruMeditation()
          );

          checkCount++;
          if (reservedName === config.name) {
            /* istanbul ignore next */
            throw new AssertionFailedError(
              BfErrorMessage.DuplicateCommandName(
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
                BfErrorMessage.DuplicateCommandName(
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

    discoverDebug(
      'no reserved name conflicts detected (%O checks performed)',
      checkCount
    );
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
    const makerDebug = discoverDebug.extend('make:programs');

    if (type === 'pure parent' && config.aliases.length) {
      makerDebug.warn(
        'root command aliases will be ignored during routing and will not appear in help text: %O',
        config.aliases
      );
    }

    const programs = {
      effector: await makePartiallyConfiguredProgram('effector'),
      helper: await makePartiallyConfiguredProgram('helper'),
      router: await makePartiallyConfiguredProgram('router')
    };

    if (type === 'pure parent' && context.state.globalVersionOption?.name.length) {
      const { name: versionOptionName, description: versionOptionDescription } =
        context.state.globalVersionOption;

      assert(versionOptionName.length, BfErrorMessage.GuruMeditation());

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

    const routerDebug = discoverDebug.extend('router@');

    programs.router.command(
      ['$0'],
      '[routed-1]',
      {},
      async function () {
        routerDebug('control reserved; calling HelperProgram::parseAsync');
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
      false,
      makeVanillaYargsBuilder(programs.helper, config, 'first-pass'),
      async (parsedArgv) => {
        const helperDebug = discoverDebug.extend('helper');

        helperDebug('entered wrapper handler function for %O', config.name);
        assert(
          context.state.firstPassArgv === undefined,
          BfErrorMessage.GuruMeditation()
        );

        if (context.state.isHandlingHelpOption) {
          helperDebug(
            'sending help text to stdout (triggered by the %O option)',
            /* istanbul ignore next */
            context.state.globalHelpOption?.name || '???'
          );

          // ! Notice the helper program is ALWAYS the one outputting help text.
          programs.helper.showHelp('log');
          context.state.didOutputHelpOrVersionText = true;

          helperDebug('gracefully exited wrapper handler function for %O', config.name);
          throw new GracefulEarlyExitError();
        } else if (type === 'pure parent' && context.state.isHandlingVersionOption) {
          helperDebug(
            'sending version text to stdout (triggered by the %O option)',
            /* istanbul ignore next */
            context.state.globalVersionOption?.name || '???'
          );

          // eslint-disable-next-line no-console
          console.log(context.state.globalVersionOption?.text || '???');
          context.state.didOutputHelpOrVersionText = true;

          helperDebug('gracefully exited wrapper handler function for %O', config.name);
          throw new GracefulEarlyExitError();
        } else {
          if (!meta.isImplemented && meta.hasChildren) {
            helperDebug.message(
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
            BfErrorMessage.GuruMeditation()
          );

          context.state.deepestParseResult = localArgv;

          helperDebug(
            'context.state.deepestParseResult set to EffectorProgram::parseAsync result: %O',

            localArgv
          );

          helperDebug('exited wrapper handler function for %O', config.name);
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

    makerDebug(
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
        const descriptorDebug = discoverDebug.extend(`${descriptor}@`);
        descriptorDebug.message('entered failure handler for command %O', fullName);

        // ? If a failure happened but error is not defined, it was *probably*
        // ? a yargs-specific error (e.g. argument validation failure).
        // ! Is there a better way to differentiate between Yargs-specific
        // ! errors and third-party errors? Or is `!error` the best we can do?
        const isProbablyVanillaYargsError = !error;

        descriptorDebug('message: %O', message);
        descriptorDebug('error.message: %O', error?.message);
        descriptorDebug('error is native error: %O', isNativeError(error));
        descriptorDebug(
          'is allowed to show help on fail: %O',
          context.state.showHelpOnFail
        );
        descriptorDebug(
          'is probably vanilla yargs error: %O',
          isProbablyVanillaYargsError
        );
        descriptorDebug(
          'did output help or version text: %O',
          context.state.didOutputHelpOrVersionText
        );

        assert(
          !meta.hasChildren || type !== 'pure child',
          BfErrorMessage.GuruMeditation()
        );

        // ? Only helpers of "parous" parents should send help text to stderr
        const isParousParentHelperHandlingCommandNotImplementedError =
          meta.hasChildren &&
          descriptor === 'helper' &&
          isCommandNotImplementedError(error);

        descriptorDebug(
          'is parous parent helper handling CommandNotImplementedError: %O',
          isParousParentHelperHandlingCommandNotImplementedError
        );

        const forceShowHelp = isCliError(error) && error.showHelp;
        descriptorDebug('will attempt to force output of help text: %O', forceShowHelp);

        if (
          context.state.showHelpOnFail &&
          !context.state.didOutputHelpOrVersionText &&
          (isProbablyVanillaYargsError ||
            isParousParentHelperHandlingCommandNotImplementedError ||
            forceShowHelp)
        ) {
          descriptorDebug(
            `sending help text to stderr (triggered by ${error ? 'black flag' : 'yargs'})`
          );
          // ! Note how only the most specific program gets to generate help
          // ! text.
          program.showHelp('error');
          context.state.didOutputHelpOrVersionText = true;

          if (isParousParentHelperHandlingCommandNotImplementedError) {
            descriptorDebug(
              'exited failure handler: set finalError to CliError(InvalidSubCommandInvocation)'
            );

            context.state.finalError = new CliError(
              BfErrorMessage.InvalidSubCommandInvocation()
            );
          }
        }

        if (context.state.finalError === undefined) {
          if (isCliError(error)) {
            descriptorDebug('exited failure handler: set finalError to error as-is');
            context.state.finalError = error;
          } else {
            descriptorDebug(
              'exited failure handler: set finalError to error wrapped with CliError'
            );
            context.state.finalError = new CliError(
              /* istanbul ignore next */
              error || message || BfErrorMessage.GuruMeditation()
            );
          }
        } else {
          descriptorDebug('exited failure handler: finalError unchanged');
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
    const makerDebug = discoverDebug.extend('make:program:partial');
    const deferredCommandArgs: Parameters<Program['command']>[] = [];

    makerDebug(
      'creating new proto-%O program (awaiting full configuration)',
      descriptor
    );

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
    } else if (context.state.globalHelpOption?.name.length) {
      const { name: helpOptionName, description: helpOptionDescription } =
        context.state.globalHelpOption;

      assert(helpOptionName.length, BfErrorMessage.GuruMeditation());

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
      get(target, property: PropertyKey, proxy: Program) {
        const isOwnProperty =
          Object.hasOwn(vanillaYargs, property) ||
          Object.hasOwn(Object.getPrototypeOf(vanillaYargs), property);

        if (['help', 'version'].includes(property as string)) {
          return function () {
            throw new AssertionFailedError(
              BfErrorMessage.InvocationNotAllowed(property as string)
            );
          };
        }

        if (property === 'parseSync') {
          return function () {
            throw new AssertionFailedError(BfErrorMessage.UseParseAsyncInstead());
          };
        }

        if (property === 'argv') {
          makerDebug.warn(
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
              makerDebug(
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

              const optionsShallowClone = Object.fromEntries(
                Object.entries(options).map(([option, optionConfiguration]) => {
                  if ('demandOption' in optionConfiguration) {
                    makerDebug(
                      `discarded attempted mutation of disabled yargs option configuration key "demandOption" (for the %O option) on %O program`,
                      option,
                      descriptor
                    );
                  }

                  const { demandOption: _, ...rest } = optionConfiguration;
                  return [option, rest];
                })
              );

              target.options(optionsShallowClone);
              return proxy;
            };
          }
        }

        if (descriptor === 'router') {
          if (isOwnProperty && !['parseAsync', 'command'].includes(property as string)) {
            return typeof target[property as keyof typeof target] === 'function'
              ? function () {
                  throw new AssertionFailedError(
                    BfErrorMessage.InvocationNotAllowed(String(property))
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
              makerDebug('::command call was deferred for %O program', descriptor);
              deferredCommandArgs.push(args);
              return proxy;
            };
          }

          if (property === 'command_finalize_deferred') {
            return function () {
              makerDebug(
                'began alpha-sorting deferred command calls for %O program',
                descriptor
              );

              deferredCommandArgs.sort(([firstCommands], [secondCommands]) => {
                const firstCommand = [firstCommands].flat()[0];
                const secondCommand = [secondCommands].flat()[0];

                // ? Ensure the root command is added first (though it probably
                // ? doesn't matter either way).
                /* istanbul ignore next */
                return firstCommand?.startsWith('$0')
                  ? -1
                  : secondCommand?.startsWith('$0')
                    ? 1
                    : alphaSort.compare(String(firstCommand), String(secondCommand));
              });

              makerDebug(
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
        // ! statements above or terrible things will happen!
        const value: unknown = target[property as keyof typeof target];

        if (typeof value === 'function') {
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
        const routerDebug = discoverDebug.extend('router');
        const givenName = context.state.rawArgv.shift();

        /* istanbul ignore next */
        if (routerDebug.enabled) {
          const splitName = childFullName.split(' ');
          routerDebug.message(
            'entered router handler function bridging %O ==> %O',
            splitName.slice(0, -1).join(' '),
            splitName.at(-1)
          );

          routerDebug('shifted given name off rawArgv: %O', givenName);
          routerDebug('new context.state.rawArgv: %O', context.state.rawArgv);
          routerDebug("relinquishing control to child command's router program");
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
      discoverDebug(
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
        throw new AssertionFailedError(BfErrorMessage.GuruMeditation());
      },
      [],
      childConfig.deprecated
    );

    if (parentHelper) {
      discoverDebug(
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
  ): Extract<Parameters<Program['command']>[2], (...args: never[]) => unknown> {
    return (vanillaYargs, helpOrVersionSet) => {
      const yargsDebug = discoverDebug.extend(
        pass === 'first-pass' ? 'helper' : 'effector'
      );

      yargsDebug(`entered wrapper builder function (${pass}) for %O`, config.name);

      assert(
        pass === 'first-pass'
          ? context.state.firstPassArgv === undefined
          : context.state.firstPassArgv !== undefined,
        BfErrorMessage.GuruMeditation()
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

        assert(
          !isPromise(blackFlagBuilderResult),
          BfErrorMessage.BuilderCannotBeAsync(config.name)
        );

        if (blackFlagBuilderResult && blackFlagBuilderResult !== program) {
          // ? Use program here instead of vanillaYargs since we want our
          // ? version of the ::options method.
          program.options(
            blackFlagBuilderResult as Parameters<typeof vanillaYargs.options>[0]
          );
        }

        yargsDebug(
          `exited wrapper builder function (${pass}) for %O (no errors)`,
          config.name
        );
      } catch (error) {
        yargsDebug.warn(
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
 * Replace all space characters in a string with hyphens.
 */
function replaceSpaces(str: string) {
  return str.replaceAll(/\s/g, '-');
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
  /* istanbul ignore next */
  return (
    isNativeError(error) &&
    'code' in error &&
    ((error.code === 'ERR_MODULE_NOT_FOUND' && 'url' in error) ||
      (error.code === 'MODULE_NOT_FOUND' && 'moduleName' in error))
  );
}

/**
 * Type-guard for Node's "ERR_UNKNOWN_FILE_EXTENSION" so-called `SystemError`s.
 */
function isUnknownFileExtensionSystemError(error: unknown): error is Error & {
  code: 'ERR_UNKNOWN_FILE_EXTENSION';
} {
  return (
    isNativeError(error) &&
    'code' in error &&
    error.code === 'ERR_UNKNOWN_FILE_EXTENSION'
  );
}
