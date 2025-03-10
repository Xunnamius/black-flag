[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / withBuilderExtensions

# Function: withBuilderExtensions()

> **withBuilderExtensions**<`CustomCliArguments`, `CustomExecutionContext`>(`customBuilder`?, `__namedParameters`?): [`WithBuilderExtensionsReturnType`][3]<`CustomCliArguments`, `CustomExecutionContext`>

Defined in: [packages/extensions/src/index.ts:725][4]

This function enables several additional options-related units of
functionality via analysis of the returned options configuration object and
the parsed command line arguments (argv).

## Type Parameters

• **CustomCliArguments** _extends_ `Record`<`string`, `unknown`>

• **CustomExecutionContext** _extends_ `ExecutionContext`

## Parameters

### Custombuilder?

[`BfeBuilderObject`][5]<`CustomCliArguments`, `CustomExecutionContext`> | (...`args`) => `void` | [`BfeBuilderObject`][5]<`CustomCliArguments`, `CustomExecutionContext`>

### \_\_namedparameters?

[`WithBuilderExtensionsConfig`][6]<`CustomCliArguments`> = `{}`

## Returns

[`WithBuilderExtensionsReturnType`][3]<`CustomCliArguments`, `CustomExecutionContext`>

## See

[WithBuilderExtensionsReturnType][3]

[1]: ../../README.md
[2]: ../README.md
[3]: ../type-aliases/WithBuilderExtensionsReturnType.md
[4]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L725
[5]: ../type-aliases/BfeBuilderObject.md
[6]: ../type-aliases/WithBuilderExtensionsConfig.md
