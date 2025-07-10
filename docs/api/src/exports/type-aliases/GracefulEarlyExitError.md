[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / GracefulEarlyExitError

# Type Alias: GracefulEarlyExitError

> **GracefulEarlyExitError** = `InstanceType`\<*typeof* [`GracefulEarlyExitError`](../variables/GracefulEarlyExitError.md)\>

Defined in: [src/error.ts:180](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/error.ts#L180)

Represents an exceptional event that should result in the immediate
termination of the application but with an exit code indicating success
(`0`).

Note that [CliErrorOptions.dangerouslyFatal](../util/type-aliases/CliErrorOptions.md#dangerouslyfatal), if given, is always
ignored.
