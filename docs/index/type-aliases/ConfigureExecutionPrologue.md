[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / ConfigureExecutionPrologue

# Type Alias: ConfigureExecutionPrologue()\<CustomContext\>

> **ConfigureExecutionPrologue**\<`CustomContext`\>: (`rootPrograms`, `context`) => `Promisable`\<`void`\>

This function is called once towards the end of the execution of
`configureProgram`, after all commands have been discovered but before any
have been executed, and should apply any final configurations to the programs
that constitute the command line interface.

All commands and sub-commands known to Black Flag are available in the
ExecutionContext.commands map, which can be accessed from the
`context` parameter or from the [Arguments](Arguments.md) object returned by
`Program::parseAsync` etc.

This function is the complement of [ConfigureExecutionEpilogue](ConfigureExecutionEpilogue.md).

Note that any errors thrown this early in the initialization process will be
thrown as-is and will NOT trigger [ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md).

## Type Parameters

• **CustomContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Parameters

• **rootPrograms**: [`Programs`](../../util/type-aliases/Programs.md)

• **context**: `CustomContext`

## Returns

`Promisable`\<`void`\>

## Defined in

[types/configure.ts:37](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/types/configure.ts#L37)
