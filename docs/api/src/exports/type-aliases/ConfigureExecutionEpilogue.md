[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ConfigureExecutionEpilogue

# Type Alias: ConfigureExecutionEpilogue()\<CustomContext\>

> **ConfigureExecutionEpilogue**\<`CustomContext`\> = (`argv`, `context`) => `Promisable`\<[`Arguments`](Arguments.md)\>

Defined in: [src/types/configure.ts:79](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/types/configure.ts#L79)

This function is called once after CLI argument parsing completes and either
(1) handler execution succeeds or (2) a `GracefulEarlyExitError` is thrown.
The value returned by this function is used as the return value of the
`PreExecutionContext::execute` method. This function will _not_ be called
when yargs argument validation fails.

This function is the complement of [ConfigureExecutionPrologue](ConfigureExecutionPrologue.md).

Note that errors thrown at this point in the cleanup process will be
handled by [ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md) but will never send help
text to stderr regardless of error type.

## Type Parameters

### CustomContext

`CustomContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Parameters

### argv

[`Arguments`](Arguments.md)

### context

`CustomContext`

## Returns

`Promisable`\<[`Arguments`](Arguments.md)\>
