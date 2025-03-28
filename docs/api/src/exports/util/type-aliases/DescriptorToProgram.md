[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / DescriptorToProgram

# Type Alias: DescriptorToProgram\<Descriptor, CustomCliArguments, CustomExecutionContext\>

> **DescriptorToProgram**\<`Descriptor`, `CustomCliArguments`, `CustomExecutionContext`\> = `"effector"` *extends* `Descriptor` ? [`EffectorProgram`](EffectorProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\> : `"helper"` *extends* `Descriptor` ? [`HelperProgram`](HelperProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\> : [`RouterProgram`](RouterProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Defined in: [src/types/program.ts:168](https://github.com/Xunnamius/black-flag/blob/d52d6ef8a8da5a82b265a7ff9d65b74350896d3b/src/types/program.ts#L168)

Accepts a `Descriptor` type and maps it to one of the `XProgram` types.

## Type Parameters

### Descriptor

`Descriptor` *extends* [`ProgramDescriptor`](ProgramDescriptor.md)

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
