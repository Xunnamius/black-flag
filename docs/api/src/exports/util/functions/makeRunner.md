[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / makeRunner

# Function: makeRunner()

> **makeRunner**\<`CustomCliArguments`\>(`options`): (...`args`) => [`RunProgramReturnType`](../../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:538](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/index.ts#L538)

A "high-order" factory function that returns a "low-order" curried
[runProgram](../../functions/runProgram.md) function that can be called multiple times while only
having to provide a subset of the required parameters.

This is useful when unit/integration testing a CLI, which will likely require
multiple calls to `runProgram(...)`.

**BE AWARE**: when an exception (e.g. bad CLI arguments) occurs in the
low-order function, `process.exitCode` is set to the appropriate value, the
[ConfigureErrorHandlingEpilogue](../../type-aliases/ConfigureErrorHandlingEpilogue.md) hook is triggered, and either
`NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
is returned. Otherwise, upon success, `Arguments` is returned.

In other words: **the promise returned by the low-order function will never
reject and no exception will ever be thrown.** Keep this in mind when writing
unit tests and see [runProgram](../../functions/runProgram.md) for more details.

Ideally, testing for the presence of errors should be done by capturing
output sent to `process.stderr` (e.g. `console.error`)—or by interrogating
whichever error handling method was implemented in
[ConfigureErrorHandlingEpilogue](../../type-aliases/ConfigureErrorHandlingEpilogue.md)—since that is what end-users will see
and experience. That said, if it would be more optimal to test against an
actual thrown error, set `makeRunner`'s `errorHandlingBehavior` option to
`'throw'`.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Parameters

### options

[`MakeRunnerOptions`](../type-aliases/MakeRunnerOptions.md)

## Returns

`Function`

### Parameters

#### args

\[\] | \[`Promisable`\<[`ConfigurationHooks`](../../type-aliases/ConfigurationHooks.md)\>\] | \[`Promisable`\<[`PreExecutionContext`](../type-aliases/PreExecutionContext.md)\>\] | \[`string` \| `string`[]\] | \[`string` \| `string`[], `Promisable`\<[`ConfigurationHooks`](../../type-aliases/ConfigurationHooks.md)\>\] | \[`string` \| `string`[], `Promisable`\<[`PreExecutionContext`](../type-aliases/PreExecutionContext.md)\>\]

### Returns

[`RunProgramReturnType`](../../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>
