[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / FactoriedRunProgramParameters

# Type Alias: FactoriedRunProgramParameters

> **FactoriedRunProgramParameters** = [`RunProgramParameters`](../../type-aliases/RunProgramParameters.md) *extends* \[infer \_, `...(infer Tail)`\] ? `Tail` : \[\]

Defined in: [src/index.ts:104](https://github.com/Xunnamius/black-flag/blob/d52d6ef8a8da5a82b265a7ff9d65b74350896d3b/src/index.ts#L104)

The available call signature parameters of the low-order function returned by
[makeRunner](../functions/makeRunner.md).

This is the same thing as [RunProgramParameters](../../type-aliases/RunProgramParameters.md) but with the first
parameter (i.e. the `commandModulesPath` string) omitted.
