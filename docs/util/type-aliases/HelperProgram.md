[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / HelperProgram

# Type alias: HelperProgram\<CustomCliArguments, CustomExecutionContext\>

> **HelperProgram**\<`CustomCliArguments`, `CustomExecutionContext`\>: `Omit`\<[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, `"demand"` \| `"demandCommand"` \| `"command"`\>

Represents an "helper" [Program](Program.md) instance.

## Type parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Source

[types/program.ts:130](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/types/program.ts#L130)
