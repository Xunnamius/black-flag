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

[types/configure.ts:48](https://github.com/Xunnamius/black-flag/blob/99e2b3aa8ebef83fdf414dda22ad11405c1907df/types/configure.ts#L48)
