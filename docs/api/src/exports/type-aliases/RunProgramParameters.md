[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / RunProgramParameters

# Type Alias: RunProgramParameters

> **RunProgramParameters** = `RunProgramParametersWithAny` \| \[`string`, `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\] \| \[`string`, `string` \| `string`[], `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\]

Defined in: [src/index.ts:91](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/index.ts#L91)

The available call signature parameters of the [runProgram](../functions/runProgram.md) function.

The first parameter is always the required `commandModulesPath` string,
optionally followed by `argv` string/array, and then either a * [ConfigurationHooks](ConfigurationHooks.md) or [PreExecutionContext](../util/type-aliases/PreExecutionContext.md) instance (or a
promise that returns them).
