[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / RootConfiguration

# Type Alias: RootConfiguration\<CustomCliArguments, CustomExecutionContext\>

> **RootConfiguration**\<`CustomCliArguments`, `CustomExecutionContext`\>: `Partial`\<[`ParentConfiguration`](ParentConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

Defined in: [src/types/module.ts:150](https://github.com/Xunnamius/black-flag/blob/10cd0ebc0304d033218ec4dffba0c41cb2e85ff6/src/types/module.ts#L150)

A partial extension to the [Configuration](Configuration.md) interface for root
configurations. This type was designed for use in external ESM/CJS module
files that will eventually get imported via auto-discovery.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)
