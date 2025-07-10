[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / WithBuilderExtensionsReturnType

# Type Alias: WithBuilderExtensionsReturnType\<CustomCliArguments, CustomExecutionContext\>

> **WithBuilderExtensionsReturnType**\<`CustomCliArguments`, `CustomExecutionContext`\> = \[[`BfeBuilderFunction`](BfeBuilderFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>, [`WithHandlerExtensions`](WithHandlerExtensions.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\]

Defined in: [packages/extensions/src/index.ts:679](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L679)

The array of extended exports and high-order functions returned by
[withBuilderExtensions](../functions/withBuilderExtensions.md).

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
