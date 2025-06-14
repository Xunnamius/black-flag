[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeBuilderObject

# Type Alias: BfeBuilderObject\<CustomCliArguments, CustomExecutionContext\>

> **BfeBuilderObject**\<`CustomCliArguments`, `CustomExecutionContext`\> = `object`

Defined in: [packages/extensions/src/index.ts:212](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L212)

A version of the object type of the `builder` export accepted by Black Flag
that supports BFE's additional functionality.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`

## Index Signature

\[`key`: `string`\]: [`BfeBuilderObjectValue`](BfeBuilderObjectValue.md)\<`CustomCliArguments`, `CustomExecutionContext`\>
