[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / WithBuilderExtensionsReturnType

# Type Alias: WithBuilderExtensionsReturnType\<CustomCliArguments, CustomExecutionContext\>

> **WithBuilderExtensionsReturnType**\<`CustomCliArguments`, `CustomExecutionContext`\> = \[[`BfeBuilderFunction`](BfeBuilderFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, [`WithHandlerExtensions`](WithHandlerExtensions.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\]

Defined in: [packages/extensions/src/index.ts:681](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/packages/extensions/src/index.ts#L681)

The array of extended exports and high-order functions returned by
[withBuilderExtensions](../functions/withBuilderExtensions.md).

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
