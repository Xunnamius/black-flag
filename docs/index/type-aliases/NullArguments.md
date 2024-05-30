[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / NullArguments

# Type alias: NullArguments\<CustomExecutionContext\>

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

## Type parameters

• **CustomExecutionContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Source

[types/program.ts:30](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/types/program.ts#L30)
