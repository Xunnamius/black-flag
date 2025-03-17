[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ChildConfiguration

# Type Alias: ChildConfiguration\<CustomCliArguments, CustomExecutionContext\>

> **ChildConfiguration**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Partial`\<[`Configuration`](Configuration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

Defined in: [src/types/module.ts:170](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/module.ts#L170)

A partial extension to the [Configuration](Configuration.md) interface for child
configurations. This type was designed for use in external ESM/CJS module
files that will eventually get imported via auto-discovery.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)
