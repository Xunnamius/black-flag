[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / ConfigureErrorHandlingEpilogue

# Type Alias: ConfigureErrorHandlingEpilogue()\<CustomContext\>

> **ConfigureErrorHandlingEpilogue**\<`CustomContext`\>: (`meta`, `argv`, `context`) => `Promisable`\<`void`\>

This function is called once at the very end of the error handling process
after an error has occurred.

Note that this function is _always_ called whenever there is an error,
regardless of which other functions have already been called. The only
exceptions to this are if (1) the error occurs within
`configureErrorHandlingEpilogue` itself or (2) the error is an instance of
`GracefulEarlyExitError`.

This function is also called even after yargs internally handles and reports
an argument parsing/validation error.

## Type Parameters

• **CustomContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Parameters

• **meta**

• **meta.error**: `unknown`

• **meta.exitCode**: `number`

• **meta.message**: `string`

• **argv**: `Omit`\<`Partial`\<[`Arguments`](Arguments.md)\>, *typeof* [`$executionContext`](../variables/$executionContext.md)\> & `object`

• **context**: `CustomContext`

## Returns

`Promisable`\<`void`\>

## Defined in

[types/configure.ts:81](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/types/configure.ts#L81)
