[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / CommandNotImplementedError

# Class: CommandNotImplementedError

Defined in: [src/error.ts:201](https://github.com/Xunnamius/black-flag/blob/5e1e5b553c79657a97e5923bcba77a292781de9e/src/error.ts#L201)

Represents trying to execute a CLI command that has not yet been implemented.

## Extends

- [`CliError`](../../classes/CliError.md)

## Constructors

### new CommandNotImplementedError()

> **new CommandNotImplementedError**(`error`?, `options`?): [`CommandNotImplementedError`](CommandNotImplementedError.md)

Defined in: [src/error.ts:208](https://github.com/Xunnamius/black-flag/blob/5e1e5b553c79657a97e5923bcba77a292781de9e/src/error.ts#L208)

Represents trying to execute a CLI command that has not yet been
implemented.

#### Parameters

##### error?

`Error`

##### options?

[`CliErrorOptions`](../type-aliases/CliErrorOptions.md)

#### Returns

[`CommandNotImplementedError`](CommandNotImplementedError.md)

#### Overrides

[`CliError`](../../classes/CliError.md).[`constructor`](../../classes/CliError.md#constructors)

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

Defined in: [src/error.ts:203](https://github.com/Xunnamius/black-flag/blob/5e1e5b553c79657a97e5923bcba77a292781de9e/src/error.ts#L203)

#### Overrides

[`CliError`](../../classes/CliError.md).[`[$type]`](../../classes/CliError.md#$type)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

[`CliError`](../../classes/CliError.md).[`cause`](../../classes/CliError.md#cause)

***

### dangerouslyFatal

> **dangerouslyFatal**: `boolean` = `false`

Defined in: [src/error.ts:144](https://github.com/Xunnamius/black-flag/blob/5e1e5b553c79657a97e5923bcba77a292781de9e/src/error.ts#L144)

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

#### Inherited from

[`CliError`](../../classes/CliError.md).[`dangerouslyFatal`](../../classes/CliError.md#dangerouslyfatal)

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

[`CliError`](../../classes/CliError.md).[`message`](../../classes/CliError.md#message-1)

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

[`CliError`](../../classes/CliError.md).[`name`](../../classes/CliError.md#name)

***

### showHelp

> **showHelp**: `undefined` \| `boolean` \| `"full"` \| `"short"` \| `"default"`

Defined in: [src/error.ts:143](https://github.com/Xunnamius/black-flag/blob/5e1e5b553c79657a97e5923bcba77a292781de9e/src/error.ts#L143)

If truthy, help text will be sent to stderr _before this exception finishes
bubbling_.

Specifically, if `showHelp` is set to `"full"`, the full help text will be
sent to stderr, including the entire `usage` string. If set to `"short"`
(or `true`), the same help text will be sent to stderr except only the
first line of usage will be included. If set to `"default"`, the value of
`ExecutionContext::state.showHelpOnFail` will be used. If set to
`false` (the default), no help text will be sent to stderr related to this
error.

#### Default

```ts
false
```

#### Inherited from

[`CliError`](../../classes/CliError.md).[`showHelp`](../../classes/CliError.md#showhelp)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`CliError`](../../classes/CliError.md).[`stack`](../../classes/CliError.md#stack)

***

### suggestedExitCode

> **suggestedExitCode**: [`FrameworkExitCode`](../../enumerations/FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

Defined in: [src/error.ts:142](https://github.com/Xunnamius/black-flag/blob/5e1e5b553c79657a97e5923bcba77a292781de9e/src/error.ts#L142)

The exit code that will be returned when the application exits, given
nothing else goes wrong in the interim.

#### Default

```ts
FrameworkExitCode.DefaultError
```

#### Inherited from

[`CliError`](../../classes/CliError.md).[`suggestedExitCode`](../../classes/CliError.md#suggestedexitcode)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`CliError`](../../classes/CliError.md).[`prepareStackTrace`](../../classes/CliError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`CliError`](../../classes/CliError.md).[`stackTraceLimit`](../../classes/CliError.md#stacktracelimit)

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

[`CliError`](../../classes/CliError.md).[`captureStackTrace`](../../classes/CliError.md#capturestacktrace)
