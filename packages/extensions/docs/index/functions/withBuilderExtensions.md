[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / withBuilderExtensions

# Function: withBuilderExtensions()

> **withBuilderExtensions**\<`CustomCliArguments`, `CustomExecutionContext`\>(`customBuilder?`, `__namedParameters?`): [`WithBuilderExtensionsReturnType`](../type-aliases/WithBuilderExtensionsReturnType.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Defined in: [packages/extensions/src/index.ts:797](https://github.com/Xunnamius/black-flag/blob/c5ada654b2eb8206c373e88bdba1d3a12ccec944/packages/extensions/src/index.ts#L797)

This function enables several additional options-related units of
functionality via analysis of the returned options configuration object and
the parsed command line arguments (argv).

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`

## Parameters

### customBuilder?

[`BfeBuilderObject`](../type-aliases/BfeBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\> | (...`args`) => `void` \| [`BfeBuilderObject`](../type-aliases/BfeBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

### \_\_namedParameters?

[`WithBuilderExtensionsConfig`](../type-aliases/WithBuilderExtensionsConfig.md)\<`CustomCliArguments`\> = `{}`

## Returns

[`WithBuilderExtensionsReturnType`](../type-aliases/WithBuilderExtensionsReturnType.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

## See

[WithBuilderExtensionsReturnType](../type-aliases/WithBuilderExtensionsReturnType.md)
