[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeSubOptionOfExtensionValue

# Type Alias: BfeSubOptionOfExtensionValue\<CustomCliArguments, CustomExecutionContext\>

> **BfeSubOptionOfExtensionValue**\<`CustomCliArguments`, `CustomExecutionContext`\> = `object`

Defined in: [packages/extensions/src/index.ts:509](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L509)

The array element type of
[BfeBuilderObjectValueExtensions.subOptionOf](BfeBuilderObjectValueExtensions.md#suboptionof).

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`

## Properties

### update

> **update**: (`oldOptionConfig`, `argv`) => [`BfeBuilderObjectValueWithoutSubOptionOfExtension`](BfeBuilderObjectValueWithoutSubOptionOfExtension.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`BfeBuilderObjectValueWithoutSubOptionOfExtension`](BfeBuilderObjectValueWithoutSubOptionOfExtension.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Defined in: [packages/extensions/src/index.ts:546](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L546)

This function receives the current configuration for this option
(`oldOptionConfig`) and the fully parsed `argv` (not including any default
values), and must return the new configuration for this option.

This configuration will completely overwrite the old configuration. To
extend the old configuration instead, spread it. For example:

```javascript
return {
  ...oldOptionConfig,
  description: 'New description'
}
```

***

### when()

> **when**: (`superOptionValue`, `argv`) => `boolean`

Defined in: [packages/extensions/src/index.ts:526](https://github.com/Xunnamius/black-flag/blob/79ac029630564873580521833d41f0f37fb5eec8/packages/extensions/src/index.ts#L526)

This function receives the `superOptionValue` of the so-called "super
option" (i.e. `key` in `{ subOptionOf: { key: { when: ... }}}`), which you
are free to type as you please, and the fully parsed `argv` (not including
any default values). This function must return a boolean indicating whether
the `update` function should run or not.

Note that this function is only invoked if the super option is given on the
command line. If it is not, neither this function nor `update` will ever
run. Therefore, if your updater should run whenever the super option is
given, regardless of its value, it is acceptable to use `{ when: () => true
}`

#### Parameters

##### superOptionValue

`any`

##### argv

`Arguments`\<`CustomCliArguments`, `CustomExecutionContext`\>

#### Returns

`boolean`
