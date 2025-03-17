[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / FactoriedRunProgramParameters

# Type Alias: FactoriedRunProgramParameters

> **FactoriedRunProgramParameters** = [`RunProgramParameters`](../../type-aliases/RunProgramParameters.md) *extends* \[infer \_, `...(infer Tail)`\] ? `Tail` : \[\]

Defined in: [src/index.ts:102](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/index.ts#L102)

The available call signature parameters of the low-order function returned by
[makeRunner](../functions/makeRunner.md).

This is the same thing as [RunProgramParameters](../../type-aliases/RunProgramParameters.md) but with the first
parameter (i.e. the `commandModulesPath` string) omitted.
