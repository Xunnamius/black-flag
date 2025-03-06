[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ParentConfiguration

# Type Alias: ParentConfiguration\<CustomCliArguments, CustomExecutionContext\>

> **ParentConfiguration**\<`CustomCliArguments`, `CustomExecutionContext`\>: `Partial`\<[`Configuration`](Configuration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

Defined in: [src/types/module.ts:152](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/types/module.ts#L152)

A partial extension to the [Configuration](Configuration.md) interface for non-root
parent configurations. This type was designed for use in external ESM/CJS
module files that will eventually get imported via auto-discovery.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)
