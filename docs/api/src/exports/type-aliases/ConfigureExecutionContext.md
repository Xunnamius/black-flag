[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ConfigureExecutionContext

# Type Alias: ConfigureExecutionContext()\<CustomContext\>

> **ConfigureExecutionContext**\<`CustomContext`\> = (`context`) => `Promisable`\<`CustomContext`\>

Defined in: [src/types/configure.ts:22](https://github.com/Xunnamius/black-flag/blob/f3086f07a0f4cf661850599e370f220c47febbd1/src/types/configure.ts#L22)

This function is called once towards the beginning of the execution of
`configureProgram` and should return the value that will become the global
[ExecutionContext](../util/type-aliases/ExecutionContext.md) singleton.

Note that the value returned by this function is discarded after being
shallowly cloned by `Object.assign`. That is: the global
[ExecutionContext](../util/type-aliases/ExecutionContext.md) singleton will not strictly equal `context`.

Also note that any errors thrown this early in the initialization process
will trigger a framework error and will NOT be handled by
[ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md) nor send help text to stderr
regardless of error type.

## Type Parameters

### CustomContext

`CustomContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Parameters

### context

[`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Returns

`Promisable`\<`CustomContext`\>
