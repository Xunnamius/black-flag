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

#### Source

[src/error.ts:172](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/src/error.ts#L172)

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

#### Overrides

[`CliError`](CliError.md).[`[$type]`](CliError.md#%5B$type%5D)

#### Source

[src/error.ts:166](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/src/error.ts#L166)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`CliError`](CliError.md).[`cause`](CliError.md#cause)

#### Source

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

[`CliError`](CliError.md).[`message`](CliError.md#message)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

[`CliError`](CliError.md).[`name`](CliError.md#name)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### showHelp

> **showHelp**: `boolean` = `false`

#### Inherited from

[`CliError`](CliError.md).[`showHelp`](CliError.md#showhelp)

#### Source

[src/error.ts:94](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/src/error.ts#L94)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`CliError`](CliError.md).[`stack`](CliError.md#stack)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### suggestedExitCode

> **suggestedExitCode**: [`FrameworkExitCode`](../enumerations/FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

#### Inherited from

[`CliError`](CliError.md).[`suggestedExitCode`](CliError.md#suggestedexitcode)

#### Source

[src/error.ts:93](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/src/error.ts#L93)

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

#### Source

node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`CliError`](CliError.md).[`stackTraceLimit`](CliError.md#stacktracelimit)

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

[`CliError`](CliError.md).[`captureStackTrace`](CliError.md#capturestacktrace)

#### Source

node\_modules/@types/node/globals.d.ts:21
