[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / RunProgramParameters

# Type Alias: RunProgramParameters

> **RunProgramParameters** = \[`string`\] \| \[`string`, `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\] \| \[`string`, `Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>\] \| \[`string`, `string` \| `string`[]\] \| \[`string`, `string` \| `string`[], `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\] \| \[`string`, `string` \| `string`[], `Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>\]

Defined in: [src/index.ts:69](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/index.ts#L69)

The available call signature parameters of the [runProgram](../functions/runProgram.md) function.

The first parameter is always the required `commandModulesPath` string,
optionally followed by `argv` string/array, and then either a
[ConfigurationHooks](ConfigurationHooks.md) or [PreExecutionContext](../util/type-aliases/PreExecutionContext.md) instance (or a
promise that returns them).
