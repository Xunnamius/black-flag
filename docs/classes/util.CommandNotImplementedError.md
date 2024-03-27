[@black-flag/core](../README.md) / [util](../modules/util.md) / CommandNotImplementedError

# Class: CommandNotImplementedError

[util](../modules/util.md).CommandNotImplementedError

Represents trying to execute a CLI command that has not yet been implemented.

## Hierarchy

- [`CliError`](index.CliError.md)

  ↳ **`CommandNotImplementedError`**

## Table of contents

### Constructors

- [constructor](util.CommandNotImplementedError.md#constructor)

### Properties

- [[$type]](util.CommandNotImplementedError.md#[$type])
- [cause](util.CommandNotImplementedError.md#cause)
- [message](util.CommandNotImplementedError.md#message)
- [name](util.CommandNotImplementedError.md#name)
- [showHelp](util.CommandNotImplementedError.md#showhelp)
- [stack](util.CommandNotImplementedError.md#stack)
- [suggestedExitCode](util.CommandNotImplementedError.md#suggestedexitcode)
- [prepareStackTrace](util.CommandNotImplementedError.md#preparestacktrace)
- [stackTraceLimit](util.CommandNotImplementedError.md#stacktracelimit)

### Methods

- [captureStackTrace](util.CommandNotImplementedError.md#capturestacktrace)

## Constructors

### constructor

• **new CommandNotImplementedError**(): [`CommandNotImplementedError`](util.CommandNotImplementedError.md)

Represents trying to execute a CLI command that has not yet been
implemented.

#### Returns

[`CommandNotImplementedError`](util.CommandNotImplementedError.md)

#### Overrides

[CliError](index.CliError.md).[constructor](index.CliError.md#constructor)

#### Defined in

[src/error.ts:150](https://github.com/Xunnamius/black-flag/blob/f8d8814/src/error.ts#L150)

## Properties

### [$type]

• **[$type]**: `string`[]

#### Overrides

[CliError](index.CliError.md).[[$type]](index.CliError.md#[$type])

#### Defined in

[src/error.ts:145](https://github.com/Xunnamius/black-flag/blob/f8d8814/src/error.ts#L145)

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
