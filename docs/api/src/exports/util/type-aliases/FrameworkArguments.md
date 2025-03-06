[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / FrameworkArguments

# Type Alias: FrameworkArguments\<CustomExecutionContext\>

> **FrameworkArguments**\<`CustomExecutionContext`\>: `object`

Defined in: [src/types/program.ts:256](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/types/program.ts#L256)

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
