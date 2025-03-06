[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / Executor

# Type Alias: Executor()

> **Executor**: (`rawArgv`?) => `Promise`\<[`Arguments`](../../type-aliases/Arguments.md)\>

Defined in: [src/types/program.ts:279](https://github.com/Xunnamius/black-flag/blob/a0f00d5a2809e5f4f75ecb90bce738d38590143c/src/types/program.ts#L279)

This function accepts an optional `rawArgv` array that defaults to
`yargs::hideBin(process.argv)` and returns an `Arguments` object representing
the arguments parsed and validated by yargs (i.e.
`context.state.deepestParseResult`).

**This function throws whenever\* an exception occurs**, making it not ideal
as an entry point for a CLI. See [runProgram](../../functions/runProgram.md) for a wrapper function
that handles exceptions and sets the exit code for you.

Note: when the special `GracefulEarlyExitError` exception is thrown _from
within a command's handler or builder_, `Executor` will set
`context.state.deepestParseResult` to `NullArguments` and
`context.state.isGracefullyExiting` to `true`. Further, `Executor` **will
not** re-throw the exception in this special case, returning `NullArguments`
instead.

## Parameters

### rawArgv?

`Parameters`\<[`ConfigureArguments`](../../type-aliases/ConfigureArguments.md)\>\[`0`\]

## Returns

`Promise`\<[`Arguments`](../../type-aliases/Arguments.md)\>
