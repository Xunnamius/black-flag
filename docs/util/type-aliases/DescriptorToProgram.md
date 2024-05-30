[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / DescriptorToProgram

# Type alias: DescriptorToProgram\<Descriptor, CustomCliArguments, CustomExecutionContext\>

> **DescriptorToProgram**\<`Descriptor`, `CustomCliArguments`, `CustomExecutionContext`\>: `"effector"` *extends* `Descriptor` ? [`EffectorProgram`](EffectorProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\> : `"helper"` *extends* `Descriptor` ? [`HelperProgram`](HelperProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\> : [`RouterProgram`](RouterProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Accepts a `Descriptor` type and maps it to one of the `XProgram` types.

## Type parameters

• **Descriptor** *extends* [`ProgramDescriptor`](ProgramDescriptor.md)

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Source

[types/program.ts:159](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/types/program.ts#L159)
