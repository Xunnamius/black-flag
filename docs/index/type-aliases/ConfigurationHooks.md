[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / ConfigurationHooks

# Type alias: ConfigurationHooks

> **ConfigurationHooks**: `object`

An object containing zero or more configuration hooks. See each hook type
definition for details.

## Type declaration

### configureArguments?

> `optional` **configureArguments**: [`ConfigureArguments`](ConfigureArguments.md)

This function is called once towards the beginning of the execution of
`PreExecutionContext::execute` and should return a `process.argv`-like array.

This is where yargs middleware and other argument pre-processing can be
implemented.

### configureErrorHandlingEpilogue?

> `optional` **configureErrorHandlingEpilogue**: [`ConfigureErrorHandlingEpilogue`](ConfigureErrorHandlingEpilogue.md)

This function is called once at the very end of the error handling process
after an error has occurred.

Note that this function is _always_ called whenever there is an error,
regardless of which other functions have already been called. The only
exceptions to this are if (1) the error occurs within
`configureErrorHandlingEpilogue` itself or (2) the error is an instance of
`GracefulEarlyExitError`.

This function is also called even after yargs internally handles and reports
an argument parsing/validation error.

### configureExecutionContext?

> `optional` **configureExecutionContext**: [`ConfigureExecutionContext`](ConfigureExecutionContext.md)

This function is called once towards the beginning of the execution of
`configureProgram` and should return what will become the global
[ExecutionContext](../../util/type-aliases/ExecutionContext.md) singleton.

Note that any errors thrown this early in the initialization process will
be thrown as-is and will NOT trigger
[ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md).

### configureExecutionEpilogue?

> `optional` **configureExecutionEpilogue**: [`ConfigureExecutionEpilogue`](ConfigureExecutionEpilogue.md)

This function is called once after CLI argument parsing completes and either
(1) handler execution succeeds or (2) a `GracefulEarlyExitError` is thrown.
The value returned by this function is used as the return value of the
`PreExecutionContext::execute` method. This function will _not_ be called
when yargs argument validation fails.

This function is the complement of [ConfigureExecutionPrologue](ConfigureExecutionPrologue.md).

### configureExecutionPrologue?

> `optional` **configureExecutionPrologue**: [`ConfigureExecutionPrologue`](ConfigureExecutionPrologue.md)

This function is called once towards the end of the execution of
`configureProgram`, after all commands have been discovered but before any
have been executed, and should apply any final configurations to the
programs that constitute the command line interface.

All commands and sub-commands known to Black Flag are available in the
ExecutionContext.commands map, which can be accessed from the
`context` parameter or from the [Arguments](Arguments.md) object returned by
`Program::parseAsync` et al.

This function is the complement of [ConfigureExecutionEpilogue](ConfigureExecutionEpilogue.md).

Note that any errors thrown this early in the initialization process will
be thrown as-is and will NOT trigger
[ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md).

## Source

[types/configure.ts:96](https://github.com/Xunnamius/black-flag/blob/35f66cc9d69f8434d03db49f067b4f7e03d4c58c/types/configure.ts#L96)
