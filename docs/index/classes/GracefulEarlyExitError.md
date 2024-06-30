[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / GracefulEarlyExitError

# Class: GracefulEarlyExitError

Represents an exceptional event that should result in the immediate
termination of the application but with an exit code indicating success
(`0`).

## Extends

- [`CliError`](CliError.md)

## Constructors

### new GracefulEarlyExitError()

> **new GracefulEarlyExitError**(): [`GracefulEarlyExitError`](GracefulEarlyExitError.md)

Represents an exceptional event that should result in the immediate
termination of the application but with an exit code indicating success
(`0`).

#### Returns

[`GracefulEarlyExitError`](GracefulEarlyExitError.md)

#### Overrides

[`CliError`](CliError.md).[`constructor`](CliError.md#constructors)

#### Defined in

[src/error.ts:172](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/error.ts#L172)

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

#### Overrides

[`CliError`](CliError.md).[`[$type]`](CliError.md#%5B$type%5D)

#### Defined in

[src/error.ts:166](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/error.ts#L166)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`CliError`](CliError.md).[`cause`](CliError.md#cause)

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

[`CliError`](CliError.md).[`message`](CliError.md#message)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

[`CliError`](CliError.md).[`name`](CliError.md#name)

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

[`CliError`](CliError.md).[`showHelp`](CliError.md#showhelp)

#### Defined in

[src/error.ts:94](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/error.ts#L94)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`CliError`](CliError.md).[`stack`](CliError.md#stack)

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

#### Inherited from

[`CliError`](CliError.md).[`suggestedExitCode`](CliError.md#suggestedexitcode)

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

[`CliError`](CliError.md).[`prepareStackTrace`](CliError.md#preparestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`CliError`](CliError.md).[`stackTraceLimit`](CliError.md#stacktracelimit)

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

[`CliError`](CliError.md).[`captureStackTrace`](CliError.md#capturestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:21
