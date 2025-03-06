[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ConfigureExecutionContext

# Type Alias: ConfigureExecutionContext()\<CustomContext\>

> **ConfigureExecutionContext**\<`CustomContext`\>: (`context`) => `Promisable`\<`CustomContext`\>

Defined in: [src/types/configure.ts:17](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/types/configure.ts#L17)

This function is called once towards the beginning of the execution of
`configureProgram` and should return what will become the global
[ExecutionContext](../util/type-aliases/ExecutionContext.md) singleton.

Note that any errors thrown this early in the initialization process will
trigger a framework error and will NOT be handled by
[ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md).

## Type Parameters

• **CustomContext** *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Parameters

### context

[`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Returns

`Promisable`\<`CustomContext`\>
