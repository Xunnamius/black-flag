[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / RunProgramParameters

# Type Alias: RunProgramParameters

> **RunProgramParameters**: \[`string`\] \| \[`string`, `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\] \| \[`string`, `Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>\] \| \[`string`, `string` \| `string`[]\] \| \[`string`, `string` \| `string`[], `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\] \| \[`string`, `string` \| `string`[], `Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>\]

Defined in: [src/index.ts:67](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/index.ts#L67)

The available call signature parameters of the [runProgram](../functions/runProgram.md) function.

The first parameter is always the required `commandModulesPath` string,
optionally followed by `argv` string/array, and then either a
[ConfigurationHooks](ConfigurationHooks.md) or [PreExecutionContext](../util/type-aliases/PreExecutionContext.md) instance (or a
promise that returns them).
