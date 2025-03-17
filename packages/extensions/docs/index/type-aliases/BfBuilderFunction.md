[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfBuilderFunction

# Type Alias: BfBuilderFunction\<CustomCliArguments, CustomExecutionContext\>

> **BfBuilderFunction**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Extract`\<`Configuration`\<`CustomCliArguments`, `CustomExecutionContext`\>\[`"builder"`\], `Function`\>

Defined in: [packages/extensions/src/index.ts:169](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/packages/extensions/src/index.ts#L169)

The function type of the `builder` export accepted by Black Flag.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
