[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / BfeBuilderObjectValueWithoutExtensions

# Type Alias: BfeBuilderObjectValueWithoutExtensions

> **BfeBuilderObjectValueWithoutExtensions** = `Omit`\<[`BfGenericBuilderObjectValue`](BfGenericBuilderObjectValue.md), `"conflicts"` \| `"implies"` \| `"demandOption"` \| `"demand"` \| `"require"` \| `"required"` \| `"default"` \| `"coerce"`\>

Defined in: [packages/extensions/src/index.ts:491](https://github.com/Xunnamius/black-flag/blob/170aa97d281b546ae8a3014f985324d5c71f08f4/packages/extensions/src/index.ts#L491)

An object containing a subset of only those properties recognized by
Black Flag (and, consequentially, vanilla yargs). Also excludes
properties that conflict with [BfeBuilderObjectValueExtensions](BfeBuilderObjectValueExtensions.md) and/or
are deprecated by vanilla yargs.

This type + [BfeBuilderObjectValueExtensions](BfeBuilderObjectValueExtensions.md) =
[BfeBuilderObjectValue](BfeBuilderObjectValue.md).

This type is a subset of [BfBuilderObjectValue](BfBuilderObjectValue.md).
