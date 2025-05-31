[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / RunProgramParameters

# Type Alias: RunProgramParameters

> **RunProgramParameters** = `RunProgramParametersWithAny` \| \[`string`, `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\] \| \[`string`, `string` \| `string`[], `Promisable`\<[`ConfigurationHooks`](ConfigurationHooks.md)\>\]

Defined in: [src/index.ts:92](https://github.com/Xunnamius/black-flag/blob/d6004b46e3ac5a451e4e0f05bf5c8726ce157ac9/src/index.ts#L92)

The available call signature parameters of the [runProgram](../functions/runProgram.md) function.

The first parameter is always the required `commandModulesPath` string,
optionally followed by `argv` string/array, and then either a * [ConfigurationHooks](ConfigurationHooks.md) or [PreExecutionContext](../util/type-aliases/PreExecutionContext.md) instance (or a
promise that returns them).
