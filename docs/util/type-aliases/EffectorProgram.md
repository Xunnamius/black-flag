[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / EffectorProgram

# Type Alias: EffectorProgram\<CustomCliArguments, CustomExecutionContext\>

> **EffectorProgram**\<`CustomCliArguments`, `CustomExecutionContext`\>: `Omit`\<[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, `"command_deferred"` \| `"command_finalize_deferred"`\>

Represents an "effector" [Program](Program.md) instance.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Defined in

[types/program.ts:119](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/types/program.ts#L119)
