[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeBuilderObject

# Type Alias: BfeBuilderObject\<CustomCliArguments, CustomExecutionContext\>

> **BfeBuilderObject**\<`CustomCliArguments`, `CustomExecutionContext`\>: `object`

Defined in: [packages/extensions/src/index.ts:203](https://github.com/Xunnamius/black-flag/blob/10cd0ebc0304d033218ec4dffba0c41cb2e85ff6/packages/extensions/src/index.ts#L203)

A version of the object type of the `builder` export accepted by Black Flag
that supports BFE's additional functionality.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Index Signature

\[`key`: `string`\]: [`BfeBuilderObjectValue`](BfeBuilderObjectValue.md)\<`CustomCliArguments`, `CustomExecutionContext`\>
