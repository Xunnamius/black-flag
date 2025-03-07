[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / CliErrorOptions

# Type Alias: CliErrorOptions

> **CliErrorOptions**: `object`

Defined in: [src/error.ts:73](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/error.ts#L73)

Options available when constructing a new `CliError` object.

## Type declaration

### cause?

> `optional` **cause**: `ErrorOptions`\[`"cause"`\]

By default, if an `Error` object is passed to `CliError`, that
`Error` instance will be passed through as `CliError.cause` and that
instance's `Error.message` will be passed through as `CliError.message`.

Use this option to override this default behavior and instead set
`CliError.cause` manually.

### dangerouslyFatal?

> `optional` **dangerouslyFatal**: `boolean`

This option is similar in intent to yargs's `exitProcess()` function,
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

### showHelp?

> `optional` **showHelp**: `boolean`

If `true`, help text will be sent to stderr _before this exception finishes
bubbling_. Where the exception is thrown will determine which instance is
responsible for error text generation.

#### Default

```ts
false
```

### suggestedExitCode?

> `optional` **suggestedExitCode**: `number`

The exit code that will be returned when the application exits, given
nothing else goes wrong in the interim.

#### Default

```ts
FrameworkExitCode.DefaultError
```
