[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / WithBuilderExtensionsReturnType

# Type Alias: WithBuilderExtensionsReturnType\<CustomCliArguments, CustomExecutionContext\>

> **WithBuilderExtensionsReturnType**\<`CustomCliArguments`, `CustomExecutionContext`\> = \[[`BfeBuilderFunction`](BfeBuilderFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, [`WithHandlerExtensions`](WithHandlerExtensions.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\]

Defined in: [packages/extensions/src/index.ts:686](https://github.com/Xunnamius/black-flag/blob/9e502baf0a24d2f38890806199a48bc7a3c83054/packages/extensions/src/index.ts#L686)

The array of extended exports and high-order functions returned by
[withBuilderExtensions](../functions/withBuilderExtensions.md).

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
