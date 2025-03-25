[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / FactoriedRunProgramParameters

# Type Alias: FactoriedRunProgramParameters

> **FactoriedRunProgramParameters** = [`RunProgramParameters`](../../type-aliases/RunProgramParameters.md) *extends* \[infer \_, `...(infer Tail)`\] ? `Tail` : \[\]

Defined in: [src/index.ts:103](https://github.com/Xunnamius/black-flag/blob/f3086f07a0f4cf661850599e370f220c47febbd1/src/index.ts#L103)

The available call signature parameters of the low-order function returned by
[makeRunner](../functions/makeRunner.md).

This is the same thing as [RunProgramParameters](../../type-aliases/RunProgramParameters.md) but with the first
parameter (i.e. the `commandModulesPath` string) omitted.
