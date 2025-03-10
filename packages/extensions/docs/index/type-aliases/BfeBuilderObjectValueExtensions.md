[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / BfeBuilderObjectValueExtensions

# Type Alias: BfeBuilderObjectValueExtensions\<CustomCliArguments, CustomExecutionContext>

> **BfeBuilderObjectValueExtensions**<`CustomCliArguments`, `CustomExecutionContext`>: `object`

Defined in: [packages/extensions/src/index.ts:226][3]

An object containing only those properties recognized by
BFE.

This type + [BfeBuilderObjectValueWithoutExtensions][4] =
[BfeBuilderObjectValue][5].

## Type Parameters

• **CustomCliArguments** _extends_ `Record`<`string`, `unknown`>

• **CustomExecutionContext** _extends_ `ExecutionContext`

## Type Declaration

### Check?

> `optional` **check**: [`BfeCheckFunction`][6]<`CustomCliArguments`, `CustomExecutionContext`> | [`BfeCheckFunction`][6]<`CustomCliArguments`, `CustomExecutionContext`>\[]

`check` is the declarative option-specific version of vanilla yargs's
`yargs::check()`. Also supports async and promise-returning functions.

This function receives the `currentArgumentValue`, which you are free to
type as you please, and the fully parsed `argv`. If this function throws,
the exception will bubble. If this function returns an instance of `Error`,
a string, or any non-truthy value (including `undefined` or not returning
anything), Black Flag will throw a `CliError` on your behalf.

You may also pass an array of check functions, each being executed after
the other. Note that providing an array of one or more async check
functions will result in them being awaited concurrently.

See [the
documentation][7]
for details.

### Coerce?

> `optional` **coerce**: [`BfGenericBuilderObjectValue`][8]\[`"coerce"`]

`coerce` transforms an original `argv` value into another one. This is
equivalent to `coerce` from vanilla yargs.

However, unlike vanilla yargs and Black Flag, the `coerce` function will
_always_ receive an array if the option was configured with `{ array: true
}`.

Note that **a defaulted argument will not result in this function being
called.** Only arguments given via `argv` trigger `coerce`. This is vanilla
yargs behavior.

### Conflicts?

> `optional` **conflicts**: [`BfeBuilderObjectValueExtensionValue`][9]

`conflicts` enables checks to ensure the specified arguments, or
argument-value pairs, are _never_ given conditioned on the existence of
another argument. For example:

```jsonc
{
  "x": { "conflicts": "y" }, // ◄ Disallows y if x is given
  "y": {}
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

### Default?

> `optional` **default**: `unknown`

`default` will set a default value for an argument. This is equivalent to
`default` from vanilla yargs.

However, unlike vanilla yargs and Black Flag, this default value is applied
towards the end of BFE's execution, enabling its use alongside keys like
`conflicts`. See [the
documentation][10]
for details.

Note also that a defaulted argument will not be coerced by the `coerce`
setting. Only arguments given via `argv` trigger `coerce`. This is vanilla
yargs behavior.

### Demandthisoption?

> `optional` **demandThisOption**: [`BfGenericBuilderObjectValue`][8]\[`"demandOption"`]

`demandThisOption` enables checks to ensure an argument is always given.
This is equivalent to `demandOption` from vanilla yargs. For example:

```jsonc
{
  "x": { "demandThisOption": true }, // ◄ Disallows ∅, y
  "y": { "demandThisOption": false }
}
```

### Demandthisoptionif?

> `optional` **demandThisOptionIf**: [`BfeBuilderObjectValueExtensionValue`][9]

`demandThisOptionIf` enables checks to ensure an argument is given when at
least one of the specified groups of arguments, or argument-value pairs, is
also given. For example:

```jsonc
{
  "x": {},
  "y": { "demandThisOptionIf": "x" }, // ◄ Demands y if x is given
  "z": { "demandThisOptionIf": "x" } // ◄ Demands z if x is given
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

### Demandthisoptionor?

> `optional` **demandThisOptionOr**: [`BfeBuilderObjectValueExtensionValue`][9]

`demandThisOptionOr` enables non-optional inclusive disjunction checks per
group. Put another way, `demandThisOptionOr` enforces a "logical or"
relation within groups of required options. For example:

```jsonc
{
  "x": { "demandThisOptionOr": ["y", "z"] }, // ◄ Demands x or y or z
  "y": { "demandThisOptionOr": ["x", "z"] },
  "z": { "demandThisOptionOr": ["x", "y"] }
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

### Demandthisoptionxor?

> `optional` **demandThisOptionXor**: [`BfeBuilderObjectValueExtensionValue`][9]

`demandThisOptionXor` enables non-optional exclusive disjunction checks per
exclusivity group. Put another way, `demandThisOptionXor` enforces mutual
exclusivity within groups of required options. For example:

```jsonc
{
  // ▼ Disallows ∅, z, w, xy, xyw, xyz, xyzw
  "x": { "demandThisOptionXor": ["y"] },
  "y": { "demandThisOptionXor": ["x"] },
  // ▼ Disallows ∅, x, y, zw, xzw, yzw, xyzw
  "z": { "demandThisOptionXor": ["w"] },
  "w": { "demandThisOptionXor": ["z"] }
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

### Implies?

> `optional` **implies**: `Exclude`<[`BfeBuilderObjectValueExtensionValue`][9], `string` | `unknown`\[]> | `Exclude`<[`BfeBuilderObjectValueExtensionValue`][9], `string` | `unknown`\[]>\[]

`implies` will set default values for the specified arguments conditioned
on the existence of another argument. These implied defaults will override
any `default` configurations of the specified arguments.

If any of the specified arguments are explicitly given on the command line,
their values must match the specified argument-value pairs respectively
(which is the behavior of `requires`/`conflicts`). Use `looseImplications`
to modify this behavior.

Hence, `implies` only accepts one or more argument-value pairs and not raw
strings. For example:

```jsonc
{
  "x": { "implies": { "y": true } }, // ◄ x is now synonymous with xy
  "y": {}
}
```

#### See

- [BfeBuilderObjectValueExtensions.looseImplications][11]
- [BfeBuilderObjectValueExtensions.vacuousImplications][12]

### Looseimplications?

> `optional` **looseImplications**: `boolean`

When `looseImplications` is set to `true`, any implied arguments, when
explicitly given on the command line, will _override_ their configured
implications instead of causing an error.

#### Default

```ts
false
```

#### See

[BfeBuilderObjectValueExtensions.implies][13]

### Requires?

> `optional` **requires**: [`BfeBuilderObjectValueExtensionValue`][9]

`requires` enables checks to ensure the specified arguments, or
argument-value pairs, are given conditioned on the existence of another
argument. For example:

```jsonc
{
  "x": { "requires": "y" }, // ◄ Disallows x without y
  "y": {}
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

### Suboptionof?

> `optional` **subOptionOf**: `Record`<`string`, [`BfeSubOptionOfExtensionValue`][14]<`CustomCliArguments`, `CustomExecutionContext`> | [`BfeSubOptionOfExtensionValue`][14]<`CustomCliArguments`, `CustomExecutionContext`>\[]>

`subOptionOf` is declarative sugar around Black Flag's support for double
argument parsing, allowing you to describe the relationship between options
and the suboptions whose configurations they determine.

See [the
documentation][15]
for details.

For describing simpler implicative relations, see `implies`.

### Vacuousimplications?

> `optional` **vacuousImplications**: `boolean`

When `vacuousImplications` is set to `true` and the option is also
configured as a "boolean" type, the implications configured via `implies`
will still be applied to `argv` even if said option has a `false` value in
`argv`. In the same scenario except with `vacuousImplications` set to
`false`, the implications configured via `implies` are instead ignored.

#### Default

```ts
false
```

#### See

[BfeBuilderObjectValueExtensions.implies][13]

[1]: ../../README.md
[2]: ../README.md
[3]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L226
[4]: BfeBuilderObjectValueWithoutExtensions.md
[5]: BfeBuilderObjectValue.md
[6]: BfeCheckFunction.md
[7]: https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#check
[8]: BfGenericBuilderObjectValue.md
[9]: BfeBuilderObjectValueExtensionValue.md
[10]: https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#support-for-default-with-conflictsrequiresetc
[11]: BfeBuilderObjectValueExtensions.md#looseimplications
[12]: BfeBuilderObjectValueExtensions.md#vacuousimplications
[13]: BfeBuilderObjectValueExtensions.md#implies
[14]: BfeSubOptionOfExtensionValue.md
[15]: https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#suboptionof
