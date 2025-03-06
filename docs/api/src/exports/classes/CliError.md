[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / CliError

# Class: CliError

Defined in: [src/error.ts:132](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/error.ts#L132)

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

- `NonNullable`\<[`CliErrorOptions`](../util/type-aliases/CliErrorOptions.md)\>

## Constructors

### new CliError()

> **new CliError**(`reason`?, `options`?): [`CliError`](CliError.md)

Defined in: [src/error.ts:142](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/error.ts#L142)

Represents a CLI-specific error, optionally with suggested exit code and
other context.

#### Parameters

##### reason?

`string` | `Error`

##### options?

[`CliErrorOptions`](../util/type-aliases/CliErrorOptions.md)

#### Returns

[`CliError`](CliError.md)

#### Overrides

`AppError.constructor`

### new CliError()

> **new CliError**(`reason`, `options`, `message`, `superOptions`): [`CliError`](CliError.md)

Defined in: [src/error.ts:147](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/error.ts#L147)

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

[`CliError`](CliError.md)

#### Overrides

`AppError.constructor`

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

Defined in: [src/error.ts:137](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/error.ts#L137)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Implementation of

`NonNullable.cause`

#### Inherited from

`AppError.cause`

***

### dangerouslyFatal

> **dangerouslyFatal**: `boolean` = `false`

Defined in: [src/error.ts:135](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/error.ts#L135)

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

> **showHelp**: `boolean` = `false`

Defined in: [src/error.ts:134](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/error.ts#L134)

If `true`, help text will be sent to stderr _before this exception finishes
bubbling_. Where the exception is thrown will determine which instance is
responsible for error text generation.

#### Default

```ts
false
```

#### Implementation of

`NonNullable.showHelp`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`AppError.stack`

***

### suggestedExitCode

> **suggestedExitCode**: [`FrameworkExitCode`](../enumerations/FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

Defined in: [src/error.ts:133](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/error.ts#L133)

The exit code that will be returned when the application exits, given
nothing else goes wrong in the interim.

#### Default

```ts
FrameworkExitCode.DefaultError
```

#### Implementation of

`NonNullable.suggestedExitCode`

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
