[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / RouterProgram

# Type Alias: RouterProgram\<CustomCliArguments, CustomExecutionContext\>

> **RouterProgram**\<`CustomCliArguments`, `CustomExecutionContext`\>: `Pick`\<[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, `"parseAsync"` \| `"command"`\>

Represents an "router" [Program](Program.md) instance.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Defined in

[types/program.ts:141](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/types/program.ts#L141)
