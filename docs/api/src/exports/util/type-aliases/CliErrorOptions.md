[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / CliErrorOptions

# Type Alias: CliErrorOptions

> **CliErrorOptions** = `object`

Defined in: [src/error.ts:84](https://github.com/Xunnamius/black-flag/blob/b4a32322c214182f04aaa04d9c05f164415f17c8/src/error.ts#L84)

Options available when constructing a new `CliError` object.

## Properties

### cause?

> `optional` **cause**: `ErrorOptions`\[`"cause"`\]

Defined in: [src/error.ts:156](https://github.com/Xunnamius/black-flag/blob/b4a32322c214182f04aaa04d9c05f164415f17c8/src/error.ts#L156)

By default, if an `Error` object is passed to `CliError`, that
`Error` instance will be passed through as `CliError.cause` and that
instance's `Error.message` will be passed through as `CliError.message`.

Use this option to override this default behavior and instead set
`CliError.cause` manually.

***

### dangerouslyFatal?

> `optional` **dangerouslyFatal**: `boolean`

Defined in: [src/error.ts:147](https://github.com/Xunnamius/black-flag/blob/b4a32322c214182f04aaa04d9c05f164415f17c8/src/error.ts#L147)

This option is similar in intent to Yargs's `exitProcess()` function,
except applied more granularly.

Normally, [runProgram](../../functions/runProgram.md) never throws and never calls `process.exit`,
instead setting `process.exitCode` when an error occurs.

However, it is at times prudent to kill Node.js as soon as possible after
error handling happens. For example: the execa library struggles to abort
concurrent subcommand promises in a timely manner, and doesn't prevent them
from dumping output to stdout even after Black Flag has finished executing.
To work around this, we can set `dangerouslyFatal` to `true`, forcing Black
Flag to call `process.exit` immediately after error handling completes.

More generally, enabling `dangerouslyFatal` is a quick way to get rid of
strange behavior that can happen when your microtask queue isn't empty
(i.e. the event loop still has work to do) by the time Black Flag's error
handling code completes. **However, doing this without proper consideration
of _why_ you still have hanging promises and/or other microtasks adding
work to the event loop can lead to faulty/glitchy/flaky software and
heisenbugs.** You will also have to specially handle `process.exit` when
running unit/integration tests and executing command handlers within other
command handlers. Tread carefully.

#### Default

```ts
false
```

***

### showHelp?

> `optional` **showHelp**: `Extract`\<[`ExecutionContext`](ExecutionContext.md)\[`"state"`\]\[`"showHelpOnFail"`\], `object`\>\[`"outputStyle"`\] \| `"default"` \| `boolean`

Defined in: [src/error.ts:117](https://github.com/Xunnamius/black-flag/blob/b4a32322c214182f04aaa04d9c05f164415f17c8/src/error.ts#L117)

If `showHelp` is set to a string that isn't `"default"`, help text will be
sent to stderr. Note that help text is always sent _before this exception
finishes bubbling up to `ConfigureErrorHandlingEpilogue`_.

Specifically, if `showHelp` is set to `"full"`, the full help text will be
sent to stderr, including the entire `usage` string. If set to `"short"`
(or `true`), the same help text will be sent to stderr except only the
first line of usage will be included. In either case, help text will be
sent to stderr regardless of the value of
[ExecutionContext.state.showHelpOnFail](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md#showhelponfail).

Alternatively, if set to `"default"`, the value of
[ExecutionContext.state.showHelpOnFail](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md#showhelponfail)
will be used. And if set to `false`, no help text will be sent to stderr
due to this error regardless of the value of
[ExecutionContext.state.showHelpOnFail](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md#showhelponfail).

Note that, regardless of this `showHelp`, help text is always output when a
parent command is invoked that (1) has one or more child commands and (2)
lacks its own handler implementation or implements a handler that throws
[CommandNotImplementedError](../classes/CommandNotImplementedError.md).

#### Default

```ts
"default"
```

***

### suggestedExitCode?

> `optional` **suggestedExitCode**: `number`

Defined in: [src/error.ts:91](https://github.com/Xunnamius/black-flag/blob/b4a32322c214182f04aaa04d9c05f164415f17c8/src/error.ts#L91)

The exit code that will be returned when the application exits, given
nothing else goes wrong in the interim.

#### Default

```ts
FrameworkExitCode.DefaultError
```
