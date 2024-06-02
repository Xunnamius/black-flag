[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / Executor

# Type alias: Executor()

> **Executor**: (`rawArgv`?) => `Promise`\<[`Arguments`](../../index/type-aliases/Arguments.md)\>

This function accepts an optional `rawArgv` array that defaults to
`yargs::hideBin(process.argv)` and returns an `Arguments` object representing
the arguments parsed and validated by yargs (i.e.
`context.state.deepestParseResult`).

**This function throws whenever\* an exception occurs**, making it not ideal
as an entry point for a CLI. See [runProgram](../../index/functions/runProgram.md) for a wrapper function
that handles exceptions and sets the exit code for you.

Note: when the special `GracefulEarlyExitError` exception is thrown _from
within a command's handler or builder_, `Executor` will set
`context.state.deepestParseResult` to `NullArguments` and
`context.state.isGracefullyExiting` to `true`. Further, `Executor` **will
not** re-throw the exception in this special case, returning `NullArguments`
instead.

## Parameters

• **rawArgv?**: `Parameters`\<[`ConfigureArguments`](../../index/type-aliases/ConfigureArguments.md)\>\[`0`\]

## Returns

`Promise`\<[`Arguments`](../../index/type-aliases/Arguments.md)\>

## Source

[types/program.ts:280](https://github.com/Xunnamius/black-flag/blob/35f66cc9d69f8434d03db49f067b4f7e03d4c58c/types/program.ts#L280)
