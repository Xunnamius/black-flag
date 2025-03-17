[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / PreExecutionContext

# Type Alias: PreExecutionContext\<CustomContext\>

> **PreExecutionContext**\<`CustomContext`\> = `CustomContext` & `object`

Defined in: [src/types/program.ts:305](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L305)

Represents the pre-execution context that is the result of calling
`configureProgram`.

## Type declaration

### execute

> **execute**: [`Executor`](Executor.md)

Execute the root command, parsing any available CLI arguments and running
the appropriate handler, and return the resulting final parsed arguments
object.

**This function throws whenever\* an exception occurs**, making it not
ideal as an entry point for a CLI. See [runProgram](../../functions/runProgram.md) for a wrapper
function that handles exceptions and sets the exit code for you.

Note: when the special `GracefulEarlyExitError` exception is thrown _from
within a command's handler or builder (or certain hooks)_, `Executor` will
set `ExecutionContext::state.deepestParseResult` to `NullArguments` and
`ExecutionContext::state.isGracefullyExiting` to `true`. Further,
`Executor` **will not** re-throw the exception in this special case,
returning `NullArguments` instead.

### executionContext

> **executionContext**: `CustomContext`

A reference to the global context singleton passed to all other
configuration hooks, command builders, and command handlers. This object
recursively contains some of the same entries as its enclosing
`PreExecutionContext`.

### rootPrograms

> **rootPrograms**: [`Programs`](Programs.md)

An object containing the effector, helper, and router [Program](Program.md)
instances belonging to the root command.

## Type Parameters

### CustomContext

`CustomContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
