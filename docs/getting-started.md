# Black Flag: Getting Started

What follows is a simple step-by-step guide for building, running, and testing a
brand new CLI tool from scratch. We shall call our new invention `myctl`.

> [!TIP]
>
> There's also a functional [`myctl` demo repository][1]. And you can interact
> with the published version on NPM: `npx -p @black-flag/demo myctl --help`.

This guide is split into two main sections:

<!-- remark-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Building and Running Your CLI](#building-and-running-your-cli)
- [Testing Your CLI](#testing-your-cli)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- remark-ignore-end -->

<br />

## Building and Running Your CLI

Let's make a new CLI project!

> [!TIP]
>
> What follows are linux shell commands. The equivalent Windows DOS/PS commands
> will be different.

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

> [!IMPORTANT]
>
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
one, it lives at the apex of our commands directory, and it's always named
`index.js` (or `index.mjs`, `index.cjs`, `index.ts`, `index.mts`, `index.cts`).
In vanilla Yargs parlance, this would be the highest-level "default command".

```text
touch commands/index.js
```

Depending on how you invoke Black Flag (e.g. with Node, Deno, Babel+Node, etc),
all discoverable command files support a subset of the following extensions in
precedence order: `.js`, `.mjs`, `.cjs`, `.ts` (but _not_ `.d.ts`), `.mts`,
`.cts`. To keep things simple, we'll be using ES modules as `.js` files; note
the [`"type"`][2] property in `package.json`.

Also note that empty files, and files that do not export a [`handler`][3]
function or custom [`command`][4] string, are picked up by Black Flag as
unfinished or "unimplemented" commands. They will still appear in help text but,
when invoked, will either (1) output an error message explaining that the
command is not implemented if said command has no sub-commands or (2) output
help text for the command if said command has one or more sub-commands.

This means you can stub out a complex CLI in thirty seconds: just name your
directories and empty files accordingly!

With that in mind, let's actually run our skeletal CLI now:

```shell
./cli.js
```

```text
This command is currently unimplemented
```

Let's try with a bad positional parameter:

```shell
./cli.js bad
```

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
    [`ExecutionContext::state.initialTerminalWidth`][5] directly in
    [`configureExecutionContext`][6]
- `yargs::exitProcess(false)`
  - Black Flag only sets `process.exitCode` and never calls `process.exit(...)`
- `yargs::help(false)::option('help', { description })`
  - Black Flag supervises all help text generation, so this is just cosmetic
- `yargs::fail(...)`
  - Black Flag uses a custom failure handler
- `yargs::showHelpOnFail('short')`
  - All errors will be reported to the user alongside help text by default. This
    can be tweaked by updating [`ExecutionContext::state.showHelpOnFail`][7]
    directly in [`configureExecutionContext`][6], or by calling Black Flag's
    custom [`showHelpOnFail`][7] implementation (it overrides
    `yargs::showHelpOnFail`) in a builder or elsewhere
- `yargs::usage(defaultUsageText)`
  - Defaults to [this][8].
  - Note that, as of yargs\@17.7.2, calling `yargs::usage("...")` multiple times
    (such as in [`configureExecutionPrologue`][9]) will concatenate each
    invocation's arguments into one long usage string (delimited by newlines).
    To work around this for "short" versus "full" help text output, we use
    `yargs::usage(null)` to reset the current usage text.
- `yargs::version(false)`
  - For the root command,
    `yargs::version(false)::option('version', { description })` is called
    instead

<!-- lint enable list-item-style -->

Most of these defaults can be tweaked or overridden via each command's
[`builder`][10] function, which gives you direct access to the Yargs API. Let's
add one to `commands/index.js` along with a [`handler`][3] function and
[`usage`][11] string:

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
 * export, on the other hand, supports the Yargs DSL for defining positional
 * parameters and the like.
 *
 * @type {import('@black-flag/core').RootConfiguration['usage']}
 */
export const usage = 'Usage: $0 command [options]\n\nCustom description here.';
```

> [!TIP]
>
> The Yargs DSL for declaring and defining positional parameters is described
> in-depth [here][12].

> [!TIP]
>
> Looking for more in-depth examples? Check out [`examples/`][13] for a
> collection of recipes solving all sorts of common CLI tasks using Black Flag,
> including leveraging TypeScript and reviewing various different ways to define
> command modules.

Now let's run the CLI again:

```shell
./cli.js
```

```text
ran root command handler
```

And with a "bad" argument (we're no longer in strict mode):

```shell
./cli.js --bad --bad2 --bad3
```

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

Well, that was easy. Let's run our CLI now:

```shell
./cli.js --help
```

```text
Usage: myctl command [options]

Custom description here.

Commands:
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

```text
Usage: myctl remote

Commands:
  myctl remote add
  myctl remote remove
  myctl remote show

Options:
  --help  Show help text                                               [boolean]
```

Since different OSes walk different filesystems in different orders,
auto-discovered commands will appear _in [natural sort][14] order_ in help text
rather than in insertion order; [command groupings][15] are still respected and
each command's options are still enumerated in insertion order.

> [!TIP]
>
> Black Flag offers a stronger sorting guarantee than
> `yargs::parserConfiguration({ 'sort-commands': true })`.

Now let's try a grandchild command:

```shell
./cli.js remote show --help
```

```text
Usage: myctl remote show

Options:
  --help  Show help text                                               [boolean]
```

Phew. Alright, but what about trying some commands we know _don't_ exist?

```shell
./cli.js remote bad horrible
```

```text
Usage: myctl remote

Commands:
  myctl remote add
  myctl remote remove
  myctl remote show

Options:
  --help  Show help text                                               [boolean]

Invalid command: you must call this command with a valid sub-command argument
```

Neat! 📸

## Testing Your CLI

Testing if your CLI tool works by running it manually on the command line is
nice and all, but if we're serious about building a stable and usable tool,
we'll need some automated tests.

Thankfully, with Black Flag, testing your commands is usually easier than
writing them.

First, let's install [jest][16]. We'll also create a file to hold our tests.

```shell
npm install --save-dev jest @babel/plugin-syntax-import-attributes
touch test.cjs
```

Since we set our root command to non-strict mode, let's test that it doesn't
throw in the presence of unknown arguments. Let's also test that it exits with
the exit code we expect and sends an expected response to stdout.

Note that we use [`makeRunner`][17] below, which is a factory function that
returns a [curried][18] version of [`runProgram`][19] that is far less tedious
to invoke successively.

> [!NOTE]
>
> Each invocation of `runProgram()`/`makeRunner()()` configures and runs your
> entire CLI _from scratch_. Other than stuff like [the require cache][20],
> there is no shared state between invocations unless you explicitly make it so.
> This makes testing your commands "in isolation" dead simple and avoids a
> [common Yargs footgun][21].

```javascript
const { makeRunner } = require('@black-flag/core/util');

// makeRunner is a factory function that returns runProgram functions with
// curried arguments.
const run = makeRunner({ commandModulesPath: `${__dirname}/commands` });

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

> [!TIP]
>
> In our tests above, we took a [behavior-driven approach][22] and tested for
> errors by looking at what `console.error` should be outputting. This is how
> users of our CLI will experience errors too, making this the ideal testing
> approach in many cases. [`runProgram`][19]/[`makeRunner`][17] are configured
> for this approach out of the box in that they **never throw/reject, even when
> an error occurs**. Instead, they trigger [the configured error handling
> behavior][23] (which defaults to `console.error`), which is what our tests
> check for.
>
> However, in many other cases, a purely [test-driven approach][24] is required,
> where we're not so interested in what the user should experience but in the
> nature of the failure itself. To support this, [`makeRunner`][17] supports the
> [`errorHandlingBehavior`][25] option. Setting `errorHandlingBehavior` to
> `"throw"` will cause your curried runner functions to throw/reject _in
> addition to_ triggering the configured error handling behavior.
>
> It's up to you to choose which approach is best.

Finally, let's run our tests:

```shell
NODE_OPTIONS='--no-warnings --experimental-vm-modules' npx jest --testMatch '**/test.cjs' --restoreMocks
```

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

> [!IMPORTANT]
>
> As of March 2025, we need to use `NODE_OPTIONS='--experimental-vm-modules'`
> until [the Node team unflags virtual machine module support][26] in a future
> version.

> [!TIP]
>
> We use [`--restoreMocks`][27] to ensure mock state doesn't leak between tests.
> We use [`--testMatch '**/test.cjs'`][28] to make Jest see our CJS files.

Neat! 📸

<!-- symbiote-template-region-start 5 -->

[1]: https://github.com/Xunnamius/black-flag-demo
[2]: https://nodejs.org/api/packages.html#type
[3]: ./api/src/exports/type-aliases/Configuration.md#handler
[4]: ./api/src/exports/type-aliases/Configuration.md#command
[5]:
  ./api/src/exports/util/type-aliases/ExecutionContext.md#initialterminalwidth
[6]: ./api/src/exports/type-aliases/ConfigureExecutionContext.md
[7]: ./api/src/exports/util/type-aliases/ExecutionContext.md#showhelponfail
[8]:
  https://github.com/Xunnamius/black-flag/blob/fc0b42b7afe725aa3834fb3c5f83dd02223bbde7/src/constant.ts#L13
[9]: ./api/src/exports/type-aliases/ConfigureExecutionPrologue.md
[10]: ./api/src/exports/type-aliases/Configuration.md#builder
[11]: ./api/src/exports/type-aliases/Configuration.md#usage
[12]:
  https://github.com/yargs/yargs/blob/main/docs/advanced.md#positional-arguments
[13]: ../examples/README.md
[14]: https://en.wikipedia.org/wiki/Natural_sort_order
[15]: https://yargs.js.org/docs#api-reference-groupkeys-groupname
[16]: https://www.npmjs.com/package/jest
[17]: ./api/src/exports/util/functions/makeRunner.md
[18]: https://en.wikipedia.org/wiki/Currying
[19]: ./api/src/exports/functions/runProgram.md
[20]: https://jestjs.io/docs/jest-object#jestresetmodules
[21]: https://github.com/yargs/yargs/issues/2191
[22]: https://en.wikipedia.org/wiki/Behavior-driven_development
[23]: ./api/src/exports/type-aliases/ConfigureErrorHandlingEpilogue.md
[24]: https://en.wikipedia.org/wiki/Test-driven_development
[25]:
  ./api/src/exports/util/type-aliases/MakeRunnerOptions.md#errorhandlingbehavior
[26]: https://github.com/nodejs/node/issues/37648
[27]: https://jestjs.io/docs/configuration#restoremocks-boolean
[28]: https://jestjs.io/docs/configuration#testmatch-arraystring
