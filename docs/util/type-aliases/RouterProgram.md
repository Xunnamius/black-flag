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

[types/program.ts:141](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/types/program.ts#L141)
