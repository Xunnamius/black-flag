[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / WithBuilderExtensionsReturnType

# Type Alias: WithBuilderExtensionsReturnType\<CustomCliArguments, CustomExecutionContext\>

> **WithBuilderExtensionsReturnType**\<`CustomCliArguments`, `CustomExecutionContext`\> = \[[`BfeBuilderFunction`](BfeBuilderFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, [`WithHandlerExtensions`](WithHandlerExtensions.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\]

Defined in: [packages/extensions/src/index.ts:689](https://github.com/Xunnamius/black-flag/blob/a49f96af98d9a9d96fd7dc9946a709fd368c04c2/packages/extensions/src/index.ts#L689)

The array of extended exports and high-order functions returned by
[withBuilderExtensions](../functions/withBuilderExtensions.md).

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
