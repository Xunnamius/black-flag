[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / ConfigureExecutionContext

# Type Alias: ConfigureExecutionContext()\<CustomContext\>

> **ConfigureExecutionContext**\<`CustomContext`\>: (`context`) => `Promisable`\<`CustomContext`\>

This function is called once towards the beginning of the execution of
`configureProgram` and should return what will become the global
[ExecutionContext](../../util/type-aliases/ExecutionContext.md) singleton.

Note that any errors thrown this early in the initialization process will be
thrown as-is and will NOT trigger [ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md).

## Type Parameters

• **CustomContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Parameters

• **context**: [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Returns

`Promisable`\<`CustomContext`\>

## Defined in

[types/configure.ts:17](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/types/configure.ts#L17)
