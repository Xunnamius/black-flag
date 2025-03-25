[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / RunProgramParameters

# Type Alias: RunProgramParameters

> **RunProgramParameters** = \[`string`\] \| \[`string`, `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\] \| \[`string`, `Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>\] \| \[`string`, `string` \| `string`[]\] \| \[`string`, `string` \| `string`[], `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\] \| \[`string`, `string` \| `string`[], `Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>\]

Defined in: [src/index.ts:68](https://github.com/Xunnamius/black-flag/blob/f3086f07a0f4cf661850599e370f220c47febbd1/src/index.ts#L68)

The available call signature parameters of the [runProgram](../functions/runProgram.md) function.

The first parameter is always the required `commandModulesPath` string,
optionally followed by `argv` string/array, and then either a
[ConfigurationHooks](ConfigurationHooks.md) or [PreExecutionContext](../util/type-aliases/PreExecutionContext.md) instance (or a
promise that returns them).
