[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / FrameworkArguments

# Type Alias: FrameworkArguments\<CustomExecutionContext\>

> **FrameworkArguments**\<`CustomExecutionContext`\>: `object`

Represents the CLI arguments/properties added by Black Flag rather than the
end developer.

Instead of using this type directly, your project's custom arguments (e.g.
`MyCustomArgs`) should be wrapped with the [Arguments](../../index/type-aliases/Arguments.md) generic type
(e.g. `Arguments<MyCustomArgs>`), which will extend `FrameworkArguments` for
you.

## Type Parameters

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Type declaration

### \[$executionContext\]

> **\[$executionContext\]**: `CustomExecutionContext`

## Defined in

[types/program.ts:257](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/types/program.ts#L257)
