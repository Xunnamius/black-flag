[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeBuilderFunction

# Type Alias: BfeBuilderFunction()\<CustomCliArguments, CustomExecutionContext\>

> **BfeBuilderFunction**\<`CustomCliArguments`, `CustomExecutionContext`\> = (...`args`) => [`BfBuilderObject`](BfBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Defined in: [packages/extensions/src/index.ts:589](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/packages/extensions/src/index.ts#L589)

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
