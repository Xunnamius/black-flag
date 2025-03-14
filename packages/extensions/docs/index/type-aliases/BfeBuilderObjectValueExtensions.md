[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeBuilderObjectValueExtensions

# Type Alias: BfeBuilderObjectValueExtensions\<CustomCliArguments, CustomExecutionContext\>

> **BfeBuilderObjectValueExtensions**\<`CustomCliArguments`, `CustomExecutionContext`\>: `object`

Defined in: [packages/extensions/src/index.ts:226](https://github.com/Xunnamius/black-flag/blob/3c3f6e1e60095912b550318378e24dc68e62b7d6/packages/extensions/src/index.ts#L226)

An object containing only those properties recognized by
BFE.

This type + [BfeBuilderObjectValueWithoutExtensions](BfeBuilderObjectValueWithoutExtensions.md) =
[BfeBuilderObjectValue](BfeBuilderObjectValue.md).

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Type declaration

### check?

> `optional` **check**: [`BfeCheckFunction`](BfeCheckFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`BfeCheckFunction`](BfeCheckFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>[]

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
documentation](https://github.com/Xunnamius/black-flag/tree/main/packages/extensions/README.md#check)
for details.

### coerce?

> `optional` **coerce**: [`BfGenericBuilderObjectValue`](BfGenericBuilderObjectValue.md)\[`"coerce"`\]

`coerce` transforms an original `argv` value into another one. This is
equivalent to `coerce` from vanilla yargs.

However, unlike vanilla yargs and Black Flag, the `coerce` function will
_always_ receive an array if the option was configured with `{ array: true
}`.

Note that **a defaulted argument will not result in this function being
called.** Only arguments given via `argv` trigger `coerce`. This is vanilla
yargs behavior.

### conflicts?

> `optional` **conflicts**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

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

### default?

> `optional` **default**: `unknown`

`default` will set a default value for an argument. This is equivalent to
`default` from vanilla yargs.

However, unlike vanilla yargs and Black Flag, this default value is applied
towards the end of BFE's execution, enabling its use alongside keys like
`conflicts`. See [the
documentation](https://github.com/Xunnamius/black-flag/tree/main/packages/extensions/README.md#support-for-default-with-conflictsrequiresetc)
for details.

Note also that a defaulted argument will not be coerced by the `coerce`
setting. Only arguments given via `argv` trigger `coerce`. This is vanilla
yargs behavior.

### demandThisOption?

> `optional` **demandThisOption**: [`BfGenericBuilderObjectValue`](BfGenericBuilderObjectValue.md)\[`"demandOption"`\]

`demandThisOption` enables checks to ensure an argument is always given.
This is equivalent to `demandOption` from vanilla yargs. For example:

```jsonc
{
  "x": { "demandThisOption": true }, // ◄ Disallows ∅, y
  "y": { "demandThisOption": false }
}
```

### demandThisOptionIf?

> `optional` **demandThisOptionIf**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

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

### demandThisOptionOr?

> `optional` **demandThisOptionOr**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

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

### demandThisOptionXor?

> `optional` **demandThisOptionXor**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

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

### implies?

> `optional` **implies**: `Exclude`\<[`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md), `string` \| `unknown`[]\> \| `Exclude`\<[`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md), `string` \| `unknown`[]\>[]

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

 - [BfeBuilderObjectValueExtensions.looseImplications](BfeBuilderObjectValueExtensions.md#looseimplications)
 - [BfeBuilderObjectValueExtensions.vacuousImplications](BfeBuilderObjectValueExtensions.md#vacuousimplications)

### looseImplications?

> `optional` **looseImplications**: `boolean`

When `looseImplications` is set to `true`, any implied arguments, when
explicitly given on the command line, will _override_ their configured
implications instead of causing an error.

#### Default

```ts
false
```

#### See

[BfeBuilderObjectValueExtensions.implies](BfeBuilderObjectValueExtensions.md#implies)

### requires?

> `optional` **requires**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

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

### subOptionOf?

> `optional` **subOptionOf**: `Record`\<`string`, [`BfeSubOptionOfExtensionValue`](BfeSubOptionOfExtensionValue.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`BfeSubOptionOfExtensionValue`](BfeSubOptionOfExtensionValue.md)\<`CustomCliArguments`, `CustomExecutionContext`\>[]\>

`subOptionOf` is declarative sugar around Black Flag's support for double
argument parsing, allowing you to describe the relationship between options
and the suboptions whose configurations they determine.

See [the
documentation](https://github.com/Xunnamius/black-flag/tree/main/packages/extensions/README.md#suboptionof)
for details.

For describing simpler implicative relations, see `implies`.

### vacuousImplications?

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

[BfeBuilderObjectValueExtensions.implies](BfeBuilderObjectValueExtensions.md#implies)
