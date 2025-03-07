[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ConfigureExecutionEpilogue

# Type Alias: ConfigureExecutionEpilogue()\<CustomContext\>

> **ConfigureExecutionEpilogue**\<`CustomContext`\>: (`argv`, `context`) => `Promisable`\<[`Arguments`](Arguments.md)\>

Defined in: [src/types/configure.ts:65](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/types/configure.ts#L65)

This function is called once after CLI argument parsing completes and either
(1) handler execution succeeds or (2) a `GracefulEarlyExitError` is thrown.
The value returned by this function is used as the return value of the
`PreExecutionContext::execute` method. This function will _not_ be called
when yargs argument validation fails.

This function is the complement of [ConfigureExecutionPrologue](ConfigureExecutionPrologue.md).

## Type Parameters

• **CustomContext** *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Parameters

### argv

[`Arguments`](Arguments.md)

### context

`CustomContext`

## Returns

`Promisable`\<[`Arguments`](Arguments.md)\>
