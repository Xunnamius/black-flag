[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / RootConfiguration

# Type alias: RootConfiguration\<CustomCliArguments, CustomExecutionContext\>

> **RootConfiguration**\<`CustomCliArguments`, `CustomExecutionContext`\>: `Partial`\<[`ParentConfiguration`](ParentConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

A partial extension to the [Configuration](Configuration.md) interface for root
configurations. This type was designed for use in external ESM/CJS module
files that will eventually get imported via auto-discovery.

## Type parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Source

[types/module.ts:138](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/types/module.ts#L138)
