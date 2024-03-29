[@black-flag/core](../README.md) / [index](../modules/index.md) / GracefulEarlyExitError

# Class: GracefulEarlyExitError

[index](../modules/index.md).GracefulEarlyExitError

Represents an exceptional event that should result in the immediate
termination of the application but with an exit code indicating success
(`0`).

## Hierarchy

- [`CliError`](index.CliError.md)

  ↳ **`GracefulEarlyExitError`**

## Table of contents

### Constructors

- [constructor](index.GracefulEarlyExitError.md#constructor)

### Properties

- [[$type]](index.GracefulEarlyExitError.md#[$type])
- [cause](index.GracefulEarlyExitError.md#cause)
- [message](index.GracefulEarlyExitError.md#message)
- [name](index.GracefulEarlyExitError.md#name)
- [showHelp](index.GracefulEarlyExitError.md#showhelp)
- [stack](index.GracefulEarlyExitError.md#stack)
- [suggestedExitCode](index.GracefulEarlyExitError.md#suggestedexitcode)
- [prepareStackTrace](index.GracefulEarlyExitError.md#preparestacktrace)
- [stackTraceLimit](index.GracefulEarlyExitError.md#stacktracelimit)

### Methods

- [captureStackTrace](index.GracefulEarlyExitError.md#capturestacktrace)

## Constructors

### constructor

• **new GracefulEarlyExitError**(): [`GracefulEarlyExitError`](index.GracefulEarlyExitError.md)

Represents an exceptional event that should result in the immediate
termination of the application but with an exit code indicating success
(`0`).

#### Returns

[`GracefulEarlyExitError`](index.GracefulEarlyExitError.md)

#### Overrides

[CliError](index.CliError.md).[constructor](index.CliError.md#constructor)

#### Defined in

[src/error.ts:172](https://github.com/Xunnamius/black-flag/blob/f8d8814/src/error.ts#L172)

## Properties

### [$type]

• **[$type]**: `string`[]

#### Overrides

[CliError](index.CliError.md).[[$type]](index.CliError.md#[$type])

#### Defined in

[src/error.ts:166](https://github.com/Xunnamius/black-flag/blob/f8d8814/src/error.ts#L166)

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

[CliError](index.CliError.md).[cause](index.CliError.md#cause)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

[CliError](index.CliError.md).[message](index.CliError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1077

___

### name

• **name**: `string`

#### Inherited from

[CliError](index.CliError.md).[name](index.CliError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1076

___

### showHelp

• **showHelp**: `boolean` = `false`

#### Inherited from

[CliError](index.CliError.md).[showHelp](index.CliError.md#showhelp)

#### Defined in

[src/error.ts:94](https://github.com/Xunnamius/black-flag/blob/f8d8814/src/error.ts#L94)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[CliError](index.CliError.md).[stack](index.CliError.md#stack)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1078

___

### suggestedExitCode

• **suggestedExitCode**: [`FrameworkExitCode`](../enums/index.FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

#### Inherited from

[CliError](index.CliError.md).[suggestedExitCode](index.CliError.md#suggestedexitcode)

#### Defined in

[src/error.ts:93](https://github.com/Xunnamius/black-flag/blob/f8d8814/src/error.ts#L93)

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Type declaration

▸ (`err`, `stackTraces`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

[CliError](index.CliError.md).[prepareStackTrace](index.CliError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:28

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[CliError](index.CliError.md).[stackTraceLimit](index.CliError.md#stacktracelimit)

#### Defined in

node_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[CliError](index.CliError.md).[captureStackTrace](index.CliError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:21
