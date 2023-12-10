[black-flag](../README.md) / [index](../modules/index.md) / AssertionFailedError

# Class: AssertionFailedError

[index](../modules/index.md).AssertionFailedError

Represents a failed sanity check.

## Hierarchy

- [`CliError`](index.CliError.md)

  ↳ **`AssertionFailedError`**

## Table of contents

### Constructors

- [constructor](index.AssertionFailedError.md#constructor)

### Properties

- [[$type]](index.AssertionFailedError.md#[$type])
- [cause](index.AssertionFailedError.md#cause)
- [message](index.AssertionFailedError.md#message)
- [name](index.AssertionFailedError.md#name)
- [stack](index.AssertionFailedError.md#stack)
- [suggestedExitCode](index.AssertionFailedError.md#suggestedexitcode)
- [prepareStackTrace](index.AssertionFailedError.md#preparestacktrace)
- [stackTraceLimit](index.AssertionFailedError.md#stacktracelimit)

### Methods

- [captureStackTrace](index.AssertionFailedError.md#capturestacktrace)

## Constructors

### constructor

• **new AssertionFailedError**(`message`): [`AssertionFailedError`](index.AssertionFailedError.md)

Represents a failed sanity check.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

[`AssertionFailedError`](index.AssertionFailedError.md)

#### Overrides

[CliError](index.CliError.md).[constructor](index.CliError.md#constructor)

#### Defined in

[src/error.ts:149](https://github.com/Xunnamius/black-flag/blob/d763fad/src/error.ts#L149)

## Properties

### [$type]

• **[$type]**: `string`[]

#### Overrides

[CliError](index.CliError.md).[[$type]](index.CliError.md#[$type])

#### Defined in

[src/error.ts:145](https://github.com/Xunnamius/black-flag/blob/d763fad/src/error.ts#L145)

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

[src/error.ts:66](https://github.com/Xunnamius/black-flag/blob/d763fad/src/error.ts#L66)

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
