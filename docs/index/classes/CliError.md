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

> **new CliError**(`cause`, `options`?): [`CliError`](CliError.md)

Represents a CLI-specific error, optionally with suggested exit code and
other context.

#### Parameters

• **cause**: `string` \| `Error`

• **options?**: [`CliErrorOptions`](../../util/type-aliases/CliErrorOptions.md)

#### Returns

[`CliError`](CliError.md)

#### Overrides

`AppError.constructor`

#### Source

[src/error.ts:101](https://github.com/Xunnamius/black-flag/blob/35f66cc9d69f8434d03db49f067b4f7e03d4c58c/src/error.ts#L101)

### new CliError()

> **new CliError**(`cause`, `options`, `message`, `superOptions`): [`CliError`](CliError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **cause**: `string` \| `Error`

• **options**: [`CliErrorOptions`](../../util/type-aliases/CliErrorOptions.md)

• **message**: `string`

• **superOptions**: `ErrorOptions`

#### Returns

[`CliError`](CliError.md)

#### Overrides

`AppError.constructor`

#### Source

[src/error.ts:106](https://github.com/Xunnamius/black-flag/blob/35f66cc9d69f8434d03db49f067b4f7e03d4c58c/src/error.ts#L106)

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

#### Source

[src/error.ts:96](https://github.com/Xunnamius/black-flag/blob/35f66cc9d69f8434d03db49f067b4f7e03d4c58c/src/error.ts#L96)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`AppError.cause`

#### Source

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`AppError.message`

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`AppError.name`

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### showHelp

> **showHelp**: `boolean` = `false`

#### Implementation of

`NonNullable.showHelp`

#### Source

[src/error.ts:94](https://github.com/Xunnamius/black-flag/blob/35f66cc9d69f8434d03db49f067b4f7e03d4c58c/src/error.ts#L94)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`AppError.stack`

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### suggestedExitCode

> **suggestedExitCode**: [`FrameworkExitCode`](../enumerations/FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

#### Implementation of

`NonNullable.suggestedExitCode`

#### Source

[src/error.ts:93](https://github.com/Xunnamius/black-flag/blob/35f66cc9d69f8434d03db49f067b4f7e03d4c58c/src/error.ts#L93)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### Inherited from

`AppError.prepareStackTrace`

#### Source

node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`AppError.stackTraceLimit`

#### Source

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

#### Source

node\_modules/@types/node/globals.d.ts:21
