[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / HelperProgram

# Type Alias: HelperProgram\<CustomCliArguments, CustomExecutionContext\>

> **HelperProgram**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Omit`\<[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, `"demand"` \| `"demandCommand"` \| `"command"`\>

Defined in: [src/types/program.ts:139](https://github.com/Xunnamius/black-flag/blob/f3086f07a0f4cf661850599e370f220c47febbd1/src/types/program.ts#L139)

Represents an "helper" [Program](Program.md) instance.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
