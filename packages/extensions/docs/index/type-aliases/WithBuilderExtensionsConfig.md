[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / WithBuilderExtensionsConfig

# Type Alias: WithBuilderExtensionsConfig\<CustomCliArguments\>

> **WithBuilderExtensionsConfig**\<`CustomCliArguments`\> = `object`

Defined in: [packages/extensions/src/index.ts:704](https://github.com/Xunnamius/black-flag/blob/a49f96af98d9a9d96fd7dc9946a709fd368c04c2/packages/extensions/src/index.ts#L704)

A configuration object that further configures the behavior of
[withBuilderExtensions](../functions/withBuilderExtensions.md).

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

## Properties

### commonOptions?

> `optional` **commonOptions**: readonly `LiteralUnion`\<keyof `CustomCliArguments` \| `"help"` \| `"version"`, `string`\>[]

Defined in: [packages/extensions/src/index.ts:739](https://github.com/Xunnamius/black-flag/blob/a49f96af98d9a9d96fd7dc9946a709fd368c04c2/packages/extensions/src/index.ts#L739)

An array of zero or more string keys of `CustomCliArguments`, with the
optional addition of `'help'` and `'version'`, that should be grouped under
_"Common Options"_ when [automatic grouping of related
options](https://github.com/Xunnamius/black-flag/blob/main/packages/extensions/README.md#automatic-sorting-of-options)
is enabled.

This setting is ignored if `disableAutomaticGrouping === true`.

#### Default

```ts
['help']
```

***

### disableAutomaticGrouping?

> `optional` **disableAutomaticGrouping**: `boolean`

Defined in: [packages/extensions/src/index.ts:717](https://github.com/Xunnamius/black-flag/blob/a49f96af98d9a9d96fd7dc9946a709fd368c04c2/packages/extensions/src/index.ts#L717)

Set to `true` to disable BFE's support for automatic grouping of related
options.

See [the
documentation](https://github.com/Xunnamius/black-flag/blob/main/packages/extensions/README.md#automatic-grouping-of-related-options)
for details.

#### Default

```ts
false
```

***

### enableAutomaticSorting?

> `optional` **enableAutomaticSorting**: `boolean`

Defined in: [packages/extensions/src/index.ts:727](https://github.com/Xunnamius/black-flag/blob/a49f96af98d9a9d96fd7dc9946a709fd368c04c2/packages/extensions/src/index.ts#L727)

Set to `true` to enable BFE's support for automatic sorting of options.

See [the
documentation](https://github.com/Xunnamius/black-flag/blob/main/packages/extensions/README.md#automatic-sorting-of-options)
for details.

#### Default

```ts
false
```
