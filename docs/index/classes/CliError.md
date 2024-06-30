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

#### Defined in

[src/error.ts:101](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/error.ts#L101)

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

#### Defined in

[src/error.ts:106](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/error.ts#L106)

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

#### Defined in

[src/error.ts:96](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/error.ts#L96)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`AppError.cause`

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

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

[src/error.ts:94](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/error.ts#L94)

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

[src/error.ts:93](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/error.ts#L93)

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
