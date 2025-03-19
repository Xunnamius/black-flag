[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / AsStrictExecutionContext

# Type Alias: AsStrictExecutionContext\<CustomExecutionContext\>

> **AsStrictExecutionContext**\<`CustomExecutionContext`\> = `OmitIndexSignature`\<`Exclude`\<`CustomExecutionContext`, `"state"`\>\> & `OmitIndexSignature`\<`CustomExecutionContext`\[`"state"`\]\>

Defined in: [packages/extensions/src/index.ts:633](https://github.com/Xunnamius/black-flag/blob/6ed277e0a55bcec73d66d48954610cdf899ffe68/packages/extensions/src/index.ts#L633)

A stricter version of Black Flag's
[ExecutionContext](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md)
type that explicitly omits the fallback indexers for unrecognized properties.
Even though it is the runtime equivalent of `ExecutionContext`, using this
type allows intellisense to report bad/misspelled/missing arguments from
`context` in various places where it otherwise couldn't.

**This type is intended for intellisense purposes only.**

## Type Parameters

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext`
