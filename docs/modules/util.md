[black-flag](../README.md) / util

# Module: util

## Table of contents

### Type Aliases

- [DescriptorToProgram](util.md#descriptortoprogram)
- [EffectorProgram](util.md#effectorprogram)
- [HelperProgram](util.md#helperprogram)
- [ProgramDescriptor](util.md#programdescriptor)
- [ProgramType](util.md#programtype)
- [Programs](util.md#programs)
- [RouterProgram](util.md#routerprogram)

### Functions

- [hideBin](util.md#hidebin)
- [isCliError](util.md#isclierror)
- [isGracefulEarlyExitError](util.md#isgracefulearlyexiterror)
- [makeRunner](util.md#makerunner)

## Type Aliases

### DescriptorToProgram

Ƭ **DescriptorToProgram**\<`Descriptor`, `CustomCliArguments`\>: ``"effector"`` extends `Descriptor` ? [`EffectorProgram`](util.md#effectorprogram)\<`CustomCliArguments`\> : ``"helper"`` extends `Descriptor` ? [`HelperProgram`](util.md#helperprogram)\<`CustomCliArguments`\> : [`RouterProgram`](util.md#routerprogram)\<`CustomCliArguments`\>

Accepts a `Descriptor` type and maps it to one of the `XProgram` types.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Descriptor` | extends [`ProgramDescriptor`](util.md#programdescriptor) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/program.ts:133](https://github.com/Xunnamius/black-flag/blob/f567ddd/types/program.ts#L133)

___

### EffectorProgram

Ƭ **EffectorProgram**\<`CustomCliArguments`\>: `Omit`\<[`Program`](index.md#program)\<`CustomCliArguments`\>, ``"command_deferred"`` \| ``"command_finalize_deferred"`` \| ``"parse"`` \| ``"parseSync"`` \| ``"argv"``\>

Represents an "effector" [Program](index.md#program) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/program.ts:96](https://github.com/Xunnamius/black-flag/blob/f567ddd/types/program.ts#L96)

___

### HelperProgram

Ƭ **HelperProgram**\<`CustomCliArguments`\>: `Omit`\<[`Program`](index.md#program)\<`CustomCliArguments`\>, ``"command"`` \| ``"positional"`` \| ``"parse"`` \| ``"parseSync"`` \| ``"argv"``\>

Represents an "helper" [Program](index.md#program) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/program.ts:106](https://github.com/Xunnamius/black-flag/blob/f567ddd/types/program.ts#L106)

___

### ProgramDescriptor

Ƭ **ProgramDescriptor**: ``"effector"`` \| ``"helper"`` \| ``"router"``

Represents the three program types that comprise any Black Flag command.

#### Defined in

[types/program.ts:128](https://github.com/Xunnamius/black-flag/blob/f567ddd/types/program.ts#L128)

___

### ProgramType

Ƭ **ProgramType**: ``"pure parent"`` \| ``"parent-child"`` \| ``"pure child"``

Represents valid [Configuration](index.md#configuration) module types that can be loaded.

#### Defined in

[types/program.ts:123](https://github.com/Xunnamius/black-flag/blob/f567ddd/types/program.ts#L123)

___

### Programs

Ƭ **Programs**\<`CustomCliArguments`\>: \{ [Descriptor in ProgramDescriptor]: DescriptorToProgram\<Descriptor, CustomCliArguments\> }

Represents the program types that represent every Black Flag command as
aptly-named values in an object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/program.ts:146](https://github.com/Xunnamius/black-flag/blob/f567ddd/types/program.ts#L146)

___

### RouterProgram

Ƭ **RouterProgram**\<`CustomCliArguments`\>: `Pick`\<[`Program`](index.md#program)\<`CustomCliArguments`\>, ``"parseAsync"`` \| ``"command"`` \| ``"parsed"``\>

Represents an "router" [Program](index.md#program) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/program.ts:116](https://github.com/Xunnamius/black-flag/blob/f567ddd/types/program.ts#L116)

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

[src/error.ts:21](https://github.com/Xunnamius/black-flag/blob/f567ddd/src/error.ts#L21)

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

[src/error.ts:34](https://github.com/Xunnamius/black-flag/blob/f567ddd/src/error.ts#L34)

___

### makeRunner

▸ **makeRunner**\<`CustomContext`, `CustomCliArguments`\>(`options`): \<T\>(...`args`: `T` extends [`_`, ...Tail[]] ? `Tail` : []) => `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

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
| `options` | `Object` | - |
| `options.commandModulePath` | `string` | **`See`** [runProgram](index.md#runprogram) |

#### Returns

`fn`

▸ \<`T`\>(`...args`): `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [commandModulePath: string] \| [commandModulePath: string, configurationHooks: Promisable\<ConfigureHooks\<CustomContext\>\>] \| [commandModulePath: string, preExecutionContext: PreExecutionContext\<CustomContext\>] \| [commandModulePath: string, argv: string \| string[]] \| [commandModulePath: string, argv: string \| string[], configurationHooks: Promisable\<ConfigureHooks\<CustomContext\>\>] \| [commandModulePath: string, argv: string \| string[], preExecutionContext: PreExecutionContext\<CustomContext\>] |

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `T` extends [`_`, ...Tail[]] ? `Tail` : [] |

##### Returns

`Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

**`See`**

[runProgram](index.md#runprogram)

#### Defined in

[src/util.ts:33](https://github.com/Xunnamius/black-flag/blob/f567ddd/src/util.ts#L33)
