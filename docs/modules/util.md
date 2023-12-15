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
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:126](https://github.com/Xunnamius/black-flag/blob/f6eddfb/types/program.ts#L126)

___

### EffectorProgram

Ƭ **EffectorProgram**\<`CustomCliArguments`\>: `Omit`\<[`Program`](index.md#program)\<`CustomCliArguments`\>, ``"command_deferred"`` \| ``"command_finalize_deferred"`` \| ``"parse"`` \| ``"parseSync"`` \| ``"argv"``\>

Represents an "effector" [Program](index.md#program) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:89](https://github.com/Xunnamius/black-flag/blob/f6eddfb/types/program.ts#L89)

___

### HelperProgram

Ƭ **HelperProgram**\<`CustomCliArguments`\>: `Omit`\<[`Program`](index.md#program)\<`CustomCliArguments`\>, ``"command"`` \| ``"positional"`` \| ``"parse"`` \| ``"parseSync"`` \| ``"argv"``\>

Represents an "helper" [Program](index.md#program) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:99](https://github.com/Xunnamius/black-flag/blob/f6eddfb/types/program.ts#L99)

___

### ProgramDescriptor

Ƭ **ProgramDescriptor**: ``"effector"`` \| ``"helper"`` \| ``"router"``

Represents the three program types that comprise any Black Flag command.

#### Defined in

[types/program.ts:121](https://github.com/Xunnamius/black-flag/blob/f6eddfb/types/program.ts#L121)

___

### ProgramType

Ƭ **ProgramType**: ``"pure parent"`` \| ``"parent-child"`` \| ``"pure child"``

Represents valid [Configuration](index.md#configuration) module types that can be loaded.

#### Defined in

[types/program.ts:116](https://github.com/Xunnamius/black-flag/blob/f6eddfb/types/program.ts#L116)

___

### Programs

Ƭ **Programs**\<`CustomCliArguments`\>: \{ [Descriptor in ProgramDescriptor]: DescriptorToProgram\<Descriptor, CustomCliArguments\> }

Represents the program types that represent every Black Flag command as
aptly-named values in an object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:139](https://github.com/Xunnamius/black-flag/blob/f6eddfb/types/program.ts#L139)

___

### RouterProgram

Ƭ **RouterProgram**\<`CustomCliArguments`\>: `Pick`\<[`Program`](index.md#program)\<`CustomCliArguments`\>, ``"parseAsync"`` \| ``"command"`` \| ``"parsed"``\>

Represents an "router" [Program](index.md#program) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:109](https://github.com/Xunnamius/black-flag/blob/f6eddfb/types/program.ts#L109)

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

[src/error.ts:21](https://github.com/Xunnamius/black-flag/blob/f6eddfb/src/error.ts#L21)

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

[src/error.ts:34](https://github.com/Xunnamius/black-flag/blob/f6eddfb/src/error.ts#L34)

___

### makeRunner

▸ **makeRunner**\<`CustomContext`, `CustomCliArguments`\>(`options`): \<T\>(...`args`: `T` extends [`_`, ...Tail[]] ? `Tail` : []) => `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

A factory function that returns a [runProgram](index.md#runprogram) function that can be
called multiple times while only having to provide a subset of the required
parameters at initialization.

This is useful when unit/integration testing your CLI, which will likely
require multiple calls to `runProgram(...)`.

Note: when an exception (e.g. bad arguments) occurs in the low-order
`runProgram` function, `undefined` will be returned unless you've configured
Black Flag to return something else. **The promise will not reject and no
exception will be thrown.** Keep this in mind when writing your unit tests.
See [runProgram](index.md#runprogram) for more details on this.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.commandModulePath` | `string` | **`See`** [runProgram](index.md#runprogram) |
| `options.configurationHooks?` | `Promisable`\<[`ConfigurationHooks`](index.md#configurationhooks)\<[`ExecutionContext`](index.md#executioncontext)\>\> | Note: cannot be used with `preExecutionContext`. **`See`** [runProgram](index.md#runprogram) |
| `options.preExecutionContext?` | `Promisable`\<[`PreExecutionContext`](index.md#preexecutioncontext)\<[`ExecutionContext`](index.md#executioncontext)\>\> | Note: cannot be used with `configurationHooks`. **`See`** [runProgram](index.md#runprogram) |

#### Returns

`fn`

▸ \<`T`\>(`...args`): `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [commandModulePath: string] \| [commandModulePath: string, configurationHooks: Promisable\<ConfigurationHooks\<CustomContext\>\>] \| [commandModulePath: string, preExecutionContext: Promisable\<PreExecutionContext\<CustomContext\>\>] \| [commandModulePath: string, argv: string \| string[]] \| [commandModulePath: string, argv: string \| string[], configurationHooks: Promisable\<ConfigurationHooks\<CustomContext\>\>] \| [commandModulePath: string, argv: string \| string[], preExecutionContext: Promisable\<PreExecutionContext\<CustomContext\>\>] |

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `T` extends [`_`, ...Tail[]] ? `Tail` : [] |

##### Returns

`Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

#### Defined in

[src/util.ts:38](https://github.com/Xunnamius/black-flag/blob/f6eddfb/src/util.ts#L38)
