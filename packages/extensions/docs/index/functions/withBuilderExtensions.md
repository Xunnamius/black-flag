[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / withBuilderExtensions

# Function: withBuilderExtensions()

> **withBuilderExtensions**\<`CustomCliArguments`, `CustomExecutionContext`\>(`customBuilder`?, `__namedParameters`?): [`WithBuilderExtensionsReturnType`](../type-aliases/WithBuilderExtensionsReturnType.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Defined in: [packages/extensions/src/index.ts:725](https://github.com/Xunnamius/black-flag/blob/3c3f6e1e60095912b550318378e24dc68e62b7d6/packages/extensions/src/index.ts#L725)

This function enables several additional options-related units of
functionality via analysis of the returned options configuration object and
the parsed command line arguments (argv).

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Parameters

### customBuilder?

[`BfeBuilderObject`](../type-aliases/BfeBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\> | (...`args`) => `void` \| [`BfeBuilderObject`](../type-aliases/BfeBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

### \_\_namedParameters?

[`WithBuilderExtensionsConfig`](../type-aliases/WithBuilderExtensionsConfig.md)\<`CustomCliArguments`\> = `{}`

## Returns

[`WithBuilderExtensionsReturnType`](../type-aliases/WithBuilderExtensionsReturnType.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

## See

[WithBuilderExtensionsReturnType](../type-aliases/WithBuilderExtensionsReturnType.md)
