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

#### Source

[src/error.ts:188](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/src/error.ts#L188)

## Properties

### \[$type\]

> **\[$type\]**: `string`[]

#### Overrides

[`CliError`](../../index/classes/CliError.md).[`[$type]`](../../index/classes/CliError.md#%5B$type%5D)

#### Source

[src/error.ts:184](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/src/error.ts#L184)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`cause`](../../index/classes/CliError.md#cause)

#### Source

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`message`](../../index/classes/CliError.md#message)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`name`](../../index/classes/CliError.md#name)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### showHelp

> **showHelp**: `boolean` = `false`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`showHelp`](../../index/classes/CliError.md#showhelp)

#### Source

[src/error.ts:94](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/src/error.ts#L94)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`stack`](../../index/classes/CliError.md#stack)

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### suggestedExitCode

> **suggestedExitCode**: [`FrameworkExitCode`](../../index/enumerations/FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`suggestedExitCode`](../../index/classes/CliError.md#suggestedexitcode)

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

[`CliError`](../../index/classes/CliError.md).[`prepareStackTrace`](../../index/classes/CliError.md#preparestacktrace)

#### Source

node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`CliError`](../../index/classes/CliError.md).[`stackTraceLimit`](../../index/classes/CliError.md#stacktracelimit)

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

[`CliError`](../../index/classes/CliError.md).[`captureStackTrace`](../../index/classes/CliError.md#capturestacktrace)

#### Source

node\_modules/@types/node/globals.d.ts:21
