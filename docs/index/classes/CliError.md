[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / CliError

# Class: CliError

Represents a CLI-specific error with suggested exit code and other
properties. As `CliError` has built-in support for cause chaining, this class
can be used as a simple wrapper around other errors.

## Extends

- `AppError`

## Extended by

- [`GracefulEarlyExitError`](GracefulEarlyExitError.md)
- [`AssertionFailedError`](../../util/classes/AssertionFailedError.md)
- [`CommandNotImplementedError`](../../util/classes/CommandNotImplementedError.md)

## Implements

- `NonNullable`\<[`CliErrorOptions`](../../util/type-aliases/CliErrorOptions.md)\>

## Constructors

### new CliError()

> **new CliError**(`reason`, `options`?): [`CliError`](CliError.md)

Represents a CLI-specific error, optionally with suggested exit code and
other context.

#### Parameters

• **reason**: `string` \| `Error`

• **options?**: [`CliErrorOptions`](../../util/type-aliases/CliErrorOptions.md)

#### Returns

[`CliError`](CliError.md)

#### Overrides

`AppError.constructor`

#### Defined in

[src/error.ts:140](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/error.ts#L140)

### new CliError()

> **new CliError**(`reason`, `options`, `message`, `superOptions`): [`CliError`](CliError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **reason**: `string` \| `Error`

• **options**: [`CliErrorOptions`](../../util/type-aliases/CliErrorOptions.md)

• **message**: `string`

• **superOptions**: `ErrorOptions`

#### Returns

[`CliError`](CliError.md)

#### Overrides

`AppError.constructor`

#### Defined in

[src/error.ts:145](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/error.ts#L145)

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

#### Defined in

[src/error.ts:135](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/error.ts#L135)

***

### cause?

> `optional` **cause**: `unknown`

#### Implementation of

`NonNullable.cause`

#### Inherited from

`AppError.cause`

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### dangerouslyFatal

> **dangerouslyFatal**: `boolean` = `false`

This option is similar in intent to yargs's `exitProcess()` function,
except applied more granularly.

Normally, [runProgram](../functions/runProgram.md) never throws and never calls `process.exit`,
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

#### Implementation of

`NonNullable.dangerouslyFatal`

#### Defined in

[src/error.ts:133](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/error.ts#L133)

***

### message

> **message**: `string`

#### Inherited from

`AppError.message`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`AppError.name`

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

#### Implementation of

`NonNullable.showHelp`

#### Defined in

[src/error.ts:132](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/error.ts#L132)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`AppError.stack`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### suggestedExitCode

> **suggestedExitCode**: [`FrameworkExitCode`](../enumerations/FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

The exit code that will be returned when the application exits, given
nothing else goes wrong in the interim.

#### Default

```ts
FrameworkExitCode.DefaultError
```

#### Implementation of

`NonNullable.suggestedExitCode`

#### Defined in

[src/error.ts:131](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/error.ts#L131)

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

`AppError.prepareStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`AppError.stackTraceLimit`

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

`AppError.captureStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:21
