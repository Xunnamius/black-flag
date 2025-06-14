[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / WithUsageExtensionsConfig

# Type Alias: WithUsageExtensionsConfig

> **WithUsageExtensionsConfig** = `object`

Defined in: [packages/extensions/src/index.ts:746](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L746)

A configuration object that further configures the behavior of
[withUsageExtensions](../functions/withUsageExtensions.md).

## Properties

### altDescription?

> `optional` **altDescription**: `string`

Defined in: [packages/extensions/src/index.ts:753](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L753)

The result of calling this function defaults to: `Usage:
$000\n\n${altDescription}`.

#### Default

```ts
"$1."
```

***

### appendPeriod?

> `optional` **appendPeriod**: `boolean`

Defined in: [packages/extensions/src/index.ts:766](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L766)

Whether a period will be appended to the resultant string or not. A
period is only appended if one is not already appended.

#### Default

```ts
true
```

***

### includeOptions?

> `optional` **includeOptions**: `boolean`

Defined in: [packages/extensions/src/index.ts:779](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L779)

Whether the string `' [...options]'` will be appended to the first line
of usage text (after `includeSubCommand`).

#### Default

```ts
options.prependNewlines
```

***

### includeSubCommand?

> `optional` **includeSubCommand**: `boolean` \| `"required"`

Defined in: [packages/extensions/src/index.ts:787](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L787)

Whether some variation of the string `' [subcommand]'` will be appended
to the first line of usage text (before `includeOptions`). Set to `true`
or `required` when generating usage for a command with subcommands.

#### Default

```ts
false
```

***

### prependNewlines?

> `optional` **prependNewlines**: `boolean`

Defined in: [packages/extensions/src/index.ts:772](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L772)

Whether newlines will be prepended to `altDescription` or not.

#### Default

```ts
true
```

***

### trim?

> `optional` **trim**: `boolean`

Defined in: [packages/extensions/src/index.ts:759](https://github.com/Xunnamius/black-flag/blob/55cfbcd0072708351b7f32c809d598866a5f7476/packages/extensions/src/index.ts#L759)

Whether `altDescription` will be `trim()`'d or not.

#### Default

```ts
true
```
