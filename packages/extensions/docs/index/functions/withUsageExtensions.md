[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / withUsageExtensions

# Function: withUsageExtensions()

## Call Signature

> **withUsageExtensions**(`altDescription?`): `string`

Defined in: [packages/extensions/src/index.ts:1427](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L1427)

Generate command usage text consistently yet flexibly.

Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
`"$1."`.

### Parameters

#### altDescription?

`string`

### Returns

`string`

## Call Signature

> **withUsageExtensions**(`altDescription?`, `config?`): `string`

Defined in: [packages/extensions/src/index.ts:1428](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L1428)

Generate command usage text consistently yet flexibly.

Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
`"$1."`.

### Parameters

#### altDescription?

`string`

#### config?

`Omit`\<[`WithUsageExtensionsConfig`](../type-aliases/WithUsageExtensionsConfig.md), `"altDescription"`\>

### Returns

`string`

## Call Signature

> **withUsageExtensions**(`config?`): `string`

Defined in: [packages/extensions/src/index.ts:1432](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L1432)

Generate command usage text consistently yet flexibly.

Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
`"$1."`.

### Parameters

#### config?

[`WithUsageExtensionsConfig`](../type-aliases/WithUsageExtensionsConfig.md)

### Returns

`string`

## Call Signature

> **withUsageExtensions**(`config?`, `moreConfig?`): `string`

Defined in: [packages/extensions/src/index.ts:1433](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L1433)

Generate command usage text consistently yet flexibly.

Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
`"$1."`.

### Parameters

#### config?

`string` | [`WithUsageExtensionsConfig`](../type-aliases/WithUsageExtensionsConfig.md)

#### moreConfig?

`Omit`\<[`WithUsageExtensionsConfig`](../type-aliases/WithUsageExtensionsConfig.md), `"altDescription"`\>

### Returns

`string`
