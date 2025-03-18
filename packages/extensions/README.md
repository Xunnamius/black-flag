<!-- symbiote-template-region-start 1 -->

<p align="center" width="100%">
  <img width="300" src="https://raw.githubusercontent.com/Xunnamius/black-flag/refs/heads/main/packages/extensions/logo.png">
</p>

<p align="center" width="100%">
<!-- symbiote-template-region-end -->
A collection of set-theoretic declarative-first APIs for Yargs and <a href="https://github.com/Xunnamius/black-flag">Black Flag</a>
<!-- symbiote-template-region-start 2 -->
</p>

<hr />

<div align="center">

[![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]
[![Last commit timestamp][x-badge-lastcommit-image]][x-badge-repo-link]
[![Codecov][x-badge-codecov-image]][x-badge-codecov-link]
[![Source license][x-badge-license-image]][x-badge-license-link]
[![Uses Semantic Release!][x-badge-semanticrelease-image]][x-badge-semanticrelease-link]

[![NPM version][x-badge-npm-image]][x-badge-npm-link]
[![Monthly Downloads][x-badge-downloads-image]][x-badge-downloads-link]

</div>

<br />

# @black-flag/extensions 🏴

<!-- symbiote-template-region-end -->

Black Flag Extensions (BFE) is a collection of surprisingly simple set-theoretic
APIs that wrap Black Flag commands' exports to provide a bevy of new declarative
features, some of which are heavily inspired by [Yargs's GitHub Issues
reports][1]. It's like type-fest or jest-extended, but for Black Flag and Yargs!

In exchange for straying a bit from the vanilla Yargs API, BFE greatly increases
Black Flag's declarative powers.

Note that BFE does not represent a [complete][2] [propositional logic][3] and so
cannot describe every possible relation between arguments. Nor should it; BFE
makes it easy to fall back to using the Yargs API imperatively in those rare
instances it's necessary.

<!-- symbiote-template-region-start 3 -->

---

<!-- remark-ignore-start -->
<!-- symbiote-template-region-end -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Usage](#usage)
  - [`withBuilderExtensions`](#withbuilderextensions)
  - [`withUsageExtensions`](#withusageextensions)
  - [`getInvocableExtendedHandler`](#getinvocableextendedhandler)
- [Examples](#examples)
  - [Example 1](#example-1)
  - [Example 2](#example-2)
- [Appendix 🏴](#appendix-)
  - [Differences between Black Flag Extensions and Yargs](#differences-between-black-flag-extensions-and-yargs)
  - [Black Flag versus Black Flag Extensions](#black-flag-versus-black-flag-extensions)
  - [Published Package Details](#published-package-details)
  - [License](#license)
- [Contributing and Support](#contributing-and-support)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- symbiote-template-region-start 4 -->
<!-- remark-ignore-end -->

<br />

## Install

<!-- symbiote-template-region-end -->

To install:

```shell
npm install @black-flag/extensions
```

## Usage

> [!NOTE]
>
> See also: [differences between BFE and Yargs][4].

> [!WARNING]
>
> Most of the examples in this section are using hyphen characters followed by a
> [word joiner character][5] to prevent breaking example awkwardly across lines.
> Be cautious copying and pasting examples.

### `withBuilderExtensions`

> ⪢ API reference: [`withBuilderExtensions`][6]

This function enables several additional options-related units of functionality
via analysis of the returned options configuration object and the parsed command
line arguments (i.e. `argv`).

```javascript
import { withBuilderExtensions } from '@black-flag/extensions';

export default function command({ state }) {
  const [builder, withHandlerExtensions] = withBuilderExtensions(
    (blackFlag, helpOrVersionSet, argv) => {
      blackFlag.strict(false);

      // ▼ The "returned options configuration object"
      return {
        'my-argument': {
          alias: ['arg1'],
          demandThisOptionXor: ['arg2'],
          string: true
        },
        arg2: {
          boolean: true,
          demandThisOptionXor: ['my-argument']
        }
      };
    },
    { disableAutomaticGrouping: true }
  );

  return {
    name: 'my-command',
    builder,
    handler: withHandlerExtensions(({ myArgument, arg2 }) => {
      state.outputManager.log(
        'Executing command with arguments: arg1=${myArgument} arg2=${arg2}'
      );
    })
  };
}
```

Note how, in the previous example, the option names passed to configuration
keys, e.g. `{ demandThisOptionXor: ['my-argument'] }`, are represented by their
exact _canonical_ names as defined (e.g. `'my-⁠argument'`) and not their aliases
(`'arg1'`) or camel-case expanded forms (`'myArgument'`). All BFE configuration
keys expect canonical option names in this way; passing an alias or a camel-case
expansion will result in erroneous behavior.

In the same vein, `withBuilderExtensions` will throw if you attempt to add a
command option with a name, alias, or camel-case expansion that conflicts with
another of that command's options. This sanity check takes into account the
following [yargs-parser][7] configuration settings: `camel-case-expansion`,
`strip-aliased`, `strip-dashed`.

Also note how `withBuilderExtensions` returns a two-element array of the form:
`[builder, withHandlerExtensions]`. [`builder`][8] should be exported as your
command's [`builder`][8] function **without being invoked**. If you want to
implement additional imperative logic, pass a `customBuilder` _function_ to
`withBuilderExtensions` as demonstrated in the previous example; otherwise, you
should pass an options configuration _object_.

On the other hand, `withHandlerExtensions` **should be invoked immediately**,
and its return value should be exported as your command's [`handler`][9]
function as demonstrated in the previous example. You should pass a
`customHandler` to `withHandlerExtensions` upon invocation, though this is not
required. If you call `withHandlerExtensions()` without providing a
`customHandler`, a placeholder function that throws `CommandNotImplementedError`
will be used instead, indicating that the command has not yet been implemented.
This mirrors [Black Flag's default behavior for unimplemented command
handlers][10].

#### New Option Configuration Keys

This section details the new configuration keys made available by BFE, each
implementing an options-related unit of functionality beyond that offered by
vanilla Yargs and Black Flag.

Note that the checks enabled by these configuration keys:

- Are run on Black Flag's [second parsing pass][11] except where noted. This
  allows BFE to perform checks against argument _values_ in addition to the
  argument existence checks enabled by vanilla Yargs.

- Will ignore the existence of the [`default`][12] key ([unless it's a custom
  check][13]). This means you can use keys like [`requires`][14] and
  [`conflicts`][15] alongside [`default`][12] without causing unresolvable CLI
  errors. This avoids a rather unintuitive [Yargs footgun][16].

- Will take into account the following [yargs-parser settings][7] configuration
  settings: `camel-case-expansion`, `strip-aliased`, `strip-dashed`. Note that
  `dot-notation` is _not_ currently recognized or considered by BFE, but may be
  in the future.

**Logical Keys**

> [!NOTE]
>
> In the below definitions, `P`, `Q`, and `R` are arguments (or argument-value
> pairs) configured via a hypothetical call to
> [`blackFlag.options({ P: { [key]: [Q, R] }})`][17]. The [truth values][3] of
> `P`, `Q`, and `R` as described in the "Definition" column represent the
> existence of each respective argument (and its value) in the `argv` parse
> result. `gwav` is a predicate standing for "given with any value," meaning the
> argument was given on the command line.

| Key                         | Definition                                    |
| :-------------------------- | :-------------------------------------------- |
| [`requires`][14]            | `P ⟹ (Q ∧ R)` or `¬P ∨ (Q ∧ R)`               |
| [`conflicts`][15]           | `P ⟹ (¬Q ∧ ¬R)` or `¬P ∨ (¬Q ∧ ¬R)`           |
| [`implies`][18]             | `P ⟹ (Q ∧ R ∧ (gwav(Q) ⟹ Q) ∧ (gwav(R) ⟹ R))` |
| [`demandThisOptionIf`][19]  | `(Q ∨ R) ⟹ P` or `P ∨ (¬Q ∧ ¬R)`              |
| [`demandThisOption`][20]    | `P`                                           |
| [`demandThisOptionOr`][21]  | `P ∨ Q ∨ R`                                   |
| [`demandThisOptionXor`][22] | `P ⊕ Q ⊕ R`                                   |

**Relational Keys**

| Key                         |
| :-------------------------- |
| [`check`][13]               |
| [`subOptionOf`][23]         |
| [`looseImplications`][24]   |
| [`vacuousImplications`][25] |

---

##### `requires`

> ⪢ API reference: [`requires`][26]

> [!IMPORTANT]
>
> `requires` is a superset of and replacement for vanilla Yargs's
> [`implies`][27]. BFE also has [its own implication implementation][18].

`requires` enables checks to ensure the specified arguments, or argument-value
pairs, are given conditioned on the existence of another argument. For example:

```jsonc
{
  "x": { "requires": "y" }, // ◄ Disallows x without y
  "y": {}
}
```

This configuration will trigger a check to ensure that `-⁠y` is given whenever
`-⁠x` is given.

`requires` also supports checks against the parsed _values_ of arguments in
addition to the argument existence checks demonstrated above. For example:

```jsonc
{
  // ▼ Disallows x unless y == 'one' and z is given
  "x": { "requires": [{ "y": "one" }, "z"] },
  "y": {},
  "z": { "requires": "y" } // ◄ Disallows z unless y is given
}
```

This configuration allows the following arguments: no arguments (`∅`),
`-⁠y=...`, `-⁠y=... -⁠z`, `-⁠xz -⁠y=one`; and disallows: `-⁠x`, `-⁠z`,
`-⁠x -⁠y=...`, `-⁠xz -⁠y=...`, `-⁠xz`.

Note that, when performing a check using the parsed value of an argument and
that argument is configured as an array (`{ array: true }`), that array will be
searched for said value. Otherwise, a strict deep equality check is performed.

###### `requires` versus `implies`

Choose [BFE's `implies`][18] over `requires` when you want one argument to imply
the value of another _without_ requiring the other argument to be explicitly
given in `argv` (e.g. via the command line).

---

##### `conflicts`

> ⪢ API reference: [`conflicts`][28]

> [!IMPORTANT]
>
> `conflicts` is a superset of vanilla Yargs's [`conflicts`][29].

`conflicts` enables checks to ensure the specified arguments, or argument-value
pairs, are _never_ given conditioned on the existence of another argument. For
example:

```jsonc
{
  "x": { "conflicts": "y" }, // ◄ Disallows y if x is given
  "y": {}
}
```

This configuration will trigger a check to ensure that `-⁠y` is never given
whenever `-⁠x` is given.

`conflicts` also supports checks against the parsed _values_ of arguments in
addition to the argument existence checks demonstrated above. For example:

```jsonc
{
  // ▼ Disallows y == 'one' or z if x is given
  "x": { "conflicts": [{ "y": "one" }, "z"] },
  "y": {},
  "z": { "conflicts": "y" } // ◄ Disallows y if z is given
}
```

This configuration allows the following arguments: no arguments (`∅`),
`-⁠y=...`, `-⁠x`, `-⁠z`, `-⁠x -⁠y=...`; and disallows: `-⁠y=... -⁠z`,
`-⁠x -⁠y=one`, `-⁠xz -⁠y=one`, `-⁠xz`.

Note that, when performing a check using the parsed value of an argument and
that argument is configured as an array (`{ array: true }`), that array will be
searched for said value. Otherwise, a strict deep equality check is performed.

###### `conflicts` versus `implies`

Choose [BFE's `implies`][18] over `conflicts` when you want the existence of one
argument to override the default/given value of another argument while not
preventing the two arguments from being given simultaneously.

---

##### `implies`

> ⪢ API reference: [`implies`][30]

> [!IMPORTANT]
>
> BFE's `implies` replaces vanilla Yargs's `implies` in a breaking way. The two
> implementations are nothing alike. If you're looking for vanilla Yargs's
> functionality, see [`requires`][14].

`implies` will set a default value for the specified arguments conditioned on
the existence of another argument. This will _override_ the default value of the
specified arguments.

Unless [`looseImplications`][24] is set to `true`, if any of the specified
arguments are explicitly given in `argv` (e.g. via the command line), their
values must match the specified argument-value pairs respectively (similar to
[`requires`][14]/[`conflicts`][15]). For this reason, `implies` only accepts one
or more argument-value pairs and not raw strings. For example:

```jsonc
{
  "x": { "implies": { "y": true } }, // ◄ x becomes synonymous with xy
  "y": {}
}
```

This configuration makes it so that `-⁠x` and `-⁠x -⁠y=true` result in the exact
same `argv`. Further, unlike `requires`, `implies` _makes no demands on argument
existence_ and so allows the following arguments: no arguments (`∅`), `-⁠x`,
`-⁠y=true`, `-⁠y=false`, `-⁠x -⁠y=true`; and disallows: `-⁠x -⁠y=false`.

Note that attempting to imply a value for a non-existent option will throw a
framework error.

Additionally, if any of the specified arguments have their own [`default`][12]s
configured, said defaults will be overridden by the values of `implies`. For
example:

```jsonc
{
  "x": { "implies": { "y": true } },
  "y": { "default": false } // ◄ y will still default to true if x is given
}
```

Also note the [special behavior][25] of `implies` specifically in the case where
an argument value in `argv` is strictly equal to `false`.

For describing much more intricate implications between various arguments and
their values, see [`subOptionOf`][23].

###### Handling Transitive Implications

`implies` configurations **do not cascade transitively**. This means if argument
`P` `implies` argument `Q`, and argument `Q` `implies` argument `R`, and `P` is
given, the only check that will be performed is on `P` and `Q`. If `P` must
imply some value for both `Q` _and `R`_, specify this explicitly in `P`'s
configuration. For example:

```diff
{
- P: { "implies": { Q: true } },
+ P: { "implies": { Q: true, R: true } },
  Q: { "implies": { R: true } },
  R: {}
}
```

This has implications beyond just `implies`. **An implied value will not
transitively satisfy any other BFE logic checks** (such as
[`demandThisOptionXor`][22]) **or trigger any relational behavior** (such as
with [`subOptionOf`][23]). The implied argument-value pair will simply be merged
into `argv` as if you had done it manually in your command's [`handler`][9]. If
this is a problem, prefer the explicit direct relationships described by other
[configuration keys][31] instead of relying on the implicit transitive
relationships described by `implies`.

Despite this constraint, any per-option [`check`][13]s you've configured, which
are run last (at the very end of `withHandlerExtensions`), _will_ see the
implied argument-value pairs. Therefore, use [`check`][13] to guarantee any
complex invariants, if necessary; ideally, you shouldn't be setting bad defaults
via `implies`, but BFE won't stop you from doing so.

###### Handling Parser Configuration

Like other BFE checks, `implies` _does_ take into account the [yargs-parser
settings][7] `camel-case-expansion`, `strip-aliased`, and `strip-dashed`; but
_does not_ currently pay attention to `dot-notation` or
`duplicate-arguments-array`. `implies` may still work when using the latter
parser configurations, but it is recommended you turn them off instead.

###### `implies` versus `requires`/`conflicts`

BFE's `implies`, since it sets arguments in `argv` if they are not explicitly
given, is a weaker form of [`requires`][14]/[`conflicts`][15].

Choose `requires` over BFE's `implies` when you want one argument to imply the
value of another _while_ requiring the other argument to be explicitly given in
`argv` (e.g. via the command line).

Choose `conflicts` over BFE's `implies` when you think you want to use `implies`
but you don't actually need to override the default value of the implied
argument and only want the conflict semantics.

Alternatively, choose [`subOptionOf`][23] over BFE's `implies` when you want the
value of one argument to imply something complex about another argument and/or
its value, such as updating the other argument's options configuration.

###### `looseImplications`

If `looseImplications` is set to `true`, any of the specified arguments, when
explicitly given in `argv` (e.g. via the command line), will _override_ any
configured implications instead of causing an error. When `looseImplications` is
set to `false`, which is the default, values explicitly given in `argv` must
match the specified argument-value pairs respectively (similar to
[`requires`][14]/[`conflicts`][15]).

###### `vacuousImplications`

By default, an option's configured implications will only take effect if said
option is given in `argv` _with a non-`false` value_. For example:

```jsonc
{
  "x": {
    "boolean": true,
    "implies": { "y": true }
  },
  "y": {
    // This example works regardless of the type of y!
    "boolean": true,
    //"array": true,
    //"count": true,
    //"number": true,
    //"string": true,
    "default": false
  }
}
```

If `-⁠x` (or `-⁠x=true`) is given, it is synonymous with `-⁠x -⁠y` (or
`-⁠x=true -⁠y=true`) being given and vice-versa. However, if `-⁠x=false` (or
`-⁠no-x`) is given, the `implies` key is effectively ignored. This means
`-⁠x=false` _does not imply anything about `-⁠y`_; `-⁠x=false -y=true` and
`-⁠x=false -y=false` are both accepted by BFE without incident.

In this way, the configured implications of [`boolean`][32]-type options are
_never [vacuously satisfied][33]_; a strictly `false` condition does not "imply"
anything about its [consequent][34].

This feature reduces confusion for end users. For instance, suppose we had a CLI
build tool that accepted the arguments `-⁠patch` and `-⁠only-⁠patch`. `-⁠patch`
instructs the tool to patch any output before committing it to disk while
`-⁠only-⁠patch` instructs the tool to _only_ patch pre-existing output already
on disk. The command's options configuration could look something like the
following:

```jsonc
{
  "patch": {
    "boolean": true,
    "description": "Patch output using the nearest patcher file",
    "default": true
  },
  "only-⁠patch": {
    "boolean": true,
    "description": "Instead of building new output, only patch existing output",
    "default": false,
    "implies": { "patch": true }
  }
}
```

The following are rightly allowed by BFE (synonymous commands are grouped):

_Is building and patching:_

- `build-tool`
- `build-tool -⁠patch`
- `build-tool -⁠patch=true`
- `build-tool -⁠only-⁠patch=false`
- `build-tool -⁠no-⁠only-⁠patch`

_Is building and not patching:_

<!-- TODO: remove these "disable" toggles after fixing list-item-style bug -->
<!-- lint disable list-item-style -->

- `build-tool -⁠patch=false`
- `build-tool -⁠no-⁠patch`
- _`build-tool -⁠no-⁠patch -⁠no-⁠only-⁠patch`_ (this is the interesting one)

<!-- lint enable list-item-style -->

_Is patching and not building:_

- `build-tool -⁠only-⁠patch`
- `build-tool -⁠only-⁠patch=true`
- `build-tool -⁠patch -⁠only-⁠patch`

On the other hand, the following rightly cause BFE to throw:

- `build-tool -⁠patch=false -⁠only-⁠patch`
- `build-tool -⁠no-⁠patch -⁠only-⁠patch`

If BFE didn't ignore vacuous implications by default, the command
`build-tool -⁠no-⁠patch -⁠no-⁠only-⁠patch` would erroneously cause BFE to throw
since `implies: { patch: true }` means "any time `-⁠only-⁠patch` is given, set
`{ patch: true }` in `argv`", which conflicts with `-⁠no-⁠patch` which already
sets `{ patch: false }` in `argv`. This can be confusing for end users since the
command, while redundant, technically makes sense; it is logically
indistinguishable from `build-tool -⁠no-⁠only-patch`, which does not throw an
error.

To remedy this, BFE simply ignores the `implies` configurations of options when
their argument value is strictly equal to `false` in `argv`. To disable this
behavior for a specific option, set `vacuousImplications` to `true` (it is
`false` by default) or consider using
[`requires`][14]/[`conflicts`][15]/[`subOptionOf`][23] over `implies`.

---

##### `demandThisOptionIf`

> ⪢ API reference: [`demandThisOptionIf`][35]

> [!IMPORTANT]
>
> `demandThisOptionIf` is a superset of vanilla Yargs's [`demandOption`][32].

`demandThisOptionIf` enables checks to ensure an argument is given when at least
one of the specified groups of arguments, or argument-value pairs, is also
given. For example:

```jsonc
{
  "x": {},
  "y": { "demandThisOptionIf": "x" }, // ◄ Demands y if x is given
  "z": { "demandThisOptionIf": "x" } // ◄ Demands z if x is given
}
```

This configuration allows the following arguments: no arguments (`∅`), `-⁠y`,
`-⁠z`, `-⁠yz`, `-⁠xyz`; and disallows: `-⁠x`, `-⁠xy`, `-⁠xz`.

`demandThisOptionIf` also supports checks against the parsed _values_ of
arguments in addition to the argument existence checks demonstrated above. For
example:

```jsonc
{
  // ▼ Demands x if y == 'one' or z is given
  "x": { "demandThisOptionIf": [{ "y": "one" }, "z"] },
  "y": {},
  "z": {}
}
```

This configuration allows the following arguments: no arguments (`∅`), `-⁠x`,
`-⁠y=...`, `-⁠x -⁠y=...`, `-⁠xz`, `-⁠xz y=...`; and disallows: `-⁠z`, `-⁠y=one`,
`-⁠y=... -⁠z`.

Note that, when performing a check using the parsed value of an argument and
that argument is configured as an array (`{ array: true }`), that array will be
searched for said value. Otherwise, a strict deep equality check is performed.

Also note that a more powerful implementation of `demandThisOptionIf` can be
achieved via [`subOptionOf`][23].

---

##### `demandThisOption`

> ⪢ API reference: [`demandThisOption`][36]

> [!IMPORTANT]
>
> `demandThisOption` is an alias of vanilla Yargs's [`demandOption`][32].
> `demandOption` is disallowed by intellisense.

`demandThisOption` enables checks to ensure an argument is always given. This is
equivalent to `demandOption` from vanilla Yargs. For example:

```jsonc
{
  "x": { "demandThisOption": true }, // ◄ Disallows ∅, y
  "y": { "demandThisOption": false }
}
```

This configuration will trigger a check to ensure that `-⁠x` is given.

> [!NOTE]
>
> As an alias of vanilla Yargs's [`demandOption`][32], this check is outsourced
> to Yargs, which means it runs on Black Flag's _first and second parsing
> passes_ like any other configurations key coming from vanilla Yargs.

---

##### `demandThisOptionOr`

> ⪢ API reference: [`demandThisOptionOr`][37]

> [!IMPORTANT]
>
> `demandThisOptionOr` is a superset of vanilla Yargs's [`demandOption`][32].

`demandThisOptionOr` enables non-optional inclusive disjunction checks per
group. Put another way, `demandThisOptionOr` enforces a "logical or" relation
within groups of required options. For example:

```jsonc
{
  "x": { "demandThisOptionOr": ["y", "z"] }, // ◄ Demands x or y or z
  "y": { "demandThisOptionOr": ["x", "z"] }, // ◄ Mirrors the above (discarded)
  "z": { "demandThisOptionOr": ["x", "y"] } // ◄ Mirrors the above (discarded)
}
```

This configuration will trigger a check to ensure _at least one_ of `x`, `y`, or
`z` is given. In other words, this configuration allows the following arguments:
`-⁠x`, `-⁠y`, `-⁠z`, `-⁠xy`, `-⁠xz`, `-⁠yz`, `-⁠xyz`; and disallows: no
arguments (`∅`).

In the interest of readability, consider mirroring the appropriate
`demandThisOptionOr` configuration to the other relevant options, though this is
not required (redundant groups are discarded). The previous example demonstrates
proper mirroring.

`demandThisOptionOr` also supports checks against the parsed _values_ of
arguments in addition to the argument existence checks demonstrated above. For
example:

```jsonc
{
  // ▼ Demands x or y == 'one' or z
  "x": { "demandThisOptionOr": [{ "y": "one" }, "z"] },
  "y": {},
  "z": {}
}
```

This configuration allows the following arguments: `-⁠x`, `-⁠y=one`, `-⁠z`,
`-⁠x -⁠y=...`, `-⁠xz`, `-⁠y=... -⁠z`, `-⁠xz -⁠y=...`; and disallows: no
arguments (`∅`), `-⁠y=...`.

Note that, when performing a check using the parsed value of an argument and
that argument is configured as an array (`{ array: true }`), that array will be
searched for said value. Otherwise, a strict deep equality check is performed.

---

##### `demandThisOptionXor`

> ⪢ API reference: [`demandThisOptionXor`][38]

> [!IMPORTANT]
>
> `demandThisOptionXor` is a superset of vanilla Yargs's [`demandOption`][32] +
> [`conflicts`][29].

`demandThisOptionXor` enables non-optional exclusive disjunction checks per
exclusivity group. Put another way, `demandThisOptionXor` enforces mutual
exclusivity within groups of required options. For example:

```jsonc
{
  "x": { "demandThisOptionXor": ["y"] }, // ◄ Disallows ∅, z, w, xy, xyw, xyz, xyzw
  "y": { "demandThisOptionXor": ["x"] }, // ◄ Mirrors the above (discarded)
  "z": { "demandThisOptionXor": ["w"] }, // ◄ Disallows ∅, x, y, zw, xzw, yzw, xyzw
  "w": { "demandThisOptionXor": ["z"] } // ◄ Mirrors the above (discarded)
}
```

This configuration will trigger a check to ensure _exactly one_ of `-⁠x` or
`-⁠y` is given, and _exactly one_ of `-⁠z` or `-⁠w` is given. In other words,
this configuration allows the following arguments: `-⁠xz`, `-⁠xw`, `-⁠yz`,
`-⁠yw`; and disallows: no arguments (`∅`), `-⁠x`, `-⁠y`, `-⁠z`, `-⁠w`, `-⁠xy`,
`-⁠zw`, `-⁠xyz`, `-⁠xyw`, `-⁠xzw`, `-⁠yzw`, `-⁠xyzw`.

In the interest of readability, consider mirroring the appropriate
`demandThisOptionXor` configuration to the other relevant options, though this
is not required (redundant groups are discarded). The previous example
demonstrates proper mirroring.

`demandThisOptionXor` also supports checks against the parsed _values_ of
arguments in addition to the argument existence checks demonstrated above. For
example:

```jsonc
{
  // ▼ Demands x xor y == 'one' xor z
  "x": { "demandThisOptionXor": [{ "y": "one" }, "z"] },
  "y": {},
  "z": {}
}
```

This configuration allows the following arguments: `-⁠x`, `-⁠y=one`, `-⁠z`,
`-⁠x -⁠y=...`, `-⁠y=... -⁠z`; and disallows: no arguments (`∅`), `-⁠y=...`,
`-⁠x -⁠y=one`, `-⁠xz`, `-⁠y=one -⁠z`, `-⁠xz -⁠y=...`.

Note that, when performing a check using the parsed value of an argument and
that argument is configured as an array (`{ array: true }`), that array will be
searched for said value. Otherwise, a strict deep equality check is performed.

---

##### `check`

> ⪢ API reference: [`check`][39]

`check` is the declarative option-specific version of vanilla Yargs's
[`yargs::check()`][40].

This function receives the `currentArgumentValue`, which you are free to type as
you please, and the fully parsed `argv`. If this function throws, the exception
will bubble. If this function returns an instance of `Error`, a string, or any
non-truthy value (including `undefined` or not returning anything), Black Flag
will throw a `CliError` on your behalf.

All `check` functions are run in definition order and always at the very end of
the [second parsing pass][11], well after all other BFE checks have passed and
all updates to `argv` have been applied (including from [`subOptionOf`][23] and
[BFE's `implies`][18]). This means `check` always sees the _final_ version of
`argv`, which is the same version that the command's [`handler`][9] is passed.

> [!IMPORTANT]
>
> `check` functions are skipped if their corresponding argument does not exist
> in `argv`.

When a check fails, execution of its command's [`handler`][9] function will
cease and [`configureErrorHandlingEpilogue`][41] will be invoked (unless you
threw/returned a [`GracefulEarlyExitError`][42]). For example:

```javascript
export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    number: true,
    check: function (currentXArgValue, fullArgv) {
      if (currentXArgValue < 0 || currentXArgValue > 10) {
        throw new Error(
          `"x" must be between 0 and 10 (inclusive), saw: ${currentXArgValue}`
        );
      }

      return true;
    }
  },
  y: {
    boolean: true,
    default: false,
    requires: 'x',
    check: function (currentYArgValue, fullArgv) {
      if (currentYArgValue && fullArgv.x <= 5) {
        throw new Error(
          `"x" must be greater than 5 to use 'y', saw: ${fullArgv.x}`
        );
      }

      return true;
    }
  }
});
```

You may also pass an array of check functions, each being executed after the
other. This makes it easy to reuse checks between options. For example:

> [!WARNING]
>
> Providing an array with one or more _async_ check functions will result in
> them all being awaited concurrently.

```javascript
export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    number: true,
    check: [checkArgBetween0And10('x'), checkArgGreaterThan5('x')]
  },
  y: {
    number: true,
    check: checkArgBetween0And10('y')
  },
  z: {
    number: true,
    check: checkArgGreaterThan5('z')
  }
});

function checkArgBetween0And10(argName) {
  return function (argValue, fullArgv) {
    return (
      (argValue >= 0 && argValue <= 10) ||
      `"${argName}" must be between 0 and 10 (inclusive), saw: ${argValue}`
    );
  };
}

function checkArgGreaterThan5(argName) {
  return function (argValue, fullArgv) {
    return (
      argValue > 5 || `"${argName}" must be greater than 5, saw: ${argValue}`
    );
  };
}
```

See the Yargs documentation on [`yargs::check()`][40] for more information.

---

##### `subOptionOf`

> ⪢ API reference: [`subOptionOf`][43]

One of Black Flag's killer features is [native support for dynamic options][44].
However, taking advantage of this feature in a command's [`builder`][8] export
requires a strictly imperative approach.

Take, for example, [the `init` command from @black-flag/demo][45]:

```javascript
// Taken at 06/04/2024 from @black-flag/demo "myctl" CLI
// @ts-check

/**
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const builder = function (yargs, _, argv) {
  yargs.parserConfiguration({ 'parse-numbers': false });

  if (argv && argv.lang) {
    // This code block implements our dynamic options (depending on --lang)
    return argv.lang === 'node'
      ? {
          lang: { choices: ['node'], demandOption: true },
          version: { choices: ['19.8', '20.9', '21.1'], default: '21.1' }
        }
      : {
          lang: { choices: ['python'], demandOption: true },
          version: {
            choices: ['3.10', '3.11', '3.12'],
            default: '3.12'
          }
        };
  } else {
    // This code block represents the fallback
    return {
      lang: {
        choices: ['node', 'python'],
        demandOption: true,
        default: 'python'
      },
      version: { string: true, default: 'latest' }
    };
  }
};

/**
 * @type {import('@black-flag/core').Configuration<{ lang: string, version: string }>['handler']}
 */
export const handler = function ({ lang, version }) {
  console.log(`> Initializing new ${lang}@${version} project...`);
};
```

Among other freebies, taking advantage of dynamic options support gifts your CLI
with help text more gorgeous and meaningful than anything you could accomplish
with vanilla Yargs:

```text
myctl init --lang 'node' --version=21.1
> initializing new node@21.1 project...
```

```text
myctl init --lang 'python' --version=21.1
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                                     [choices: "python"]
  --version                                    [choices: "3.10", "3.11", "3.12"]

Invalid values:
  Argument: version, Given: "21.1", Choices: "3.10", "3.11", "3.12"
```

```text
myctl init --lang fake
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                             [choices: "node", "python"]
  --version                                                             [string]

Invalid values:
  Argument: lang, Given: "fake", Choices: "node", "python"
```

```text
myctl init --help
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                             [choices: "node", "python"]
  --version                                                             [string]
```

Ideally, Black Flag would allow us to describe the relationship between
`-⁠-⁠lang` and its _suboption_ `-⁠-⁠version` declaratively, without having to
drop down to imperative interactions with the Yargs API like we did above.

This is the goal of the `subOptionOf` configuration key. Using `subOptionOf`,
developers can take advantage of dynamic options without sweating the
implementation details.

> [!NOTE]
>
> `subOptionOf` updates are run and applied during Black Flag's [second parsing
> pass][11].

For example:

```javascript
/**
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    choices: ['a', 'b', 'c'],
    demandThisOption: true,
    description: 'A choice'
  },
  y: {
    number: true,
    description: 'A number'
  },
  z: {
    // ▼ These configurations are applied as the baseline or "fallback" during
    //   Black Flag's first parsing pass. The updates within subOptionOf are
    //   evaluated and applied during Black Flag's second parsing pass.
    boolean: true,
    description: 'A useful context-sensitive flag',
    subOptionOf: {
      // ▼ Ignored if x is not given
      x: [
        {
          when: (currentXArgValue, fullArgv) => currentXArgValue === 'a',
          update:
            // ▼ We can pass an updater function that returns an opt object.
            //   This object will *replace* the argument's old configuration!
            (oldXArgumentConfig, fullArgv) => {
              return {
                // ▼ We don't want to lose the old config, so we spread it
                ...oldXArgumentConfig,
                description: 'This is a switch specifically for the "a" choice'
              };
            }
        },
        {
          when: (currentXArgValue, fullArgv) => currentXArgValue !== 'a',
          update:
            // ▼ Or we can just pass the replacement configuration object. Note
            //   that, upon multiple `when` matches, the last update in the
            //   chain will win. If you want merge behavior instead of overwrite,
            //   spread the old config in the object you return.
            {
              string: true,
              description: 'This former-flag now accepts a string instead'
            }
        }
      ],
      // ▼ Ignored if y is not given. If x and y ARE given, since this occurs
      //   after the x config, this update will overwrite any others. Use the
      //   functional form + object spread to preserve the old configuration.
      y: {
        when: (currentYArgValue, fullArgv) =>
          fullArgv.x === 'a' && currentYArgValue > 5,
        update: (oldConfig, fullArgv) => {
          return {
            array: true,
            demandThisOption: true,
            description:
              'This former-flag now accepts an array of two or more strings',
            check: function (currentZArgValue, fullArgv) {
              return (
                currentZArgValue.length >= 2 ||
                `"z" must be an array of two or more strings, only saw: ${currentZArgValue.length ?? 0}`
              );
            }
          };
        }
      },
      // ▼ Since "does-not-exist" is not an option defined anywhere, this will
      //   always be ignored
      'does-not-exist': []
    }
  }
});
```

> [!IMPORTANT]
>
> You cannot nest `subOptionOf` keys within each other nor return an object
> containing `subOptionOf` from an `update` that did not already have one. Doing
> so will trigger a framework error.

Now we're ready to re-implement the `init` command from `myctl` using our new
declarative superpowers:

```javascript
export const [builder, withHandlerExtensions] = withBuilderExtensions(
  function (blackFlag) {
    blackFlag.parserConfiguration({ 'parse-numbers': false });

    return {
      lang: {
        // ▼ These two are our fallback or "baseline" configurations for --lang
        choices: ['node', 'python'],
        demandThisOption: true,
        default: 'python',

        subOptionOf: {
          // ▼ Yep, --lang is also a suboption of --lang
          lang: [
            {
              when: (lang) => lang === 'node',
              // ▼ Remember: updates overwrite any old config (including baseline)
              update: {
                choices: ['node'],
                demandThisOption: true
              }
            },
            {
              when: (lang) => lang !== 'node',
              update: {
                choices: ['python'],
                demandThisOption: true
              }
            }
          ]
        }
      },

      // Another benefit of subOptionOf: all configuration relevant to a specific
      // option is co-located within that option and not spread across some
      // function or file. We don't have to go looking for the logic that's
      // modifying --version since it's all right here in one code block.
      version: {
        // ▼ These two are our fallback or "baseline" configurations for --version
        string: true,
        default: 'latest',

        subOptionOf: {
          // ▼ --version is a suboption of --lang
          lang: [
            {
              when: (lang) => lang === 'node',
              update: {
                choices: ['19.8', '20.9', '21.1'],
                default: '21.1'
              }
            },
            {
              when: (lang) => lang !== 'node',
              update: {
                choices: ['3.10', '3.11', '3.12'],
                default: '3.12'
              }
            }
          ]
        }
      }
    };
  }
);
```

Easy peasy!

For another example, consider a "build" command where we want to ensure
`-⁠-⁠skip-⁠output-⁠checks` is `true` whenever
`-⁠-⁠generate-⁠types=false`/`-⁠-⁠no-⁠generate-⁠types` is given since the output
checks are only meaningful if type definition files are available:

```javascript
/**
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const [builder, withHandlerExtensions] = withBuilderExtensions({
  'generate-types': {
    boolean: true,
    description: 'Output TypeScript declaration files alongside distributables',
    default: true,
    subOptionOf: {
      'generate-types': {
        // ▼ If --generate-types=false...
        when: (generateTypes) => !generateTypes,
        update: (oldConfig) => {
          return {
            ...oldConfig,
            // ▼ ... then --skip-output-checks must be true!
            implies: { 'skip-output-checks': true },
            // ▼ Since "false" options cannot imply stuff (see "implies" docs)
            // by default, we need to tell BFE that a false implication is okay
            vacuousImplications: true
          };
        }
      }
    }
  },
  'skip-output-checks': {
    alias: 'skip-output-check',
    boolean: true,
    description: 'Do not run consistency and integrity checks on build output',
    default: false
  }
});
```

This configuration allows the following arguments: no arguments (`∅`),
`-⁠-⁠generate-⁠types=true`, `-⁠-⁠generate-⁠types=false`,
`-⁠-⁠generate-⁠types=true -⁠-⁠skip-⁠output-⁠checks=true`,
`-⁠-⁠generate-⁠types=true -⁠-⁠skip-⁠output-⁠checks=false`,
`-⁠-⁠generate-⁠types=false -⁠-⁠skip-⁠output-⁠checks=true`; and disallows:
`-⁠-⁠generate-⁠types=false -⁠-⁠skip-⁠output-⁠checks=false`.

The same could be accomplished by making `-⁠-⁠skip-⁠output-⁠checks` a suboption
of `-⁠-⁠generate-types` (essentially the reverse of the above):

```javascript
/**
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const [builder, withHandlerExtensions] = withBuilderExtensions({
  'generate-types': {
    boolean: true,
    description: 'Output TypeScript declaration files alongside distributables',
    default: true
  },
  'skip-output-checks': {
    alias: 'skip-output-check',
    boolean: true,
    description: 'Do not run consistency and integrity checks on build output',
    default: false,
    subOptionOf: {
      'generate-types': {
        when: (generateTypes) => !generateTypes,
        update: (oldConfig) => {
          return {
            ...oldConfig,
            default: true,
            // ▼ Similar to using "choices" to limit string-accepting options,
            // we use one of these kinda wacky-looking self-referential
            // "implies" to assert --skip-output-checks must be true!
            implies: { 'skip-output-checks': true },
            vacuousImplications: true
          };
        }
      }
    }
  }
});
```

Though, note that the second example, when the user supplies the disallowed
arguments `-⁠-⁠generate-⁠types=false -⁠-⁠skip-⁠output-⁠checks=false`, they are
presented with an error message like:

```text
The following arguments as given conflict with the implications of "skip-output-checks":
   ➜ skip-output-checks == false
```

Whereas the first example presents the following error message, which makes more
sense (because it mentions `-⁠-⁠generate-⁠types`):

```text
The following arguments as given conflict with the implications of "generate-types":
   ➜ skip-output-checks == false
```

#### Support for `default` with `conflicts`/`requires`/etc

BFE (and, consequently, BF/Yargs when not generating help text) will ignore the
existence of the [`default`][12] key until near the end of BFE's execution.

> [!IMPORTANT]
>
> This means the optional `customBuilder` function passed to
> `withBuilderExtensions` will _not_ see any defaulted values. However, your
> command handlers will.

> [!WARNING]
>
> An explicitly `undefined` default, i.e. `{ default: undefined }`, will be
> deleted from the configuration object by BFE and completely ignored by Black
> Flag and Yargs. This differs from BF/Yargs's default behavior, which is to
> recognize `undefined` defaults.

Defaults are set _before_ any [`check`][13] functions are run, _before_ any
[implications][18] are set, and _before_ the relevant command [`handler`][9] is
invoked, but _after_ all other BFE checks have succeeded. This enables the use
of keys like [`requires`][14] and [`conflicts`][15] alongside [`default`][12]
without causing [impossible configurations][46] that throw unresolvable CLI
errors.

This workaround avoids a (in my opinion) rather unintuitive [Yargs footgun][16],
though there are decent arguments in support of vanilla Yargs's behavior.

#### Strange and Impossible Configurations

Note that **there are no sanity checks performed to prevent options
configurations that are unresolvable**, so care must be taken not to ask for
something insane.

For example, the following configurations are impossible to resolve:

```jsonc
{
  "x": { "requires": "y" },
  "y": { "conflicts": "x" }
}
```

```jsonc
{
  "x": { "requires": "y", "demandThisOptionXor": "y" },
  "y": {}
}
```

Similarly, silly configurations like the following, while typically resolvable,
are strange and may not work as expected:

```jsonc
{
  "x": { "requires": "x", "demandThisOptionXor": "x" }
}
```

```jsonc
{
  "x": { "implies": { "x": 5 } }
}
```

#### Automatic Grouping of Related Options

> [!CAUTION]
>
> To support this functionality, options must be described declaratively.
> [Defining options imperatively][4] will break this feature.

BFE supports automatic [grouping][47] of related options for improved UX, which
is enabled by default. These new groups are:

- **"Required Options"**: options configured with [`demandThisOption`][20].
- **"Required Options (at least one)"**: options configured with
  [`demandThisOptionOr`][21].
- **"Required Options (mutually exclusive)"**: options configured with
  [`demandThisOptionXor`][22].
- **"Common Options"**: options provided via `{ commonOptions: [...] }` to
  `withBuilderExtensions` as its second parameter:
  `withBuilderExtensions({/*...*/}, { commonOptions });`
- **"Optional Options"**: remaining options that do not fall into any of the
  above categories.

An example from [xunnctl][48]:

```text
$ x f b --help
Usage: xunnctl firewall ban

Add an IP from the global hostile IP list.

Required Options:
  --ip  An ipv4, ipv6, or supported CIDR                                                        [array]

Optional Options:
  --comment  Include custom text with the ban comment where applicable                         [string]

Common Options:
  --help         Show help text                                                               [boolean]
  --hush         Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet        Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent       No output will be generated (implies --quiet)               [boolean] [default: false]
  --config-path  Use a custom configuration file
                                [string] [default: "/home/freelance/.config/xunnctl-nodejs/state.json"]
```

```text
$ x d z u --help
Usage: xunnctl dns zone update

Reinitialize a DNS zones.

Required Options (at least one):
  --apex            Zero or more zone apex domains                                              [array]
  --apex-all-known  Include all known zone apex domains                                       [boolean]

Optional Options:
  --force        Disable protections                                                          [boolean]
  --purge-first  Delete pertinent records on the zone before recreating them                  [boolean]

Common Options:
  --help         Show help text                                                               [boolean]
  --hush         Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet        Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent       No output will be generated (implies --quiet)               [boolean] [default: false]
  --config-path  Use a custom configuration file
                                [string] [default: "/home/freelance/.config/xunnctl-nodejs/state.json"]
```

By including an explicit [`group`][47] property in an option's configuration,
the option will be included in said group _in addition to_ the result of
automatic grouping, e.g.:

```typescript
const [builder, withHandlerExtensions] = withBuilderExtensions({
  'my-option': {
    boolean: true,
    description: 'mine',
    default: true,
    // This option will be placed into the "Custom Grouped Options" group AND
    // ALSO the "Common Options" group IF it's included in `commonOptions`
    group: 'Custom Grouped Options'
  }
});
```

> [!NOTE]
>
> Options configured with an explicit [`group`][47] property will never be
> automatically included in the "Optional Options" group.

This feature can be disabled entirely by passing
`{ disableAutomaticGrouping: true }` to `withBuilderExtensions` as its second
parameter:

```typescript
const [builder, withHandlerExtensions] = withBuilderExtensions(
  {
    // ...
  },
  { disableAutomaticGrouping: true }
);
```

#### Automatic Sorting of Options

> [!CAUTION]
>
> To support this functionality, options must be described declaratively.
> [Defining options imperatively][4] will break this feature.

BFE supports automatic alpha-sorting of a command's options in help text for
improved UX, similar to how Black Flag sorts commands themselves in help text.

This feature is disabled by default, but can be enabled by passing
`{ enableAutomaticSorting: true }` to `withBuilderExtensions` as its second
parameter:

```typescript
const [builder, withHandlerExtensions] = withBuilderExtensions(
  {
    // ...
  },
  { enableAutomaticSorting: true }
);
```

### `withUsageExtensions`

> ⪢ API reference: [`withUsageExtensions`][49]

This thin wrapper function is used for more consistent and opinionated usage
string generation.

```javascript
// file: xunnctl/commands/firewall/ban.js
return {
  // ...
  description: 'Add an IP from the global hostile IP list',
  usage: withUsageExtensions(
    "$1.\n\nAdditional description text that only appears in this command's help text."
  )
};
```

```text
$ x f b --help
Usage: xunnctl firewall ban

Add an IP from the global hostile IP list.

Additional description text that only appears in this command's help text.

Required Options:
  --ip  An ipv4, ipv6, or supported CIDR                                                        [array]

Optional Options:
  --comment  Include custom text with the ban comment where applicable                         [string]

Common Options:
  --help         Show help text                                                               [boolean]
  --hush         Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet        Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent       No output will be generated (implies --quiet)               [boolean] [default: false]
  --config-path  Use a custom configuration file
                                [string] [default: "/home/freelance/.config/xunnctl-nodejs/state.json"]
```

### `getInvocableExtendedHandler`

> ⪢ API reference: [`getInvocableExtendedHandler`][50]

Unlike Black Flag, BFE puts strict constraints on the order in which command
exports must be invoked and evaluated. Specifically: an extended command's
[`builder`][8] export must be invoked twice, with the correct parameters each
time, before that extended command's [`handler`][9] can be invoked.

This can make it especially cumbersome to import an extended command from a file
and then invoke its [`handler`][9], which is dead simple for normal Black Flag
commands, and can introduce transitive tight-couplings between commands, which
makes bugs more likely and harder to spot.

`getInvocableExtendedHandler` solves this by returning a version of the extended
command's [`handler`][9] function that is ready to invoke immediately. Said
[`handler`][9] expects a single `argv` parameter which is "safely" cloned,
merged on top of any defaults (see [API reference][50]), and then passed-through
to your command's handler as-is.

> [!NOTE]
>
> A "safe" clone is a [StructuredClone][51]-like operation that passes through
> as-is any values that cannot be cloned rather than throwing an error.

> [!TIP]
>
> Command [`handler`][9] exports invoked via `getInvocableExtendedHandler` will
> receive an `argv` containing the [`$artificiallyInvoked`][52] symbol. This
> allows handlers to determine programmatically when the command isn't actually
> being invoked by Black Flag, which can be useful.
>
> However, to get intellisense/TypeScript support for the existence of
> [`$artificiallyInvoked`][52] in `argv`, you must use
> [`BfeStrictArguments`][53].

> [!CAUTION]
>
> Command [`handler`][9] exports invoked via `getInvocableExtendedHandler` will
> _never_ check the given `argv` for correctness or update any of its
> keys/values (aside from setting [`$artificiallyInvoked`][52],
> [`$executionContext`][71], and defaults for `$0` and `_` if they are omitted).
>
> By invoking a command's handler function outside of Black Flag, you're
> essentially treating it like a normal function. And all handler functions
> require a "reified argv" parameter, i.e. the object given to a command handler
> after all BF/BFE checks have passed and all updates to argv have been applied.
>
> If you want to invoke a full Black Flag command programmatically, use
> [`runProgram`][54]. If instead you want to call an individual command's
> (relatively) lightweight handler function directly, use
> `getInvocableExtendedHandler`.

`getInvocableExtendedHandler` can be used with both BFE and normal Black Flag
command exports.

For example, in JavaScript:

```javascript
// file: my-cli/commands/command-B.js
export default function command(context) {
  const [builder, withHandlerExtensions] = withBuilderExtensions({
    // ...
  });

  return {
    builder,
    handler: withHandlerExtensions(async function (argv) {
      const handler = await getInvocableExtendedHandler(
        // This accepts a function, an object, a default export, a Promise, etc
        import('./command-A.js'),
        context
      );

      await handler({ ...argv, somethingElse: true });

      // ...
    })
  };
}
```

Or in TypeScript:

```typescript
// file: my-cli/commands/command-B.ts
import { type CustomExecutionContext } from '../configure';

import {
  default as commandA,
  type CustomCliArguments as CommandACliArguments
} from './command-A';

export type CustomCliArguments = {
  /* ... */
};

export default function command(context: CustomExecutionContext) {
  const [builder, withHandlerExtensions] =
    withBuilderExtensions<CustomCliArguments>({
      // ...
    });

  return {
    builder,
    handler: withHandlerExtensions<CustomCliArguments>(async function (argv) {
      const handler = await getInvocableExtendedHandler<
        CommandACliArguments,
        typeof context
      >(commandA, context);

      await handler({ ...argv, somethingElse: true });

      // ...
    })
  };
}
```

## Examples

In this section are two example implementations of a "deploy" command.

> [!WARNING]
>
> Some of the examples in this section are using hyphen characters followed by a
> [word joiner character][5] to prevent breaking example awkwardly across lines.
> Be cautious copying and pasting examples.

### Example 1

Suppose we wanted a "deploy" command with the following somewhat contrived
feature set:

- Ability to deploy to a Vercel production target, a Vercel preview target, or
  to a remote target via SSH.

- When deploying to Vercel, allow the user to choose to deploy _only_ to preview
  (`-⁠-⁠only-preview`) or _only_ to production (`-⁠-⁠only-production`), if
  desired.

  - Deploy to the preview target only by default.

  - If both `-⁠-⁠only-preview=false` and `-⁠-⁠only-production=false`, deploy to
    _both_ the preview and production environments.

  - If both `-⁠-⁠only-preview=true` and `-⁠-⁠only-production=true`, throw an
    error.

- When deploying to a remote target via SSH, require both a `-⁠-⁠host` and
  `-⁠-⁠to-path` be provided.

  - If `-⁠-⁠host` or `-⁠-⁠to-path` are provided, they must be accompanied by
    `-⁠-⁠target=ssh` since these options don't make sense if `-⁠-⁠target` is
    something else.

What follows is an example implementation:

```typescript
import { type ChildConfiguration } from '@black-flag/core';
import {
  withBuilderExtensions,
  withUsageExtensions
} from '@black-flag/extensions';

import { type CustomExecutionContext } from '../configure.ts';

export enum DeployTarget {
  Vercel = 'vercel',
  Ssh = 'ssh'
}

export const deployTargets = Object.values(DeployTarget);

// ▼ Let's keep our custom CLI arguments strongly 💪🏿 typed
export type CustomCliArguments = {
  target: DeployTarget;
} & ( // We could make these subtypes even stronger, but the returns are diminishing
  | {
      target: DeployTarget.Vercel;
      production: boolean;
      preview: boolean;
    }
  | {
      target: DeployTarget.Ssh;
      host: string;
      toPath: string;
    }
);

export default function command({ state }: CustomExecutionContext) {
  const [builder, withHandlerExtensions] =
    withBuilderExtensions<CustomCliArguments>({
      target: {
        demandThisOption: true, // ◄ Just an alias for { demandOption: true }
        choices: deployTargets,
        description: 'Select deployment target and strategy'
      },
      'only-production': {
        alias: ['production', 'prod'],
        boolean: true,
        // ▼ Error if --only-preview/--only-preview=true, otherwise set to false
        implies: { 'only-preview': false },
        requires: { target: DeployTarget.Vercel }, // ◄ Error if --target != vercel
        default: false, // ◄ Works in a sane way alongside conflicts/requires
        description: 'Only deploy to the remote production environment'
      },
      'only-preview': {
        alias: ['preview'],
        boolean: true,
        implies: { 'only-production': false },
        requires: { target: DeployTarget.Vercel },
        default: true,
        description: 'Only deploy to the remote preview environment'
      },
      host: {
        string: true,
        // ▼ Inverse of { conflicts: { target: DeployTarget.Vercel }} in this example
        requires: { target: DeployTarget.Ssh }, // ◄ Error if --target != ssh
        // ▼ Demand --host if --target=ssh
        demandThisOptionIf: { target: DeployTarget.Ssh },
        description: 'The host to use'
      },
      'to-path': {
        string: true,
        requires: { target: DeployTarget.Ssh },
        // ▼ Demand --to-path if --target=ssh
        demandThisOptionIf: { target: DeployTarget.Ssh },
        description: 'The deploy destination path to use'
      }
    });

  return {
    builder,
    description: 'Deploy distributes to the appropriate remote',
    usage: withUsageExtensions('$1.\n\nSupports both Vercel and SSH targets!'),
    handler: withHandlerExtensions<CustomCliArguments>(async function ({
      target,
      production: productionOnly,
      preview: previewOnly,
      host,
      toPath
    }) {
      // if(state[...]) ...

      switch (target) {
        case DeployTarget.Vercel: {
          if (previewOnly || (!productionOnly && !previewOnly)) {
            // Push to preview via vercel
          }

          if (productionOnly) {
            // Push to production via vercel
          }

          break;
        }

        case DeployTarget.Ssh: {
          // Push to host at path via ssh
          break;
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}
```

### Example 2

Suppose we wanted a "deploy" command with the following [more realistic][55]
feature set:

- Ability to deploy to a Vercel production target, a Vercel preview target, or
  to a remote target via SSH.

- When deploying to Vercel, allow the user to choose to deploy to preview
  (`-⁠-⁠preview`), or to production (`-⁠-⁠production`), or both.

  - Deploy to the preview target by default.

  - If both `-⁠-⁠preview=false` and `-⁠-⁠production=false`, throw an error.

  - If both `-⁠-⁠preview=true` and `-⁠-⁠production=true`, deploy to both the
    preview and production environments.

- When deploying to a remote target via SSH, require a `-⁠-⁠host` and
  `-⁠-⁠to-path` be provided.

  - If `-⁠-⁠host` or `-⁠-⁠to-path` are provided, they must be accompanied by
    `-⁠-⁠target=ssh` since these options don't make sense if `-⁠-⁠target` is
    something else.

- Output more useful and extremely specific help text depending on the
  combination of arguments received.

What follows is an example implementation:

```typescript
import { type ChildConfiguration } from '@black-flag/core';

import {
  withBuilderExtensions,
  withUsageExtensions
} from '@black-flag/extensions';

import { type CustomExecutionContext } from '../configure.ts';

export enum DeployTarget {
  Vercel = 'vercel',
  Ssh = 'ssh'
}

export const deployTargets = Object.values(DeployTarget);

export type CustomCliArguments = { target: DeployTarget } & (
  | {
      target: DeployTarget.Vercel;
      production: boolean;
      preview: boolean;
    }
  | {
      target: DeployTarget.Ssh;
      host: string;
      toPath: string;
    }
);

export default function command({ state }: CustomExecutionContext) {
  const [builder, withHandlerExtensions] = withBuilderExtensions<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    target: {
      description: 'Select deployment target and strategy',
      demandThisOption: true,
      choices: deployTargets,
      subOptionOf: {
        target: {
          // This update will run whenever --target is given, which is useful
          // when BF generates help text for specific combinations of arguments
          when: () => true,
          update(oldOptionConfig, { target }) {
            return {
              ...oldOptionConfig,
              choices: [target]
            };
          }
        }
      }
    },
    production: {
      alias: ['prod'],
      boolean: true,
      description: 'Deploy to the remote production environment',
      requires: { target: DeployTarget.Vercel },
      // ▼ This overrides --preview's default if --production is given
      implies: { preview: false },
      // ▼ This allows implications to be overridden by command line arguments
      looseImplications: true,
      subOptionOf: {
        target: {
          when: (target: DeployTarget) => target !== DeployTarget.Vercel,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    },
    preview: {
      boolean: true,
      description: 'Deploy to the remote preview environment',
      requires: { target: DeployTarget.Vercel },
      default: true,
      check: function (preview, argv) {
        return (
          argv.target !== DeployTarget.Vercel ||
          preview ||
          argv.production ||
          'must choose either --preview or --production deployment environment'
        );
      },
      subOptionOf: {
        target: {
          when: (target: DeployTarget) => target !== DeployTarget.Vercel,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    },
    host: {
      string: true,
      description: 'The ssh deploy host',
      requires: { target: DeployTarget.Ssh },
      //demandThisOptionIf: { target: DeployTarget.Ssh },
      subOptionOf: {
        target: [
          {
            // ▼ Unlike demandThisOptionIf, this changes the help text output!
            when: (target: DeployTarget) => target === DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                demandThisOption: true
              };
            }
          },
          {
            when: (target: DeployTarget) => target !== DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                hidden: true
              };
            }
          }
        ]
      }
    },
    'to-path': {
      string: true,
      description: 'The ssh deploy destination path',
      requires: { target: DeployTarget.Ssh },
      //demandThisOptionIf: { target: DeployTarget.Ssh },
      subOptionOf: {
        target: [
          {
            when: (target: DeployTarget) => target === DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                demandThisOption: true
              };
            }
          },
          {
            when: (target: DeployTarget) => target !== DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                hidden: true
              };
            }
          }
        ]
      }
    }
  });

  return {
    builder,
    description: 'Deploy distributes to the appropriate remote',
    usage: withUsageExtensions('$1.\n\nSupports both Vercel and SSH targets!'),
    handler: withHandlerExtensions<CustomCliArguments>(async function ({
      target,
      production,
      preview,
      host,
      toPath
    }) {
      // if(state[...]) ...

      switch (target) {
        case DeployTarget.Vercel: {
          if (production) {
            // Push to production via vercel
          }

          if (preview) {
            // Push to preview via vercel
          }

          break;
        }

        case DeployTarget.Ssh: {
          // Push to host at path via ssh
          break;
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}
```

#### Example 2: Sample Outputs

```text
$ x deploy
Usage: symbiote deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target  Select deployment target and strategy                       [required] [choices: "vercel", "ssh"]

Optional Options:
  --production, --prod  Deploy to the remote production environment                                 [boolean]
  --preview             Deploy to the remote preview environment                    [boolean] [default: true]
  --host                The ssh deploy host                                                          [string]
  --to-path             The ssh deploy destination path                                              [string]

Common Options:
  --help    Show help text                                                                          [boolean]
  --hush    Set output to be somewhat less verbose                                 [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush)            [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)                          [boolean] [default: false]

  symbiote:<error> ❌ Execution failed: missing required argument: target
```

```text
$ x deploy --help
Usage: symbiote deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target  Select deployment target and strategy                       [choices: "vercel", "ssh"]

Optional Options:
  --production, --prod  Deploy to the remote production environment     [boolean]
  --preview             Deploy to the remote preview environment        [boolean] [default: true]
  --host                The ssh deploy host                             [string]
  --to-path             The ssh deploy destination path                 [string]

Common Options:
  --help    Show help text                                              [boolean]
  --hush    Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)               [boolean] [default: false]
```

```text
$ x deploy --target=ssh
Usage: symbiote deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target   Select deployment target and strategy                      [required] [choices: "ssh"]
  --host     The ssh deploy host                                        [string] [required]
  --to-path  The ssh deploy destination path                            [string] [required]

Common Options:
  --help    Show help text                                              [boolean]
  --hush    Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)               [boolean] [default: false]

  symbiote:<error> ❌ Execution failed: missing required arguments: host, to-path
```

```text
$ x deploy --target=vercel --to-path
Usage: symbiote deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target  Select deployment target and strategy                       [required] [choices: "vercel"]

Optional Options:
  --production, --prod  Deploy to the remote production environment                          [boolean]
  --preview             Deploy to the remote preview environment             [boolean] [default: true]

Common Options:
  --help    Show help text                                                                   [boolean]
  --hush    Set output to be somewhat less verbose                          [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush)     [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)                   [boolean] [default: false]

  symbiote:<error> ❌ Execution failed: the following arguments must be given alongside "to-path":
  symbiote:<error>   ➜ target == "ssh"
```

```text
$ x deploy --target=ssh --host prime --to-path '/some/path' --preview
Usage: symbiote deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target   Select deployment target and strategy                      [required] [choices: "ssh"]
  --host     The ssh deploy host                                                [string] [required]
  --to-path  The ssh deploy destination path                                    [string] [required]

Common Options:
  --help    Show help text                                                                [boolean]
  --hush    Set output to be somewhat less verbose                       [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush)  [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)                [boolean] [default: false]

  symbiote:<error> ❌ Execution failed: the following arguments must be given alongside "preview":
  symbiote:<error>   ➜ target == vercel
```

```text
$ x deploy --target=vercel --preview=false --production=false
symbiote:<error> ❌ Execution failed: must choose either --preview or --production deployment environment
```

<!-- symbiote-template-region-start 5 -->

## Appendix 🏴

<!-- symbiote-template-region-end -->

Further documentation can be found under [`docs/`][x-repo-docs].

### Differences between Black Flag Extensions and Yargs

When using BFE, several options function differently, such as [`implies`][18].
Other options have their effect deferred, like [`default`][12]. [`coerce`][56]
will always receive an array when the same option also has [`array: true`][17].
See the [configuration keys section][31] for a list of changes and their
justifications.

Additionally, command options must be configured by [returning an `opt`
object][17] from your command's [`builder`][8] rather than imperatively invoking
the Yargs API.

For example:

```diff
export function builder(blackFlag) {
- // DO NOT use Yargs's imperative API to define options! This *BREAKS* BFE!
- blackFlag.option('f', {
-   alias: 'file',
-   demandOption: true,
-   default: '/etc/passwd',
-   describe: 'x marks the spot',
-   type: 'string',
-   group: 'custom'
- });
-
- // DO NOT use Yargs's imperative API to define options! This *BREAKS* BFE!
- blackFlag
-   .alias('f', 'file')
-   .demandOption('f')
-   .default('f', '/etc/passwd')
-   .describe('f', 'x marks the spot')
-   .string('f')
-   .group('custom');
-
- // DO NOT use Yargs's imperative API to define options! This *BREAKS* BFE!
- blackFlag.options({
-   f: {
-     alias: 'file',
-     demandOption: true,
-     default: '/etc/passwd',
-     describe: 'x marks the spot',
-     type: 'string',
-     group: 'custom'
-   }
- });
-
+ // INSTEAD, use Yargs / Black Flag's declarative API to define options 🙂
+ return {
+   f: {
+     alias: 'file',
+     demandThisOption: true,
+     default: '/etc/passwd',
+     describe: 'x marks the spot',
+     string: true,
+     group: 'custom'
+   }
+ };
}
```

> [!TIP]
>
> The Yargs API can and should still be invoked for purposes other than defining
> options on a command, e.g. `blackFlag.strict(false)`.

To this end, the following [Yargs API functions][57] are soft-disabled via
intellisense:

- `option`
- `options`

However, no attempt is made by BFE to restrict your use of the Yargs API at
runtime. Therefore, using Yargs's API to work around these artificial
limitations, e.g. in your command's [`builder`][8] function or via the
[`configureExecutionPrologue`][58] hook, will result in **undefined behavior**.

### Black Flag versus Black Flag Extensions

The goal of [Black Flag (@black-flag/core)][59] is to be as close to a drop-in
replacement as possible for vanilla Yargs, specifically for users of
[`yargs::commandDir()`][60]. This means Black Flag must go out of its way to
maintain 1:1 parity with the vanilla Yargs API ([with a few minor
exceptions][61]).

As a consequence, Yargs's imperative nature tends to leak through Black Flag's
abstraction at certain points, such as with [the `blackFlag` parameter of the
`builder` export][8]. **This is a good thing!** Since we want access to all of
Yargs's killer features without Black Flag getting in the way.

However, this comes with costs. For one, the Yargs's API has suffered from a bit
of feature creep over the years. A result of this is a rigid API [with][62]
[an][16] [abundance][63] [of][64] [footguns][65] and an [inability][66] to
[address][67] them without introducing [massively][68] [breaking][69]
[changes][70].

BFE takes the "YOLO" approach by exporting several functions that build on top
of Black Flag's feature set without worrying too much about maintaining 1:1
parity with the vanilla Yargs's API. This way, one can opt-in to a more
opinionated but (in my opinion) cleaner, more consistent, and more intuitive
developer experience.

<!-- symbiote-template-region-start 6 -->

### Published Package Details

This is a [CJS2 package][x-pkg-cjs-mojito] with statically-analyzable exports
built by Babel for use in Node.js versions that are not end-of-life. For
TypeScript users, this package supports both `"Node10"` and `"Node16"` module
resolution strategies.

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start 7 -->

<details><summary>Expand details</summary>

That means both CJS2 (via `require(...)`) and ESM (via `import { ... } from ...`
or `await import(...)`) source will load this package from the same entry points
when using Node. This has several benefits, the foremost being: less code
shipped/smaller package size, avoiding [dual package
hazard][x-pkg-dual-package-hazard] entirely, distributables are not
packed/bundled/uglified, a drastically less complex build process, and CJS
consumers aren't shafted.

Each entry point (i.e. `ENTRY`) in [`package.json`'s
`exports[ENTRY]`][x-repo-package-json] object includes one or more [export
conditions][x-pkg-exports-conditions]. These entries may or may not include: an
[`exports[ENTRY].types`][x-pkg-exports-types-key] condition pointing to a type
declaration file for TypeScript and IDEs, a
[`exports[ENTRY].module`][x-pkg-exports-module-key] condition pointing to
(usually ESM) source for Webpack/Rollup, a `exports[ENTRY].node` and/or
`exports[ENTRY].default` condition pointing to (usually CJS2) source for Node.js
`require`/`import` and for browsers and other environments, and [other
conditions][x-pkg-exports-conditions] not enumerated here. Check the
[package.json][x-repo-package-json] file to see which export conditions are
supported.

Note that, regardless of the [`{ "type": "..." }`][x-pkg-type] specified in
[`package.json`][x-repo-package-json], any JavaScript files written in ESM
syntax (including distributables) will always have the `.mjs` extension. Note
also that [`package.json`][x-repo-package-json] may include the
[`sideEffects`][x-pkg-side-effects-key] key, which is almost always `false` for
optimal [tree shaking][x-pkg-tree-shaking] where appropriate.

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start 8 -->

</details>

### License

<!-- symbiote-template-region-end -->

See [LICENSE][x-repo-license].

<!-- symbiote-template-region-start 9 -->

## Contributing and Support

**[New issues][x-repo-choose-new-issue] and [pull requests][x-repo-pr-compare]
are always welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟
this project][x-badge-repo-link] to let me know you found it useful! ✊🏿 Or [buy
me a beer][x-repo-sponsor], I'd appreciate it. Thank you!

See [CONTRIBUTING.md][x-repo-contributing] and [SUPPORT.md][x-repo-support] for
more information.

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start 10 -->

### Contributors

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start root-package-only -->
<!-- (section elided by symbiote) -->
<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start workspace-package-only -->

See the [table of contributors][x-repo-contributors].

<!-- symbiote-template-region-end -->

[x-badge-blm-image]: https://xunn.at/badge-blm 'Join the movement!'
[x-badge-blm-link]: https://xunn.at/donate-blm
[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/Xunnamius/black-flag/main?style=flat-square&token=HWRIOBAAPW&flag=package.main_extensions
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/Xunnamius/black-flag
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/@black-flag/extensions?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-downloads-link]: https://npmtrends.com/@black-flag/extensions
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/Xunnamius/black-flag?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/@black-flag/extensions?style=flat-square
  "This package's source license"
[x-badge-license-link]:
  https://github.com/Xunnamius/black-flag/blob/main/LICENSE
[x-badge-npm-image]:
  https://xunn.at/npm-pkg-version/@black-flag/extensions
  'Install this package using npm or yarn!'
[x-badge-npm-link]: https://npm.im/@black-flag/extensions
[x-badge-repo-link]: https://github.com/Xunnamius/black-flag
[x-badge-semanticrelease-image]:
  https://xunn.at/badge-semantic-release
  'This repo practices continuous integration and deployment!'
[x-badge-semanticrelease-link]:
  https://github.com/semantic-release/semantic-release
[x-pkg-cjs-mojito]:
  https://dev.to/jakobjingleheimer/configuring-commonjs-es-modules-for-nodejs-12ed#publish-only-a-cjs-distribution-with-property-exports
[x-pkg-dual-package-hazard]:
  https://nodejs.org/api/packages.html#dual-package-hazard
[x-pkg-exports-conditions]:
  https://webpack.js.org/guides/package-exports#reference-syntax
[x-pkg-exports-module-key]:
  https://webpack.js.org/guides/package-exports#providing-commonjs-and-esm-version-stateless
[x-pkg-exports-types-key]:
  https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta#packagejson-exports-imports-and-self-referencing
[x-pkg-side-effects-key]:
  https://webpack.js.org/guides/tree-shaking#mark-the-file-as-side-effect-free
[x-pkg-tree-shaking]: https://webpack.js.org/guides/tree-shaking
[x-pkg-type]:
  https://github.com/nodejs/node/blob/8d8e06a345043bec787e904edc9a2f5c5e9c275f/doc/api/packages.md#type
[x-repo-choose-new-issue]:
  https://github.com/Xunnamius/black-flag/issues/new/choose
[x-repo-contributing]: /CONTRIBUTING.md
[x-repo-contributors]: /README.md#contributors
[x-repo-docs]: docs
[x-repo-license]: ./LICENSE
[x-repo-package-json]: package.json
[x-repo-pr-compare]: https://github.com/Xunnamius/black-flag/compare
[x-repo-sponsor]: https://github.com/sponsors/Xunnamius
[x-repo-support]: /.github/SUPPORT.md
[1]: https://github.com/yargs/yargs/issues
[2]: https://en.wikipedia.org/wiki/Completeness_(logic)
[3]: https://en.wikipedia.org/wiki/Propositional_calculus
[4]: #differences-between-black-flag-extensions-and-yargs
[5]: https://en.wikipedia.org/wiki/Word_joiner
[6]: ./docs/index/functions/withBuilderExtensions.md
[7]: https://github.com/yargs/yargs-parser?tab=readme-ov-file#configuration
[8]: ../../docs/api/src/exports/type-aliases/Configuration.md#builder
[9]: ../../docs/api/src/exports/type-aliases/Configuration.md#handler
[10]: ../../docs/features.md#its-yargs-all-the-way-down-
[11]:
  ../../docs/advanced.md#justification-for-the-parent-child-and-tripartite-program-design
[12]: https://yargs.js.org/docs#api-reference-defaultkey-value-description
[13]: #check
[14]: #requires
[15]: #conflicts
[16]: https://github.com/yargs/yargs/issues/1442
[17]: https://yargs.js.org/docs#api-reference-optionskey-opt
[18]: #implies
[19]: #demandthisoptionif
[20]: #demandthisoption
[21]: #demandthisoptionor
[22]: #demandthisoptionxor
[23]: #suboptionof
[24]: #looseimplications
[25]: #vacuousimplications
[26]: ./docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#requires
[27]: https://yargs.js.org/docs#api-reference-impliesx-y
[28]: ./docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#conflicts
[29]: https://yargs.js.org/docs#api-reference-conflictsx-y
[30]: ./docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#implies
[31]: #new-option-configuration-keys
[32]: https://yargs.js.org/docs#api-reference-demandoptionkey-msg-boolean
[33]: https://en.wikipedia.org/wiki/Vacuous_truth
[34]: https://en.wikipedia.org/wiki/Consequent
[35]:
  ./docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#demandThisOptionIf
[36]:
  ./docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#demandThisOption
[37]:
  ./docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#demandThisOptionOr
[38]:
  ./docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#demandThisOptionXor
[39]: ./docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#check
[40]: https://yargs.js.org/docs#api-reference-checkfn-globaltrue
[41]: ../../docs/api/src/exports/type-aliases/ConfigureErrorHandlingEpilogue.md
[42]: ../../docs/api/src/exports/classes/GracefulEarlyExitError.md
[43]: ./docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#subOptionOf
[44]: ../../docs/features.md#built-in-support-for-dynamic-options-
[45]: https://github.com/Xunnamius/black-flag-demo/blob/main/commands/init.js
[46]: #strange-and-impossible-configurations
[47]: https://yargs.js.org/docs#api-reference-groupkeys-groupname
[48]: https://github.com/Xunnamius/xunnctl?tab=readme-ov-file#xunnctl
[49]: ./docs/index/functions/withUsageExtensions.md
[50]: ./docs/index/functions/getInvocableExtendedHandler.md
[51]: https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
[52]: ./docs/symbols/variables/$artificiallyInvoked.md
[53]: ./docs/index/type-aliases/BfeStrictArguments.md
[54]: ../../docs/api/src/exports/functions/runProgram.md
[55]: https://github.com/Xunnamius/symbiote/blob/main/src/commands/deploy.ts
[56]: https://yargs.js.org/docs#api-reference-coercekey-fn
[57]: https://yargs.js.org/docs#api-reference
[58]: ../../docs/api/src/exports/type-aliases/ConfigureExecutionPrologue.md
[59]: https://npm.im/@black-flag/core
[60]: https://yargs.js.org/docs#api-reference-commanddirdirectory-opts
[61]: ../../docs/bf-vs-yargs.md
[62]: https://github.com/yargs/yargs/issues/1323
[63]: https://github.com/yargs/yargs/issues/2340
[64]: https://github.com/yargs/yargs/issues/1322
[65]: https://github.com/yargs/yargs/issues/2089
[66]: https://github.com/yargs/yargs/issues/1975
[67]: https://github.com/yargs/yargs-parser/issues/412
[68]: https://github.com/yargs/yargs/issues/1680
[69]: https://github.com/yargs/yargs/issues/1599
[70]: https://github.com/yargs/yargs/issues/1611
[71]: ../../docs/api/src/exports/variables/$executionContext.md
