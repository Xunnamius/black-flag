# Black Flag: Differences Versus Vanilla Yargs

> Note that Yargs is a _dependency_ of Black Flag. Black Flag is _not_ a fork of
> Yargs!

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
  > \[Jest does so whenever you use certain asymmetric matchers]\[46].

  Regardless, you should never have to reach below Black Flag's abstraction over
  Yargs to call methods like `yargs::parse`, `yargs::parseAsync`, `yargs::argv`,
  etc. Instead, just [use Black Flag as intended][1].

  Therefore, this is effectively a non-issue with proper declarative use of
  Black Flag.

- Yargs \[middleware]\[47] isn't supported since the functionality is mostly
  covered by configuration hooks ~~and I didn't notice Yargs had this feature
  until after I wrote Black Flag~~.

  If you have a Yargs middleware function you want run with a specific command,
  either pass it to `yargs::middleware` via that command's [`builder`][2]
  function or just call the middleware function right then and there. If you
  want the middleware to apply globally, invoke the function directly in
  [`configureArguments`][3]. If neither solution is desirable, you can also
  [muck around with][4] the relevant Yargs instances manually in
  [`configureExecutionPrologue`][5].

- By default, Black Flag enables the `--help` and `--version` options same as
  vanilla Yargs. However, since vanilla Yargs [lacks the ability][6] to modify
  or remove options added by `yargs::option`, calling
  `yargs::help`/`yargs::version` will throw. If you require the functionality of
  `yargs::help`/`yargs::version` to disable or modify the `--help`/`--version`
  option, update
  [`context.state.globalHelpOption`][7]/[`context.state.globalVersionOption`][7]
  directly in [`configureExecutionContext`][8].

  > Note: Black Flag enables built-in help and version _options_, never a help
  > or version _command_.

  > Note: only the root command has default support for the built-in `--version`
  > option. Calling `--version` on a child command will have no effect unless
  > you make it so. This dodges [another Yargs footgun][9], and setting
  > [`context.state.globalVersionOption = undefined`][7] will prevent Yargs from
  > clobbering any custom version arguments on the root command too.

## Irrelevant Differences

- A [bug][10] in yargs\@17.7.2 prevents `yargs::showHelp`/`--help` from printing
  anything when using an async [`builder`][2] function (or promise-returning
  function) for a [default command][11].

  Black Flag addresses this with its types, in that attempting to pass an async
  builder will be flagged as problematic by intellisense. Moreover, Black Flag
  supports an asynchronous function as the value of `module.exports` in CJS
  code, and top-level await in ESM code, so if you really do need an async
  [`builder`][2] function, [hoist][12] the async logic to work around this bug
  for now.

- A [bug?][13] in yargs\@17.7.2 causes `yargs::showHelp` to erroneously print
  the _second_ element in the [`aliases`][14] array of the [default command][11]
  when said command also has child commands.

  Black Flag addresses this by using a "helper" program to generate help text
  [more consistently][13] than vanilla Yargs. For instance, the default help
  text for a Black Flag command includes the full [`command`][2] and
  [`description`][2] strings while the commands under `"Commands:"` are listed
  in alpha-sort order as their full canonical names _only_; unlike vanilla
  Yargs, no positional arguments or aliases will be confusingly mixed into help
  text output unless you [make it so][4].

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
  Extensions][15] (BFE) can.

  Specifically: BFE will throw if you attempt to add a command option with a
  name or alias that conflicts another of that command's options. BFE also takes
  into account the following [yargs-parser settings][16] configuration settings:
  `camel-case-expansion`, `strip-aliased`, `strip-dashed`. See [BFE's
  documentation][15] for details.

- Unfortunately, yargs\@17.7.2 [doesn't really support][17] calling
  `yargs::parse` or `yargs::parseAsync` [multiple times on the same
  instance][18] if it's using the commands-based API. This might be a regression
  since, [among other things][19], there are comments within Yargs's source that
  indicate these functions were intended to be called multiple times.

  Black Flag addresses this in two ways. First, the [`runProgram`][1] helper
  takes care of state isolation for you, making it safe to call
  [`runProgram`][1] multiple times. Easy peasy. Second,
  [`PreExecutionContext::execute`][20] (the wrapper around `yargs::parseAsync`)
  will throw if invoked more than once.

- One of Black Flag's features is simple comprehensive error reporting via the
  [`configureErrorHandlingEpilogue`][21] configuration hook. Therefore, the
  `yargs::showHelpOnFail` method will ignore the redundant "message" parameter.
  If you want that functionality, use said hook to output an epilogue after
  Yargs outputs an error message, or use `yargs::epilogue`/`yargs::example`.
  Also, any invocation of `yargs::showHelpOnFail` applies globally to all
  commands in your hierarchy.

- Since every auto-discovered command translates [into its own Yargs
  instances][4], the [`command`][2] property, if exported by your command
  file(s), must start with `"$0"` or an error will be thrown. This is also
  enforced by intellisense.

- The `yargs::check`, `yargs::global`, and `yargs::onFinishCommand` methods,
  while they may work as expected on commands and their direct child commands,
  will not function "globally" across your entire command hierarchy since [there
  are several _distinct_ Yargs instances in play when Black Flag executes][4].

  If you want a uniform check or so-called "global" argument to apply to every
  command across your entire hierarchy, the "Black Flag way" would be to just
  use normal JavaScript instead: export a shared [`builder`][2] function from a
  utility file and call it in each of your command files. If you want something
  fancier than that, you can leverage [`configureExecutionPrologue`][5] to call
  `yargs::global` or `yargs::check` by hand.

  Similarly, `yargs::onFinishCommand` should only be called when the `argv`
  parameter in [`builder`][2] is not `undefined` (i.e. only on [effector
  programs][4]). This would prevent the callback from being executed twice.
  Further, the "Black Flag way" would be to ditch `yargs::onFinishCommand`
  entirely and use plain old JavaScript and/or the
  [`configureExecutionPrologue`][5] configuration hook instead.

- Since Black Flag is built from the ground up to be asynchronous, calling
  `yargs::parseSync` will throw immediately. You shouldn't be calling the
  `yargs::parseX` functions directly anyway.

- Black Flag sets several defaults compared to vanilla Yargs. These defaults are
  detailed in the [Usage section][22].

[1]: ./docs/index/functions/runProgram.md
[2]: ./docs/index/type-aliases/Configuration.md#type-declaration
[3]: ./docs/index/type-aliases/ConfigureArguments.md
[4]: #advanced-usage
[5]: ./docs/index/type-aliases/ConfigureExecutionPrologue.md
[6]: https://github.com/yargs/yargs/issues/733
[7]: ./docs/util/type-aliases/ExecutionContext.md
[8]: ./docs/index/type-aliases/ConfigureExecutionContext.md
[9]: https://github.com/yargs/yargs/issues/1323
[10]: https://github.com/yargs/yargs/issues/793#issuecomment-704749472
[11]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#default-commands
[12]: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
[13]: #generating-help-text
[14]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases
[15]: https://github.com/Xunnamius/black-flag-extensions
[16]: https://github.com/yargs/yargs-parser?tab=readme-ov-file#configuration
[17]: https://github.com/yargs/yargs/issues/2191
[18]: https://yargs.js.org/docs#api-reference-parseargs-context-parsecallback
[19]: https://github.com/yargs/yargs/issues/1137
[20]: ./docs/util/type-aliases/PreExecutionContext.md
[21]: ./docs/index/type-aliases/ConfigureErrorHandlingEpilogue.md
[22]: #building-and-running-your-cli
