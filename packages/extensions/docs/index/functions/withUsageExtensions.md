[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / withUsageExtensions

# Function: withUsageExtensions()

> **withUsageExtensions**(`__namedParameters`): `string`

Defined in: [packages/extensions/src/index.ts:1379](https://github.com/Xunnamius/black-flag/blob/65863debdad33d702508c3459cced432c1437abf/packages/extensions/src/index.ts#L1379)

Generate command usage text consistently yet flexibly.

Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
`"$1."`.

## Parameters

### \_\_namedParameters

#### altDescription?

`string` = `'$1.'`

The result of calling this function defaults to: `Usage:
$000\n\n${altDescription}`.

**Default**

```ts
"$1."
```

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

Whether the string `' [...options]'` will be appended to the first line
of usage text (after `includeSubCommand`).

**Default**

```ts
options.prependNewlines
```

#### includeSubCommand?

`boolean` \| `"required"` = `false`

Whether some variation of the string `' [subcommand]'` will be appended
to the first line of usage text (before `includeOptions`). Set to `true`
or `required` when generating usage for a command with subcommands.

**Default**

```ts
false
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
