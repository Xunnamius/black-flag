[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeCheckFunction

# Type Alias: BfeCheckFunction()\<CustomCliArguments, CustomExecutionContext\>

> **BfeCheckFunction**\<`CustomCliArguments`, `CustomExecutionContext`\> = (`currentArgumentValue`, `argv`) => `Promisable`\<`unknown`\>

Defined in: [packages/extensions/src/index.ts:578](https://github.com/Xunnamius/black-flag/blob/a49f96af98d9a9d96fd7dc9946a709fd368c04c2/packages/extensions/src/index.ts#L578)

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
