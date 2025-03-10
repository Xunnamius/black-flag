[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / WithBuilderExtensionsConfig

# Type Alias: WithBuilderExtensionsConfig\<CustomCliArguments>

> **WithBuilderExtensionsConfig**<`CustomCliArguments`>: `object`

Defined in: [packages/extensions/src/index.ts:687][3]

A configuration object that further configures the behavior of
[withBuilderExtensions][4].

## Type Parameters

• **CustomCliArguments** _extends_ `Record`<`string`, `unknown`>

## Type Declaration

### Commonoptions?

> `optional` **commonOptions**: readonly `LiteralUnion`\<keyof `CustomCliArguments` | `"help"` | `"version"`, `string`>\[]

An array of zero or more string keys of `CustomCliArguments`, with the
optional addition of `'help'` and `'version'`, that should be grouped under
_"Common Options"_ when [automatic grouping of related
options][5]
is enabled.

This setting is ignored if `disableAutomaticGrouping === true`.

#### Default

```ts
['help']
```

### Disableautomaticgrouping?

> `optional` **disableAutomaticGrouping**: `boolean`

Set to `true` to disable BFE's support for automatic grouping of related
options.

See [the
documentation][5]
for details.

#### Default

```ts
false
```

[1]: ../../README.md
[2]: ../README.md
[3]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L687
[4]: ../functions/withBuilderExtensions.md
[5]: https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#automatic-grouping-of-related-options
