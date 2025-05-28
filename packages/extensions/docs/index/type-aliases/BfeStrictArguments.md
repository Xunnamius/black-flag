[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeStrictArguments

# Type Alias: BfeStrictArguments\<CustomCliArguments, CustomExecutionContext\>

> **BfeStrictArguments**\<`CustomCliArguments`, `CustomExecutionContext`\> = `OmitIndexSignature`\<`Arguments`\<`CustomCliArguments`, `CustomExecutionContext`\>\> & `FrameworkArguments`\<`CustomExecutionContext`\> & `object`

Defined in: [packages/extensions/src/index.ts:611](https://github.com/Xunnamius/black-flag/blob/3764563cebc186c7e5f9e6fd9ad3d54a1192fe57/packages/extensions/src/index.ts#L611)

A stricter version of Black Flag's
[Arguments](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/type-aliases/Arguments.md)
type that explicitly omits the fallback indexers for unrecognized arguments.
Even though it is the runtime equivalent of `Arguments`, using this type
allows intellisense to report bad/misspelled/missing arguments from `argv` in
various places where it otherwise couldn't.

**This type is intended for intellisense purposes only.**

## Type declaration

### \[$artificiallyInvoked\]?

> `optional` **\[$artificiallyInvoked\]**: `boolean`

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
