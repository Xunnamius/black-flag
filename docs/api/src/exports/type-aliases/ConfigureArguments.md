[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ConfigureArguments

# Type Alias: ConfigureArguments()\<CustomContext\>

> **ConfigureArguments**\<`CustomContext`\> = (`rawArgv`, `context`) => `Promisable`\<*typeof* `process.argv`\>

Defined in: [src/types/configure.ts:59](https://github.com/Xunnamius/black-flag/blob/6975ac4841c42ac3213d392b5cb06d13a72628a4/src/types/configure.ts#L59)

This function is called once towards the beginning of the execution of
`PreExecutionContext::execute` and should return a `process.argv`-like array.

This is where yargs middleware and other argument pre-processing can be
implemented.

Note that errors thrown at this point in the initialization process will be
handled by [ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md) but will never send help
text to stderr regardless of error type.

## Type Parameters

### CustomContext

`CustomContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Parameters

### rawArgv

*typeof* `process.argv`

### context

`CustomContext`

## Returns

`Promisable`\<*typeof* `process.argv`\>
