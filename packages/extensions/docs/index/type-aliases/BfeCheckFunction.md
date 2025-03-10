[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / BfeCheckFunction

# Type Alias: BfeCheckFunction()\<CustomCliArguments, CustomExecutionContext>

> **BfeCheckFunction**<`CustomCliArguments`, `CustomExecutionContext`>: (`currentArgumentValue`, `argv`) => `Promisable`<`unknown`>

Defined in: [packages/extensions/src/index.ts:561][3]

This function is used to validate an argument passed to Black Flag.

## Type Parameters

• **CustomCliArguments** _extends_ `Record`<`string`, `unknown`>

• **CustomExecutionContext** _extends_ `ExecutionContext`

## Parameters

### Currentargumentvalue

`any`

### Argv

`Arguments`<`CustomCliArguments`, `CustomExecutionContext`>

## Returns

`Promisable`<`unknown`>

## See

[BfeBuilderObjectValueExtensions.check][4]

[1]: ../../README.md
[2]: ../README.md
[3]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L561
[4]: BfeBuilderObjectValueExtensions.md#check
