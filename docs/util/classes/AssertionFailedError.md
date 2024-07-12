[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / AssertionFailedError

# Class: AssertionFailedError

Represents a failed sanity check.

## Extends

- [`CliError`](../../index/classes/CliError.md)

## Constructors

### new AssertionFailedError()

> **new AssertionFailedError**(`message`): [`AssertionFailedError`](AssertionFailedError.md)

Represents a failed sanity check.

#### Parameters

• **message**: `string`

#### Returns

[`AssertionFailedError`](AssertionFailedError.md)

#### Overrides

[`CliError`](../../index/classes/CliError.md).[`constructor`](../../index/classes/CliError.md#constructors)

#### Defined in

[src/error.ts:239](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/src/error.ts#L239)

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

#### Overrides

[`CliError`](../../index/classes/CliError.md).[`[$type]`](../../index/classes/CliError.md#%5B$type%5D)

#### Defined in

[src/error.ts:235](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/src/error.ts#L235)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`cause`](../../index/classes/CliError.md#cause)

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### dangerouslyFatal

> **dangerouslyFatal**: `boolean` = `false`

This option is similar in intent to yargs's `exitProcess()` function,
except applied more granularly.

Normally, [runProgram](../../index/functions/runProgram.md) never throws and never calls `process.exit`,
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

[`CliError`](../../index/classes/CliError.md).[`dangerouslyFatal`](../../index/classes/CliError.md#dangerouslyfatal)

#### Defined in

[src/error.ts:133](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/src/error.ts#L133)

***

### message

> **message**: `string`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`message`](../../index/classes/CliError.md#message)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`name`](../../index/classes/CliError.md#name)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### showHelp

> **showHelp**: `boolean` = `false`

If `true`, help text will be sent to stderr _before this exception finishes
bubbling_. Where the exception is thrown will determine which instance is
responsible for error text generation.

#### Default

```ts
false
```

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`showHelp`](../../index/classes/CliError.md#showhelp)

#### Defined in

[src/error.ts:132](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/src/error.ts#L132)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`stack`](../../index/classes/CliError.md#stack)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### suggestedExitCode

> **suggestedExitCode**: [`FrameworkExitCode`](../../index/enumerations/FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

The exit code that will be returned when the application exits, given
nothing else goes wrong in the interim.

#### Default

```ts
FrameworkExitCode.DefaultError
```

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`suggestedExitCode`](../../index/classes/CliError.md#suggestedexitcode)

#### Defined in

[src/error.ts:131](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/src/error.ts#L131)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`prepareStackTrace`](../../index/classes/CliError.md#preparestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`stackTraceLimit`](../../index/classes/CliError.md#stacktracelimit)

#### Defined in

node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`captureStackTrace`](../../index/classes/CliError.md#capturestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:21
