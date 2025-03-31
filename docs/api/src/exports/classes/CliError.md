[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / CliError

# Class: CliError

Defined in: [src/error.ts:166](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/error.ts#L166)

Represents a CLI-specific error with suggested exit code and other
properties. As `CliError` has built-in support for cause chaining, this class
can be used as a simple wrapper around other errors.

## Extends

- `AppError`

## Extended by

- [`GracefulEarlyExitError`](GracefulEarlyExitError.md)
- [`AssertionFailedError`](../util/classes/AssertionFailedError.md)
- [`CommandNotImplementedError`](../util/classes/CommandNotImplementedError.md)

## Implements

- `Required`\<`Omit`\<[`CliErrorOptions`](../util/type-aliases/CliErrorOptions.md), `"cause"`\>\>
- `Pick`\<[`CliErrorOptions`](../util/type-aliases/CliErrorOptions.md), `"cause"`\>

## Constructors

### new CliError()

> **new CliError**(`reason`?, `options`?): `CliError`

Defined in: [src/error.ts:179](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/error.ts#L179)

Represents a CLI-specific error, optionally with suggested exit code and
other context.

#### Parameters

##### reason?

`string` | `Error`

##### options?

[`CliErrorOptions`](../util/type-aliases/CliErrorOptions.md)

#### Returns

`CliError`

#### Overrides

`AppError.constructor`

### new CliError()

> **new CliError**(`reason`, `options`, `message`, `superOptions`): `CliError`

Defined in: [src/error.ts:184](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/error.ts#L184)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

##### reason

`string` | `Error`

##### options

[`CliErrorOptions`](../util/type-aliases/CliErrorOptions.md)

##### message

`string`

##### superOptions

`ErrorOptions`

#### Returns

`CliError`

#### Overrides

`AppError.constructor`

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

Defined in: [src/error.ts:174](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/error.ts#L174)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Implementation of

`Pick.cause`

#### Inherited from

`AppError.cause`

***

### dangerouslyFatal

> **dangerouslyFatal**: `boolean` = `false`

Defined in: [src/error.ts:172](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/error.ts#L172)

This option is similar in intent to Yargs's `exitProcess()` function,
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

#### Default

```ts
false
```

#### Implementation of

`Required.dangerouslyFatal`

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`AppError.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`AppError.name`

***

### showHelp

> **showHelp**: `NonNullable`\<`undefined` \| `false` \| `"short"` \| `"full"` \| `"default"`\>

Defined in: [src/error.ts:171](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/error.ts#L171)

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
[CommandNotImplementedError](../util/classes/CommandNotImplementedError.md).

#### Default

```ts
"default"
```

#### Implementation of

`Required.showHelp`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`AppError.stack`

***

### suggestedExitCode

> **suggestedExitCode**: [`FrameworkExitCode`](../enumerations/FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

Defined in: [src/error.ts:170](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/error.ts#L170)

The exit code that will be returned when the application exits, given
nothing else goes wrong in the interim.

#### Default

```ts
FrameworkExitCode.DefaultError
```

#### Implementation of

`Required.suggestedExitCode`

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

`AppError.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`AppError.stackTraceLimit`

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

`AppError.captureStackTrace`
