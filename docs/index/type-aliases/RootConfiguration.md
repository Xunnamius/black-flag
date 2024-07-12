[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / RootConfiguration

# Type Alias: RootConfiguration\<CustomCliArguments, CustomExecutionContext\>

> **RootConfiguration**\<`CustomCliArguments`, `CustomExecutionContext`\>: `Partial`\<[`ParentConfiguration`](ParentConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

A partial extension to the [Configuration](Configuration.md) interface for root
configurations. This type was designed for use in external ESM/CJS module
files that will eventually get imported via auto-discovery.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Defined in

[types/module.ts:138](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/types/module.ts#L138)
