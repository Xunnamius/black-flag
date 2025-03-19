[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / RouterProgram

# Type Alias: RouterProgram\<CustomCliArguments, CustomExecutionContext\>

> **RouterProgram**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Pick`\<[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, `"parseAsync"` \| `"command"`\>

Defined in: [src/types/program.ts:150](https://github.com/Xunnamius/black-flag/blob/80aa4a39c172096a78cb27464b3ff055c511121d/src/types/program.ts#L150)

Represents an "router" [Program](Program.md) instance.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
