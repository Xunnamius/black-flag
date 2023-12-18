[black-flag](../README.md) / [index](../modules/index.md) / GracefulEarlyExitError

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

[src/error.ts:135](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/error.ts#L135)

## Properties

### [$type]

• **[$type]**: `string`[]

#### Overrides

[CliError](index.CliError.md).[[$type]](index.CliError.md#[$type])

#### Defined in

[src/error.ts:129](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/error.ts#L129)

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

node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: `string`

#### Inherited from

[CliError](index.CliError.md).[name](index.CliError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1075

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[CliError](index.CliError.md).[stack](index.CliError.md#stack)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1077

___

### suggestedExitCode

• **suggestedExitCode**: [`FrameworkExitCode`](../enums/index.FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

#### Inherited from

[CliError](index.CliError.md).[suggestedExitCode](index.CliError.md#suggestedexitcode)

#### Defined in

[src/error.ts:66](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/error.ts#L66)

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

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
