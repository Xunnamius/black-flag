[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / AssertionFailedError

# Class: AssertionFailedError

Defined in: [src/error.ts:245](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/error.ts#L245)

Represents a failed sanity check.

## Extends

- [`CliError`](../../classes/CliError.md)

## Constructors

### new AssertionFailedError()

> **new AssertionFailedError**(`error`, `options`?): [`AssertionFailedError`](AssertionFailedError.md)

Defined in: [src/error.ts:251](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/error.ts#L251)

Represents a failed sanity check.

#### Parameters

##### error

`Error`

##### options?

[`CliErrorOptions`](../type-aliases/CliErrorOptions.md)

#### Returns

[`AssertionFailedError`](AssertionFailedError.md)

#### Overrides

[`CliError`](../../classes/CliError.md).[`constructor`](../../classes/CliError.md#constructors)

### new AssertionFailedError()

> **new AssertionFailedError**(`message`, `options`?): [`AssertionFailedError`](AssertionFailedError.md)

Defined in: [src/error.ts:252](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/error.ts#L252)

Represents a failed sanity check.

#### Parameters

##### message

`string`

##### options?

[`CliErrorOptions`](../type-aliases/CliErrorOptions.md)

#### Returns

[`AssertionFailedError`](AssertionFailedError.md)

#### Overrides

[`CliError`](../../classes/CliError.md).[`constructor`](../../classes/CliError.md#constructors)

### new AssertionFailedError()

> **new AssertionFailedError**(`errorOrMessage`?, `options`?): [`AssertionFailedError`](AssertionFailedError.md)

Defined in: [src/error.ts:253](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/error.ts#L253)

Represents a failed sanity check.

#### Parameters

##### errorOrMessage?

`string` | `Error`

##### options?

[`CliErrorOptions`](../type-aliases/CliErrorOptions.md)

#### Returns

[`AssertionFailedError`](AssertionFailedError.md)

#### Overrides

`CliError.constructor`

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

Defined in: [src/error.ts:247](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/error.ts#L247)

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

Defined in: [src/error.ts:135](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/error.ts#L135)

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

> **showHelp**: `boolean` = `false`

Defined in: [src/error.ts:134](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/error.ts#L134)

If `true`, help text will be sent to stderr _before this exception finishes
bubbling_. Where the exception is thrown will determine which instance is
responsible for error text generation.

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

Defined in: [src/error.ts:133](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/error.ts#L133)

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
