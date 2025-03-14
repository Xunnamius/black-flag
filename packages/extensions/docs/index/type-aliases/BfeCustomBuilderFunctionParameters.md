[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeCustomBuilderFunctionParameters

# Type Alias: BfeCustomBuilderFunctionParameters\<CustomCliArguments, CustomExecutionContext, P\>

> **BfeCustomBuilderFunctionParameters**\<`CustomCliArguments`, `CustomExecutionContext`, `P`\>: `P` *extends* \[infer R, `...(infer S)`\] ? `S` *extends* \[infer T, `...(infer _U)`\] ? \[`R` & `object`, `T`, [`BfeStrictArguments`](BfeStrictArguments.md)\<`Partial`\<`CustomCliArguments`\>, `CustomExecutionContext`\> \| `undefined`\] : \[`R` & `object`, `...S`\] : `never`

Defined in: [packages/extensions/src/index.ts:627](https://github.com/Xunnamius/black-flag/blob/3c3f6e1e60095912b550318378e24dc68e62b7d6/packages/extensions/src/index.ts#L627)

A version of Black Flag's `builder` function parameters that exclude yargs
methods that are not supported by BFE.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

• **P** = `Parameters`\<[`BfBuilderFunction`](BfBuilderFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

## See

[withBuilderExtensions](../functions/withBuilderExtensions.md)
