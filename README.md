<!-- symbiote-template-region-start 1 -->

<p align="center" width="100%">
  <img width="300" src="https://raw.githubusercontent.com/Xunnamius/black-flag/refs/heads/main/logo.png">
</p>

<p align="center" width="100%">
<!-- symbiote-template-region-end -->
A declarative wrapper around yargs for building beautiful, fluent command line interfaces<br />
  <code>$ black-pearl hoist the colors --black-flag</code>
<!-- symbiote-template-region-start 2 -->
</p>

<hr />

<div align="center">

[![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]
[![Last commit timestamp][x-badge-lastcommit-image]][x-badge-repo-link]
[![Codecov][x-badge-codecov-image]][x-badge-codecov-link]
[![Source license][x-badge-license-image]][x-badge-license-link]
[![Uses Semantic Release!][x-badge-semanticrelease-image]][x-badge-semanticrelease-link]

[![NPM version][x-badge-npm-image]][x-badge-npm-link]
[![Monthly Downloads][x-badge-downloads-image]][x-badge-downloads-link]

</div>

<br />

# Black Flag 🏴

<!-- symbiote-template-region-end -->

Black Flag is a fairly thin library that wraps [yargs][1], extending its
capabilities with several powerful _declarative_ features. It can be used to
create simple single-level CLIs or deeply nested sprawling interfaces alike.

Black Flag was built as a drop-in replacement for vanilla yargs, specifically
for users of [`yargs::commandDir()`][2].

Tested on Ubuntu and Windows, and on Node.js LTS versions.

> If you find yourself a fan of Black Flag's more declarative DX, check out
> [Black Flag Extensions][3] (BFE). BFE also protects you from [a couple yargs
> footguns][4] that Black Flag by itself cannot.

<!-- symbiote-template-region-start 3 -->

---

<!-- remark-ignore-start -->
<!-- symbiote-template-region-end -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Features](#features)
  - [Declaratively Build Deep Command Hierarchies ✨](#declaratively-build-deep-command-hierarchies-)
  - [Built-In Support for Dynamic Options ✨](#built-in-support-for-dynamic-options-)
  - [It's Yargs All the Way down ✨](#its-yargs-all-the-way-down-)
  - [Run Your Tool Safely and Consistently ✨](#run-your-tool-safely-and-consistently-)
  - [Convention over Configuration ✨](#convention-over-configuration-)
  - [Simple Comprehensive Error Handling and Reporting ✨](#simple-comprehensive-error-handling-and-reporting-)
  - [A Pleasant Testing Experience ✨](#a-pleasant-testing-experience-)
  - [Built-In `debug` Integration for Runtime Insights ✨](#built-in-debug-integration-for-runtime-insights-)
  - [Extensive Intellisense Support ✨](#extensive-intellisense-support-)
- [Usage](#usage)
  - [Building and Running Your CLI](#building-and-running-your-cli)
  - [Testing Your CLI](#testing-your-cli)
- [Appendix 🏴](#appendix-)
  - [Terminology](#terminology)
  - [Differences between Black Flag and Yargs](#differences-between-black-flag-and-yargs)
  - [Advanced Usage](#advanced-usage)
  - [Inspiration](#inspiration)
  - [Published Package Details](#published-package-details)
  - [License](#license)
- [Contributing and Support](#contributing-and-support)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- symbiote-template-region-start 4 -->
<!-- remark-ignore-end -->

<br />

## Install

<!-- symbiote-template-region-end -->

To install:

```shell
npm install @black-flag/core
```

And if you're ready to go all in on Black Flag's declarative API, check out
[Black Flag Extensions][3]:

```shell
npm install @black-flag/extensions
```

## Features

> Not yet familiar with yargs? Check out their [intro documentation][5] before
> continuing.

### Declaratively Build Deep Command Hierarchies ✨

Black Flag provides first-class support for authoring simple one-off executables
_and_ sprawling deeply nested tree-like structures of commands and child
commands alike.

No more pleading with `yargs::commandDir()` to behave. Less wrestling with
positional parameters. Less tap-dancing around footguns. And no more dealing
with help text that unexpectedly changes depending on the OS or the presence of
aliases.

```shell
myctl --version
myctl init --lang 'node' --version=21.1
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

### Built-In Support for Dynamic Options ✨

[Dynamic options][6] are options whose `builder` configuration relies on the
resolved value of other options. Vanilla yargs does not support these, but Black
Flag does:

```shell
# These two lines are identical
myctl init --lang 'node'
myctl init --lang 'node' --version=21.1
```

```shell
# And these three lines are identical
myctl init
myctl init --lang 'python'
myctl init --lang 'python' --version=3.8
```

Note how the default value of `--version` changes depending on the value of
`--lang`. Further note that `myctl init` is configured to select the pythonic
defaults when called without any arguments.

### It's Yargs All the Way down ✨

At the end of the day, you're still working with yargs instances, so there's no
unfamiliar interface to wrestle with and no brand new things to learn. All of
yargs's killer features still work, the [yargs documentation][7] still applies,
and Black Flag, as a wrapper around yargs, is [widely compatible][8] with the
existing yargs ecosystem.

For example, Black Flag helps you validate those [dynamic options][9] using the
same yargs API you already know and love:

```typescript
// File: my-cli-project/commands/init.ts

// "argv" is a new third argument for builders    vvv
export function builder(yargs, helpOrVersionSet, argv) {
  //                                              ^^^

  // Tell yargs to leave strings that look like numbers as strings
  yargs.parserConfiguration({ 'parse-numbers': false });

  // This first conditional branch will be used to validate any dynamic
  // arguments and trigger the command's handler if validation succeeds
  //
  //   vvv
  if (argv) {
    // ^^^
    if (argv.lang === 'node') {
      return {
        lang: { choices: ['node'] },
        version: { choices: ['19.8', '20.9', '21.1'] }
      };
    } else {
      // Note how we can return a literal options object instead of calling
      // yargs.options(...), but we still can if we want to:
      return yargs.options({
        lang: { choices: ['python'] },
        version: {
          choices: ['3.10', '3.11', '3.12']
        }
      });
    }
  }
  // This else branch will be used for generic help text and first-pass parsing
  else {
    // This next line is the best you'd be able to do when using vanilla yargs.
    // But with Black Flag, it's only the fallback :)
    return {
      lang: { choices: ['node', 'python'] },
      version: { string: true }
    };
  }
}

export function handler(argv) {
  console.log(`> initializing new ${argv.lang}@${argv.version} project...`);
  // ...
}
```

> See [the demo repo][10] for the complete implementation of this command.

```text
myctl init --lang 'node' --version=21.1
> initializing new node@21.1 project...
```

```text
myctl init --lang 'python' --version=21.1
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                                     [choices: "python"]
  --version                                    [choices: "3.10", "3.11", "3.12"]

Invalid values:
  Argument: version, Given: "21.1", Choices: "3.10", "3.11", "3.12"
```

```text
myctl init --lang fake
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                             [choices: "node", "python"]
  --version                                                             [string]

Invalid values:
  Argument: lang, Given: "fake", Choices: "node", "python"
```

```text
myctl init --help
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                             [choices: "node", "python"]
  --version                                                             [string]
```

If `builder` and `handler` sound familiar, it's because the exports from your
command files are essentially the same as those expected by the `yargs::command`
function: [`aliases`][11], [`builder`][11], [`command`][11], [`deprecated`][11],
[`description`][11], [`handler`][11], and two new ones: [`name`][11] and
[`usage`][11].

The complete `my-cli-project/commands/init.ts` file could look like this:

```typescript
// File: my-cli-project/commands/init.ts

import type { Configuration, $executionContext } from '@black-flag/core';

// Types are also available vvv
const configuration: Configuration = {
  //                        ^^^

  // ALL OF THESE ARE OPTIONAL! Black Flag would still accept this file even if
  // if were completely blank

  // An array of yargs aliases for this command. DO NOT include positional
  // arguments here, those go in `command` just like with vanilla yargs
  aliases: [],

  // Can be a yargs options object or a builder function like below
  builder(yargs, helpOrVersionSet, argv) {
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

  // Always a string. All commands must begin with "$0". Defaults to "$0". The
  // given value is also used to replace "$000" during string interpolation for
  // the usage option
  command: '$0 [positional-arg-1] [positional-arg-2]',

  // If true, this command will be considered deprecated. Defaults to false
  deprecated: false,

  // Used as the command's description in its parent command's help text, and
  // when replacing "$1" during string interpolation for the usage option. Set
  // to false to disable the description and hide the command. Defaults to ""
  description: 'initializes stuff',

  // This function is called when the arguments match and pass yargs
  // validation. Defaults to a function that throws CommandNotImplementedError
  handler(argv) {
    console.log(`> initializing new ${argv.lang} project...`);
    // Note that you can access ExecutionContext with argv[$executionContext]
  },

  // Used as the command's name in help text, when parsing arguments, when
  // replacing "$0" during string interpolation, and elsewhere. Usually defaults
  // to a trimmed version of the file/directory name
  name: 'init',

  // Used as the command's usage instructions in its own help text. "$000", if
  // present, will be replaced by the value of the command option. Afterwards,
  // "$1" and then "$0", if present, will be replaced by the description and
  // name options. Defaults to "Usage: $000\n\n$1". Will be trimmed before being
  // output
  usage: 'This is neat.'
};

export default configuration;
```

### Run Your Tool Safely and Consistently ✨

Black Flag not only helps you declaratively build your CLI tool, but _run it_
too.

```typescript
#!/usr/bin/env node
// File: my-cli-project/cli.ts

import { runProgram } from '@black-flag/core';
// Just point Black Flag at the directory containing your command files
export default runProgram(import.meta.resolve('./commands'));
```

```shell
# This would work thanks to that shebang (#!)
./cli.js remote show origin
# This works after transpiling our .ts files to .js with babel...
node ./cli.js -- remote show origin
# ... and then publishing it and running: npm i -g @black-flag/demo
myctl remote show origin
# Or, if we were using a runtime that supported TypeScript natively
deno ./cli.ts -- remote show origin
```

The [`runProgram`][12] function bootstraps your CLI whenever you need it, e.g.
when testing, in production, when importing your CLI as a dependency, etc.

> `runProgram` never throws, and never calls `process.exit` [since that's
> dangerous][13] and a disaster for unit testing.

Under the hood, `runProgram` calls [`configureProgram`][14], which
auto-discovers and collects all the configurations exported from your command
files, followed by [`PreExecutionContext::execute`][15], which is a wrapper
around `yargs::parseAsync` and `yargs::hideBin`.

```typescript
import { join } from 'node:path';
import { runProgram, configureProgram } from '@black-flag/core';
import { hideBin, isCliError } from '@black-flag/core/util';

// Note that this example is using CJS-style path resolution. ESM is different.
export default runProgram(join(__dirname, 'commands'));

// ^^^ These are essentially equivalent vvv

let parsedArgv = undefined;

try {
  const commandsDir = join(__dirname, 'commands');
  const preExecutionContext = await configureProgram(commandsDir);
  parsedArgv = await preExecutionContext.execute(hideBin(process.argv));
  process.exitCode = 0;
} catch (error) {
  process.exitCode = isCliError(error) ? error.suggestedExitCode : 1;
}

export default parsedArgv;
```

### Convention over Configuration ✨

Black Flag [favors convention over configuration][16], meaning **everything
works out the box with sensible defaults and no sprawling configuration files**.

However, when additional configuration _is_ required, there are five optional
configuration hooks that give Black Flag the flexibility to describe even the
most bespoke of command line interfaces.

For instance, suppose we added a `my-cli-project/configure.ts` file to our
project:

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
 * have been executed, and should apply any final configurations to the yargs
 * instances that constitute the command line interface.
 */
export const configureExecutionPrologue: ConfigureExecutionPrologue = async (
  { effector, helper, router }, // <== This is: root yargs instances (see below)
  context
) => {
  // Typically unnecessary and suboptimal to use this hook. Configure commands
  // (including the root command) declaratively using the simple declarative
  // filesystem-based API instead. Otherwise, at this point, you're just using
  // yargs but with extra steps.
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
  // This is where yargs middleware and other argument pre-processing can be
  // implemented, if necessary.

  // When PreExecutionContext::execute is invoked without arguments, Black Flag
  // calls the yargs::hideBin helper utility on process.argv for you. Therefore,
  // calling hideBin here would cause a bug. You shouldn't ever need to call
  // hideBin manually, but if you do, it's re-exported from
  // '@black-flag/core/util'.

  return rawArgv; // <== This is: the argv that yargs will be given to parse
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

```typescript
#!/usr/bin/env node
// File: my-cli-project/cli.ts

import { runProgram } from '@black-flag/core';

export default runProgram(
  // Note that this example is using ESM-style path resolution. CJS is different
  import.meta.resolve('./commands'),
  // Just pass an object of your configuration hooks. Promises are okay!
  import('./configure.js') // <== Might be ".ts" over ".js" for deno projects
);
```

### Simple Comprehensive Error Handling and Reporting ✨

Black Flag provides unified error handling and reporting across all your
commands. Specifically:

- The ability to suggest an exit code when throwing an error.

  ```typescript
  try {
    ...
  } catch(error) {
    // Black Flag sets process.exitCode for you regardless of what's thrown
    throw new 'something bad happened';
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
optionally-provided [`configureErrorHandlingEpilogue`][17] configuration hook,
as well as each command file's optionally-exported [`builder`][11] function.

```typescript
// File: my-cli-project/cli.ts

await runProgram(import.meta.resolve('./commands'), {
  configureErrorHandlingEpilogue({ error }, argv, context) {
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

> Note that [framework errors][18] and errors thrown in
> `configureExecutionContext` or `configureExecutionPrologue`, which are always
> the result of developer error rather than end user error, cannot be handled by
> `configureErrorHandlingEpilogue`. If you're using
> [`makeRunner`][19]/[`runProgram`][12] (which never throws) and a
> misconfiguration triggers a framework error, your application will set its
> exit code [accordingly][20] and send an error message to stderr. In such a
> case, use [debug mode][21] to gain insight if necessary.

### A Pleasant Testing Experience ✨

Black Flag was built with a pleasant unit/integration testing experience in
mind.

Auto-discovered commands are just importable JavaScript modules entirely
decoupled from yargs and Black Flag, making them dead simple to test in
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
  ...
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
  async ({ error, message }, _argv, context) => {
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

  const errorSpy =
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

  await conf.configureErrorHandlingEpilogue(...);

  expect(errorSpy).toHaveBeenCalledWith(...);
});
```

And for those who prefer a more holistic behavior-driven testing approach, you
can use the same function for testing your CLI that you use as an entry point in
production: [`runProgram`][12].

> Black Flag additionally provides the [`makeRunner`][19] utility function so
> you don't have to tediously copy and paste `runProgram(...)` and all its
> arguments between tests.

```typescript
// File: my-cli-project/test.ts (with Jest as test runner)

import { makeRunner } from '@black-flag/core/util';

let latestError: string | undefined = undefined;
const run = makeRunner(`${__dirname}/commands`, {
  // We run our commands decoupled from our CLI's actual configuration hooks,
  // since they're too heavy for use in our unit tests. Instead, we substitute
  // some bare bones configurations:
  configureExecutionEpilogue(argv, context) { /* Some after-action cleanup */ },
  configureErrorHandlingEpilogue({ message }) { latestError = message; }
});

beforeEach(() => (latestError = undefined));
afterEach(() => (process.exitCode = undefined));

it('supports help text at every level', async () => {
  expect.hasAssertions();

  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

  await run('--help');
  await run('init --help');
  await run('remote --help');
  await run('remote add --help');
  await run('remote remove --help');
  await run('remote show --help');

  expect(logSpy.mock.calls).toStrictEqual([
    // Each "--help" invocation should call console.log once with 1 parameter...
    [expect.stringMatching(/.../)],
    // ... and there should have been 6 invocations total.
    ...,
    ...,
    ...,
    ...,
    ...,
  ]);
});

it('throws on bad init --lang argument', async () => {
  expect.hasAssertions();

  await run(['init', '--lang', 'bad']);
  expect(latestError).toBe('...');
  // Since we didn't disable it, Black Flag will also output help text for this
  // error. We could have tested for that with another jest spy if we wanted to.
});
```

### Built-In `debug` Integration for Runtime Insights ✨

Black Flag integrates [debug][22], allowing for deep insight into your tool's
runtime without significant overhead or code changes. Simply set the `DEBUG`
environment variable to an [appropriate value][23]:

```shell
# Shows all possible debug output
DEBUG='*' myctl
# Only shows built-in debug output from Black Flag
DEBUG='black-flag*' myctl
# Only shows custom debug output from your tool's command files
DEBUG='myctl*' myctl
```

> Black Flag's truly rich debug output will prove a mighty asset in debugging
> any framework-related issues, and especially when writing unit/integration
> tests. When your CLI is crashing or your test is failing in a strange way,
> consider re-running the failing test or problematic CLI with debugging
> enabled.

It is also possible to get meaningful debug output from your commands
themselves. Just include the [debug][22] package in your `package.json`
dependencies and import it in your command files:

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

### Extensive Intellisense Support ✨

Black Flag itself is fully typed, and each exposed type is heavily commented.
However, your command files are not tightly coupled with Black Flag. An
unfortunate side effect of this flexibility is that your command files do not
automatically pick up Black Flag's types in your IDE/editor. Fortunately, Black
Flag exports all its exposed types, including the generic
[`RootConfiguration`][24], [`ParentConfiguration`][25], and
[`ChildConfiguration`][26] types.

Using these types, your command files themselves can be fully typed and you can
enjoy the improved DX that comes with comprehensive intellisense. And for those
who do not prefer TypeScript, you can even type your pure JavaScript files
thanks to JSDoc syntax. No TypeScript required!

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
  handler: (argv) => (argv.handled_by = __filename)
};
```

Child commands (commands not declared in index files) should use
[`ChildConfiguration`][26]. Parent commands (commands declared in index files)
should use [`ParentConfiguration`][25]. The root parent command (at the apex of
the directory storing your command files) should use [`RootConfiguration`][24].

> There's also [`Configuration`][27], the supertype of the three
> `XConfiguration` subtypes.

Similarly, if you're using configuration hooks in a separate file, you can enjoy
intellisense with those as well using the `ConfigureX` generic types.

All of these generic types accept type parameters for validating custom
properties you might set during argument parsing or on the shared execution
context object.

See [the docs][x-repo-docs] for a complete list of Black Flag's exports and
details about generics.

---

And that's Black Flag in a nutshell! Check out a complete demo repository for
that snazzy `myctl` tool [here][10]. Or play with the real thing on NPM:
`npx -p @black-flag/demo myctl --help` (also supports `DEBUG` environment
variable). Or check out the [step-by-step getting started guide][28] below!

If you want to see an example of a fairly complex CLI built on Black Flag that
implements global options, custom rich logging and error output, and support for
configuration files, check out [my personal CLI tool][29].

## Usage

What follows is a simple step-by-step guide for building, running, and testing
the `myctl` tool from [the introductory section][30].

> There's also a functional [`myctl` demo repository][10]. And you can interact
> with the published version on NPM: `npx -p @black-flag/demo myctl --help`.

### Building and Running Your CLI

Let's make a new CLI project!

> Note: what follows are linux shell commands. The equivalent Windows DOS/PS
> commands will be different.

```shell
mkdir my-cli-project
cd my-cli-project
git init
```

Add a `package.json` file with the bare minimum metadata:

```shell
echo '{"name":"myctl","version":"1.0.0","type":"module","bin":{"myctl":"./cli.js"}}' > package.json
npm install @black-flag/core
```

Let's create the folder that will hold all our commands as well as the entry
point Node recognizes:

```text
mkdir commands
touch cli.js
chmod +x cli.js
```

Where `cli.js` has the following content:

```javascript
#!/usr/bin/env node

import { runProgram } from '@black-flag/core';
export default runProgram(import.meta.resolve('./commands'));
```

> These examples use ESM syntax. CJS is also supported. For example:
>
> ```javascript
> #!/usr/bin/env node
>
> const bf = require('@black-flag/core');
> const path = require('node:path');
> module.exports = bf.runProgram(path.join(__dirname, 'commands'));
> ```

Let's create our first command, the _root command_. Every Black Flag project has
one, and it's always named `index.js`. In vanilla yargs parlance, this would be
the highest-level "default command".

```text
touch commands/index.js
```

Depending on how you invoke Black Flag (e.g. with Node, Deno, Babel+Node, etc),
command files support a subset of the following extensions in precedence order:
`.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`. To keep things simple, we'll be
using ES modules as `.js` files (note the [type][31] in `package.json`).

Also note that empty files, and files that do not export a `handler` function or
custom `command` string, are picked up by Black Flag as unfinished or
"unimplemented" commands. They will still appear in help text but, when invoked,
will either (1) output an error message explaining that the command is not
implemented if said command has no sub-commands or (2) output help text for the
command if said command has one or more sub-commands.

This means you can stub out a complex CLI in thirty seconds: just name your
directories and empty files accordingly!

With that in mind, let's actually run our skeletal CLI now:

```shell
./cli.js
```

---

```text
This command is currently unimplemented
```

Let's try with a bad positional parameter:

```shell
./cli.js bad
```

---

```text
Usage: myctl

Options:
  --help     Show help text                                            [boolean]
  --version  Show version number                                       [boolean]

Unknown argument: bad
```

How about with a bad option:

```shell
./cli.js --bad
```

---

```text
Usage: myctl

Options:
  --help     Show help text                                            [boolean]
  --version  Show version number                                       [boolean]

Unknown argument: bad
```

We could publish right now if we wanted to. The CLI would be perfectly
functional in that it would run to completion regardless of its current lack of
useful features. Our new package could then be installed via `npm i -g myctl`,
and called from the CLI as `myctl`! Let's hold off on that though.

You may have noticed that Black Flag calls `yargs::strict(true)` on
auto-discovered commands by default, which is where the "unknown argument"
errors are coming from. In fact, commands are configured with several useful
defaults:

<!-- lint disable list-item-style -->

- `yargs::strict(true)`
- `yargs::scriptName(fullName)`
- `yargs::wrap(yargs::terminalWidth())`
  - If you want to tweak this across your entire command hierarchy, update
    [`context.state.initialTerminalWidth`][32] directly in
    [`configureExecutionContext`][33]
- `yargs::exitProcess(false)`
  - Black Flag only sets `process.exitCode` and never calls `process.exit(...)`
- `yargs::help(false)::option('help', { description })`
  - Black Flag supervises all help text generation, so this is just cosmetic
- `yargs::fail(...)`
  - Black Flag uses a custom failure handler
- `yargs::showHelpOnFail(true)`
  - Black Flag uses a custom failure handler
- `yargs::usage(defaultUsageText)`
  - Defaults to [this][34].
  - Note that, as of yargs\@17.7.2, calling `yargs::usage(...)` multiple times
    (such as in [`configureExecutionPrologue`][35]) will concatenate each
    invocation's arguments into one long usage string instead of overwriting
    previous invocations with later ones
- `yargs::version(false)`
  - For the root command,
    `yargs::version(false)::option('version', { description })` is called
    instead

<!-- lint enable list-item-style -->

Most of these defaults can be tweaked or overridden via each command's
[`builder`][11] function, which gives you direct access to the yargs API. Let's
add one to `commands/index.js` along with a `handler` function and `usage`
string:

```javascript
/**
 * This little comment gives us intellisense support :)
 *
 * Also note how we're using the `export const X = function(...) { ... }` syntax
 * instead of the streamlined `export function X(...) { ... }` syntax. Both of
 * these syntaxes are correct, however JSDoc does not support using "@type" on
 * the latter form for some reason.
 *
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const builder = function (blackFlag) {
  return blackFlag.strict(false);
};

/**
 * @type {import('@black-flag/core').RootConfiguration['handler']}
 */
export const handler = function (argv) {
  console.log('ran root command handler');
};

/**
 * Note that `usage` is just a freeform string used in help text. The `command`
 * export, on the other hand, supports the yargs DSL for defining positional
 * parameters and the like.
 *
 * @type {import('@black-flag/core').RootConfiguration['usage']}
 */
export const usage = 'Usage: $0 command [options]\n\nCustom description here.';
```

Now let's run the CLI again:

```shell
./cli.js
```

---

```text
ran root command handler
```

And with a "bad" argument (we're no longer in strict mode):

```shell
./cli.js --bad --bad2 --bad3
```

---

```text
ran root command handler
```

Neat. Let's add some more commands:

```shell
touch commands/init.js
mkdir commands/remote
touch commands/remote/index.js
touch commands/remote/add.js
touch commands/remote/remove.js
touch commands/remote/show.js
```

Wow, that was easy. Let's run our CLI now:

```shell
./cli.js --help
```

---

```text
Usage: myctl command [options]

Custom description here.

Commands:
  myctl                                                                [default]
  myctl init
  myctl remote

Options:
  --help     Show help text                                            [boolean]
  --version  Show version number                                       [boolean]
```

Let's try a child command:

```shell
./cli.js remote --help
```

---

```text
Usage: myctl remote

Commands:
  myctl remote                                                         [default]
  myctl remote add
  myctl remote remove
  myctl remote show

Options:
  --help  Show help text                                               [boolean]
```

Since different OSes walk different filesystems in different orders,
auto-discovered commands will appear _in [alpha-sort][36] order_ in help text
rather than in insertion order; [command groupings][37] are still respected and
each command's options are still enumerated in insertion order.

> Black Flag offers a stronger sorting guarantee than
> `yargs::parserConfiguration({ 'sort-commands': true })`.

Now let's try a grandchild command:

```shell
./cli.js remote show --help
```

---

```text
Usage: myctl remote show

Options:
  --help  Show help text                                               [boolean]
```

Phew. Alright, but what about trying some commands we know _don't_ exist?

```shell
./cli.js remote bad horrible
```

---

```text
Usage: myctl remote

Commands:
  myctl remote                                                         [default]
  myctl remote add
  myctl remote remove
  myctl remote show

Options:
  --help  Show help text                                               [boolean]

Invalid command: you must call this command with a valid sub-command argument
```

Neat! 📸

### Testing Your CLI

Testing if your CLI tool works by running it manually on the command line is
nice and all, but if we're serious about building a stable and usable tool,
we'll need some automated tests.

Thankfully, with Black Flag, testing your commands is usually easier than
writing them.

First, let's install [jest][38]. We'll also create a file to hold our tests.

```shell
npm install --save-dev jest @babel/plugin-syntax-import-attributes
touch test.cjs
```

Since we set our root command to non-strict mode, let's test that it doesn't
throw in the presence of unknown arguments. Let's also test that it exits with
the exit code we expect and sends an expected response to stdout.

Note that we use [`makeRunner`][19] below, which is a factory function that
returns a [curried][39] version of [`runProgram`][12] that is far less tedious
to invoke successively.

> Each invocation of `runProgram()`/`makeRunner()()` configures and runs your
> entire CLI _from scratch_. Other than stuff like [the require cache][40],
> there is no shared state between invocations unless you explicitly make it so.
> This makes testing your commands "in isolation" dead simple and avoids a
> [common yargs footgun][41].

```javascript
const { makeRunner } = require('@black-flag/core/util');

// makeRunner is a factory function that returns runProgram functions with
// curried arguments.
const run = makeRunner({ commandModulePath: `${__dirname}/commands` });

afterEach(() => {
  // Since runProgram (i.e. what is returned by makeRunner) sets
  // process.exitCode before returning, let's unset it after each test
  process.exitCode = undefined;
});

describe('myctl (root)', () => {
  it('emits expected output when called with no arguments', async () => {
    expect.hasAssertions();

    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await run();

    expect(errorSpy).not.toHaveBeenCalled();
    expect(logSpy.mock.calls).toStrictEqual([['ran root command handler']]);
  });

  it('emits expected output when called with unknown arguments', async () => {
    expect.hasAssertions();

    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await run('--unknown');
    await run('unknown');

    expect(errorSpy).not.toHaveBeenCalled();
    expect(logSpy.mock.calls).toStrictEqual([
      ['ran root command handler'],
      ['ran root command handler']
    ]);
  });

  it('still terminates with 0 exit code when called with unknown arguments', async () => {
    expect.hasAssertions();

    await run('--unknown-argument');

    expect(process.exitCode).toBe(0);
  });
});
```

Finally, let's run our tests:

```shell
npx --node-options='--experimental-vm-modules' jest --testMatch '**/test.cjs' --restoreMocks
```

> As of January 2024, we need to use
> `--node-options='--experimental-vm-modules'` until the Node team unflags
> virtual machine module support in a future version.

> We use `--restoreMocks` to ensure mock state doesn't leak between tests. We
> use `--testMatch '**/test.cjs'` to make Jest see our CJS files.

---

```text
PASS  ./test.cjs
  myctl (root)
    ✓ emits expected output when called with no arguments (168 ms)
    ✓ emits expected output when called with unknown arguments (21 ms)
    ✓ still terminates with 0 exit code when called with unknown arguments (20 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.405 s, estimated 1 s
Ran all test suites.
```

Neat! 📸

<!-- symbiote-template-region-start 5 -->

## Appendix 🏴

<!-- symbiote-template-region-end -->

Further documentation can be found under [`docs/`][x-repo-docs].

### Terminology

|      Term       | Description                                                                                                                                                                                                                                                                                                   |
| :-------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     command     | A "command" is a functional unit associated with a [configuration][27] file and represented internally as a trio of programs: [effector, helper, and router][42]. Further, each command is classified as one of: "pure parent" (root and parent), "parent-child" (parent and child), or "pure child" (child). |
|     program     | A "program" is a yargs instance wrapped in a [`Proxy`][43] granting the instance an expanded set of features. Programs are represented internally by the [`Program`][44] type.                                                                                                                                |
|      root       | The tippy top command in your hierarchy of commands and the entry point for any Black Flag application. Also referred to as the "root command".                                                                                                                                                               |
| default command | A "default command" is [yargs parlance][45] for the CLI entry point. Technically there is no concept of a "default command" at the Black Flag level, though there is the _root command_.                                                                                                                      |

### Differences between Black Flag and Yargs

> Note that yargs is a _dependency_ of Black Flag. Black Flag is _not_ a fork of
> yargs!

Aside from the expanded feature set, there are some minor differences between
yargs and Black Flag. They should not be relevant given proper use of Black
Flag, but are noted below nonetheless.

#### Minor Differences

- The `yargs::argv` magic property is soft-disabled (always returns `undefined`)
  because having such an expensive "hot" getter is not optimal in a language
  where properties can be accessed unpredictably. For instance, deep cloning a
  yargs instance results in `yargs::parse` (_and the handlers of any registered
  commands!_) getting invoked several times, _even after an error occurred in an
  earlier invocation_. This can lead to undefined or even dangerous behavior.

  > Who in their right mind is out here cloning yargs instances, you may ask?
  > [Jest does so whenever you use certain asymmetric matchers][46].

  Regardless, you should never have to reach below Black Flag's abstraction over
  yargs to call methods like `yargs::parse`, `yargs::parseAsync`, `yargs::argv`,
  etc. Instead, just [use Black Flag as intended][12].

  Therefore, this is effectively a non-issue with proper declarative use of
  Black Flag.

- Yargs [middleware][47] isn't supported since the functionality is mostly
  covered by configuration hooks ~~and I didn't notice yargs had this feature
  until after I wrote Black Flag~~.

  If you have a yargs middleware function you want run with a specific command,
  either pass it to `yargs::middleware` via that command's [`builder`][11]
  function or just call the middleware function right then and there. If you
  want the middleware to apply globally, invoke the function directly in
  [`configureArguments`][48]. If neither solution is desirable, you can also
  [muck around with][42] the relevant yargs instances manually in
  [`configureExecutionPrologue`][35].

- By default, Black Flag enables the `--help` and `--version` options same as
  vanilla yargs. However, since vanilla yargs [lacks the ability][49] to modify
  or remove options added by `yargs::option`, calling
  `yargs::help`/`yargs::version` will throw. If you require the functionality of
  `yargs::help`/`yargs::version` to disable or modify the `--help`/`--version`
  option, update
  [`context.state.globalHelpOption`][32]/[`context.state.globalVersionOption`][32]
  directly in [`configureExecutionContext`][33].

  > Note: Black Flag enables built-in help and version _options_, never a help
  > or version _command_.

  > Note: only the root command has default support for the built-in `--version`
  > option. Calling `--version` on a child command will have no effect unless
  > you make it so. This dodges [another yargs footgun][50], and setting
  > [`context.state.globalVersionOption = undefined`][32] will prevent yargs
  > from clobbering any custom version arguments on the root command too.

#### Irrelevant Differences

- A [bug][51] in yargs\@17.7.2 prevents `yargs::showHelp`/`--help` from printing
  anything when using an async [`builder`][11] function (or promise-returning
  function) for a [default command][45].

  Black Flag addresses this with its types, in that attempting to pass an async
  builder will be flagged as problematic by intellisense. Moreover, Black Flag
  supports an asynchronous function as the value of `module.exports` in CJS
  code, and top-level await in ESM code, so if you really do need an async
  [`builder`][11] function, [hoist][52] the async logic to work around this bug
  for now.

- A [bug?][53] in yargs\@17.7.2 causes `yargs::showHelp` to erroneously print
  the _second_ element in the [`aliases`][54] array of the [default command][45]
  when said command also has child commands.

  Black Flag addresses this by using a "helper" program to generate help text
  [more consistently][53] than vanilla yargs. For instance, the default help
  text for a Black Flag command includes the full [`command`][11] and
  [`description`][11] strings while the commands under `"Commands:"` are listed
  in alpha-sort order as their full canonical names _only_; unlike vanilla
  yargs, no positional arguments or aliases will be confusingly mixed into help
  text output unless you [make it so][42].

- As of yargs\@17.7.2, attempting to add two sibling commands with the exact
  same name causes all sorts of runtime insanity, especially if the commands
  also have aliases.

  Black Flag prevents you from shooting yourself in the foot with this.
  Specifically: Black Flag will throw if you attempt to add a command with a
  name or alias that conflicts with its sibling commands' name or alias.

- As of yargs\@17.7.2, and similar to the above point, attempting to add two
  options with conflicting names/aliases to the same command leads to undefined
  and potentially dangerous runtime behavior from yargs.

  Unfortunately, since yargs allows adding options through a wide variety of
  means, Black Flag cannot protect you from this footgun. However, [Black Flag
  Extensions][3] (BFE) can.

  Specifically: BFE will throw if you attempt to add a command option with a
  name or alias that conflicts another of that command's options. BFE also takes
  into account the following [yargs-parser settings][55] configuration settings:
  `camel-case-expansion`, `strip-aliased`, `strip-dashed`. See [BFE's
  documentation][3] for details.

- Unfortunately, yargs\@17.7.2 [doesn't really support][41] calling
  `yargs::parse` or `yargs::parseAsync` [multiple times on the same
  instance][56] if it's using the commands-based API. This might be a regression
  since, [among other things][57], there are comments within yargs's source that
  indicate these functions were intended to be called multiple times.

  Black Flag addresses this in two ways. First, the [`runProgram`][12] helper
  takes care of state isolation for you, making it safe to call
  [`runProgram`][12] multiple times. Easy peasy. Second,
  [`PreExecutionContext::execute`][15] (the wrapper around `yargs::parseAsync`)
  will throw if invoked more than once.

- One of Black Flag's features is simple comprehensive error reporting via the
  [`configureErrorHandlingEpilogue`][17] configuration hook. Therefore, the
  `yargs::showHelpOnFail` method will ignore the redundant "message" parameter.
  If you want that functionality, use said hook to output an epilogue after
  yargs outputs an error message, or use `yargs::epilogue`/`yargs::example`.
  Also, any invocation of `yargs::showHelpOnFail` applies globally to all
  commands in your hierarchy.

- Since every auto-discovered command translates [into its own yargs
  instances][42], the [`command`][11] property, if exported by your command
  file(s), must start with `"$0"` or an error will be thrown. This is also
  enforced by intellisense.

- The `yargs::check`, `yargs::global`, and `yargs::onFinishCommand` methods,
  while they may work as expected on commands and their direct child commands,
  will not function "globally" across your entire command hierarchy since [there
  are several _distinct_ yargs instances in play when Black Flag executes][42].

  If you want a uniform check or so-called "global" argument to apply to every
  command across your entire hierarchy, the "Black Flag way" would be to just
  use normal JavaScript instead: export a shared [`builder`][11] function from a
  utility file and call it in each of your command files. If you want something
  fancier than that, you can leverage [`configureExecutionPrologue`][35] to call
  `yargs::global` or `yargs::check` by hand.

  Similarly, `yargs::onFinishCommand` should only be called when the `argv`
  parameter in [`builder`][11] is not `undefined` (i.e. only on [effector
  programs][42]). This would prevent the callback from being executed twice.
  Further, the "Black Flag way" would be to ditch `yargs::onFinishCommand`
  entirely and use plain old JavaScript and/or the
  [`configureExecutionPrologue`][35] configuration hook instead.

- Since Black Flag is built from the ground up to be asynchronous, calling
  `yargs::parseSync` will throw immediately. You shouldn't be calling the
  `yargs::parseX` functions directly anyway.

- Black Flag sets several defaults compared to vanilla yargs. These defaults are
  detailed in the [Usage section][28].

### Advanced Usage

> Note: you shouldn't need to reach below Black Flag's declarative abstraction
> layer when building your tool. If you feel that you do, consider [opening a
> new issue][x-repo-choose-new-issue]!

Since Black Flag is just a bunch of yargs instances stacked on top of each other
wearing a trench coat, you can muck around with the internal yargs instances
directly if you want.

For example, you can retrieve a mapping of all commands known to Black Flag and
their corresponding yargs instances in the OS-specific order they were
encountered during auto-discovery:

```typescript
import { runCommand, $executionContext } from '@black-flag/core';

const argv = await runCommand('./commands');

// The next two function calls result in identical console output

console.log('commands:', argv[$executionContext].commands);

await runCommand('./commands', {
  configureExecutionEpilogue(_argv, { commands }) {
    console.log('commands:', commands);
  }
});
```

```javascript
commands: Map(6) {
  'myctl' => { programs: [Object], metadata: [Object] },
  'myctl init' => { programs: [Object], metadata: [Object] },
  'myctl remote' => { programs: [Object], metadata: [Object] },
  'myctl remote add' => { programs: [Object], metadata: [Object] },
  'myctl remote remove' => { programs: [Object], metadata: [Object] },
  'myctl remote show' => { programs: [Object], metadata: [Object] }
}
```

Each of these six commands is actually _three_ programs:

1. The **effector** (`programs.effector`) programs are responsible for
   second-pass arguments parsing and comprehensive validation, executing each
   command's actual [`handler`][11] function, generating specific help text
   during errors, and ensuring the final parse result bubbles up to the router
   program.

2. The **helper** (`programs.helper`) programs are responsible for generating
   generic help text as well as first-pass arguments parsing and initial
   validation. Said parse result is used as the `argv` third parameter passed to
   the [`builder`][11] functions of effectors.

3. The **router** (`programs.router`) programs are responsible for proxying
   control to other routers and to helpers, and for ensuring exceptions and
   final parse results bubble up to the root Black Flag execution context
   ([`PreExecutionContext::execute`][15]) for handling.

> See the [flow chart][58] below for a visual overview.

These three programs representing the root command are accessible from the
[`PreExecutionContext::rootPrograms`][15] property. They are also always the
first item in the `PreExecutionContext::commands` map.

```typescript
const preExecutionContext = configureProgram('./commands', {
  configureExecutionEpilogue(_argv, { commands }) {
    assert(preExecutionContext.rootPrograms === commands.get('myctl').programs);
    assert(
      preExecutionContext.rootPrograms ===
        commands.get(Array.from(commands.keys())[0])
    );
  }
});

await preExecutionContext.execute();
```

Effectors do the heavy lifting in that they actually execute their command's
[`handler`][11]. They are accessible via the [`programs.effector`][59] property
of each object in [`PreExecutionContext::commands`][15], and can be configured
as one might a typical yargs instance.

Helpers are "clones" of their respective effectors and are accessible via the
[`programs.helper`][59] property of each object in
[`PreExecutionContext::commands`][15]. These instances have been reconfigured to
address [a couple bugs][4] in yargs help text output by excluding aliases from
certain output lines and excluding positional arguments from certain others. A
side-effect of this is that only effectors recognize top-level positional
arguments, which isn't a problem Black Flag users have to worry about unless
they're dangerously tampering with these programs directly.

Routers are partially-configured just enough to proxy control to other routers
or to helpers and are accessible via the [`programs.router`][59] property of
each object in [`PreExecutionContext::commands`][15]. They cannot and _must not_
have any configured strictness or validation logic.

Therefore: if you want to tamper with the program responsible for running a
command's [`handler`][11], operate on the effector program. If you want to
tamper with a command's generic stdout help text, operate on the helper program.
If you want to tamper with validation and parsing, operate on both the helper
and effectors. If you want to tamper with the routing of control between
commands, operate on the router program.

See [the docs][x-repo-docs] for more details on Black Flag's internals.

#### Motivation

Rather than chain singular yargs instances together, the delegation of
responsibility between helper and effectors facilitates the double-parsing
necessary for [dynamic options][9] support. In implementing dynamic options,
Black Flag accurately parses the given arguments with the helper program on the
first pass and feeds the result to the [`builder`][11] function of the effector
on the second pass (via [`builder`'s new third parameter][9]).

In the same vein, hoisting routing responsibilities to the router program allows
Black Flag to make certain guarantees:

- An end user trying to invoke a parent command with no implementation, or a
  non-existent child command of such a parent, will cause help text to be
  printed and an exception to be thrown with default error exit code. E.g.:
  `myctl parent child1` and `myctl parent child2` work but we want
  `myctl parent` to show help text listing the available commands ("child1" and
  "child2") and exit with an error indicating the given command was not found.

- An end user trying to invoke a non-existent child of a strict pure child
  command will cause help text to be printed and an exception to be thrown with
  default error exit code. E.g.: we want `myctl exists noexist` and
  `myctl noexist` to show help text listing the available commands ("exists")
  and exit with an error indicating bad arguments.

- The right command gets to generate help and version text when triggered via
  arguments. To this end, passing `--help`/`--version` or equivalent arguments
  is effectively ignored by routers.

With vanilla yargs's strict mode, attempting to meet these guarantees would
require disallowing any arguments unrecognized by the yargs instances earlier in
the chain, even if the instances down-chain _do_ recognize said arguments. This
would break Black Flag's support for deep "chained" command hierarchies
entirely.

However, without vanilla yargs's strict mode, attempting to meet these
guarantees would require allowing attempts to invoke non-existent child commands
without throwing an error or throwing the wrong/confusing error. Worse, it would
require a more rigid set of assumptions for the yargs instances, meaning some
API features would be unnecessarily disabled. This would result in a deeply
flawed experience for developers and users.

Hence the need for a distinct _routing program_ which allows parent commands to
recursively chain/route control to child commands in your hierarchy even when
ancestor commands are not aware of the syntax accepted by their distant
descendants—while still properly throwing an error when the end user tries to
invoke a child command that does not exist or invoke a child command with
gibberish arguments.

#### Generating Help Text

Effectors are essentially yargs instances with a registered [default
command][45]. Unfortunately, when vanilla yargs is asked to generate help text
for a default command that has aliases and/or top-level positional arguments,
you get the following:

![Vanilla yargs parseAsync help text example][60]

This is not ideal output for several reasons. For one, the `"cmd"` alias of the
root command is being reported alongside `subcmd` as if it were a child command
when in actuality it's just an alias for the default command.

Worse, the complete command string (`'$0 root-positional'`) is also dumped into
output, potentially without any explanatory text. And even with explanatory text
for `root-positional`, what if the `subcmd` command has its own positional
argument also called `root-positional`?

```text
...
Commands:
  fake-name cmd root-positional     Root description                   [default]
  fake-name subcmd root-positional  Sub description
                                                  [aliases: sub, s] [deprecated]

Positionals:
  root-positional  Some description                                     [string]
...
```

It gets even worse. What if the description of `subcmd`'s `root-positional`
argument is different than the root command's version, and with entirely
different functionality? At that point the help text is actually _lying to the
user_, which could have drastic consequences when invoking powerful CLI commands
with permanent effects.

On the other hand, given the same configuration, Black Flag outputs the
following:

![Black Flag runProgram help text example][61]

> Note 1: in this example, `runProgram` is a function returned by
> [`makeRunner`][19].

> Note 2: in the above image, the first line under "Commands:" is the root
> command. In more recent versions of Black Flag, the root command is omitted
> from the list of sub-commands.

#### Execution Flow Diagram

What follows is a flow diagram illustrating Black Flag's execution flow using
the `myctl` example from the previous sections.

```text
                           `myctl --verbose`
                 ┌───────────────────────────────────┐
                 │                 2                 │
                 │             ┌─────►┌───────────┐  │
┌──────────┐     │             │      │           │  │
│          │  1  │ ┌───────────┴┐     │           │  │
│   USER   ├─────┼─►   ROOT     │     │  ROUTER   │  │
│ TERMINAL │  R1 │ │  COMMAND   │  R2 │  (yargs)  │  │
│          ◄─────┼─┤(Black Flag)◄─────┤           │  │
└──────────┘     │ └────────────┘     │           │  │
                 │                    └┬──▲───┬──▲┘  │
                 │                 3A  │  │   │  │   │
                 │      ┌──────────────┘  │   │  │   │
                 │      │          R3A    │   │  │   │
                 │      │ ┌───────────────┘   │  │   │
                 │      │ │        3B         │  │   │
                 │      │ │     ┌─────────────┘  │   │
                 │      │ │     │  R3B           │   │
                 │      │ │     │ ┌──────────────┘   │
                 │      │ │     │ │                  │
                 │      │ │ ┌───▼─┴──┐ 4A ┌────────┐ │
                 │      │ │ │ HELPER ├────►EFFECTOR│ │
                 │      │ │ │ (yargs)│ R4A│ (yargs)│ │
                 │      │ │ └────────┘◄───┴────────┘ │
                 │      │ │                          │
                 └──────┼─┼──────────────────────────┘
                        │ │
                        │ │`myctl remote --help`
                 ┌──────┼─┼──────────────────────────┐
                 │      │ │        4B                │
                 │      │ │    ┌─────►┌───────────┐  │
                 │      │ │    │      │           │  │
                 │ ┌────▼─┴────┴┐     │           │  │
                 │ │PARENT-CHILD│     │  ROUTER   │  │
                 │ │  COMMAND   │  R4B│  (yargs)  │  │
                 │ │(Black Flag)◄─────┤           │  │
                 │ └────────────┘     │           │  │
                 │                    └┬──▲───┬──▲┘  │
                 │                 5A  │  │   │  │   │
                 │      ┌──────────────┘  │   │  │   │
                 │      │          R5A    │   │  │   │
                 │      │ ┌───────────────┘   │  │   │
                 │      │ │        5B         │  │   │
                 │      │ │     ┌─────────────┘  │   │
                 │      │ │     │  R5B           │   │
                 │      │ │     │ ┌──────────────┘   │
                 │      │ │     │ │                  │
                 │      │ │ ┌───▼─┴──┐ 6A ┌────────┐ │
                 │      │ │ │ HELPER ├────►EFFECTOR│ │
                 │      │ │ │ (yargs)│ R6A│ (yargs)│ │
                 │      │ │ └────────┘◄───┴────────┘ │
                 │      │ │                          │
                 └──────┼─┼──────────────────────────┘
                        │ │
                        │ │`myctl remote remove origin`
                 ┌──────┼─┼──────────────────────────┐
                 │      │ │        6B                │
                 │      │ │    ┌─────►┌───────────┐  │
                 │      │ │    │      │           │  │
                 │ ┌────▼─┴────┴┐     │           │  │
                 │ │   CHILD    │     │  ROUTER   │  │
                 │ │  COMMAND   │  R6B│  (yargs)  │  │
                 │ │(Black Flag)◄─────┤           │  │
                 │ └────────────┘     │           │  │
                 │                    └────┬──▲───┘  │
                 │                 7       │  │      │
                 │              ┌──────────┘  │      │
                 │              │  R7         │      │
                 │              │ ┌───────────┘      │
                 │              │ │                  │
                 │          ┌───▼─┴──┐ 8  ┌────────┐ │
                 │          │ HELPER ├────►EFFECTOR│ │
                 │          │ (yargs)│ R8 │ (yargs)│ │
                 │          └────────┘◄───┴────────┘ │
                 │                                   │
                 └───────────────────────────────────┘
```

Suppose the user executes `myctl --verbose`.<sup>🡒1</sup> Black Flag (using
`runProgram`) calls your configuration hooks, discovers all available commands,
and creates three programs per discovered command: the "router", "helper", and
"effector". If there was an error during discovery/configuration or hook
execution, an internal error handling routine would execute before the process
exited with the appropriate code.<sup>1🡒R1</sup> This is how all errors that
bubble up are handled. Otherwise, Black Flag calls the root
`RouterProgram::parseAsync`.<sup>1🡒2</sup> The router detects that the given
arguments refer to the current command and so calls
`HelperProgram::parseAsync`.<sup>2🡒3B</sup> If the helper throws (e.g. due to a
validation error), the exception bubbles up to the root
command.<sup>R3B🡒R1</sup> Otherwise, the helper will parse the given arguments
before calling `EffectorProgram::parseAsync`.<sup>3B🡒4A</sup> The effector will
re-parse the given arguments, this time with the third `argv` parameter
available to `builder`, before throwing an error, outputting help/version text,
or in this case, calling the current command's `handler` function. The result of
calling `EffectorProgram::parseAsync` bubbles up to the root
command<sup>R4A🡒R2</sup> where it is then communicated to the
user.<sup>R2🡒R1</sup>

> The `myctl` command is _the_ root command, and as such is the only command
> that doesn't have a parent command, making it a "pure parent".

Suppose instead the user executes `myctl remote --help`.<sup>🡒1</sup> Black Flag
(using `runProgram`) sets everything up and calls `RouterProgram::parseAsync`
the same as the previous example.<sup>1🡒2</sup> However, this time the router
detects that the given arguments refer to a child command and so relinquishes
control to the trio of programs representing the `myctl remote`
command.<sup>2->3A</sup> Black Flag notes the user asked to generate generic
help text (by having passed the `--help` argument) before calling
`RouterProgram::parseAsync`.<sup>3A->4B</sup> `myctl remote`'s router detects
that the given arguments refer to the current command and that we're only
generating generic help text so calls `HelperProgram::showHelp`<sup>4B🡒5B</sup>
and throws a `GracefulEarlyExitError` that bubbles up to the root
command<sup>R5B🡒R2</sup> where it is then communicated to the
user.<sup>R2🡒R1</sup>

> The `myctl remote` child command is a child command of the root `myctl`
> command, but it also has its own child commands, making it a parent _and_ a
> child command (i.e. a "parent-child").

Finally, suppose the user executes `myctl remote remove origin`.<sup>🡒1</sup>
Black Flag (using `runProgram`) sets everything up and calls the root
`RouterProgram::parseAsync` the same as the previous example.<sup>1🡒2</sup> The
router detects that the given arguments refer to a child command and so
relinquishes control to the trio of programs representing the `myctl remote`
command.<sup>2->3A</sup> The parent-child router detects that the given
arguments refer to a child command and so relinquishes control to the trio of
programs representing the `myctl remote show` command.<sup>3A->4B->5A</sup>
`myctl remote show`'s router detects that the given arguments refer to the
current command<sup>5A->6B</sup> and so calls
`HelperProgram::parseAsync`.<sup>6B🡒7</sup> If the helper throws (e.g. due to a
validation error), the exception bubbles up to the root command.<sup>R7🡒R1</sup>
Otherwise, the helper will parse the given arguments before calling
`EffectorProgram::parseAsync`.<sup>7🡒8</sup> The effector will re-parse the
given arguments, this time with the third `argv` parameter available to
`builder`, before calling the current command's `handler` function. The result
of calling `EffectorProgram::parseAsync` bubbles up to the root
command<sup>R8🡒R2</sup> where it is then communicated to the
user.<sup>R2🡒R1</sup>

> The `myctl remote show` child command is a child command of the parent-child
> `myctl remote` command. It has no children itself, making it a "pure child"
> command.

> The ascii art diagram was built using [https://asciiflow.com][62]

### Inspiration

I love yargs 💕 Yargs is the greatest! I've made over a dozen CLI tools with
yargs, each with drastically different interfaces and requirements. A couple
help manage critical systems.

Recently, as I was copying-and-pasting some configs from past projects for [yet
another tool][29], I realized the (irritatingly disparate 😖) structures of my
CLI projects up until this point were converging on a set of conventions around
yargs. And, as I'm [always eager][63] to ["optimize" my workflows][64], I
wondered how much of the boilerplate behind my "conventional use" of yargs could
be abstracted away, making my next CLIs more stable upon release, much faster to
build, and more pleasant to test. But perhaps most importantly, I could ensure
my previous CLIs once upgraded would remain simple and consistent to maintain by
myself and others in perpetuity.

Throw in a re-watch of the PotC series and Black Flag was born! 🏴‍☠🍾

<!-- symbiote-template-region-start 6 -->

### Published Package Details

This is a [CJS2 package][x-pkg-cjs-mojito] with statically-analyzable exports
built by Babel for use in Node.js versions that are not end-of-life. For
TypeScript users, this package supports both `"Node10"` and `"Node16"` module
resolution strategies.

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start 7 -->

<details><summary>Expand details</summary>

That means both CJS2 (via `require(...)`) and ESM (via `import { ... } from ...`
or `await import(...)`) source will load this package from the same entry points
when using Node. This has several benefits, the foremost being: less code
shipped/smaller package size, avoiding [dual package
hazard][x-pkg-dual-package-hazard] entirely, distributables are not
packed/bundled/uglified, a drastically less complex build process, and CJS
consumers aren't shafted.

Each entry point (i.e. `ENTRY`) in [`package.json`'s
`exports[ENTRY]`][x-repo-package-json] object includes one or more [export
conditions][x-pkg-exports-conditions]. These entries may or may not include: an
[`exports[ENTRY].types`][x-pkg-exports-types-key] condition pointing to a type
declaration file for TypeScript and IDEs, a
[`exports[ENTRY].module`][x-pkg-exports-module-key] condition pointing to
(usually ESM) source for Webpack/Rollup, a `exports[ENTRY].node` and/or
`exports[ENTRY].default` condition pointing to (usually CJS2) source for Node.js
`require`/`import` and for browsers and other environments, and [other
conditions][x-pkg-exports-conditions] not enumerated here. Check the
[package.json][x-repo-package-json] file to see which export conditions are
supported.

Note that, regardless of the [`{ "type": "..." }`][x-pkg-type] specified in
[`package.json`][x-repo-package-json], any JavaScript files written in ESM
syntax (including distributables) will always have the `.mjs` extension. Note
also that [`package.json`][x-repo-package-json] may include the
[`sideEffects`][x-pkg-side-effects-key] key, which is almost always `false` for
optimal [tree shaking][x-pkg-tree-shaking] where appropriate.

<!-- symbiote-template-region-end -->
<!-- TODO: additional package details here -->
<!-- symbiote-template-region-start 8 -->

</details>

### License

<!-- symbiote-template-region-end -->

See [LICENSE][x-repo-license].

<!-- TODO: additional license information and/or sections here -->
<!-- symbiote-template-region-start 9 -->

## Contributing and Support

**[New issues][x-repo-choose-new-issue] and [pull requests][x-repo-pr-compare]
are always welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟
this project][x-badge-repo-link] to let me know you found it useful! ✊🏿 Or [buy
me a beer][x-repo-sponsor], I'd appreciate it. Thank you!

See [CONTRIBUTING.md][x-repo-contributing] and [SUPPORT.md][x-repo-support] for
more information.

<!-- symbiote-template-region-end -->
<!-- TODO: additional contribution/support sections here -->
<!-- symbiote-template-region-start 10 -->

### Contributors

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start root-package-only -->
<!-- remark-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- remark-ignore-end -->

Thanks goes to these wonderful people ([emoji
key][x-repo-all-contributors-emojis]):

<!-- remark-ignore-start -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://xunn.io/"><img src="https://avatars.githubusercontent.com/u/656017?v=4?s=100" width="100px;" alt="Bernard"/><br /><sub><b>Bernard</b></sub></a><br /><a href="#infra-Xunnamius" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/Xunnamius/black-flag/commits?author=Xunnamius" title="Code">💻</a> <a href="https://github.com/Xunnamius/black-flag/commits?author=Xunnamius" title="Documentation">📖</a> <a href="#maintenance-Xunnamius" title="Maintenance">🚧</a> <a href="https://github.com/Xunnamius/black-flag/commits?author=Xunnamius" title="Tests">⚠️</a> <a href="https://github.com/Xunnamius/black-flag/pulls?q=is%3Apr+reviewed-by%3AXunnamius" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- remark-ignore-end -->

This project follows the [all-contributors][x-repo-all-contributors]
specification. Contributions of any kind welcome!

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start workspace-package-only -->
<!-- (section elided by symbiote) -->
<!-- symbiote-template-region-end -->

[x-badge-blm-image]: https://xunn.at/badge-blm 'Join the movement!'
[x-badge-blm-link]: https://xunn.at/donate-blm
[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/Xunnamius/black-flag/main?style=flat-square&token=HWRIOBAAPW&flag=package.main_root
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/Xunnamius/black-flag
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/@black-flag/core?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-downloads-link]: https://npmtrends.com/@black-flag/core
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/Xunnamius/black-flag?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/@black-flag/core?style=flat-square
  "This package's source license"
[x-badge-license-link]:
  https://github.com/Xunnamius/black-flag/blob/main/LICENSE
[x-badge-npm-image]:
  https://xunn.at/npm-pkg-version/@black-flag/core
  'Install this package using npm or yarn!'
[x-badge-npm-link]: https://npm.im/@black-flag/core
[x-badge-repo-link]: https://github.com/Xunnamius/black-flag
[x-badge-semanticrelease-image]:
  https://xunn.at/badge-semantic-release
  'This repo practices continuous integration and deployment!'
[x-badge-semanticrelease-link]:
  https://github.com/semantic-release/semantic-release
[x-pkg-cjs-mojito]:
  https://dev.to/jakobjingleheimer/configuring-commonjs-es-modules-for-nodejs-12ed#publish-only-a-cjs-distribution-with-property-exports
[x-pkg-dual-package-hazard]:
  https://nodejs.org/api/packages.html#dual-package-hazard
[x-pkg-exports-conditions]:
  https://webpack.js.org/guides/package-exports#reference-syntax
[x-pkg-exports-module-key]:
  https://webpack.js.org/guides/package-exports#providing-commonjs-and-esm-version-stateless
[x-pkg-exports-types-key]:
  https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta#packagejson-exports-imports-and-self-referencing
[x-pkg-side-effects-key]:
  https://webpack.js.org/guides/tree-shaking#mark-the-file-as-side-effect-free
[x-pkg-tree-shaking]: https://webpack.js.org/guides/tree-shaking
[x-pkg-type]:
  https://github.com/nodejs/node/blob/8d8e06a345043bec787e904edc9a2f5c5e9c275f/doc/api/packages.md#type
[x-repo-all-contributors]: https://github.com/all-contributors/all-contributors
[x-repo-all-contributors-emojis]: https://allcontributors.org/docs/en/emoji-key
[x-repo-choose-new-issue]:
  https://github.com/Xunnamius/black-flag/issues/new/choose
[x-repo-contributing]: /CONTRIBUTING.md
[x-repo-docs]: docs
[x-repo-license]: ./LICENSE
[x-repo-package-json]: package.json
[x-repo-pr-compare]: https://github.com/Xunnamius/black-flag/compare
[x-repo-sponsor]: https://github.com/sponsors/Xunnamius
[x-repo-support]: /.github/SUPPORT.md
[1]: https://yargs.js.org
[2]: https://yargs.js.org/docs#api-reference-commanddirdirectory-opts
[3]: https://github.com/Xunnamius/black-flag-extensions
[4]: #irrelevant-differences
[5]: https://github.com/yargs/yargs/blob/HEAD/docs/examples.md
[6]: https://github.com/yargs/yargs/issues/793
[7]:
  https://github.com/yargs/yargs/blob/e517318cea0087b813f5de414b3cdec7b70efe33/docs/api.md
[8]: #differences-between-black-flag-and-yargs
[9]: #built-in-support-for-dynamic-options-
[10]: https://github.com/Xunnamius/black-flag-demo
[11]: ./docs/index/type-aliases/Configuration.md#type-declaration
[12]: ./docs/index/functions/runProgram.md
[13]:
  https://kostasbariotis.com/why-you-should-not-use-process-exit#what-should-we-do
[14]: ./docs/index/functions/configureProgram.md
[15]: ./docs/util/type-aliases/PreExecutionContext.md
[16]: https://en.wikipedia.org/wiki/Convention_over_configuration
[17]: ./docs/index/type-aliases/ConfigureErrorHandlingEpilogue.md
[18]: ./docs/util/classes/AssertionFailedError.md
[19]: ./docs/util/functions/makeRunner.md
[20]: ./docs/index/enumerations/FrameworkExitCode.md
[21]: #built-in-debug-integration-for-runtime-insights-
[22]: https://www.npmjs.com/package/debug
[23]: https://www.npmjs.com/package/debug#usage
[24]: ./docs/index/type-aliases/RootConfiguration.md
[25]: ./docs/index/type-aliases/ParentConfiguration.md
[26]: ./docs/index/type-aliases/ChildConfiguration.md
[27]: ./docs/index/type-aliases/Configuration.md
[28]: #building-and-running-your-cli
[29]: https://github.com/Xunnamius/xunnctl
[30]: #features
[31]: https://nodejs.org/api/packages.html#type
[32]: ./docs/util/type-aliases/ExecutionContext.md
[33]: ./docs/index/type-aliases/ConfigureExecutionContext.md
[34]:
  https://github.com/Xunnamius/black-flag/blob/fc0b42b7afe725aa3834fb3c5f83dd02223bbde7/src/constant.ts#L13
[35]: ./docs/index/type-aliases/ConfigureExecutionPrologue.md
[36]: https://www.npmjs.com/package/alpha-sort
[37]:
  https://github.com/yargs/yargs/blob/e517318cea0087b813f5de414b3cdec7b70efe33/docs/pi.md#user-content-groupkeys-groupname
[38]: https://www.npmjs.com/package/jest
[39]: https://builtin.com/software-engineering-perspectives/currying-javascript
[40]: https://jestjs.io/docs/jest-object#jestresetmodules
[41]: https://github.com/yargs/yargs/issues/2191
[42]: #advanced-usage
[43]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[44]: ./docs/util/type-aliases/Program.md
[45]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#default-commands
[46]:
  https://github.com/jestjs/jest/blob/e7280a2132f454d5939b22c4e9a7a05b30cfcbe6/packages/jest-util/Readme.md#deepcycliccopy
[47]:
  https://github.com/yargs/yargs/blob/HEAD/docs/api.md#user-content-middlewarecallbacks-applybeforevalidation
[48]: ./docs/index/type-aliases/ConfigureArguments.md
[49]: https://github.com/yargs/yargs/issues/733
[50]: https://github.com/yargs/yargs/issues/1323
[51]: https://github.com/yargs/yargs/issues/793#issuecomment-704749472
[52]: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
[53]: #generating-help-text
[54]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases
[55]: https://github.com/yargs/yargs-parser?tab=readme-ov-file#configuration
[56]: https://yargs.js.org/docs#api-reference-parseargs-context-parsecallback
[57]: https://github.com/yargs/yargs/issues/1137
[58]: #execution-flow-diagram
[59]: ./docs/util/type-aliases/ProgramMetadata.md
[60]: ./example-1.png
[61]: ./example-2.png
[62]: https://asciiflow.com
[63]: https://xkcd.com/1205
[64]:
  https://www.reddit.com/r/ProgrammerHumor/comments/bqzc9m/i_would_rather_spend_hours_making_a_program_to_do
