[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / withUsageExtensions

# Function: withUsageExtensions()

> **withUsageExtensions**(`altDescription`, `__namedParameters`): `string`

Defined in: [packages/extensions/src/index.ts:1368](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/packages/extensions/src/index.ts#L1368)

Generate command usage text consistently yet flexibly.

Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
`$1.`

## Parameters

### altDescription

`string` = `'$1.'`

### \_\_namedParameters

#### appendPeriod?

`boolean` = `true`

Whether a period will be appended to the resultant string or not. A
period is only appended if one is not already appended.

**Default**

```ts
true
```

#### includeOptions?

`boolean` = `prependNewlines`

Whether the string `' [...options]'` will be appended to the first line of usage text

**Default**

```ts
options.prependNewlines
```

#### prependNewlines?

`boolean` = `true`

Whether newlines will be prepended to `altDescription` or not.

**Default**

```ts
true
```

#### trim?

`boolean` = `true`

Whether `altDescription` will be `trim()`'d or not.

**Default**

```ts
true
```

## Returns

`string`
