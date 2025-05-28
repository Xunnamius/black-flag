[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeCheckFunction

# Type Alias: BfeCheckFunction()\<CustomCliArguments, CustomExecutionContext\>

> **BfeCheckFunction**\<`CustomCliArguments`, `CustomExecutionContext`\> = (`currentArgumentValue`, `argv`) => `Promisable`\<`unknown`\>

Defined in: [packages/extensions/src/index.ts:575](https://github.com/Xunnamius/black-flag/blob/c5ada654b2eb8206c373e88bdba1d3a12ccec944/packages/extensions/src/index.ts#L575)

This function is used to validate an argument passed to Black Flag.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`

## Parameters

### currentArgumentValue

`any`

### argv

`Arguments`\<`CustomCliArguments`, `CustomExecutionContext`\>

## Returns

`Promisable`\<`unknown`\>

## See

[BfeBuilderObjectValueExtensions.check](BfeBuilderObjectValueExtensions.md#check)
