[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / FrameworkArguments

# Type Alias: FrameworkArguments\<CustomExecutionContext\>

> **FrameworkArguments**\<`CustomExecutionContext`\> = `object`

Defined in: [src/types/program.ts:273](https://github.com/Xunnamius/black-flag/blob/d6004b46e3ac5a451e4e0f05bf5c8726ce157ac9/src/types/program.ts#L273)

Represents the CLI arguments/properties added by Black Flag rather than the
end developer.

Instead of using this type directly, your project's custom arguments (e.g.
`MyCustomArgs`) should be wrapped with the [Arguments](../../type-aliases/Arguments.md) generic type
(e.g. `Arguments<MyCustomArgs>`), which will extend `FrameworkArguments` for
you.

## Type Parameters

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Properties

### \[$executionContext\]

> **\[$executionContext\]**: `CustomExecutionContext`

Defined in: [src/types/program.ts:276](https://github.com/Xunnamius/black-flag/blob/d6004b46e3ac5a451e4e0f05bf5c8726ce157ac9/src/types/program.ts#L276)
