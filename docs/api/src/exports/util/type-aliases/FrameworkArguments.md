[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / FrameworkArguments

# Type Alias: FrameworkArguments\<CustomExecutionContext\>

> **FrameworkArguments**\<`CustomExecutionContext`\>: `object`

Defined in: [src/types/program.ts:271](https://github.com/Xunnamius/black-flag/blob/10cd0ebc0304d033218ec4dffba0c41cb2e85ff6/src/types/program.ts#L271)

Represents the CLI arguments/properties added by Black Flag rather than the
end developer.

Instead of using this type directly, your project's custom arguments (e.g.
`MyCustomArgs`) should be wrapped with the [Arguments](../../type-aliases/Arguments.md) generic type
(e.g. `Arguments<MyCustomArgs>`), which will extend `FrameworkArguments` for
you.

## Type Parameters

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Type declaration

### \[$executionContext\]

> **\[$executionContext\]**: `CustomExecutionContext`
