[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeBuilderObject

# Type Alias: BfeBuilderObject\<CustomCliArguments, CustomExecutionContext\>

> **BfeBuilderObject**\<`CustomCliArguments`, `CustomExecutionContext`\> = `object`

Defined in: [packages/extensions/src/index.ts:205](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L205)

A version of the object type of the `builder` export accepted by Black Flag
that supports BFE's additional functionality.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`

## Index Signature

\[`key`: `string`\]: [`BfeBuilderObjectValue`](BfeBuilderObjectValue.md)\<`CustomCliArguments`, `CustomExecutionContext`\>
