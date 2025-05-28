[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfBuilderFunction

# Type Alias: BfBuilderFunction\<CustomCliArguments, CustomExecutionContext\>

> **BfBuilderFunction**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Extract`\<`Configuration`\<`CustomCliArguments`, `CustomExecutionContext`\>\[`"builder"`\], `Function`\>

Defined in: [packages/extensions/src/index.ts:169](https://github.com/Xunnamius/black-flag/blob/c5ada654b2eb8206c373e88bdba1d3a12ccec944/packages/extensions/src/index.ts#L169)

The function type of the `builder` export accepted by Black Flag.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
