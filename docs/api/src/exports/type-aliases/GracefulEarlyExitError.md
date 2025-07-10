[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / GracefulEarlyExitError

# Type Alias: GracefulEarlyExitError

> **GracefulEarlyExitError** = `InstanceType`\<*typeof* [`GracefulEarlyExitError`](../variables/GracefulEarlyExitError.md)\>

Defined in: [src/error.ts:180](https://github.com/Xunnamius/black-flag/blob/8d031666f2b06def50a0b12d4e86a7961a49e69d/src/error.ts#L180)

Represents an exceptional event that should result in the immediate
termination of the application but with an exit code indicating success
(`0`).

Note that [CliErrorOptions.dangerouslyFatal](../util/type-aliases/CliErrorOptions.md#dangerouslyfatal), if given, is always
ignored.
