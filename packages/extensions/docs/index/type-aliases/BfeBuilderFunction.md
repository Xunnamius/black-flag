[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeBuilderFunction

# Type Alias: BfeBuilderFunction()\<CustomCliArguments, CustomExecutionContext\>

> **BfeBuilderFunction**\<`CustomCliArguments`, `CustomExecutionContext`\> = (...`args`) => [`BfBuilderObject`](BfBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Defined in: [packages/extensions/src/index.ts:587](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L587)

This function implements several additional optionals-related units of
functionality. This function is meant to take the place of a command's
`builder` export.

This type cannot be instantiated by direct means. Instead, it is created and
returned by [withBuilderExtensions](../functions/withBuilderExtensions.md).

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`

## Parameters

### args

...`Parameters`\<[`BfBuilderFunction`](BfBuilderFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

## Returns

[`BfBuilderObject`](BfBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

## See

[withBuilderExtensions](../functions/withBuilderExtensions.md)
