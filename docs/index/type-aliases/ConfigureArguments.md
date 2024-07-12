[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / ConfigureArguments

# Type Alias: ConfigureArguments()\<CustomContext\>

> **ConfigureArguments**\<`CustomContext`\>: (`rawArgv`, `context`) => `Promisable`\<*typeof* `process.argv`\>

This function is called once towards the beginning of the execution of
`PreExecutionContext::execute` and should return a `process.argv`-like array.

This is where yargs middleware and other argument pre-processing can be
implemented.

## Type Parameters

• **CustomContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Parameters

• **rawArgv**: *typeof* `process.argv`

• **context**: `CustomContext`

## Returns

`Promisable`\<*typeof* `process.argv`\>

## Defined in

[types/configure.ts:48](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/types/configure.ts#L48)
