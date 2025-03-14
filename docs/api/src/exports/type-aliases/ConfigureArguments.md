[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ConfigureArguments

# Type Alias: ConfigureArguments()\<CustomContext\>

> **ConfigureArguments**\<`CustomContext`\>: (`rawArgv`, `context`) => `Promisable`\<*typeof* `process.argv`\>

Defined in: [src/types/configure.ts:59](https://github.com/Xunnamius/black-flag/blob/aaa1a74457790f285cb2c85d4d6a7ee05978fc42/src/types/configure.ts#L59)

This function is called once towards the beginning of the execution of
`PreExecutionContext::execute` and should return a `process.argv`-like array.

This is where yargs middleware and other argument pre-processing can be
implemented.

Note that errors thrown at this point in the initialization process will be
handled by [ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md) but will never send help
text to stderr regardless of error type.

## Type Parameters

• **CustomContext** *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Parameters

### rawArgv

*typeof* `process.argv`

### context

`CustomContext`

## Returns

`Promisable`\<*typeof* `process.argv`\>
