[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / ConfigureExecutionPrologue

# Type alias: ConfigureExecutionPrologue()\<CustomContext\>

> **ConfigureExecutionPrologue**\<`CustomContext`\>: (`rootPrograms`, `context`) => `Promisable`\<`void`\>

This function is called once towards the end of the execution of
`configureProgram`, after all commands have been discovered but before any
have been executed, and should apply any final configurations to the programs
that constitute the command line interface.

All commands and sub-commands known to Black Flag are available in the
ExecutionContext.commands map, which can be accessed from the
`context` parameter or from the [Arguments](Arguments.md) object returned by
`Program::parseAsync` et al.

This function is the complement of [ConfigureExecutionEpilogue](ConfigureExecutionEpilogue.md).

Note that any errors thrown this early in the initialization process will be
thrown as-is and will NOT trigger [ConfigureErrorHandlingEpilogue](ConfigureErrorHandlingEpilogue.md).

## Type parameters

• **CustomContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Parameters

• **rootPrograms**: [`Programs`](../../util/type-aliases/Programs.md)

• **context**: `CustomContext`

## Returns

`Promisable`\<`void`\>

## Source

[types/configure.ts:37](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/types/configure.ts#L37)
