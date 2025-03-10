[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / AsStrictExecutionContext

# Type Alias: AsStrictExecutionContext\<CustomExecutionContext>

> **AsStrictExecutionContext**<`CustomExecutionContext`>: `OmitIndexSignature`<`Exclude`<`CustomExecutionContext`, `"state"`>> & `OmitIndexSignature`<`CustomExecutionContext`\[`"state"`]>

Defined in: [packages/extensions/src/index.ts:617][3]

A stricter version of Black Flag's
[ExecutionContext][4]
type that explicitly omits the fallback indexers for unrecognized properties.
Even though it is the runtime equivalent of `ExecutionContext`, using this
type allows intellisense to report bad/misspelled/missing arguments from
`context` in various places where it otherwise couldn't.

**This type is intended for intellisense purposes only.**

## Type Parameters

• **CustomExecutionContext** _extends_ `ExecutionContext`

[1]: ../../README.md
[2]: ../README.md
[3]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L617
[4]: https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md
