[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / NullArguments

# Type Alias: NullArguments\<CustomExecutionContext\>

> **NullArguments**\<`CustomExecutionContext`\> = `object` & [`FrameworkArguments`](../util/type-aliases/FrameworkArguments.md)\<`CustomExecutionContext`\>

Defined in: [src/types/program.ts:41](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/program.ts#L41)

Represents an empty or "null" `Arguments` object devoid of useful data.

This result type is fed to certain configuration hooks and returned by
various `Arguments`-returning functions when an exceptional event prevents
yargs from returning a real `Arguments` parse result.

## Type declaration

### \_

> **\_**: \[\]

### $0

> **$0**: *typeof* [`nullArguments$0`](../util/variables/nullArguments$0.md)

## Type Parameters

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)
