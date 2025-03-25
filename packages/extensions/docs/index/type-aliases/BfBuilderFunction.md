[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfBuilderFunction

# Type Alias: BfBuilderFunction\<CustomCliArguments, CustomExecutionContext\>

> **BfBuilderFunction**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Extract`\<`Configuration`\<`CustomCliArguments`, `CustomExecutionContext`\>\[`"builder"`\], `Function`\>

Defined in: [packages/extensions/src/index.ts:172](https://github.com/Xunnamius/black-flag/blob/a49f96af98d9a9d96fd7dc9946a709fd368c04c2/packages/extensions/src/index.ts#L172)

The function type of the `builder` export accepted by Black Flag.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
