[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeCustomBuilderFunctionParameters

# Type Alias: BfeCustomBuilderFunctionParameters\<CustomCliArguments, CustomExecutionContext, P\>

> **BfeCustomBuilderFunctionParameters**\<`CustomCliArguments`, `CustomExecutionContext`, `P`\> = `P` *extends* \[infer R, `...(infer S)`\] ? `S` *extends* \[infer T, `...(infer _U)`\] ? \[`R` & `object`, `T`, [`BfeStrictArguments`](BfeStrictArguments.md)\<`Partial`\<`CustomCliArguments`\>, `CustomExecutionContext`\> \| `undefined`\] : \[`R` & `object`, `...S`\] : `never`

Defined in: [packages/extensions/src/index.ts:641](https://github.com/Xunnamius/black-flag/blob/9e502baf0a24d2f38890806199a48bc7a3c83054/packages/extensions/src/index.ts#L641)

A version of Black Flag's `builder` function parameters that exclude yargs
methods that are not supported by BFE.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`

### P

`P` = `Parameters`\<[`BfBuilderFunction`](BfBuilderFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

## See

[withBuilderExtensions](../functions/withBuilderExtensions.md)
