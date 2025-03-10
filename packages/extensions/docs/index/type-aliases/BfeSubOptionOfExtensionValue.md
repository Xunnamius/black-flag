[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / BfeSubOptionOfExtensionValue

# Type Alias: BfeSubOptionOfExtensionValue\<CustomCliArguments, CustomExecutionContext>

> **BfeSubOptionOfExtensionValue**<`CustomCliArguments`, `CustomExecutionContext`>: `object`

Defined in: [packages/extensions/src/index.ts:502][3]

The array element type of
[BfeBuilderObjectValueExtensions.subOptionOf][4].

## Type Parameters

• **CustomCliArguments** _extends_ `Record`<`string`, `unknown`>

• **CustomExecutionContext** _extends_ `ExecutionContext`

## Type Declaration

### Update

> **update**: (`oldOptionConfig`, `argv`) => [`BfeBuilderObjectValueWithoutSubOptionOfExtension`][5]<`CustomCliArguments`, `CustomExecutionContext`> | [`BfeBuilderObjectValueWithoutSubOptionOfExtension`][5]<`CustomCliArguments`, `CustomExecutionContext`>

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

### When()

> **when**: (`superOptionValue`, `argv`) => `boolean`

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

##### Superoptionvalue

`any`

##### Argv

`Arguments`<`CustomCliArguments`, `CustomExecutionContext`>

#### Returns

`boolean`

[1]: ../../README.md
[2]: ../README.md
[3]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L502
[4]: BfeBuilderObjectValueExtensions.md#suboptionof
[5]: BfeBuilderObjectValueWithoutSubOptionOfExtension.md
