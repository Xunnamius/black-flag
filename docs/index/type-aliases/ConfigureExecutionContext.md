[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / ConfigureExecutionContext

# Type alias: ConfigureExecutionContext()\<CustomContext\>

> **ConfigureExecutionContext**\<`CustomContext`\>: (`context`) => `Promisable`\<`CustomContext`\>

This function is called once towards the beginning of the execution of
`configureProgram` and should return what will become the global
[ExecutionContext](../../util/type-aliases/ExecutionContext.md) singleton.

Note that any errors thrown this early in the initialization process will be
thrown as-is and will NOT trigger [ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md).

## Type parameters

• **CustomContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Parameters

• **context**: [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Returns

`Promisable`\<`CustomContext`\>

## Source

[types/configure.ts:17](https://github.com/Xunnamius/black-flag/blob/35f66cc9d69f8434d03db49f067b4f7e03d4c58c/types/configure.ts#L17)
