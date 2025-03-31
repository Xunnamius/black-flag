[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / HelperProgram

# Type Alias: HelperProgram\<CustomCliArguments, CustomExecutionContext\>

> **HelperProgram**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Omit`\<[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, `"demand"` \| `"demandCommand"` \| `"command"`\>

Defined in: [src/types/program.ts:141](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/types/program.ts#L141)

Represents an "helper" [Program](Program.md) instance.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
