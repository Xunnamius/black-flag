[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [index][2] / BfeCustomBuilderFunctionParameters

# Type Alias: BfeCustomBuilderFunctionParameters\<CustomCliArguments, CustomExecutionContext, P>

> **BfeCustomBuilderFunctionParameters**<`CustomCliArguments`, `CustomExecutionContext`, `P`>: `P` _extends_ \[infer R, `...(infer S)`] ? `S` _extends_ \[infer T, `...(infer _U)`] ? \[`R` & `object`, `T`, [`BfeStrictArguments`][3]<`Partial`<`CustomCliArguments`>, `CustomExecutionContext`> | `undefined`] : \[`R` & `object`, `...S`] : `never`

Defined in: [packages/extensions/src/index.ts:627][4]

A version of Black Flag's `builder` function parameters that exclude yargs
methods that are not supported by BFE.

## Type Parameters

• **CustomCliArguments** _extends_ `Record`<`string`, `unknown`>

• **CustomExecutionContext** _extends_ `ExecutionContext`

• **P** = `Parameters`<[`BfBuilderFunction`][5]<`CustomCliArguments`, `CustomExecutionContext`>>

## See

[withBuilderExtensions][6]

[1]: ../../README.md
[2]: ../README.md
[3]: BfeStrictArguments.md
[4]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/index.ts#L627
[5]: BfBuilderFunction.md
[6]: ../functions/withBuilderExtensions.md
