<p align="center" width="100%">
  <img width="300" src="./black-flag.png">
</p>

<p align="center" width="100%">
  <code>$ black-pearl hoist the colors --black-flag</code>
</p>

<hr />

<!-- badges-start -->

<div align="center">

[![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]
[![Last commit timestamp][x-badge-lastcommit-image]][x-badge-repo-link]
[![Codecov][x-badge-codecov-image]][x-badge-codecov-link]
[![Source license][x-badge-license-image]][x-badge-license-link]
[![Uses Semantic Release!][x-badge-semanticrelease-image]][x-badge-semanticrelease-link]

[![NPM version][x-badge-npm-image]][x-badge-npm-link]
[![Monthly Downloads][x-badge-downloads-image]][x-badge-npm-link]

</div>

<!-- badges-end -->

<br />

# Black Flag

Black Flag is a fairly thin library that wraps [yargs][1], extending its
capabilities with several powerful declarative features.

---

<!-- remark-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

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
- [Install](#install)
- [Usage](#usage)
  - [Building and Running Your CLI](#building-and-running-your-cli)
  - [Testing Your CLI](#testing-your-cli)
- [Appendix 🏴](#appendix-)
  - [Differences between Black Flag and Yargs](#differences-between-black-flag-and-yargs)
  - [Advanced Usage](#advanced-usage)
  - [Inspiration](#inspiration)
  - [Published Package Details](#published-package-details)
  - [License](#license)
- [Contributing and Support](#contributing-and-support)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- remark-ignore-end -->

## Features

> Not yet familiar with yargs? Check out their [intro documentation][2] before
> continuing.

### Declaratively Build Deep Command Hierarchies ✨

Black Flag provides first-class support for authoring sprawling deeply nested
tree-like structures of commands and sub-commands.

No more wrestling with positional parameters. No more pleading with
`yargs::commandDir`. And no more forcing your help text to walk the plank!

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
parent directory; the root command assumes the name of the project (via
`package.json`).

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

[Dynamic options][3] are options whose `builder` configuration relies on the
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
unfamiliar interface to wrestle with and no brand new things to learn. All yargs
features still work, the [yargs documentation][4] still applies, and Black Flag,
as a wrapper around yargs, is [compatible][5] with the existing yargs ecosystem.

For example, Black Flag helps you validate those [dynamic options][6] using the
same yargs API you already know and love:

```typescript
// File: my-cli-project/commands/init.ts

// "argv" is a new third argument for builder functions
export function builder(yargs, helpOrVersionSet, argv) {
  //                                             ^^^
  if (argv) {
    // This will be used to validate any dynamic arguments and trigger the
    // command's handler if validation succeeds
    if (argv.lang === 'node') {
      yargs.options({
        lang: { choices: ['node'] },
        version: { choices: ['19.8', '20.9', '21.1'] }
      });
    } else {
      yargs.options({
        lang: { choices: ['python'] },
        version: {
          choices: ['3.10', '3.11', '3.12']
        }
      });
    }
  } else {
    // This will be used for generic help text and first-pass parsing
    //
    // This else block is the best you'd be able to do when using vanilla yargs.
    // But when using Black Flag, it's only the fallback :)
    yargs.options({
      lang: { choices: ['node', 'python'] },
      version: { string: true }
    });
  }
}

export function handler(argv) {
  console.log(`> initializing new ${argv.lang}@${argv.version} project...`);
  // ...
}
```

```text
myctl init --lang 'node' --version=21.1
> initializing new node@21.1 project...
```

```text
myctl init --lang 'python' --version=21.1
Usage: myctl init

Options:
  --help     Show help                                                 [boolean]
  --lang                                                     [choices: "python"]
  --version                                    [choices: "3.10", "3.11", "3.12"]

Invalid values:
  Argument: version, Given: 21.1, Choices: "3.10", "3.11", "3.12"
```

```text
myctl init --help
Usage: myctl init

Options:
  --help     Show help                                                 [boolean]
  --lang                                             [choices: "node", "python"]
  --version
```

If `builder` and `handler` sound familiar, it's because the exports from your
command files are essentially the same as those expected by the `yargs::command`
function: [`aliases`][7], [`builder`][7], [`command`][7], [`deprecated`][7],
[`description`][7], [`handler`][7], and two new ones: [`name`][7] and
[`usage`][7].

The complete `my-cli-project/commands/init.ts` file could look like this:

```typescript
// File: my-cli-project/commands/init.ts

import type { Configuration } from 'black-flag';

// Types are also available vv
const configuration: Configuration = {
  //                        ^^

  // ALL OF THESE ARE OPTIONAL! Black Flag would still accept this file even if
  // if were completely blank.

  // An array of yargs aliases for this command. Defaults to []
  aliases: [],

  // Can be a yargs builder function or a yargs options object. Defaults to {}
  // Note: cannot be async as of yargs 17.7.2
  builder(yargs, helpOrVersionSet, argv) {
    //...
    return yargs;
  },

  // Always a string. All commands must begin with "$0". Defaults to "$0". Also
  // replaces "$000" during string interpolation for the usage option given
  // below.
  command: '$0 [positional-arg-1] [positional-arg-2]',

  // If true, this command will be considered deprecated. Defaults to false
  deprecated: false,

  // Used as the command's description in its parent command's help text, and
  // when replacing "$1" during string interpolation. Set to false to disable.
  // Defaults to ""
  description: 'initializes stuff',

  // This function is called when the arguments match (and pass yargs
  // validation). Defaults to a function that throws CommandNotImplementedError
  handler(argv) {
    console.log(`> initializing new ${argv.lang} project...`);
    // ...
  },

  // Used as the command's name in help text, when parsing arguments, when
  // replacing "$0" during string interpolation, and elsewhere. Usually defaults
  // to a trimmed version of the file/directory name
  name: 'init',

  // Used as the command's usage instructions in its own help text. "$000", if
  // present, will be replaced by the value of the command option given above.
  // Afterwards, "$0" and/or "$1", if present, will be replaced by the name and
  // description options given above. Defaults to "Usage: $000\n\n$1". Will be
  // trimmed before being output.
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

import { join } from 'node:path';
import { runProgram } from 'black-flag';

// Just point Black Flag at the directory containing your command files
export default runProgram(join(__dirname, 'commands'));
```

```shell
# This would work thanks to that shebang (#!)
./cli.js remote show origin
# This works after transpiling our .ts files to .js with babel...
node ./cli.js -- remote show origin
# ... and then publishing it and ran something like: npm i -g my-cli-project
myctl remote show origin
# Or, if we were using a runtime that supported TypeScript natively
deno ./cli.ts -- remote show origin
```

The [`runProgram`][8] function bootstraps your CLI whenever you need it, e.g.
when testing, in production, when importing your CLI as a dependency, etc.

> `runProgram` never throws, and never calls `process.exit` [since that's
> dangerous][9] and a disaster for unit testing.

Under the hood, `runProgram` calls [`configureProgram`][10], which
auto-discovers and collects all the configurations exported from your command
files, followed by [`PreExecutionContext::execute`][11], which is a wrapper
around `yargs::parseAsync` and `yargs::hideBin`.

```typescript
import { join } from 'node:path';
import { runProgram, configureProgram } from 'black-flag';
import { hideBin, isCliError } from 'black-flag/util';

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

Black Flag [favors convention over configuration][12], meaning **everything
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
} from 'black-flag';

// These configuration hooks have been listed in the order they're typically
// executed by Black Flag. They are all entirely optional.

/**
 * This function is called once towards the beginning of the execution of
 * configureProgram and should return what will become the global
 * context singleton.
 */
export const configureExecutionContext: ConfigureExecutionContext = async (
  context
) => {
  // You can add some state shared between all your command handlers and
  // configuration hooks here.
  context.somethingDifferent = 'cool';
  return context; // <== This is: the "context" used literally everywhere else
};

/**
 * This function is called once towards the end of the execution of
 * configureProgram, after all commands have been discovered but before any
 * have been executed, and should apply any final configurations to the yargs
 * instances that constitute the command line interface.
 */
export const configureExecutionPrologue: ConfigureExecutionPrologue = async (
  program, // <== This is: the root yargs instance
  context
) => {
  // Typically unnecessary (and suboptimal) to use this hook. Configure commands
  // (including the root command) declaratively using the filesystem instead.
  // Otherwise, at this point, you're just using yargs but with extra steps.
  // Even worse, you'd have to configure each instance _and its shadow_ (see
  // appendix).
  //
  // Prefer the simple filesystem-based declarative API over this function!
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
  // hideBin manually, but if you do, it's re-exported from 'black-flag/util'.

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

import { join } from 'node:path';
import { runProgram } from 'black-flag';

export default runProgram(
  join(__dirname, 'commands'),
  // Just pass an object of your configuration hooks. Promises are okay!
  import('./configure.js') // <== For deno projects, it'd be ".ts" over ".js"
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
    // You can even wrap other errors with it
    throw new CliError(error);
  }
  ```

- Handling graceful exit events (like when `--help` is called) as non-errors
  automatically.

  ```typescript
  // Throwing this in your handler or elsewhere will cause Black Flag to exit
  // immediately with a 0 exit code
  throw new GracefulEarlyExitError();
  ```

- Outputting all error messages to stderr (via `console.error`) by default.

- Access to the parsed process arguments at the time the error occurred (if
  available).

How errors are reported is determined by the optionally-provided
[`configureErrorHandlingEpilogue`][13] configuration hook, as well as each
command file's optionally-exported [`builder`][7] function.

```typescript
// File: my-cli-project/cli.ts

await runProgram('./commands', {
  configureErrorHandlingEpilogue({ error }, argv, context) {
    // Instead of outputting to stderr by default, send all errors elsewhere
    sendJsErrorToLog4J(argv.aMoreDetailedErrorOrSomething ?? error);
  }
});
```

```typescript
// File: my-cli-project/commands/index.ts

export function builder(yargs) {
  // Turn off outputting help text when a parsing error occurs for this command
  yargs.showHelpOnFail(false);
}
```

> Note that [framework errors][14], which are the result of developer error
> rather than end user error, cannot be handled by
> `configureErrorHandlingEpilogue`. If you're using
> [`makeRunner`][15]/[`runProgram`][8] (which never throws) and a
> misconfiguration triggers a framework error, your program will set its exit
> code [accordingly][16]. In such a case, use [debug mode][17] to gain insight.

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
} from 'black-flag';

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
production: [`runProgram`][8].

> Black Flag additionally provides the [`makeRunner`][15] utility function so
> you don't have to tediously copy and paste `runProgram(...)` and all its
> arguments between tests.

```typescript
// File: my-cli-project/test.ts (with Jest as test runner)

import { makeRunner } from 'black-flag/util';

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

Black Flag integrates [debug][18], allowing for deep insight into your tool's
runtime without significant overhead or code changes. Simply set the `DEBUG`
environment variable to an [appropriate value][19]:

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
themselves. Just use [debug][18] in your command files:

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
[`RootConfiguration`][20], [`ParentConfiguration`][21], and
[`ChildConfiguration`][22] types.

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
 * @type {import('black-flag').ParentConfiguration}
 */
module.exports = {
  description: `description for program ${name}`,
  builder: (yargs) => yargs.option(name, { count: true }),
  handler: (argv) => (argv.handled_by = __filename)
};
```

Child commands (commands not declared in index files) should use
[`ChildConfiguration`][22]. Parent commands (commands declared in index files)
should use [`ParentConfiguration`][21]. The root parent command (at the apex of
the directory storing your command files) should use [`RootConfiguration`][20].

> There's also [`Configuration`][23], the supertype of the three
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
that snazzy `myctl` tool [here][24]. Or play with the real thing on NPM:
`npx -p @xunnamius/my-cli-project myctl --help` (also supports `DEBUG`
environment variable). Or check out the [step-by-step getting started guide][25]
below!

## Install

```shell
npm install black-flag
```

## Usage

What follows is a simple step-by-step guide for building, running, and testing
the `myctl` tool from [the introduction][26].

> There's also a functional [`myctl` demo repository][24]. And you can interact
> with the published version on NPM:
> `npx -p @xunnamius/my-cli-project myctl --help`.

### Building and Running Your CLI

Let's make a new CLI project!

> Note: what follows are linux shell commands. The equivalent Windows DOS/PS
> commands will be different.

```shell
mkdir my-cli-project
cd my-cli-project
git init
```

Add `package.json` file with the bare minimum metadata:

```shell
echo '{"name":"myctl","version":"1.0.0","type":"module","bin":{"myctl":"./cli.js"}}' > package.json
npm install black-flag
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

import { join } from 'node:path';
import { runProgram } from 'black-flag';

export default runProgram(join(__dirname, 'command'));
```

Let's create our first command, the _root command_. Every Black Flag project has
one, and it's always named `index.js`. In vanilla yargs parlance, this would be
the highest-level "default command".

```text
touch commands/index.js
```

Depending on how you invoke Black Flag (e.g. with Node, Deno, Babel+Node, etc),
command files support a subset of the following extensions in precedence order:
`.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`. To keep things simple, we'll be
using ES modules as `.js` files (note the [type][27] in `package.json`).

Also note that empty files, and files that do not export a `handler` function,
are picked up by Black Flag as unfinished/unimplemented commands. They will
still appear in help text but, when invoked, will throw an error. This means you
can stub out a complex CLI in a couple minutes: just name your directories and
empty files accordingly!

With that in mind, let's actually run our skeletal CLI now:

```shell
./cli.js
```

---

```text
CommandNotImplementedError: attempted to invoke unimplemented functionality
```

Let's try with a bad positional parameter:

```shell
./cli.js bad
```

---

```text
Usage: myctl

Commands:
  myctl                                                                [default]

Options:
  --help          Show help text                                       [boolean]
  --version       Show version number                                  [boolean]

Unknown argument: bad
```

How about with a bad option:

```shell
./cli.js --bad
```

---

```text
Usage: myctl

Commands:
  myctl                                                                [default]

Options:
  --help          Show help text                                       [boolean]
  --version       Show version number                                  [boolean]

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

- `yargs::exitProcess(false)`
  - Black Flag only sets `process.exitCode` and never calls `process.exit(...)`
- `yargs::fail(...)`
  - Black Flag uses a custom failure handler
- `yargs::help('help', customDescription)`
- `yargs::scriptName(fullName)`
- `yargs::showHelpOnFail(true)`
  - Black Flag uses a custom failure handler
- `yargs::strict(true)`
- `yargs::usage(defaultUsageText)`
  - Defaults to `Usage: ${command}\n\n${description}` where `command` and
    `description` are exports of your command file
  - Note that, as of yargs\@17.7.2, calling `yargs::usage(...)` multiple times
    (such as in [`configureExecutionPrologue`][28]) will concatenate each
    invocation's arguments into one long usage string instead of overwriting
    previous invocations with later ones
- `yargs::version(false)`
  - For the root command, `yargs::version(pkgJson.version || false)` is called
    instead
- `yargs::wrap(yargs::terminalWidth())`

<!-- lint enable list-item-style -->

Any default can be overridden on a command-by-command basis via each command's
[`builder`][7] function, which gives you direct access to the entire yargs API.
Let's add one to `commands/index.js` along with a `handler` function and `usage`
string:

```javascript
/**
 * This little comment gives us intellisense support :)
 *
 * @type {import('black-flag').RootConfiguration['builder']}
 */
export function builder(yargs) {
  return yargs.strict(false);
}

/**
 * @type {import('black-flag').RootConfiguration['handler']}
 */
export function handler(argv) {
  console.log('ran root command handler');
}

/**
 * Note that `usage` is just a freeform string used in help text. The `command`
 * export, on the other hand, supports the yargs DSL for defining positional
 * parameters and the like.
 *
 * @type {import('black-flag').RootConfiguration['usage']}
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

Commands:
  myctl                                                                [default]
  myctl init
  myctl remote

Options:
  --help          Show help text                                       [boolean]
  --version       Show version number                                  [boolean]
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
  --help          Show help text                                       [boolean]
```

Since different OSes walk different filesystems in different orders,
auto-discovered commands will appear _in [alpha-sort][29] order_ in help text
rather than in insertion order; [command groupings][30] are still respected and
each command's options are still enumerated in insertion order.

Now let's try a grandchild command:

```shell
./cli.js remote show --help
```

---

```text
Usage: myctl remote show

Options:
  --help          Show help text                                       [boolean]
```

Neat! 📸

### Testing Your CLI

Testing if your CLI tool works by running it manually on the command line is
nice and all, but if we're serious about building a stable and usable tool,
we'll need some automated tests.

Thankfully, with Black Flag, testing your commands is usually easier than
writing them.

First, let's install [jest][31]. We'll also create a file to hold our tests.

```shell
npm install jest
touch test.js
```

Since we set our root command to non-strict mode, let's test that it doesn't
throw in the presence of unknown arguments. Let's also test that it exits with
the exit code we expect and sends an expected response to stdout.

Note that we use [`makeRunner`][32] below, which is a factory function that
returns a [curried][33] version of [`runProgram`][8] that is far less tedious to
invoke successively.

> Each invocation of `runProgram()`/`makeRunner()()` configures and runs your
> entire CLI _from scratch_. Other than stuff like [the require cache][34],
> there is no shared state between invocations unless you explicitly make it so.
> This makes testing your commands "in isolation" dead simple and avoids a
> [common yargs footgun][35].

```javascript
import { makeRunner } from 'black-flag/util';

// makeRunner is a factory function that returns runProgram functions with
// curried arguments.
const run = makeRunner(`${__dirname}/commands`);

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
npx jest
```

---

```text
 PASS  test.js

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.272 s
```

Neat! 📸

## Appendix 🏴

Further documentation can be found under [`docs/`][x-repo-docs].

### Differences between Black Flag and Yargs

> Note that yargs is a _dependency_ of Black Flag. Black Flag is _not_ a fork of
> yargs!

Aside from the expanded feature set, there are some minor differences between
yargs and Black Flag. They should not be relevant given proper use of Black
Flag, but are noted below nonetheless.

<!-- lint disable list-item-style -->

#### Minor Differences

- The `yargs::argv` magic property is soft-disabled (always returns `undefined`)
  so that deep cloning a yargs instance doesn't result in `yargs::parse` (_and
  yargs's command handlers_) getting invoked several times, _even after an error
  occurred in an earlier invocation_. This can lead to undefined or even
  dangerous behavior.

  > Who in their right mind is out here cloning yargs instances, you may ask?
  > [Jest does so whenever you use certain asymmetric matchers][36].

  Regardless, you should never have to reach below Black Flag's abstraction over
  yargs to call methods like `yargs::parse`, `yargs::parseAsync`, `yargs::argv`,
  etc. Instead, just [use Black Flag as intended][8].

  Therefore, this is effectively a non-issue with proper declarative use of
  Black Flag.

- Yargs [middleware][37] isn't supported since the functionality is mostly
  covered by configuration hooks ~~and I didn't notice yargs had this feature
  until after I wrote Black Flag~~.

  If you have a yargs middleware function you want run with a specific command,
  pass it to `yargs::middleware` via that command's [`builder`][7] function. If
  you want the middleware to apply globally, invoke the function directly in
  [`configureArguments`][28]. If neither solution is desirable, you can also
  [dangerously muck around with][38] the relevant yargs instances manually in
  [`configureExecutionPrologue`][39].

#### Irrelevant Differences

- A [bug][40] in yargs\@17.7.2 prevents `yargs::showHelp(...)`/`--help` from
  printing anything when using an async [`builder`][7] function (or
  promise-returning function) for a default command.

  Black Flag addresses this with its types, in that attempting to pass an async
  builder will be flagged as problematic by intellisense. Moreover, Black Flag
  supports an asynchronous function as the value of `module.exports` in CJS
  code, and top-level await in ESM code, so if you really do need an async
  [`builder`][7] function, [hoist][41] the async logic to work around this bug
  for now.

- A bug in yargs\@17.7.2 causes `yargs::showHelp(...)` to erroneously print the
  _second_ element in the [`aliases`][42] array of the [default command][43]
  when said command also has sub-commands.

  Black Flag addresses this defensively: if Black Flag notices the buggy
  behavior, it will correct it inline with a simple find-replace before
  continuing. If it's fixed upstream, the defensive "fix" will become a no-op.

- Currently, yargs (as of 17.7.2) [doesn't really support][35] [calling
  `yargs::parse`/`yargs::parseAsync` multiple times on the same instance][44] if
  it's using the commands-based API. This seems to be a regression since, [among
  other things][45], there are comments within yargs's source that indicate
  these functions were intended to be called multiple times.

  Black Flag addresses this in two ways. First, the [`runProgram`][8] helper
  takes care of state isolation for you, making it safe to call
  [`runProgram`][8] multiple times. Easy peasy. Second,
  [`PreExecutionContext::execute`][11] (the wrapper around `yargs::parseAsync`)
  will throw if invoked more than once.

- One of Black Flag's features is simple comprehensive error reporting via the
  [`configureErrorHandlingEpilogue`][13] configuration hook. Therefore, the
  `yargs::showHelpOnFail(...)` method will ignore the redundant "message"
  parameter. If you want that functionality, use said hook to output an
  "epilogue" message after yargs outputs an error message.

- Since every auto-discovered command translates [into its own yargs
  instances][38], the [`command`][7] property, if exported by your command
  file(s), must start with `"$0"`. However, most command files shouldn't export
  a [`command`][7] property at all since the default usually suffices and
  parameters are more naturally defined via [`builder`][7].

- `yargs::check` and `yargs::global`, while they work as expected on commands
  and their direct sub-commands, do not necessarily apply "globally" across your
  entire command hierarchy since [there are several _distinct_ yargs instances
  in play when Black Flag executes][38]. This is not a problem for most projects
  and vanilla yargs already has a similar limitation with `yargs::check`.

  However, if you want a uniform check to apply to every single yargs instance
  across your entire command hierarchy, and using each command's [`builder`][7]
  property doesn't sound appealing, you can leverage the
  [`configureArguments`][28]/[`configureExecutionPrologue`][39] hook and
  [command metadata][38].

- Due to the way Black Flag stacks yargs instances, arbitrary parameters cannot
  appear in the arguments list until after the final command name.

  For example, the following is acceptable:

  ```shell
  treasure-chest retrieve --name piece-of-8
  ```

  While this will result in an error:

  ```shell
  treasure-chest --name piece-of-8 retrieve
  ```

  Similarly:

  ```shell
  treasure-chest retrieve --help # Will succeed
  treasure-chest --help retrieve # Will FAIL
  ```

  This limitation was inherited from yargs itself: vanilla yargs [never really
  supported this functionality][46] in that you can't implement
  `git -p ls-files --full-name` and have that mean something different than
  `git ls-files --full-name -p` or `git -p ls-files --full-name -p` with yargs.
  Black Flag makes this a formal invariant that will throw an error.

- All yargs instances used by Black Flag use the same `yargs::help(...)`
  function. This means descendant commands and ancestor commands will always use
  the same `yargs::help(...)` settings, thus preserving the vanilla yargs
  behavior.

- Since Black Flag is built from the ground up to be asynchronous, calling
  `yargs::parseSync` will throw immediately. [You shouldn't be calling the
  `yargs::parseX` functions directly anyway][8].

<!-- lint enable list-item-style -->

### Advanced Usage

> Note: you shouldn't need to reach below Black Flag's declarative abstraction
> layer when building your tool. If you feel that you do, consider [opening a
> new issue][x-repo-choose-new-issue]!

Since Black Flag is just a bunch of yargs instances stacked on top of each other
wearing a trench coat, you can muck around with the internal yargs instances
directly if you want.

For example, you can retrieve a mapping of all commands known to Black Flag and
their corresponding yargs instances in the order they were encountered during
auto-discovery (OS-specific):

```typescript
import { runCommand, $executionContext } from 'black-flag';

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
  'myctl' => { program: [yargs], metadata: [Object] },
  'myctl init' => { program: [yargs], metadata: [Object] },
  'myctl remote' => { program: [yargs], metadata: [Object] },
  'myctl remote add' => { program: [yargs], metadata: [Object] },
  'myctl remote remove' => { program: [yargs], metadata: [Object] },
  'myctl remote show' => { program: [yargs], metadata: [Object] }
}
```

Each of these six programs is actually two yargs instances:

1. The **actual** (or **"non-shadow"**) yargs instance is responsible for
   generating help text, proxying control to sub-command yargs instances, and
   first-pass arguments parsing and validation. Said parse result is used as the
   `argv` third parameter passed to [`builder`][7] functions.

2. The **shadow** yargs instance is responsible for second-pass arguments
   parsing and validation, running each command's [`handler`][7], and returning
   the `argv` returned by [`PreExecutionContext::execute`][11].

See the [flow chart][47] below for more details.

Actual instances are available as the `program` property of each object in
[`PreExecutionContext::commands`][11]. The actual instance representing the root
command is accessible from the [`PreExecutionContext::program`][11] property,
which is always the first item in the `PreExecutionContext::commands` map.

```typescript
const preExecutionContext = configureProgram('./commands', {
  configureExecutionEpilogue(_argv, { commands }) {
    assert(preExecutionContext.program === commands.get(commands.keys()[0]));
    assert(preExecutionContext.program === commands.get('myctl'));
  }
});

await preExecutionContext.execute();
```

Shadow instances are "clones" of their actual instances, and are available as
the [`metadata.shadow`][48] property of each object in
[`PreExecutionContext::commands`][11]. The actual command and its shadow clone
are identical except the actual command is [_never_ set to strict mode][49]
while the shadow is set to strict mode by default.

> Note that non-shadow instances have their strict mode functions [soft
> disabled][49] for the reasons described below. When executing Black Flag in
> [debug mode][17], you will be warned when accidentally invoking them.

Therefore: if you want to tamper with the instance responsible for handing off
or "proxying" control between yargs instances, operate on the actual instance.
On the other hand, if you want to tamper with the instance responsible for
running a program's actual [`handler`][7] function, you should operate on
[`metadata.shadow`][48].

This bifurcation of responsibility facilitates the double-parsing necessary for
both [_dynamic options_][6] and _dynamic strictness_.

In implementing dynamic options, Black Flag accurately parses the given
arguments with the actual instance on the first pass and feeds the result to the
[`builder`][7] function of the shadow clone on the second pass (via [`builder`'s
new third parameter][6]).

By facilitating dynamic strictness, Black Flag can guarantee both parent and
child programs are evaluated in vanilla yargs strict mode by default, meaning an
end user trying to invoke a non-existent sub-command will cause an exception to
be thrown. With vanilla yargs strict mode, this would mean disallowing any
arguments unrecognized by the yargs instance doing the proxying, even if the
yargs instance being proxied to _does_ recognize said arguments. This would
break Black Flag's support for deep command hierarchies entirely.

Hence the need for so-called "dynamic strictness," which allows parent yargs
instances to recursively proxy control to child yargs instances in your
hierarchy of commands even when ancestor commands are not aware of the syntax
accepted by their distant descendants—while still properly throwing an error
when the end user tries to invoke a sub-command that does not exist.

See [the docs][x-repo-docs] for more details on Black Flag's internals.

#### Execution Flow Diagram

What follows is a flow diagram illustrating the process described above using
the `myctl` example from the previous sections.

```
                            `myctl --help`
                 ┌───────────────────────────────────┐
                 │                 2                 │
                 │       ┌───────────►┌────────────┐ │
┌──────────┐     │       │            │            │ │
│          │  1  │ ┌─────┴──────┐     │            │ │
│   USER   ├─────┼─►   ROOT     │     │ NON-SHADOW │ │
│ TERMINAL │  R1 │ │  PROGRAM   │  R2 │  (yargs)   │ │
│          ◄─────┼─┤(Black Flag)◄─────┤            │ │
└──────────┘     │ └────────────┘     │            │ │
                 │                    └┬──▲───┬──▲─┘ │
                 │                 3A  │  │   │  │   │
                 │      ┌──────────────┘  │   │  │   │
                 │      │          R3A    │   │  │   │
                 │      │ ┌───────────────┘   │  │   │
                 │      │ │                 3B│  │R3B│
                 │      │ │              ┌────▼──┴─┐ │
                 │      │ │              │ SHADOW  │ │
                 │      │ │              │ (yargs) │ │
                 │      │ │              └─────────┘ │
                 │      │ │                          │
                 └──────┼─┼──────────────────────────┘
                        │ │
                        │ │ `myctl remote --help`
                 ┌──────┼─┼──────────────────────────┐
                 │      │ │        4                 │
                 │      │ │ ┌────────►┌────────────┐ │
                 │      │ │ │         │            │ │
                 │ ┌────▼─┴─┴───┐     │            │ │
                 │ │PARENT-CHILD│     │ NON-SHADOW │ │
                 │ │  PROGRAM   │  R4 │  (yargs)   │ │
                 │ │(Black Flag)◄─────┤            │ │
                 │ └────────────┘     │            │ │
                 │                    └┬──▲────┬─▲─┘ │
                 │                 5A  │  │    │ │   │
                 │      ┌──────────────┘  │    │ │   │
                 │      │          R5A    │    │ │   │
                 │      │ ┌───────────────┘    │ │   │
                 │      │ │                  5B│ │R5B│
                 │      │ │              ┌─────▼─┴─┐ │
                 │      │ │              │ SHADOW  │ │
                 │      │ │              │ (yargs) │ │
                 │      │ │              └─────────┘ │
                 │      │ │                          │
                 └──────┼─┼──────────────────────────┘
                        │ │
                        │ │ `myctl remote show --help`
                 ┌──────┼─┼──────────────────────────┐
                 │      │ │        6                 │
                 │      │ │ ┌────────►┌────────────┐ │
                 │      │ │ │         │            │ │
                 │ ┌────▼─┴─┴─────┐   │ NON-SHADOW │ │
                 │ │    CHILD     │R6 │  (yargs)   │ │
                 │ │   PROGRAM    ◄───┤            │ │
                 │ │ (Black Flag) │   └────────┬─▲─┘ │
                 │ └──────────────┘           7│ │R7 │
                 │                       ┌─────▼─┴─┐ │
                 │                       │ SHADOW  │ │
                 │                       │ (yargs) │ │
                 │                       └─────────┘ │
                 │                                   │
                 └───────────────────────────────────┘
```

Suppose the user executes `myctl --help`.<sup>🡒1</sup> Black Flag (using
`runProgram`) calls your configuration hooks, discovers all available commands,
and creates two fully configured yargs instances per discovered command: the
"shadow" and the "non-shadow" ("actual"). If there was an error during
discovery/configuration or hook execution, the error handling hook would execute
before the process exited with the appropriate code.<sup>1🡒R1</sup> This is how
all errors that bubble up are handled. Otherwise, Black Flag calls
`non-shadow::parseAsync`.<sup>1🡒2</sup> If the non-shadow throws (e.g. due to a
validation error), the exception bubbles up to the root program.<sup>R2🡒R1</sup>
Otherwise, the non-shadow will parse the given arguments before calling
`shadow::parseAsync`.<sup>2🡒3B</sup> The shadow will re-parse the given
arguments, this time with the third `argv` parameter available to `builder`,
before calling the root command's `handler` function, throwing an error, or, in
this case, outputting help text. The result of calling `shadow::parseAsync`
bubbles up to the root program<sup>R3🡒R2</sup> and communicated to the
user.<sup>R2🡒R1</sup>

> The `myctl` command is _the_ root command, and as such is the only command
> that doesn't have a parent command, making it a "pure parent".

Suppose instead the user executes `myctl remote --help`.<sup>🡒1</sup> Black Flag
(using `runProgram`) sets everything up and calls `non-shadow::parseAsync` the
same as the previous example.<sup>1🡒2</sup> However, this time the root
non-shadow detects that the given arguments refer to a subcommand and so
relinquishes control to the pair of yargs instances representing the
`myctl remote` command.<sup>2->3A</sup> A process identical to the previous
example plays out, just at the parent-child level rather than the
root.<sup>4🡒5B🡒R5B🡒R1</sup>

> The `myctl remote` subcommand is a child command of the root `myctl` command,
> but it also has its own child commands, making it a parent _and_ a child
> command (i.e. a "parent-child").

Finally, suppose the user executes `myctl remote show --help`.<sup>🡒1</sup>
Black Flag (using `runProgram`) sets everything up and calls
`non-shadow::parseAsync` the same as the previous example.<sup>1🡒2</sup> The
root non-shadow detects that the given arguments refer to a subcommand and so
relinquishes control to the pair of yargs instances representing the
`myctl remote` command.<sup>2->3A</sup> The parent-child non-shadow detects that
the given arguments refer to a subcommand and so relinquishes control to the
pair of yargs instances representing the `myctl remote show`
command.<sup>4->5A</sup> A process identical to the previous example plays out,
just at the child level rather than the previous two levels.<sup>6🡒7🡒R7🡒R1</sup>

> The `myctl remote show` subcommand is a child command of the parent-child
> `myctl remote` command. It has no children itself, making it a child or "pure
> child" command.

> The ascii art diagram was built using [https://asciiflow.com][50]

### Inspiration

I love yargs 💕 Yargs is the greatest! I've made over a dozen CLI tools with
yargs, each with drastically different interfaces and requirements. A couple
help manage critical systems.

Recently, as I was copying-and-pasting some configs from past projects for [yet
another tool][51], I realized the (irritatingly disparate 😖) structures of my
CLI projects up until this point were converging on a set of conventions around
yargs. And, as I'm [always eager][52] to ["optimize" my workflows][53], I
wondered how much of the boilerplate behind my "conventional use" of yargs could
be abstracted away, making my next CLIs more stable upon release, much faster to
build, and more pleasant to test. But perhaps most importantly, I could ensure
my previous CLIs once upgraded would remain simple and consistent to maintain by
myself and others in perpetuity.

Throw in a re-watch of the PotC series and Black Flag was born! 🏴‍☠🍾

### Published Package Details

This is a [CJS2 package][x-pkg-cjs-mojito] with statically-analyzable exports
built by Babel for Node.js versions that are not end-of-life. For TypeScript
users, this package supports both `"Node10"` and `"Node16"` module resolution
strategies.

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
declarations file for TypeScript and IDEs, an
[`exports[ENTRY].module`][x-pkg-exports-module-key] condition pointing to
(usually ESM) source for Webpack/Rollup, an `exports[ENTRY].node` condition
pointing to (usually CJS2) source for Node.js `require` _and `import`_, an
`exports[ENTRY].default` condition pointing to source for browsers and other
environments, and [other conditions][x-pkg-exports-conditions] not enumerated
here. Check the [package.json][x-repo-package-json] file to see which export
conditions are supported.

Though [`package.json`][x-repo-package-json] includes
[`{ "type": "commonjs" }`][x-pkg-type], note that any ESM-only entry points will
be ES module (`.mjs`) files. Finally, [`package.json`][x-repo-package-json] also
includes the [`sideEffects`][x-pkg-side-effects-key] key, which is `false` for
optimal [tree shaking][x-pkg-tree-shaking] where appropriate.

</details>

### License

See [LICENSE][x-repo-license].

## Contributing and Support

**[New issues][x-repo-choose-new-issue] and [pull requests][x-repo-pr-compare]
are always welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟
this project][x-badge-repo-link] to let me know you found it useful! ✊🏿 Or you
could [buy me a beer][x-repo-sponsor] 🥺 Thank you!

See [CONTRIBUTING.md][x-repo-contributing] and [SUPPORT.md][x-repo-support] for
more information.

### Contributors

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
      <td align="center" valign="top" width="14.28%"><a href="https://xunn.io/"><img src="https://avatars.githubusercontent.com/u/656017?v=4?s=100" width="100px;" alt="Bernard"/><br /><sub><b>Bernard</b></sub><br /><a href="#infra-Xunnamius" title="Infrastructure (Hosting, Build-Tools, etc)">🚇 <a href="https://github.com/Xunnamius/black-flag/commits?author=Xunnamius" title="Code">💻 <a href="https://github.com/Xunnamius/black-flag/commits?author=Xunnamius" title="Documentation">📖 <a href="#maintenance-Xunnamius" title="Maintenance">🚧 <a href="https://github.com/Xunnamius/black-flag/commits?author=Xunnamius" title="Tests">⚠️ <a href="https://github.com/Xunnamius/black-flag/pulls?q=is%3Apr+reviewed-by%3AXunnamius" title="Reviewed Pull Requests">👀</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions
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

[x-badge-blm-image]: https://xunn.at/badge-blm 'Join the movement!'
[x-badge-blm-link]: https://xunn.at/donate-blm
[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/Xunnamius/black-flag/main?style=flat-square&token=HWRIOBAAPW
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/Xunnamius/black-flag
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/black-flag?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/xunnamius/black-flag?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/black-flag?style=flat-square
  "This package's source license"
[x-badge-license-link]:
  https://github.com/Xunnamius/black-flag/blob/main/LICENSE
[x-badge-npm-image]:
  https://xunn.at/npm-pkg-version/black-flag
  'Install this package using npm or yarn!'
[x-badge-npm-link]: https://www.npmjs.com/package/black-flag
[x-badge-repo-link]: https://github.com/xunnamius/black-flag
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
  https://github.com/xunnamius/black-flag/issues/new/choose
[x-repo-contributing]: /CONTRIBUTING.md
[x-repo-docs]: docs
[x-repo-license]: ./LICENSE
[x-repo-package-json]: package.json
[x-repo-pr-compare]: https://github.com/xunnamius/black-flag/compare
[x-repo-sponsor]: https://github.com/sponsors/Xunnamius
[x-repo-support]: /.github/SUPPORT.md
[1]: https://yargs.js.org
[2]: https://github.com/yargs/yargs/blob/HEAD/docs/examples.md
[3]: https://github.com/yargs/yargs/issues/793
[4]:
  https://github.com/yargs/yargs/blob/e517318cea0087b813f5de414b3cdec7b70efe33/docs/api.md
[5]: #differences-between-black-flag-and-yargs
[6]: #built-in-support-for-dynamic-options-
[7]: ./docs/modules/index.md#type-declaration-1
[8]: ./docs/modules/index.md#runProgram
[9]:
  https://kostasbariotis.com/why-you-should-not-use-process-exit#what-should-we-do
[10]: ./docs/modules/index.md#configureProgram
[11]: ./docs/modules/index.md#preexecutioncontext
[12]: https://en.wikipedia.org/wiki/Convention_over_configuration
[13]: ./docs/modules/index.md#configureerrorhandlingepilogue
[14]: ./docs/classes/index.AssertionFailedError.md
[15]: ./docs/modules/util.md#makerunner
[16]: ./docs/enums/index.FrameworkExitCode.md
[17]: #built-in-debug-integration-for-runtime-insights-
[18]: https://www.npmjs.com/package/debug
[19]: https://www.npmjs.com/package/debug#usage
[20]: ./docs/modules/index.md#rootconfiguration
[21]: ./docs/modules/index.md#parentconfiguration
[22]: ./docs/modules/index.md#childconfiguration
[23]: ./docs/modules/index.md#configuration
[24]: https://github.com/Xunnamius/black-flag-demo
[25]: #building-and-running-your-cli
[26]: #introduction
[27]: https://nodejs.org/api/packages.html#type
[28]: #convention-over-configuration-
[29]: https://www.npmjs.com/package/alpha-sort
[30]:
  https://github.com/yargs/yargs/blob/e517318cea0087b813f5de414b3cdec7b70efe33/docs/pi.md#user-content-groupkeys-groupname
[31]: https://www.npmjs.com/package/jest
[32]: ./docs/modules/index.md#makeprogram
[33]: https://builtin.com/software-engineering-perspectives/currying-javascript
[34]: https://jestjs.io/docs/jest-object#jestresetmodules
[35]: https://github.com/yargs/yargs/issues/2191
[36]:
  https://github.com/jestjs/jest/blob/e7280a2132f454d5939b22c4e9a7a05b30cfcbe6/packages/jest-util/Readme.md#deepcycliccopy
[37]:
  https://github.com/yargs/yargs/blob/HEAD/docs/api.md#user-content-middlewarecallbacks-applybeforevalidation
[38]: #advanced-usage
[39]: ./docs/modules/index.md#configureexecutionprologue
[40]: https://github.com/yargs/yargs/issues/793#issuecomment-704749472
[41]: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
[42]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases
[43]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#default-commands
[44]: https://yargs.js.org/docs#api-reference-parseargs-context-parsecallback
[45]: https://github.com/yargs/yargs/issues/1137
[46]: https://github.com/yargs/yargs/issues/156
[47]: #execution-flow-diagram
[48]: ./docs/modules/index.md#programmetadata
[49]:
  https://github.com/Xunnamius/black-flag/blob/4e6f51f68d9a0e29ae8e750d53762368e1cfcc67/src/constant.ts#L15-L23
[50]: https://asciiflow.com
[51]: https://github.com/Xunnamius/xunnctl
[52]: https://xkcd.com/1205
[53]:
  https://www.reddit.com/r/ProgrammerHumor/comments/bqzc9m/i_would_rather_spend_hours_making_a_program_to_do
