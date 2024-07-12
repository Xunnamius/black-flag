[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / NullArguments

# Type Alias: NullArguments\<CustomExecutionContext\>

> **NullArguments**\<`CustomExecutionContext`\>: `object` & [`FrameworkArguments`](../../util/type-aliases/FrameworkArguments.md)\<`CustomExecutionContext`\>

Represents an empty or "null" `Arguments` object devoid of useful data.

This result type is fed to certain configuration hooks and returned by
various `Arguments`-returning functions when an exceptional event prevents
yargs from returning a real `Arguments` parse result.

## Type declaration

### $0

> **$0**: `"<NullArguments: no parse result available due to exception>"`

### \_

> **\_**: []

## Type Parameters

• **CustomExecutionContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Defined in

[types/program.ts:30](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/types/program.ts#L30)
