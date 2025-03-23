# Black Flag: Features

Black Flag is a CLI library built on top of Yargs. It offers several features
above and beyond what is available to users of vanilla Yargs.

## Declaratively Build Deep Command Hierarchies ✨

Black Flag provides first-class support for authoring simple one-off executables
_and_ sprawling deeply nested tree-like structures of commands and child
commands alike.

No more pleading with `yargs::commandDir()` to behave. Less wrestling with
positional parameters. Less tap-dancing around footguns. And no more dealing
with help text that unexpectedly changes depending on the OS or the presence of
aliases.

For instance, consider a "myctl" command with several subcommands:

```shell
myctl --version
myctl init --lang node --version=23.3
myctl remote add origin me@mine.myself
myctl remote add --help
myctl remote remove upstream
myctl remote show
myctl remote --help
```

Your hierarchy of commands is declared via the filesystem. Each command's
configuration file is discovered and loaded automatically (so-called
_auto-discovery_).

By default, commands assume the name of their file or, for index files, their
parent directory; the root command assumes the name of the project taken from
the nearest `package.json` file.

```text
my-cli-project
├── cli.ts
├── commands
│   ├── index.ts
│   ├── init.ts
│   └── remote
│       ├── add.ts
│       ├── index.ts
│       ├── remove.ts
│       └── show.ts
├── test.ts
└── package.json
```

That's it. Easy peasy.

## Built-In Support for Dynamic Options ✨

[Dynamic options][1] are options whose `builder` configuration relies on the
resolved value of other options. Vanilla Yargs does not support these, but Black
Flag does:

<!-- example-region dynamic-options-1 -->

```shell
# These two lines have identical meanings and outputs
myctl init --lang node
myctl init --lang node --version=23.3
# Output:
> initializing new node@23.3 project...
> initializing new node@23.3 project...
```

<!-- example-region dynamic-options-2 -->

```shell
# And these three lines have identical meanings and outputs
myctl init
myctl init --lang python
myctl init --lang python --version=3.13
# Output:
> initializing new python@3.13 project...
> initializing new python@3.13 project...
> initializing new python@3.13 project...
```

Note how the default value of `--version` changes depending on the value of
`--lang`. Further note that `myctl init` is configured to select the pythonic
defaults when called without any arguments.

## It's Yargs All the Way down ✨

At the end of the day, you're still working with Yargs instances, so there's no
unfamiliar interface to wrestle with and no brand new things to learn. All of
Yargs's killer features still work, the [Yargs documentation][2] still applies,
and Black Flag, as a wrapper around Yargs, is [widely compatible][3] with the
existing Yargs ecosystem.

For example, Black Flag helps you validate those [dynamic options][4] using the
same Yargs API you already know and love:

<!-- example-region all-1 -->

```typescript
// File: my-cli-project/commands/init.ts

const PYTHON_DEFAULT_VERSION = '3.13';
const NODE_DEFAULT_VERSION = '23.3';

// "argv" is a new third argument for builders   vvv
export function builder(yargs, _helpOrVersionSet, argv) {
  //                                             ^^^

  // Tell Yargs to leave strings that look like numbers as strings
  yargs.parserConfiguration({ 'parse-numbers': false });

  // These conditional branches will be used to validate any ✨ dynamic ✨
  // arguments and trigger the command's handler if validation succeeds.
  //
  // This is possible because Black Flag runs the builder function twice. First
  // WITHOUT the "argv" parameter, and then again WITH the "argv" parameter set
  // to the result from the first run. The recomputed "argv" result from the
  // second run is the one that gets passed to the handler function. The first
  // "argv" result (the one we see now) is discarded.
  //
  //  vvv "argv" is only defined on builder's SECOND run!
  if (argv?.lang === 'node') {
    return {
      lang: { choices: ['node'], default: 'node' },
      version: {
        choices: ['20.18', '22.12', '23.3'],
        default: NODE_DEFAULT_VERSION
      }
    };
  } else if (argv?.lang === 'python') {
    // Also note above how we can return a literal options object instead of
    // calling yargs.options(...), but we still can if we want to:
    return yargs.options({
      lang: { choices: ['python'], default: 'python' },
      version: {
        choices: ['3.11', '3.12', '3.13'],
        default: PYTHON_DEFAULT_VERSION
      }
    });
  }

  // This conditional branch will be used on builder's first run. It's used for
  // initial GENERIC validation and for generating GENERIC --help text.

  // These next lines are the best you'd be able to do when using vanilla
  // Yargs. But with Black Flag, it's only the generic fallback 🙂

  return {
    lang: {
      choices: ['node', 'python'],
      defaultDescription: '"python"',
      default: argv ? 'python' : undefined
    },
    version: {
      string: true,
      defaultDescription: `"${PYTHON_DEFAULT_VERSION}"`,
      default: argv ? PYTHON_DEFAULT_VERSION : undefined
    }
  };
}

export function handler(argv) {
  console.log(`> initializing new ${argv.lang}@${argv.version} project...`);
  // ...
}
```

> See [the demo repo][5] for the complete implementation of this command.

<!-- example-region all-2 -->

```text
myctl init --lang node --version=23.3
> initializing new node@23.3 project...
```

<!-- example-region all-3 -->

```text
myctl init --lang python --version=23.3
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                 [choices: "python"] [default: "python"]
  --version                  [choices: "3.11", "3.12", "3.13"] [default: "3.13"]

Invalid values:
  Argument: version, Given: "23.3", Choices: "3.11", "3.12", "3.13"
```

<!-- example-region all-4 -->

```text
myctl init --lang fake
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                         [choices: "node", "python"] [default: "python"]
  --version                                           [string] [default: "3.13"]

Invalid values:
  Argument: lang, Given: "fake", Choices: "node", "python"
```

<!-- example-region all-5 -->

```text
myctl init --help
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                         [choices: "node", "python"] [default: "python"]
  --version                                           [string] [default: "3.13"]
```

If `builder` and `handler` sound familiar, it's because the exports from your
command files are essentially the same as those expected by the `yargs::command`
function: [`aliases`][6], [`builder`][7], [`command`][8], [`deprecated`][9],
[`description`][10], [`handler`][11], and two new ones: [`name`][12] and
[`usage`][13].

A fully-typed version of `my-cli-project/commands/init.ts` could look something
like this:

<!-- example-region all-6 -->

```typescript
// File: my-cli-project/commands/init.ts

import type { Configuration, $executionContext } from '@black-flag/core';

// Types are also available vvv
const configuration: Configuration = {
  //                        ^^^

  // ALL OF THESE ARE OPTIONAL! Black Flag would still accept this file even if
  // if were completely blank

  // Used as the command's name in help text, when parsing arguments, when
  // replacing "$0" during string interpolation, and elsewhere. Usually defaults
  // to a trimmed version of the file/directory name
  name: 'init',

  // An array of Yargs aliases for this command. DO NOT include positional
  // arguments here, those go in `command` just like with vanilla Yargs
  aliases: [],

  // Used to define positional args using Yargs's DSL. All command strings must
  // begin with "$0". Defaults to "$0". This value is also used to replace
  // "$000" during string interpolation for the usage option
  command: '$0 [positional-arg-1] [positional-arg-2]',

  // Used as the command's usage instructions in its own help text. "$000", if
  // present, will be replaced by the value of the command option. Afterwards,
  // "$1" and then "$0", if present, will be replaced by the description and
  // name options. Defaults to "Usage: $000\n\n$1". Will be trimmed before being
  // output
  usage: 'Usage: $0 [put positional args here]\n\nThis is neat! Also:\n\n$1',

  // Used as the command's description in its parent command's help text, and
  // when replacing "$1" during string interpolation for the usage option. Set
  // to false to disable the description and hide the command. Defaults to ""
  description: 'initializes stuff',

  // If true, this command will be considered deprecated. Defaults to false
  deprecated: false,

  // Can be a Yargs options object or a builder function like below
  builder(yargs, helpOrVersionSet, argv) {
    // ...

    // We are never forced to return anything...
    // return yargs;
    // ... but we can if we want:
    return yargs.boolean('verbose');
    // We can also just return an options object too:
    return {
      verbose: {
        boolean: true,
        description: '...'
      }
    };
    // Also note you can access ExecutionContext with argv?.[$executionContext]
  },

  // This function is called when the arguments match and pass Yargs
  // validation. Defaults to a function that throws CommandNotImplementedError
  handler(argv) {
    console.log(`> initializing new ${argv.lang}@${argv.version} project...`);
    // Note that you can access ExecutionContext with argv[$executionContext]

    // ...
  }
};

export default configuration;
```

> [!TIP]
>
> The Yargs DSL for declaring and defining positional parameters is described
> in-depth [here][14].

## Run Your Tool Safely and Consistently ✨

Black Flag not only helps you declaratively build your CLI tool, but _run it_
too.

<!-- example-region run-1 -->

```typescript
#!/usr/bin/env node
// File: my-cli-project/cli.ts

import { runProgram } from '@black-flag/core';
// Just point Black Flag at the directory containing your command files
export default runProgram(import.meta.resolve('./commands'));
```

```shell
# This would work thanks to that shebang (#!) and chmod +x
./cli.js remote show origin
# This works after transpiling our .ts files to .js with babel...
node ./cli.js -- remote show origin
# ... and then publishing it and running: npm i -g @black-flag/demo
myctl remote show origin
# Or, if we were using a runtime that supported TypeScript natively
deno ./cli.ts -- remote show origin
```

The [`runProgram`][15] function bootstraps your CLI whenever you need it, e.g.
when testing, in production, when importing your CLI as a dependency, etc.

> [!IMPORTANT]
>
> <ins>**`runProgram` never throws**</ins>, and never calls `process.exit` since
> that's [ dangerous][16]. When testing your CLI, [prefer `makeRunner`][17]
> which can be made to throw.

Under the hood, `runProgram` calls [`configureProgram`][18], which
auto-discovers and collects all the configurations exported from your command
files, followed by [`PreExecutionContext::execute`][19], which is a wrapper
around `yargs::parseAsync` and `yargs::hideBin`.

<!-- example-region run-2 -->

```javascript
const { join } = require('node:path');
const { runProgram } = require('@black-flag/core');

module.exports = runProgram(join(__dirname, 'commands'));
```

👆🏿 These are essentially equivalent 👇🏿

<!-- example-region run-3 -->

```javascript
import { runProgram } from '@black-flag/core';

export default runProgram(import.meta.resolve('./commands'));
```

👆🏿 These are essentially equivalent 👇🏿

<!-- example-region run-4 -->

```javascript
import { join } from 'node:path';
import { configureProgram, isCliError } from '@black-flag/core';
import { hideBin } from '@black-flag/core/util';

let parsedArgv = undefined;

try {
  const commandsDir = import.meta.resolve('./commands');
  const preExecutionContext = await configureProgram(commandsDir);
  parsedArgv = await preExecutionContext.execute(hideBin(process.argv));
  process.exitCode = 0;
} catch (error) {
  // This catch block is why runProgram never throws 🙂
  process.exitCode = isCliError(error) ? error.suggestedExitCode : 1;
}

export default parsedArgv;
```

## Convention over Configuration ✨

Black Flag [favors convention over configuration][20], meaning **everything
works out the box with sensible defaults and no sprawling configuration files**.

However, when additional configuration _is_ required, there are five optional
configuration hooks that give Black Flag the flexibility to describe even the
most bespoke of command line interfaces.

For instance, suppose we added a `my-cli-project/configure.ts` file to our
project:

<!-- example-region convention-1 -->

```typescript
import type {
  ConfigureArguments,
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext,
  ConfigureExecutionEpilogue,
  ConfigureExecutionPrologue
} from '@black-flag/core';

// These configuration hooks have been listed in the order they're typically
// executed by Black Flag. They are all entirely optional.

/**
 * This function is called once towards the beginning of the execution of
 * configureProgram and should return what will be used to create the global
 * context singleton. Note that the return value of this function is cloned and
 * then discarded.
 */
export const configureExecutionContext: ConfigureExecutionContext = async (
  context
) => {
  // You can add some state shared between all your command handlers and
  // configuration hooks here.
  context.somethingDifferent = 'cool';
  return context; // <== This is: the "context" ExecutionContext used everywhere
};

/**
 * This function is called once towards the end of the execution of
 * configureProgram, after all commands have been discovered but before any
 * have been executed, and should apply any final configurations to the Yargs
 * instances that constitute the command line interface.
 */
export const configureExecutionPrologue: ConfigureExecutionPrologue = async (
  { effector, helper, router }, // <== This is: root Yargs instances (see below)
  context
) => {
  // Typically unnecessary and suboptimal to use this hook. Configure commands
  // (including the root command) declaratively using the simple declarative
  // filesystem-based API instead. Otherwise, at this point, you're just using
  // Yargs but with extra steps.
};

/**
 * This function is called once towards the beginning of the execution of
 * PreExecutionContext::execute(X) and should return a process.argv-like
 * array.
 */
export const configureArguments: ConfigureArguments = async (
  rawArgv, // <== This is either the X in ::execute(X), or hideBin(process.argv)
  context
) => {
  // This is where Yargs middleware and other argument pre-processing can be
  // implemented, if necessary.

  // When PreExecutionContext::execute is invoked without arguments, Black Flag
  // calls the yargs::hideBin helper utility on process.argv for you. Therefore,
  // calling hideBin here would cause a bug. You shouldn't ever need to call
  // hideBin manually, but if you do, it's re-exported from
  // '@black-flag/core/util'.

  return rawArgv; // <== This is: the argv that Yargs will be given to parse
};

/**
 * This function is called once after CLI argument parsing completes and either
 * (1) handler execution succeeds or (2) a GracefulEarlyExitError is thrown.
 */
export const configureExecutionEpilogue: ConfigureExecutionEpilogue = async (
  argv, // <== This is: the yargs::parseAsync() result
  context
) => {
  // If a GracefulEarlyExitError was thrown, then
  // context.state.isGracefullyExiting === true.

  return argv; // <== This is: what is returned by PreExecutionContext::execute
};

/**
 * This function is called once at the very end of the error handling process
 * after an error has occurred. However, this function is NOT called when a
 * GracefulEarlyExitError is thrown!
 */
export const configureErrorHandlingEpilogue: ConfigureErrorHandlingEpilogue =
  async ({ error, message, exitCode }, argv, context) => {
    // message === (error?.message || String(error))

    // Bring your own error handling and reporting if you'd like! By default,
    // this hook will dump any error messages to stderr like so:
    console.error(message);
  };
```

Then our CLI's entry point might look something like this:

<!-- example-region convention-2 -->

```typescript
#!/usr/bin/env node
// File: my-cli-project/cli.ts

import { runProgram } from '@black-flag/core';

export default runProgram(
  import.meta.resolve('./commands'),
  // Just pass an object of your configuration hooks. Promises are okay!
  import('./configure.js')
);
```

## Simple Comprehensive Error Handling and Reporting ✨

Black Flag provides unified error handling and reporting across all your
commands. Specifically:

- The ability to suggest an exit code when throwing an error.

  ```typescript
  try {
    //...
  } catch (error) {
    // Black Flag sets process.exitCode for you regardless of what's thrown
    throw 'something bad happened';
    // But you can suggest an exit code by throwing a CliError
    throw new CliError('something bad happened', { suggestedExitCode: 5 });
    // You can also tell Black Flag you'd like help text printed for this error
    throw new CliError('user failed to do something', { showHelp: true });
    // You can even wrap other errors with it
    throw new CliError(error, { suggestedExitCode: 9 });
  }
  ```

- Handling graceful exit events (like when `--help` or `--version` is used) as
  non-errors automatically.

  ```typescript
  // Throwing this in your handler or elsewhere will cause Black Flag to exit
  // immediately with a 0 exit code.
  throw new GracefulEarlyExitError();
  ```

- Outputting all error messages to stderr (via `console.error`) by default.

- Access to the parsed process arguments at the time the error occurred (if
  available).

How errors thrown during execution are reported to the user is determined by the
optionally-provided [`configureErrorHandlingEpilogue`][21] configuration hook,
as well as each command file's optionally-exported [`builder`][7] function.

```typescript
// File: my-cli-project/cli.ts

await runProgram(import.meta.resolve('./commands'), {
  configureErrorHandlingEpilogue({ error }, argv) {
    // Instead of outputting to stderr by default, send all errors elsewhere
    sendJsErrorToLog4J(argv.aMoreDetailedErrorOrSomething ?? error);
  }
});
```

```typescript
// File: my-cli-project/commands/index.ts

export function builder(blackFlag) {
  // Turn off outputting help text when an error occurs
  blackFlag.showHelpOnFail(false);
}
```

> [!TIP]
>
> [Framework errors][22] and errors thrown in `configureExecutionContext` or
> `configureExecutionPrologue`, cannot be handled by
> `configureErrorHandlingEpilogue`.
>
> If you're using [`makeRunner`][23]/[`runProgram`][15] and a misconfiguration
> triggers a framework error, your application will set its exit code
> [accordingly][24] and send an error message to stderr. If this occurs in
> production, use [debug mode][25] to gain insight into what went wrong. In a
> development environment and/or during testing, [`makeRunner`][23] (below)
> supports the [`errorHandlingBehavior`][26] option, which can be used to
> surface thrown errors via rejection.

## A Pleasant Testing Experience ✨

Black Flag was built with a pleasant unit/integration testing experience in
mind.

Auto-discovered commands are just importable JavaScript modules entirely
decoupled from Yargs and Black Flag, making them dead simple to test in
isolation.

```typescript
// File: my-cli-project/test.ts (with Jest as test runner)

import remoteRemove from './commands/remote/remove';

test('remote remove command works as expected', async () => {
  expect.hasAssertions();

  // Assuming "myctl remote remove" takes a positional argument "removal-target"
  const fakeArgv = { removalTarget: 'upstream' };

  // Run the command's handler with a fake "parsed" arguments object
  await remoteRemove.handler(fakeArgv);

  // Check that the command handler did what it was supposed to do
  expect(/* ... */).toStrictEqual(/* ... */);
});
```

Individual configuration hook functions, if used, are similarly mockable and
testable without Black Flag.

Suppose we wrote some configuration hooks in `my-cli-project/configure.ts`:

```typescript
// File: my-cli-project/configure.ts

import {
  type ConfigureArguments,
  type ConfigureErrorHandlingEpilogue
} from '@black-flag/core';

export const configureArguments: ConfigureArguments = (rawArgv) => {
  return preprocessInputArgs(rawArgv);

  function preprocessInputArgs(args) {
    // ...
  }
};

export const configureErrorHandlingEpilogue: ConfigureErrorHandlingEpilogue =
  async ({ error, message }, argv, context) => {
    // ...
  };
```

Then we could test it with the following:

```typescript
// File: my-cli-project/test.ts (with Jest as test runner)

import * as conf from './configure';

test('configureArguments returns pre-processed arguments', async () => {
  expect.hasAssertions();

  await expect(conf.configureArguments([1, 2, 3])).resolves.toStrictEqual([3]);
});

test('configureErrorHandlingEpilogue outputs as expected', async () => {
  expect.hasAssertions();

  const errorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);

  await conf.configureErrorHandlingEpilogue(/*...*/);

  expect(errorSpy).toHaveBeenCalledWith(/*...*/);
});
```

And for those who prefer a more holistic behavior-driven testing approach, you
can use the same function for testing your CLI that you use as an entry point in
production: [`runProgram`][15].

> [!TIP]
>
> Black Flag provides the [`makeRunner`][23] utility function so you don't have
> to tediously copy and paste `runProgram(...)` and all its arguments between
> tests.
>
> Additionally, unlike `runProgram`, [`makeRunner`][23] can be [configured to
> throw any errors][26] after [`configureErrorHandlingEpilogue`][21] runs. This
> can be useful for more test-driven approaches.

```typescript
// File: my-cli-project/test.ts (with Jest as test runner)

import { makeRunner } from '@black-flag/core/util';
import type { ConfigurationHooks } from '@black-flag/core';

// We test our commands decoupled from our CLI's actual configuration hooks,
// since they're too heavy for use in our unit tests. Instead, we substitute
// some dummy hooks, and test our real hooks in a separate file :)

const dummyHooks: ConfigurationHooks = {
  configureExecutionEpilogue(argv, context) {
    /* Some after-action cleanup */
  }
};

afterEach(() => {
  process.exitCode = undefined;
});

it('supports help text at every level', async () => {
  expect.hasAssertions();

  const run = makeRunner({
    commandModulesPath: '../commands',
    configurationHooks: dummyHooks
  });

  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

  // run does NOT throw when an error occurs, mirroring production behavior

  await run('--help');
  await run('init --help');
  await run('remote --help');
  await run('remote add --help');
  await run('remote remove --help');
  await run('remote show --help');

  // We expect to see what our users will see:
  expect(logSpy.mock.calls).toStrictEqual([
    // Each "--help" invocation should call console.log once with 1 parameter...
    [expect.stringMatching(/.../)],
    // ... and there should have been 6 invocations total:
    [expect.stringMatching(/.../)],
    [expect.stringMatching(/.../)],
    [expect.stringMatching(/.../)],
    [expect.stringMatching(/.../)],
    [expect.stringMatching(/.../)]
  ]);
});

it('throws on bad init --lang arguments', async () => {
  expect.hasAssertions();

  const run = makeRunner({
    commandModulesPath: '../commands',
    configurationHooks: dummyHooks,
    errorHandlingBehavior: 'throw'
  });

  // run DOES throw when an error occurs due to the errorHandlingBehavior option

  await expect(run(['init', '--lang', 'bad'])).rejects.toMatchObject({
    message: 'expected error message goes here'
  });

  await expect(run(['init', '--lang', 'also-bad'])).rejects.toMatchObject({
    message: 'expected error message goes here'
  });
});
```

## Built-In `debug` Integration for Runtime Insights ✨

Black Flag integrates `debug` (via [rejoinder][27]), allowing for deep insight
into your tool's runtime without significant overhead or code changes. Simply
set the `DEBUG` environment variable to an [appropriate value][28]:

```shell
# Shows all possible debug output
DEBUG='*' myctl
# Only shows built-in debug output from Black Flag
DEBUG='bf*' myctl
# Only shows custom debug output from your tool's command files
DEBUG='myctl*' myctl
```

> [!TIP]
>
> Black Flag's rich debugger output will prove a mighty asset in debugging any
> framework-related issues.

It is also possible to get meaningful debug output from your commands
themselves. Just include the [debug][29] package (or [rejoinder][27] for
improved DX) in your `package.json` dependencies and import it in your command
files:

```typescript
// File: my-cli-project/commands/index.ts

// Since it's at the apex of the commands/ directory, this file configures the
// "root command," i.e.:
//   myctl
//   myctl --help
//   myctl --version

import debugFactory from 'debug';

const debug = debugFactory('myctl');

export function handler(argv) {
  debug('beginning to do a bunch of cool stuff...');

  // ...

  const someResult = ...
  debug('saw some result: %O', someResult);

  // ...

  console.log('done!');
}
```

```text
myctl
done!
```

```text
DEBUG='myctl*' myctl
myctl beginning to do a bunch of cool stuff... +0ms
myctl saw some result: {
myctl   lists: [],
myctl   api: [Function: api],
myctl   apiHandler: [Function: handler],
myctl   anImportantString: 'very',
myctl } +220ms
done!
```

```text
DEBUG='*' myctl
... A LOT OF DETAILED DEBUG OUTPUT FROM BLACK FLAG AND MYCTL ...
done!
```

## Extensive Intellisense Support ✨

Black Flag itself is fully typed, and each exposed type is heavily commented.
However, your command files are not tightly coupled with Black Flag. An
unfortunate side effect of this flexibility is that your command files do not
automatically pick up Black Flag's types in your IDE/editor. Fortunately, Black
Flag exports all its exposed types, including the generic
[`RootConfiguration`][30], [`ParentConfiguration`][31], and
[`ChildConfiguration`][32] types.

Using these types, your command files themselves can be fully typed and you can
enjoy the improved DX that comes with comprehensive intellisense. And for those
who do not prefer TypeScript, you can even type your pure JavaScript files
thanks to JSDoc syntax. No TypeScript required!

<!-- example-region intellisense-1 -->

```javascript
// @ts-check
// This is a pure CJS JavaScript file, no TypeScript allowed!

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {import('@black-flag/core').ParentConfiguration}
 */
module.exports = {
  description: `description for program ${name}`,
  builder: (blackFlag) => blackFlag.option(name, { count: true }),
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
```

Child commands (commands not declared in index files) should use
[`ChildConfiguration`][32]. Parent commands (commands declared in index files)
should use [`ParentConfiguration`][31]. The root parent command (at the apex of
the directory storing your command files) should use [`RootConfiguration`][30].

> [!TIP]
>
> There's also [`Configuration`][33], the supertype of the three
> `XConfiguration` subtypes.

Similarly, if you're using configuration hooks in a separate file, you can enjoy
intellisense with those as well using the [`ConfigureX` generic types][34].

All of these generic types accept type parameters for validating custom
properties you might set during argument parsing or on the shared execution
context object.

See [`docs/api/`][35] for a complete list of Black Flag's exports and
implementation details about Black Flag's various generics.

---

And that's Black Flag's feature set in a nutshell!

Check out the fully-functional demo repository for that snazzy `myctl` tool
[here][5]. Or play with the real thing on NPM:
`npx -p @black-flag/demo myctl --help` (also supports `DEBUG` environment
variable). Or build the real thing from scratch by following [the complete
step-by-step getting started guide][36].

There's also the [`examples/`][37] directory, which houses a collection of
recipes solving common CLI tasks the Black Flag way.

For an example of a production CLI tool that puts Black Flag through its paces,
check out the source code for my "meta" project: [`@-xun/symbiote`][38].

[1]: https://github.com/yargs/yargs/issues/793
[2]: https://yargs.js.org/docs
[3]: ./bf-vs-yargs.md
[4]: #built-in-support-for-dynamic-options-
[5]: https://github.com/Xunnamius/black-flag-demo
[6]: ./api/src/exports/type-aliases/Configuration.md#aliases
[7]: ./api/src/exports/type-aliases/Configuration.md#builder
[8]: ./api/src/exports/type-aliases/Configuration.md#command
[9]: ./api/src/exports/type-aliases/Configuration.md#deprecated
[10]: ./api/src/exports/type-aliases/Configuration.md#description
[11]: ./api/src/exports/type-aliases/Configuration.md#handler
[12]: ./api/src/exports/type-aliases/Configuration.md#name
[13]: ./api/src/exports/type-aliases/Configuration.md#usage
[14]:
  https://github.com/yargs/yargs/blob/main/docs/advanced.md#positional-arguments
[15]: ./api/src/exports/functions/runProgram.md
[16]:
  https://kostasbariotis.com/why-you-should-not-use-process-exit#what-should-we-do
[17]: #a-pleasant-testing-experience-
[18]: ./api/src/exports/functions/configureProgram.md
[19]: ./api/src/exports/util/type-aliases/PreExecutionContext.md#execute
[20]: https://en.wikipedia.org/wiki/Convention_over_configuration
[21]: ./api/src/exports/type-aliases/ConfigureErrorHandlingEpilogue.md
[22]: ./api/src/exports/util/classes/AssertionFailedError.md
[23]: ./api/src/exports/util/functions/makeRunner.md
[24]: ./api/src/exports/enumerations/FrameworkExitCode.md
[25]: #built-in-debug-integration-for-runtime-insights-
[26]:
  ./api/src/exports/util/type-aliases/MakeRunnerOptions.md#errorhandlingbehavior
[27]: https://npm.im/rejoinder
[28]: https://www.npmjs.com/package/debug#usage
[29]: https://www.npmjs.com/package/debug
[30]: ./api/src/exports/type-aliases/RootConfiguration.md
[31]: ./api/src/exports/type-aliases/ParentConfiguration.md
[32]: ./api/src/exports/type-aliases/ChildConfiguration.md
[33]: ./api/src/exports/type-aliases/Configuration.md
[34]: ./api/src/exports/type-aliases/ConfigurationHooks.md
[35]: ./api/README.md
[36]: ./getting-started.md#building-and-running-your-cli
[37]: ../examples/README.md
[38]: https://github.com/Xunnamius/symbiote/blob/main/src
