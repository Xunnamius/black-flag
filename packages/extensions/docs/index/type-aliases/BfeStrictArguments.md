[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeStrictArguments

# Type Alias: BfeStrictArguments\<CustomCliArguments, CustomExecutionContext\>

> **BfeStrictArguments**\<`CustomCliArguments`, `CustomExecutionContext`\>: `OmitIndexSignature`\<`Arguments`\<`CustomCliArguments`, `CustomExecutionContext`\>\> & `FrameworkArguments`\<`CustomExecutionContext`\> & `object`

Defined in: [packages/extensions/src/index.ts:597](https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L597)

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

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`
