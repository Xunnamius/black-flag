[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ParentConfiguration

# Type Alias: ParentConfiguration\<CustomCliArguments, CustomExecutionContext\>

> **ParentConfiguration**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Partial`\<[`Configuration`](Configuration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

Defined in: [src/types/module.ts:156](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/types/module.ts#L156)

A partial extension to the [Configuration](Configuration.md) interface for non-root
parent configurations. This type was designed for use in external ESM/CJS
module files that will eventually get imported via auto-discovery.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)
