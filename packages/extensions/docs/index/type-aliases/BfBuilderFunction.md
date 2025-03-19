[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfBuilderFunction

# Type Alias: BfBuilderFunction\<CustomCliArguments, CustomExecutionContext\>

> **BfBuilderFunction**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Extract`\<`Configuration`\<`CustomCliArguments`, `CustomExecutionContext`\>\[`"builder"`\], `Function`\>

Defined in: [packages/extensions/src/index.ts:171](https://github.com/Xunnamius/black-flag/blob/6ed277e0a55bcec73d66d48954610cdf899ffe68/packages/extensions/src/index.ts#L171)

The function type of the `builder` export accepted by Black Flag.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
