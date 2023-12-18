[black-flag](../README.md) / [index](../modules/index.md) / CliError

# Class: CliError

[index](../modules/index.md).CliError

Represents a CLI-specific error with suggested exit code and other
properties. As `CliError` has built-in support for cause chaining, this class
can be used as a simple wrapper around other errors.

## Hierarchy

- `AppError`

  ↳ **`CliError`**

  ↳↳ [`GracefulEarlyExitError`](index.GracefulEarlyExitError.md)

  ↳↳ [`AssertionFailedError`](util.AssertionFailedError.md)

  ↳↳ [`CommandNotImplementedError`](util.CommandNotImplementedError.md)

## Implements

- `NonNullable`\<[`CliErrorOptions`](../modules/util.md#clierroroptions)\>

## Table of contents

### Constructors

- [constructor](index.CliError.md#constructor)

### Properties

- [[$type]](index.CliError.md#[$type])
- [cause](index.CliError.md#cause)
- [message](index.CliError.md#message)
- [name](index.CliError.md#name)
- [stack](index.CliError.md#stack)
- [suggestedExitCode](index.CliError.md#suggestedexitcode)
- [prepareStackTrace](index.CliError.md#preparestacktrace)
- [stackTraceLimit](index.CliError.md#stacktracelimit)

### Methods

- [captureStackTrace](index.CliError.md#capturestacktrace)

## Constructors

### constructor

• **new CliError**(`cause`, `options?`): [`CliError`](index.CliError.md)

Represents a CLI-specific error, optionally with suggested exit code and
other context.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cause` | `string` \| `Error` |
| `options?` | [`CliErrorOptions`](../modules/util.md#clierroroptions) |

#### Returns

[`CliError`](index.CliError.md)

#### Overrides

AppError.constructor

#### Defined in

[src/error.ts:73](https://github.com/Xunnamius/black-flag/blob/fbfc0ac/src/error.ts#L73)

• **new CliError**(`cause`, `options`, `message`, `superOptions`): [`CliError`](index.CliError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cause` | `string` \| `Error` |
| `options` | [`CliErrorOptions`](../modules/util.md#clierroroptions) |
| `message` | `string` |
| `superOptions` | `ErrorOptions` |

#### Returns

[`CliError`](index.CliError.md)

#### Overrides

AppError.constructor

#### Defined in

[src/error.ts:78](https://github.com/Xunnamius/black-flag/blob/fbfc0ac/src/error.ts#L78)

## Properties

### [$type]

• **[$type]**: `string`[]

#### Defined in

[src/error.ts:68](https://github.com/Xunnamius/black-flag/blob/fbfc0ac/src/error.ts#L68)

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

AppError.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

AppError.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: `string`

#### Inherited from

AppError.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1075

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

AppError.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1077

___

### suggestedExitCode

• **suggestedExitCode**: [`FrameworkExitCode`](../enums/index.FrameworkExitCode.md) = `FrameworkExitCode.DefaultError`

#### Implementation of

NonNullable.suggestedExitCode

#### Defined in

[src/error.ts:66](https://github.com/Xunnamius/black-flag/blob/fbfc0ac/src/error.ts#L66)

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

AppError.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:28

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

AppError.stackTraceLimit

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

AppError.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:21
