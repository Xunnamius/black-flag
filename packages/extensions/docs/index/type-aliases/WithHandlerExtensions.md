[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / WithHandlerExtensions

# Type Alias: WithHandlerExtensions()\<CustomCliArguments, CustomExecutionContext>

> **WithHandlerExtensions**<`CustomCliArguments`, `CustomExecutionContext`>: (`customHandler`?) => `Configuration`<`CustomCliArguments`, `CustomExecutionContext`>\[`"handler"`]

Defined in: [packages/extensions/src/index.ts:659][3]

This function implements several additional optionals-related units of
functionality. The return value of this function is meant to take the place
of a command's `handler` export.

This type cannot be instantiated by direct means. Instead, it is created and
returned by [withBuilderExtensions][4].

Note that `customHandler` provides a stricter constraint than Black Flag's
`handler` command export in that `customHandler`'s `argv` parameter type
explicitly omits the fallback indexer for unrecognized arguments. This
means all possible arguments must be included in [CustomCliArguments][5].

## Type Parameters

• **CustomCliArguments** _extends_ `Record`<`string`, `unknown`>

• **CustomExecutionContext** _extends_ `ExecutionContext`

## Parameters

### Customhandler?

(`argv`) => `Promisable`<`void`>

## Returns

`Configuration`<`CustomCliArguments`, `CustomExecutionContext`>\[`"handler"`]

## See

[withBuilderExtensions][4]

[1]: ../../README.md
[2]: ../README.md
[3]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L659
[4]: ../functions/withBuilderExtensions.md
[5]: WithHandlerExtensions.md
