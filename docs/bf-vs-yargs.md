# Black Flag: Differences Versus Vanilla Yargs

Aside from the expanded feature set, there are some minor differences between
Yargs and Black Flag. They should not be relevant given proper use of Black
Flag, but are noted below nonetheless.

## Minor Differences

- The `yargs::argv` magic property is soft-disabled (always returns `undefined`)
  because having such an expensive "hot" getter is not optimal in a language
  where properties can be accessed unpredictably. For instance, deep cloning a
  Yargs instance results in `yargs::parse` (_and the handlers of any registered
  commands!_) getting invoked several times, _even after an error occurred in an
  earlier invocation_. This can lead to undefined or even dangerous behavior.

  > Who in their right mind is out here cloning Yargs instances, you may ask?
  > [Jest does so whenever you use certain asymmetric matchers][1].

  Regardless, you should never have to reach below Black Flag's abstraction over
  Yargs to call methods like `yargs::parse`, `yargs::parseAsync`, `yargs::argv`,
  etc. Instead, just [use Black Flag as intended][2].

  Therefore, this is effectively a non-issue with proper declarative use of
  Black Flag.

- Yargs [middleware][3] isn't supported since the functionality is mostly
  covered by configuration hooks ~~and I didn't notice Yargs had this feature
  until after I wrote Black Flag~~.

  If you have a Yargs middleware function you want run with a specific command,
  pass it to `yargs::middleware` via that command's [`builder`][4] function. If
  you have a middleware function you want to apply across all commands, invoke
  it in [`configureArguments`][5]. If neither solution is desirable, you can
  also [muck around with][6] the relevant Yargs instances manually in
  [`configureExecutionPrologue`][7].

- By default, Black Flag enables the `--help` and `--version` options same as
  vanilla Yargs. However, since vanilla Yargs [lacks the ability][8] to modify
  or remove options added by `yargs::option`, calling
  `yargs::help`/`yargs::version` will throw. If you require the functionality of
  `yargs::help`/`yargs::version` to disable or modify the `--help`/`--version`
  option, update
  [`ExecutionContext::state.globalHelpOption`][9]/[`ExecutionContext::state.globalVersionOption`][10]
  directly in [`configureExecutionContext`][11].

  > [!NOTE]
  >
  > Black Flag enables built-in help and version _options_, never a help or
  > version _command_.

  > [!NOTE]
  >
  > Only the root command support the built-in `--version` option. Calling
  > `--version` on a child command will have no effect unless you make it so.
  > This dodges [another Yargs footgun][12], and setting
  > [`ExecutionContext::state.globalVersionOption = undefined`][10] will prevent
  > Yargs from clobbering any custom version arguments on the root command too.

## Irrelevant Differences

- A [bug][13] in yargs\@17.7.2 prevents `yargs::showHelp`/`--help` from printing
  anything when using an async [`builder`][4] function (or promise-returning
  function) for a [Yargs default command][14].

  Black Flag addresses this with its types, in that attempting to pass an async
  builder will be flagged as problematic by intellisense. Moreover, Black Flag
  supports an asynchronous function as the value of `module.exports` in CJS
  code, and top-level await in ESM code, so if you really do need an async
  [`builder`][4] function, hoist the async logic to work around this bug for
  now.

- A [bug?][15] in yargs\@17.7.2 causes `yargs::showHelp` to erroneously print
  the _second_ element in the [`yargs::aliases`][16] array of the [Yargs default
  command][14] when said command also has child commands.

  Black Flag addresses this by using a "helper" program to generate help text
  [more consistently][15] than vanilla Yargs. For instance, the default help
  text for a Black Flag command includes the full [`command`][17] and
  [`description`][18] strings while the commands under `"Commands:"` are listed
  in alpha-sort order as their full canonical names _only_; unlike vanilla
  Yargs, no positional arguments or aliases will be confusingly mixed into help
  text output unless you [make it so][6].

- As of yargs\@17.7.2, attempting to add two sibling commands with the exact
  same name causes all sorts of runtime insanity, especially if the commands
  also have aliases.

  Black Flag prevents you from shooting yourself in the foot with this.
  Specifically: Black Flag will throw if you attempt to add a command with a
  name or alias that conflicts with its sibling commands' name or alias.

- As of yargs\@17.7.2, and similar to the above point, attempting to add two
  options with conflicting names/aliases to the same command leads to undefined
  and potentially dangerous runtime behavior from Yargs.

  Unfortunately, since Yargs allows adding options through a wide variety of
  means, Black Flag cannot protect you from this footgun. However, [Black Flag
  Extensions][19] (BFE) can.

  Specifically: BFE will throw if you attempt to add a command option with a
  name or alias that conflicts another of that command's options. BFE also takes
  into account the following [yargs-parser settings][20] configuration settings:
  `camel-case-expansion`, `strip-aliased`, `strip-dashed`. See [BFE's
  documentation][19] for details.

- Unfortunately, yargs\@17.7.2 [doesn't really support][21] calling
  `yargs::parse` or `yargs::parseAsync` multiple times on the same instance if
  it's using the commands-based API. This might be a regression since, [among
  other things][22], there are comments within Yargs's source that indicate
  these functions were intended to be called multiple times.

  Black Flag addresses this in two ways. First, the [`runProgram`][2] helper
  takes care of state isolation for you, making it safe to call
  [`runProgram`][2] multiple times. Easy peasy. Second,
  [`PreExecutionContext::execute`][23] (the wrapper around `yargs::parseAsync`)
  will throw if invoked more than once.

- One of Black Flag's features is simple comprehensive error reporting via the
  [`configureErrorHandlingEpilogue`][24] configuration hook. Therefore, Black
  Flag's overridden version of the `yargs::showHelpOnFail` method will ignore
  the redundant "message" parameter. If you want that functionality, use said
  hook to output an epilogue after Yargs outputs an error message, or use
  `yargs::epilogue`/`yargs::example`.

  Also, any invocation of Black Flag's `yargs::showHelpOnFail` method applies
  globally to all commands in your hierarchy; internally, the method is just
  updating [`ExecutionContext::state.showHelpOnFail`][25].

- Since every auto-discovered command translates [into its own Yargs
  instances][6], the [`command`][17] property, if exported by your command
  file(s), must start with `"$0"` or an error will be thrown. This is also
  enforced by intellisense.

- The `yargs::check`, `yargs::global`, and `yargs::onFinishCommand` methods,
  while they may work as expected on commands and their direct child commands,
  will not function "globally" across your entire command hierarchy since [there
  are several _distinct_ Yargs instances in play when Black Flag executes][6].

  If you want a uniform check or so-called "global" argument to apply to every
  command across your entire hierarchy, the "Black Flag way" would be to just
  use normal JavaScript instead: export a shared [`builder`][4] function (or
  high-order function) from a utility file and call it in each of your command
  files. If you want something fancier than that, you can leverage
  [`configureExecutionPrologue`][7] to call `yargs::global` or `yargs::check` by
  hand.

  Similarly, `yargs::onFinishCommand` should only be called when the `argv`
  parameter in [`builder`][4] is not `undefined` (i.e. only on [effector
  programs][6]). This would prevent the callback from being executed twice.
  Further, the "Black Flag way" would be to ditch `yargs::onFinishCommand`
  entirely and use plain old JavaScript and/or the
  [`configureExecutionPrologue`][7] configuration hook instead.

- Since Black Flag is built from the ground up to be asynchronous, calling
  `yargs::parseSync` will throw immediately. You shouldn't be calling the
  `yargs::parseX` functions directly anyway.

- Black Flag sets several defaults compared to vanilla Yargs. These defaults are
  detailed [here][26].

[1]:
  https://github.com/jestjs/jest/blob/e7280a2132f454d5939b22c4e9a7a05b30cfcbe6/packages/jest-util/Readme.md#deepcycliccopy
[2]: ./api/src/exports/functions/runProgram.md
[3]:
  https://github.com/yargs/yargs/blob/HEAD/docs/api.md#user-content-middlewarecallbacks-applybeforevalidation
[4]: ./api/src/exports/type-aliases/Configuration.md#builder
[5]: ./api/src/exports/type-aliases/ConfigureArguments.md
[6]: ./advanced.md
[7]: ./api/src/exports/type-aliases/ConfigureExecutionPrologue.md
[8]: https://github.com/yargs/yargs/issues/733
[9]:
  ./api/src/exports/util/type-aliases/ExecutionContext.md#stateglobalhelpoption
[10]:
  ./api/src/exports/util/type-aliases/ExecutionContext.md#stateglobalversionoption
[11]: ./api/src/exports/type-aliases/ConfigureExecutionContext.md
[12]: https://github.com/yargs/yargs/issues/1323
[13]: https://github.com/yargs/yargs/issues/793#issuecomment-704749472
[14]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#default-commands
[15]: advanced.md#generating-help-text
[16]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases
[17]: ./api/src/exports/type-aliases/Configuration.md#command
[18]: ./api/src/exports/type-aliases/Configuration.md#description
[19]: ../packages/extensions/README.md
[20]: https://github.com/yargs/yargs-parser?tab=readme-ov-file#configuration
[21]: https://github.com/yargs/yargs/issues/2191
[22]: https://github.com/yargs/yargs/issues/1137
[23]: ./api/src/exports/util/type-aliases/PreExecutionContext.md#execute
[24]: ./api/src/exports/type-aliases/ConfigureErrorHandlingEpilogue.md
[25]:
  ./api/src/exports/util/type-aliases/ExecutionContext.md#stateshowhelponfail
[26]: ./getting-started.md#building-and-running-your-cli
