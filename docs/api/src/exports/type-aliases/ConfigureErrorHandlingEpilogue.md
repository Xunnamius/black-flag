[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ConfigureErrorHandlingEpilogue

# Type Alias: ConfigureErrorHandlingEpilogue()\<CustomContext\>

> **ConfigureErrorHandlingEpilogue**\<`CustomContext`\> = (`meta`, `argv`, `context`) => `Promisable`\<`void`\>

Defined in: [src/types/configure.ts:96](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/types/configure.ts#L96)

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

### CustomContext

`CustomContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Parameters

### meta

#### error

`unknown`

#### exitCode

`number`

#### message

`string`

### argv

`Omit`\<`Partial`\<[`Arguments`](Arguments.md)\>, *typeof* [`$executionContext`](../variables/$executionContext.md)\> & `object`

### context

`CustomContext`

## Returns

`Promisable`\<`void`\>
