[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / ConfigureArguments

# Type alias: ConfigureArguments()\<CustomContext\>

> **ConfigureArguments**\<`CustomContext`\>: (`rawArgv`, `context`) => `Promisable`\<*typeof* `process.argv`\>

This function is called once towards the beginning of the execution of
`PreExecutionContext::execute` and should return a `process.argv`-like array.

This is where yargs middleware and other argument pre-processing can be
implemented.

## Type parameters

• **CustomContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Parameters

• **rawArgv**: *typeof* `process.argv`

• **context**: `CustomContext`

## Returns

`Promisable`\<*typeof* `process.argv`\>

## Source

[types/configure.ts:48](https://github.com/Xunnamius/black-flag/blob/078357b0a89baf1ca6264881df1614997567a0db/types/configure.ts#L48)
