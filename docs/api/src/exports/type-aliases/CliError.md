[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / CliError

# Type Alias: CliError

> **CliError** = `InstanceType`\<*typeof* [`CliError`](../variables/CliError.md)\>

Defined in: [src/error.ts:102](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/error.ts#L102)

Represents a CLI-specific error with suggested exit code and other
properties. As `CliError` has built-in support for cause chaining, this class
can be used as a simple wrapper around other errors.
