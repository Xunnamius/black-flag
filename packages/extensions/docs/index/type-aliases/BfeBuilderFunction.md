[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / BfeBuilderFunction

# Type Alias: BfeBuilderFunction()\<CustomCliArguments, CustomExecutionContext>

> **BfeBuilderFunction**<`CustomCliArguments`, `CustomExecutionContext`>: (...`args`) => [`BfBuilderObject`][3]<`CustomCliArguments`, `CustomExecutionContext`>

Defined in: [packages/extensions/src/index.ts:580][4]

This function implements several additional optionals-related units of
functionality. This function is meant to take the place of a command's
`builder` export.

This type cannot be instantiated by direct means. Instead, it is created and
returned by [withBuilderExtensions][5].

## Type Parameters

• **CustomCliArguments** _extends_ `Record`<`string`, `unknown`>

• **CustomExecutionContext** _extends_ `ExecutionContext`

## Parameters

### Args

...`Parameters`<[`BfBuilderFunction`][6]<`CustomCliArguments`, `CustomExecutionContext`>>

## Returns

[`BfBuilderObject`][3]<`CustomCliArguments`, `CustomExecutionContext`>

## See

[withBuilderExtensions][5]

[1]: ../../README.md
[2]: ../README.md
[3]: BfBuilderObject.md
[4]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L580
[5]: ../functions/withBuilderExtensions.md
[6]: BfBuilderFunction.md
