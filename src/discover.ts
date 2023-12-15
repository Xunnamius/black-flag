import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isNativeError, isPromise } from 'node:util/types';

import makeVanillaYargs from 'yargs/yargs';

import { defaultUsageText } from 'universe/constant';
import { wrapExecutionContext } from 'universe/index';

import {
  AssertionFailedError,
  CliError,
  CommandNotImplementedError,
  ErrorMessage,
  GracefulEarlyExitError,
  isCliError
} from 'universe/error';

import type {
  Arguments,
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

import type { Configuration, ImportedConfigurationModule } from 'types/module';

import type { PackageJson } from 'type-fest';

const hasSpacesRegExp = /\s+/;

/**
 * Recursively scans the filesystem for valid index files starting at
 * `basePath`. Upon encountering such a file, it is imported along with each
 * valid sibling file in the same directory, treating the raw results as
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
): Promise<{
  /**
   * Stores the result of the latest call to `EffectorProgram::parseAsync`,
   * hence the need for passing around a reference to the object containing this
   * result.
   *
   * This is necessary because, with our depth-first multi-yargs architecture,
   * the parse job done by shallower programs in the chain must not mutate the
   * result of the deepest call to `EffectorProgram::parseAsync` in the
   * execution chain.
   */
  result: Arguments | undefined;
}> {
  // ! Invariant: first command to be discovered, if any, is the root command.
  let alreadyLoadedRootCommand = false;

  const debug = context.debug.extend('discover');
  const debug_load = debug.extend('load');

  const deepestParseResult: Awaited<ReturnType<typeof discoverCommands>> = {
    result: undefined
  };

  debug('ensuring base path directory exists and is readable: "%O"', basePath);

  try {
    await fs.access(basePath, fs.constants.R_OK);
    if (!(await fs.stat(basePath)).isDirectory()) {
      throw new Error('path is not a directory');
    }
  } catch (error) {
    debug.error('failed due to invalid base path "%O": %O', basePath, error);
    throw new AssertionFailedError(
      ErrorMessage.AssertionFailureBadConfigurationPath(basePath)
    );
  }

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
    throw new AssertionFailedError(
      ErrorMessage.AssertionFailureNoConfigurationLoaded(basePath)
    );
  }

  return deepestParseResult;

  async function discover(
    configPath: string,
    lineage: string[] = [],
    grandparentPrograms: Programs | undefined = undefined
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
        `skipped ${parentType} configuration (depth: %O) due to missing index file in directory %O`,
        depth,
        configPath
      );

      return;
    }

    lineage = [...lineage, parentConfig.name];
    const parentConfigFullName = lineage.join(' ');

    debug('updated parent lineage: %O', lineage);
    debug('command full name: %O', parentConfigFullName);

    const parentPrograms = await makeCommandPrograms(
      parentConfig,
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
        await discover(entryFullPath, lineage, parentPrograms);
      } else if (isPotentialChildConfigOfCurrentParent) {
        debug('attempting to load file');

        const { configuration: childConfig, metadata: childMeta } =
          await loadConfiguration(entryFullPath, context);

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

        const childPrograms = await makeCommandPrograms(
          childConfig,
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
            error.moduleName === maybeConfigPath
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
          const meta = {} as ProgramMetadata;

          meta.filename = path.basename(maybeConfigPath);
          meta.filenameWithoutExtension = meta.filename.split('.').slice(0, -1).join('.');
          meta.filepath = maybeConfigPath;
          meta.parentDirName = path.basename(path.dirname(maybeConfigPath));

          const isParentProgram = meta.filenameWithoutExtension === 'index';

          meta.type = isRootProgram
            ? 'pure parent'
            : isParentProgram
              ? 'parent-child'
              : 'pure child';

          debug_('configuration file metadata: %O', meta);

          // ? ESM <=> CJS interop
          if ('default' in maybeImportedConfig && !maybeImportedConfig.__esModule) {
            maybeImportedConfig = maybeImportedConfig.default;
          }

          let rawConfig: Partial<Configuration>;

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
              debug_.extend('handler')(
                'executing real handler function for %O',
                finalConfig.name
              );

              return (rawConfig.handler || defaultCommandHandler)(...args);
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
              ErrorMessage.AssertionFailureNamingInvariant(finalConfig.name)
            );
          }

          debug_('configuration is valid!');

          alreadyLoadedRootCommand = true;

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
   * Returns a {@link Programs} object with fully-configured programs.
   */
  async function makeCommandPrograms(
    config: Configuration,
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

    // * Only the root command should recognize the --version flag.

    if (type === 'pure parent') {
      programs.helper.version(pkg.version || false);
      programs.effector.version(pkg.version || false);
    } else {
      programs.helper.version(false);
      programs.effector.version(false);
    }

    // * Enable strict mode by default.

    programs.helper.strict(true);
    programs.effector.strict(true);

    // * Configure usage help text.

    const usageText = (config.usage ?? defaultUsageText)
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

    // * Finish configuring custom error handling for helper, which is
    // * responsible for outputting help text to stderr

    programs.helper.fail((message: string | null, error) => {
      const debug_ = debug.extend('helper*');
      debug_.message('entered privileged failure handler for command %O', fullName);

      debug_('message: %O', message);
      debug_('error.message: %O', error?.message);
      debug_('error is native error: %O', isNativeError(error));

      // TODO: probably better to check for instanceof YError ... maybe?
      if (!error && context.state.showHelpOnFail) {
        // ? If there's no error object, it's probably a yargs-specific error.
        debug_('sending help text to stderr (triggered by yargs)');
        // ! Notice the helper program is ALWAYS the one outputting help text.
        programs.helper.showHelp('error');
        // eslint-disable-next-line no-console
        console.error();
      }

      if (isCliError(error)) {
        debug_('exited privileged failure handler: re-throwing error as-is');
        throw error;
      } else {
        debug_(
          'exited privileged failure handler: re-throwing error/message wrapped with CliError'
        );
        throw new CliError(error || message);
      }
    });

    programs.effector.fail(false);

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

          debug_('gracefully exited wrapper handler function for %O', config.name);
          throw new GracefulEarlyExitError();
        } else {
          context.state.firstPassArgv = parsedArgv;

          const localArgv = await programs.effector.parseAsync(
            context.state.rawArgv,
            wrapExecutionContext(context)
          );

          const isDeepestParseResult = !deepestParseResult.result;
          deepestParseResult.result ??= localArgv;

          debug_('is deepest effector parse result: %O', isDeepestParseResult);
          debug_(
            `EffectorProgram::parseAsync result${
              !isDeepestParseResult ? ' (discarded)' : ''
            }: %O`,
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

    // * For router programs, disable just about everything. For other program
    // * types, configure Black Flag's custom default help option.

    if (descriptor === 'router') {
      vanillaYargs
        .version(false)
        .scriptName('[router]')
        .usage('[router]')
        .strict(false)
        .exitProcess(false)
        .fail(false);
    } else if (context.state.globalHelpOption) {
      const { name, description } = context.state.globalHelpOption;
      assert(name.length, ErrorMessage.GuruMeditation());
      vanillaYargs.option(name, { boolean: true, description });
    }

    // * Disable exit-on-error functionality.

    vanillaYargs.exitProcess(false);

    // * Begin configuring custom error handling.

    vanillaYargs.showHelpOnFail(false);

    // * We defer the rest of the setup until we enter a scope with more
    // * information available.

    return new Proxy(vanillaYargs, {
      get(target, property: keyof Program, proxy: Program) {
        if (property === ('help' as keyof Program)) {
          throw new AssertionFailedError(
            ErrorMessage.AssertionFailureInvocationNotAllowed(property)
          );
        }

        if (property === 'parse') {
          debug_.warn(
            'bad function call: you should be using "parseAsync" instead of "parse"'
          );
        }

        if (property === 'parseSync') {
          throw new AssertionFailedError(
            ErrorMessage.AssertionFailureUseParseAsyncInstead()
          );
        }

        if (property === 'argv') {
          debug_.warn(
            `discarded attempted access to disabled "argv" magic property on %O program`,
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

        if (descriptor === 'router') {
          if (
            Object.hasOwn(vanillaYargs, property) &&
            !['parse', 'parseAsync', 'command', 'parsed'].includes(property)
          ) {
            throw new AssertionFailedError(
              ErrorMessage.AssertionFailureInvocationNotAllowed(property)
            );
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
                return firstCommand.startsWith('$0')
                  ? 1
                  : secondCommand.startsWith('$0')
                    ? -1
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

        const value: unknown = target[property as keyof typeof target];

        if (value instanceof Function) {
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
        const acceptableNames = [childConfig.name, ...childConfig.aliases];

        if (debug_.enabled) {
          const splitName = childFullName.split(' ');
          debug_.message(
            'entered router handler function bridging %O ==> %O',
            splitName.slice(0, -1).join(' '),
            splitName.at(-1)
          );
        }

        debug_('ordering invariant: %O must be one of: %O', givenName, acceptableNames);

        const rawArgvSatisfiesArgumentOrderingInvariant =
          givenName && acceptableNames.includes(givenName);

        if (!rawArgvSatisfiesArgumentOrderingInvariant) {
          debug_.error('ordering invariant violated!');

          throw new AssertionFailedError(
            ErrorMessage.AssertionFailureOrderingInvariant()
          );
        }

        debug_('invariant satisfied');
        debug_("relinquishing control to child command's router program");

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
      debug_(`entered wrapped builder function (${pass}) for %O`, config.name);

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
                program,
                context.state.isHandlingHelpOption || helpOrVersionSet,
                context.state.firstPassArgv
              )
            : config.builder;

        if (blackFlagBuilderResult && blackFlagBuilderResult !== program) {
          // ? Record<string, never> is really yargs.Options but why import it?
          // ? Our Proxy always returns a program, so TS can stop worrying!
          vanillaYargs.options(blackFlagBuilderResult as Record<string, never>);
        }

        debug_(
          `exited wrapped builder function (${pass}) for %O (no errors)`,
          config.name
        );
      } catch (error) {
        debug_.warn(
          `exited wrapped builder function (${pass}) for %O (with error)`,
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
 * Uppercase the first letter of a string.
 */
function capitalize(str: string) {
  return (str.at(0)?.toUpperCase() || '') + str.slice(1);
}

/**
 * Type-guard for Node's "MODULE_NOT_FOUND" so-called `SystemError`.
 */
function isModuleNotFoundSystemError(error: unknown): error is NodeJS.ErrnoException & {
  _originalMessage: string;
  code: 'MODULE_NOT_FOUND';
  hint: string;
  moduleName: string;
  requireStack: unknown;
  siblingWithSimilarExtensionFound: boolean;
} {
  return (
    isNativeError(error) &&
    'code' in error &&
    error.code === 'MODULE_NOT_FOUND' &&
    'moduleName' in error
  );
}
