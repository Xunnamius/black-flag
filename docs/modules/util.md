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

[src/error.ts:21](https://github.com/Xunnamius/black-flag/blob/873af70/src/error.ts#L21)

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

[src/error.ts:34](https://github.com/Xunnamius/black-flag/blob/873af70/src/error.ts#L34)

___

### makeRunner

▸ **makeRunner**<`CustomCliArguments`\>(`commandModulePath?`): <CustomContext, T\>(...`args`: `T` extends [`_`, ...Tail[]] ? `Tail` : []) => `Promise`<[`Arguments`](index.md#arguments)<`CustomCliArguments`\>\>

A factory function that returns a [runProgram](index.md#runprogram) function that can be
called multiple times while only having to provide the `commandModulePath`
parameter, as well as the optional `CustomContext` and `CustomCliArguments`
type parameters, at initialization.

This is useful when unit/integration testing your CLI, which will likely
require multiple calls to `runProgram(...)`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`<`string`, `unknown`\> = `EmptyObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandModulePath?` | `string` |

#### Returns

`fn`

▸ <`CustomContext`, `T`\>(`...args`): `Promise`<[`Arguments`](index.md#arguments)<`CustomCliArguments`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `T` | extends `RunProgramSignature`<`CustomContext`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `T` extends [`_`, ...Tail[]] ? `Tail` : [] |

##### Returns

`Promise`<[`Arguments`](index.md#arguments)<`CustomCliArguments`\>\>

#### Defined in

[src/util.ts:55](https://github.com/Xunnamius/black-flag/blob/873af70/src/util.ts#L55)
