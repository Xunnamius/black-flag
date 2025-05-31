[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / FactoriedRunProgramParameters

# Type Alias: FactoriedRunProgramParameters

> **FactoriedRunProgramParameters** = `RunProgramParametersWithAny` *extends* \[infer \_, `...(infer Tail)`\] ? `Tail` : \[\]

Defined in: [src/index.ts:116](https://github.com/Xunnamius/black-flag/blob/d6004b46e3ac5a451e4e0f05bf5c8726ce157ac9/src/index.ts#L116)

The available call signature parameters of the low-order function returned by
[makeRunner](../functions/makeRunner.md).

This is the same thing as [RunProgramParameters](../../type-aliases/RunProgramParameters.md) but with the first
parameter (i.e. the `commandModulesPath` string) omitted.
