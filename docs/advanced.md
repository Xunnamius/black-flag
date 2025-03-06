# Black Flag: Advanced Usage

## Terminology

|      Term       | Description                                                                                                                                                                                                                                                                                                     |
| :-------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     command     | A "command" is a functional unit associated with a [configuration][103] file and represented internally as a trio of programs: [effector, helper, and router][104]. Further, each command is classified as one of: "pure parent" (root and parent), "parent-child" (parent and child), or "pure child" (child). |
|     program     | A "program" is a yargs instance wrapped in a [`Proxy`][105] granting the instance an expanded set of features. Programs are represented internally by the [`Program`][106] type.                                                                                                                                |
|      root       | The tippy top command in your hierarchy of commands and the entry point for any Black Flag application. Also referred to as the "root command".                                                                                                                                                                 |
| default command | A "default command" is [yargs parlance][107] for the CLI entry point. Technically there is no concept of a "default command" at the Black Flag level, though there is the _root command_.                                                                                                                       |

> Note: you shouldn't need to reach below Black Flag's declarative abstraction
> layer when building your tool. If you feel that you do, consider \[opening a
> new issue]\[x-repo-choose-new-issue]!

Since Black Flag is just a bunch of Yargs instances stacked on top of each other
wearing a trench coat, you can muck around with the internal Yargs instances
directly if you want.

For example, you can retrieve a mapping of all commands known to Black Flag and
their corresponding Yargs instances in the OS-specific order they were
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
   command's actual [`handler`][1] function, generating specific help text
   during errors, and ensuring the final parse result bubbles up to the router
   program.

2. The **helper** (`programs.helper`) programs are responsible for generating
   generic help text as well as first-pass arguments parsing and initial
   validation. Said parse result is used as the `argv` third parameter passed to
   the [`builder`][1] functions of effectors.

3. The **router** (`programs.router`) programs are responsible for proxying
   control to other routers and to helpers, and for ensuring exceptions and
   final parse results bubble up to the root Black Flag execution context
   ([`PreExecutionContext::execute`][2]) for handling.

> See the [flow chart][3] below for a visual overview.

These three programs representing the root command are accessible from the
[`PreExecutionContext::rootPrograms`][2] property. They are also always the
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
[`handler`][1]. They are accessible via the [`programs.effector`][4] property of
each object in [`PreExecutionContext::commands`][2], and can be configured as
one might a typical Yargs instance.

Helpers are "clones" of their respective effectors and are accessible via the
[`programs.helper`][4] property of each object in
[`PreExecutionContext::commands`][2]. These instances have been reconfigured to
address [a couple bugs][5] in Yargs help text output by excluding aliases from
certain output lines and excluding positional arguments from certain others. A
side-effect of this is that only effectors recognize top-level positional
arguments, which isn't a problem Black Flag users have to worry about unless
they're dangerously tampering with these programs directly.

Routers are partially-configured just enough to proxy control to other routers
or to helpers and are accessible via the [`programs.router`][4] property of each
object in [`PreExecutionContext::commands`][2]. They cannot and _must not_ have
any configured strictness or validation logic.

Therefore: if you want to tamper with the program responsible for running a
command's [`handler`][1], operate on the effector program. If you want to tamper
with a command's generic stdout help text, operate on the helper program. If you
want to tamper with validation and parsing, operate on both the helper and
effectors. If you want to tamper with the routing of control between commands,
operate on the router program.

See [the docs][6] for more details on Black Flag's internals.

Motivation

Rather than chain singular Yargs instances together, the delegation of
responsibility between helper and effectors facilitates the double-parsing
necessary for [dynamic options][7] support. In implementing dynamic options,
Black Flag accurately parses the given arguments with the helper program on the
first pass and feeds the result to the [`builder`][1] function of the effector
on the second pass (via [`builder`'s new third parameter][7]).

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

With vanilla Yargs's strict mode, attempting to meet these guarantees would
require disallowing any arguments unrecognized by the Yargs instances earlier in
the chain, even if the instances down-chain _do_ recognize said arguments. This
would break Black Flag's support for deep "chained" command hierarchies
entirely.

However, without vanilla Yargs's strict mode, attempting to meet these
guarantees would require allowing attempts to invoke non-existent child commands
without throwing an error or throwing the wrong/confusing error. Worse, it would
require a more rigid set of assumptions for the Yargs instances, meaning some
API features would be unnecessarily disabled. This would result in a deeply
flawed experience for developers and users.

Hence the need for a distinct _routing program_ which allows parent commands to
recursively chain/route control to child commands in your hierarchy even when
ancestor commands are not aware of the syntax accepted by their distant
descendants—while still properly throwing an error when the end user tries to
invoke a child command that does not exist or invoke a child command with
gibberish arguments.

Generating Help Text

Effectors are essentially Yargs instances with a registered [default
command][8]. Unfortunately, when vanilla Yargs is asked to generate help text
for a default command that has aliases and/or top-level positional arguments,
you get the following:

![Vanilla Yargs parseAsync help text example][9]

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

![Black Flag runProgram help text example][10]

> Note 1: in this example, `runProgram` is a function returned by
> [`makeRunner`][11].

> Note 2: in the above image, the first line under "Commands:" is the root
> command. In more recent versions of Black Flag, the root command is omitted
> from the list of sub-commands.

## Execution Flow Diagram

What follows is a flow diagram illustrating Black Flag's execution flow using
the `myctl` example from [`README.md`][108].

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

> The ascii art diagram was built using [https://asciiflow.com][109]

[1]: ./docs/index/type-aliases/Configuration.md#type-declaration
[2]: ./docs/util/type-aliases/PreExecutionContext.md
[3]: #execution-flow-diagram
[4]: ./docs/util/type-aliases/ProgramMetadata.md
[5]: #irrelevant-differences
[6]: api
[7]: #built-in-support-for-dynamic-options-
[8]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#default-commands
[9]: ./images/example-1.png
[10]: ./images/example-2.png
[11]: ./docs/util/functions/makeRunner.md
[103]: ./docs/index/type-aliases/Configuration.md
[104]: #advanced-usage
[105]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[106]: ./docs/util/type-aliases/Program.md
[107]:
  https://github.com/yargs/yargs/blob/main/docs/advanced.md#default-commands
[108]: ./README.md
[109]: https://asciiflow.com
