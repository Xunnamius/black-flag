[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / withUsageExtensions

# Function: withUsageExtensions()

## Call Signature

> **withUsageExtensions**(`altDescription?`): `string`

Defined in: [packages/extensions/src/index.ts:1420](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L1420)

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

Defined in: [packages/extensions/src/index.ts:1421](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L1421)

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

Defined in: [packages/extensions/src/index.ts:1425](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L1425)

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

Defined in: [packages/extensions/src/index.ts:1426](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L1426)

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
