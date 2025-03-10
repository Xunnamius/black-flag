[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / withUsageExtensions

# Function: withUsageExtensions()

> **withUsageExtensions**(`altDescription`, `__namedParameters`): `string`

Defined in: [packages/extensions/src/index.ts:1336][3]

Generate command usage text consistently yet flexibly.

Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
`$1.`

## Parameters

### Altdescription

`string` = `'$1.'`

### \_\_namedparameters

#### Appendperiod?

`boolean` = `true`

Whether a period will be appended to the resultant string or not. A
period is only appended if one is not already appended.

**Default**

```ts
true
```

#### Includeoptions?

`boolean` = `prependNewlines`

Whether the string `' [...options]'` will be appended to the first line of usage text

**Default**

```ts
options.prependNewlines
```

#### Prependnewlines?

`boolean` = `true`

Whether newlines will be prepended to `altDescription` or not.

**Default**

```ts
true
```

#### Trim?

`boolean` = `true`

Whether `altDescription` will be `trim()`'d or not.

**Default**

```ts
true
```

## Returns

`string`

[1]: ../../README.md
[2]: ../README.md
[3]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L1336
