[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / CliErrorOptions

# Type alias: CliErrorOptions

> **CliErrorOptions**: `object`

Options available when constructing a new `CliError` object.

## Type declaration

### showHelp?

> `optional` **showHelp**: `boolean`

If `true`, help text will be sent to stderr _before this exception finishes
bubbling_. Where the exception is thrown will determine which instance is
responsible for error text generation.

#### Default

```ts
false
```

### suggestedExitCode?

> `optional` **suggestedExitCode**: `number`

The exit code that will be returned when the application exits, given
nothing else goes wrong in the interim.

#### Default

```ts
FrameworkExitCode.DefaultError
```

## Source

[src/error.ts:67](https://github.com/Xunnamius/black-flag/blob/078357b0a89baf1ca6264881df1614997567a0db/src/error.ts#L67)
