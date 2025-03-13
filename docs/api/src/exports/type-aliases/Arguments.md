[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / Arguments

# Type Alias: Arguments\<CustomCliArguments, CustomExecutionContext\>

> **Arguments**\<`CustomCliArguments`, `CustomExecutionContext`\>: `_Arguments`\<[`FrameworkArguments`](../util/type-aliases/FrameworkArguments.md)\<`CustomExecutionContext`\> & `CustomCliArguments`\>

Defined in: [src/types/program.ts:29](https://github.com/Xunnamius/black-flag/blob/40d21584fb01de3f46f2fedf60011594304c55d4/src/types/program.ts#L29)

Represents the parsed CLI arguments, plus `_` and `$0`, any (hidden)
arguments/properties specific to Black Flag, and an indexer falling back to
`unknown` for unrecognized arguments.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)
