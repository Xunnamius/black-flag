[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / EffectorProgram

# Type Alias: EffectorProgram\<CustomCliArguments, CustomExecutionContext\>

> **EffectorProgram**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Omit`\<[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, `"command"`\>

Defined in: [src/types/program.ts:133](https://github.com/Xunnamius/black-flag/blob/d6004b46e3ac5a451e4e0f05bf5c8726ce157ac9/src/types/program.ts#L133)

Represents an "effector" [Program](Program.md) instance.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
