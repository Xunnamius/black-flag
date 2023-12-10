[black-flag](../README.md) / util

# Module: util

## Table of contents

### Functions

- [hideBin](util.md#hidebin)
- [isCliError](util.md#isclierror)
- [isGracefulEarlyExitError](util.md#isgracefulearlyexiterror)
- [makeRunner](util.md#makerunner)

## Functions

### hideBin

▸ **hideBin**(`argv`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |

#### Returns

`string`[]

**`See`**

https://yargs.js.org/docs/#api-reference

#### Defined in

node_modules/@types/yargs/helpers.d.ts:4

___

### isCliError

▸ **isCliError**(`parameter`): parameter is CliError

Type guard for [CliError](../classes/index.CliError.md).

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameter` | `unknown` |

#### Returns

parameter is CliError

#### Defined in

[src/error.ts:21](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/error.ts#L21)

___

### isGracefulEarlyExitError

▸ **isGracefulEarlyExitError**(`parameter`): parameter is GracefulEarlyExitError

Type guard for [GracefulEarlyExitError](../classes/index.GracefulEarlyExitError.md).

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameter` | `unknown` |

#### Returns

parameter is GracefulEarlyExitError

#### Defined in

[src/error.ts:34](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/error.ts#L34)

___

### makeRunner

▸ **makeRunner**\<`CustomContext`, `CustomCliArguments`\>(`options?`): \<T\>(...`args`: `T` extends [`_`, ...Tail[]] ? `Tail` : []) => `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

A factory function that returns a [runProgram](index.md#runprogram) function that can be
called multiple times while only having to provide a subset of the required
parameters at initialization.

This is useful when unit/integration testing your CLI, which will likely
require multiple calls to `runProgram(...)`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | - |
| `options.commandModulePath?` | `string` | **`See`** [runProgram](index.md#runprogram) |

#### Returns

`fn`

▸ \<`T`\>(`...args`): `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [commandModulePath?: string] \| [commandModulePath: string, configurationHooks: Promisable\<ConfigureHooks\<CustomContext\>\>] \| [commandModulePath: string, preExecutionContext: PreExecutionContext\<CustomContext\>] \| [commandModulePath: string, argv: string \| string[]] \| [commandModulePath: string, argv: string \| string[], configurationHooks: Promisable\<ConfigureHooks\<CustomContext\>\>] \| [commandModulePath: string, argv: string \| string[], preExecutionContext: PreExecutionContext\<CustomContext\>] |

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `T` extends [`_`, ...Tail[]] ? `Tail` : [] |

##### Returns

`Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

**`See`**

[runProgram](index.md#runprogram)

#### Defined in

[src/util.ts:35](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/util.ts#L35)
