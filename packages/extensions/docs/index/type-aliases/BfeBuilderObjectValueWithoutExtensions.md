[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / BfeBuilderObjectValueWithoutExtensions

# Type Alias: BfeBuilderObjectValueWithoutExtensions

> **BfeBuilderObjectValueWithoutExtensions**: `Omit`<[`BfGenericBuilderObjectValue`][3], `"conflicts"` | `"implies"` | `"demandOption"` | `"demand"` | `"require"` | `"required"` | `"default"` | `"coerce"`>

Defined in: [packages/extensions/src/index.ts:474][4]

An object containing a subset of only those properties recognized by
Black Flag (and, consequentially, vanilla yargs). Also excludes
properties that conflict with [BfeBuilderObjectValueExtensions][5] and/or
are deprecated by vanilla yargs.

This type + [BfeBuilderObjectValueExtensions][5] =
[BfeBuilderObjectValue][6].

This type is a subset of [BfBuilderObjectValue][7].

[1]: ../../README.md
[2]: ../README.md
[3]: BfGenericBuilderObjectValue.md
[4]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L474
[5]: BfeBuilderObjectValueExtensions.md
[6]: BfeBuilderObjectValue.md
[7]: BfBuilderObjectValue.md
