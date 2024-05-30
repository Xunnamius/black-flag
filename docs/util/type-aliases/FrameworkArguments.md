[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / FrameworkArguments

# Type alias: FrameworkArguments\<CustomExecutionContext\>

> **FrameworkArguments**\<`CustomExecutionContext`\>: `object`

Represents the CLI arguments/properties added by Black Flag rather than the
end developer.

Instead of using this type directly, your project's custom arguments (e.g.
`MyCustomArgs`) should be wrapped with the [Arguments](../../index/type-aliases/Arguments.md) generic type
(e.g. `Arguments<MyCustomArgs>`), which will extend `FrameworkArguments` for
you.

## Type parameters

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Type declaration

### \[$executionContext\]

> **\[$executionContext\]**: `CustomExecutionContext`

## Source

[types/program.ts:257](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/types/program.ts#L257)
