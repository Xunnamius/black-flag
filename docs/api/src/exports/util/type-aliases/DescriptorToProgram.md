[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / DescriptorToProgram

# Type Alias: DescriptorToProgram\<Descriptor, CustomCliArguments, CustomExecutionContext\>

> **DescriptorToProgram**\<`Descriptor`, `CustomCliArguments`, `CustomExecutionContext`\>: `"effector"` *extends* `Descriptor` ? [`EffectorProgram`](EffectorProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\> : `"helper"` *extends* `Descriptor` ? [`HelperProgram`](HelperProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\> : [`RouterProgram`](RouterProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Defined in: [src/types/program.ts:158](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/types/program.ts#L158)

Accepts a `Descriptor` type and maps it to one of the `XProgram` types.

## Type Parameters

• **Descriptor** *extends* [`ProgramDescriptor`](ProgramDescriptor.md)

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
