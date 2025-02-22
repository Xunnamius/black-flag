<!-- symbiote-template-region-start 1 -->

# 📐 Project Architecture

Before continuing with this document, see the document on the [generic project
architecture][1] expected by projects (like this repository) that leverage
[symbiote][2].

What follows are any notable additions and/or deviations from the aforementioned
document.

<br />

---

<br />

<!-- symbiote-template-region-end -->

## Terminology

|      Term       | Description                                                                                                                                                                                                                                                                                                   |
| :-------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     command     | A "command" is a functional unit associated with a [configuration][27] file and represented internally as a trio of programs: [effector, helper, and router][42]. Further, each command is classified as one of: "pure parent" (root and parent), "parent-child" (parent and child), or "pure child" (child). |
|     program     | A "program" is a yargs instance wrapped in a [`Proxy`][43] granting the instance an expanded set of features. Programs are represented internally by the [`Program`][44] type.                                                                                                                                |
|      root       | The tippy top command in your hierarchy of commands and the entry point for any Black Flag application. Also referred to as the "root command".                                                                                                                                                               |
| default command | A "default command" is [yargs parlance][45] for the CLI entry point. Technically there is no concept of a "default command" at the Black Flag level, though there is the _root command_.                                                                                                                      |

## Execution Flow Diagram

What follows is a flow diagram illustrating Black Flag's execution flow using
the `myctl` example from [`README.md`](./README.md).

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

> The ascii art diagram was built using
> [https://asciiflow.com](https://asciiflow.com)

[1]: https://github.com/Xunnamius/symbiote/wiki/Generic-Project-Architecture
[2]: https://github.com/Xunnamius/symbiote
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
[63]: https://xkcd.com/1205
[64]:
  https://www.reddit.com/r/ProgrammerHumor/comments/bqzc9m/i_would_rather_spend_hours_making_a_program_to_do
