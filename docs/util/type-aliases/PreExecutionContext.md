[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / PreExecutionContext

# Type Alias: PreExecutionContext\<CustomContext\>

> **PreExecutionContext**\<`CustomContext`\>: `CustomContext` & `object`

Represents the pre-execution context that is the result of calling
`configureProgram`.

## Type declaration

### execute

> **execute**: [`Executor`](Executor.md)

Execute the root command, parsing any available CLI arguments and running
the appropriate handler, and return the resulting final parsed arguments
object.

**This function throws whenever\* an exception occurs**, making it not
ideal as an entry point for a CLI. See [runProgram](../../index/functions/runProgram.md) for a wrapper
function that handles exceptions and sets the exit code for you.

Note: when the special `GracefulEarlyExitError` exception is thrown _from
within a command's handler or builder_, `Executor` will set
`context.state.deepestParseResult` to `NullArguments` and
`context.state.isGracefullyExiting` to `true`. Further, `Executor` **will
not** re-throw the exception in this special case, returning
`NullArguments` instead.

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

• **CustomContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Defined in

[types/program.ts:291](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/types/program.ts#L291)
