[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / FactoriedRunProgramParameters

# Type Alias: FactoriedRunProgramParameters

> **FactoriedRunProgramParameters** = `RunProgramParametersWithAny` *extends* \[infer \_, `...(infer Tail)`\] ? `Tail` : \[\]

Defined in: [src/index.ts:115](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/index.ts#L115)

The available call signature parameters of the low-order function returned by
[makeRunner](../functions/makeRunner.md).

This is the same thing as [RunProgramParameters](../../type-aliases/RunProgramParameters.md) but with the first
parameter (i.e. the `commandModulesPath` string) omitted.
