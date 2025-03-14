[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ConfigureExecutionPrologue

# Type Alias: ConfigureExecutionPrologue()\<CustomContext\>

> **ConfigureExecutionPrologue**\<`CustomContext`\>: (`rootPrograms`, `context`) => `Promisable`\<`void`\>

Defined in: [src/types/configure.ts:44](https://github.com/Xunnamius/black-flag/blob/aaa1a74457790f285cb2c85d4d6a7ee05978fc42/src/types/configure.ts#L44)

This function is called once towards the end of the execution of
`configureProgram`, after all commands have been discovered but before any
have been executed, and should apply any final configurations to the programs
that constitute the command line interface.

All commands and sub-commands known to Black Flag are available in the
[ExecutionContext.commands](../util/type-aliases/ExecutionContext.md#commands) map, which can be accessed from the
`context` parameter or from the [Arguments](Arguments.md) object returned by
`Program::parseAsync` etc.

This function is the complement of [ConfigureExecutionEpilogue](ConfigureExecutionEpilogue.md).

Note that any errors thrown this early in the initialization process will
trigger a framework error and will NOT be handled by
[ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md) nor send help text to stderr
regardless of error type.

## Type Parameters

• **CustomContext** *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Parameters

### rootPrograms

[`Programs`](../util/type-aliases/Programs.md)

### context

`CustomContext`

## Returns

`Promisable`\<`void`\>
