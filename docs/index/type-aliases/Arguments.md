[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / Arguments

# Type Alias: Arguments\<CustomCliArguments, CustomExecutionContext\>

> **Arguments**\<`CustomCliArguments`, `CustomExecutionContext`\>: `_Arguments`\<[`FrameworkArguments`](../../util/type-aliases/FrameworkArguments.md)\<`CustomExecutionContext`\> & `CustomCliArguments`\>

Represents the parsed CLI arguments, plus `_` and `$0`, any (hidden)
arguments/properties specific to Black Flag, and an indexer falling back to
`unknown` for unrecognized arguments.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Defined in

[types/program.ts:18](https://github.com/Xunnamius/black-flag/blob/99e2b3aa8ebef83fdf414dda22ad11405c1907df/types/program.ts#L18)
