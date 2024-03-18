[@black-flag/core](../README.md) / [util](../modules/util.md) / AssertionFailedError

# Class: AssertionFailedError

[util](../modules/util.md).AssertionFailedError

Represents a failed sanity check.

## Hierarchy

- [`CliError`](index.CliError.md)

  ↳ **`AssertionFailedError`**

## Table of contents

### Constructors

- [constructor](util.AssertionFailedError.md#constructor)

### Properties

- [[$type]](util.AssertionFailedError.md#[$type])
- [cause](util.AssertionFailedError.md#cause)
- [message](util.AssertionFailedError.md#message)
- [name](util.AssertionFailedError.md#name)
- [stack](util.AssertionFailedError.md#stack)
- [suggestedExitCode](util.AssertionFailedError.md#suggestedexitcode)
- [prepareStackTrace](util.AssertionFailedError.md#preparestacktrace)
- [stackTraceLimit](util.AssertionFailedError.md#stacktracelimit)

### Methods

- [captureStackTrace](util.AssertionFailedError.md#capturestacktrace)

## Constructors

### constructor

• **new AssertionFailedError**(`message`): [`AssertionFailedError`](util.AssertionFailedError.md)

Represents a failed sanity check.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

[`AssertionFailedError`](util.AssertionFailedError.md)

#### Overrides

[CliError](index.CliError.md).[constructor](index.CliError.md#constructor)

#### Defined in

[src/error.ts:175](https://github.com/Xunnamius/black-flag/blob/4e1a91c/src/error.ts#L175)

## Properties

### [$type]

• **[$type]**: `string`[]

#### Overrides

[CliError](index.CliError.md).[[$type]](index.CliError.md#[$type])

#### Defined in

[src/error.ts:171](https://github.com/Xunnamius/black-flag/blob/4e1a91c/src/error.ts#L171)

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

[src/error.ts:85](https://github.com/Xunnamius/black-flag/blob/4e1a91c/src/error.ts#L85)

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
