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

[types/configure.ts:17](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/types/configure.ts#L17)
