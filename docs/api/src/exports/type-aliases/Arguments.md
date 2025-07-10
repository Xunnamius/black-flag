[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / Arguments

# Type Alias: Arguments\<CustomCliArguments, CustomExecutionContext\>

> **Arguments**\<`CustomCliArguments`, `CustomExecutionContext`\> = `_Arguments`\<[`FrameworkArguments`](../util/type-aliases/FrameworkArguments.md)\<`CustomExecutionContext`\> & `CustomCliArguments`\>

Defined in: [src/types/program.ts:29](https://github.com/Xunnamius/black-flag/blob/8d031666f2b06def50a0b12d4e86a7961a49e69d/src/types/program.ts#L29)

Represents the parsed CLI arguments, plus `_` and `$0`, any (hidden)
arguments/properties specific to Black Flag, and an indexer falling back to
`unknown` for unrecognized arguments.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)
