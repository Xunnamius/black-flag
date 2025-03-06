# Black Flag: Getting Started

What follows is a simple step-by-step guide for building, running, and testing a
brand new CLI tool from scratch. We'll call it: `myctl`.

> There's also a functional [`myctl` demo repository][1]. And you can interact
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
one, and it's always named `index.js`. In vanilla Yargs parlance, this would be
the highest-level "default command".

```text
touch commands/index.js
```

Depending on how you invoke Black Flag (e.g. with Node, Deno, Babel+Node, etc),
command files support a subset of the following extensions in precedence order:
`.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`. To keep things simple, we'll be
using ES modules as `.js` files (note the [type][2] in `package.json`).

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
    [`context.state.initialTerminalWidth`][3] directly in
    [`configureExecutionContext`][4]
- `yargs::exitProcess(false)`
  - Black Flag only sets `process.exitCode` and never calls `process.exit(...)`
- `yargs::help(false)::option('help', { description })`
  - Black Flag supervises all help text generation, so this is just cosmetic
- `yargs::fail(...)`
  - Black Flag uses a custom failure handler
- `yargs::showHelpOnFail(true)`
  - Black Flag uses a custom failure handler
- `yargs::usage(defaultUsageText)`
  - Defaults to \[this]\[34].
  - Note that, as of yargs\@17.7.2, calling `yargs::usage(...)` multiple times
    (such as in [`configureExecutionPrologue`][5]) will concatenate each
    invocation's arguments into one long usage string instead of overwriting
    previous invocations with later ones
- `yargs::version(false)`
  - For the root command,
    `yargs::version(false)::option('version', { description })` is called
    instead

<!-- lint enable list-item-style -->

Most of these defaults can be tweaked or overridden via each command's
[`builder`][6] function, which gives you direct access to the Yargs API. Let's
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
 * export, on the other hand, supports the Yargs DSL for defining positional
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
auto-discovered commands will appear _in [alpha-sort][7] order_ in help text
rather than in insertion order; \[command groupings]\[37] are still respected
and each command's options are still enumerated in insertion order.

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

First, let's install [jest][8]. We'll also create a file to hold our tests.

```shell
npm install --save-dev jest @babel/plugin-syntax-import-attributes
touch test.cjs
```

Since we set our root command to non-strict mode, let's test that it doesn't
throw in the presence of unknown arguments. Let's also test that it exits with
the exit code we expect and sends an expected response to stdout.

Note that we use [`makeRunner`][9] below, which is a factory function that
returns a [curried][10] version of [`runProgram`][11] that is far less tedious
to invoke successively.

> Each invocation of `runProgram()`/`makeRunner()()` configures and runs your
> entire CLI _from scratch_. Other than stuff like [the require cache][12],
> there is no shared state between invocations unless you explicitly make it so.
> This makes testing your commands "in isolation" dead simple and avoids a
> [common Yargs footgun][13].

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

[1]: https://github.com/Xunnamius/black-flag-demo
[2]: https://nodejs.org/api/packages.html#type
[3]: ./docs/util/type-aliases/ExecutionContext.md
[4]: ./docs/index/type-aliases/ConfigureExecutionContext.md
[5]: ./docs/index/type-aliases/ConfigureExecutionPrologue.md
[6]: ./docs/index/type-aliases/Configuration.md#type-declaration
[7]: https://www.npmjs.com/package/alpha-sort
[8]: https://www.npmjs.com/package/jest
[9]: ./docs/util/functions/makeRunner.md
[10]: https://builtin.com/software-engineering-perspectives/currying-javascript
[11]: ./docs/index/functions/runProgram.md
[12]: https://jestjs.io/docs/jest-object#jestresetmodules
[13]: https://github.com/yargs/yargs/issues/2191
