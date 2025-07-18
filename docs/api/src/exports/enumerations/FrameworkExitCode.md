[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / FrameworkExitCode

# Enumeration: FrameworkExitCode

Defined in: [src/constant.ts:51](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/constant.ts#L51)

Well-known exit codes shared across CLI implementations.

## Enumeration Members

### AssertionFailed

> **AssertionFailed**: `3`

Defined in: [src/constant.ts:75](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/constant.ts#L75)

The exit code used when a sanity check fails. This includes (but is not
limited to) all _framework errors_.

If your CLI is spitting out this code, deeper insight can be had by
re-running things in debug mode (i.e. `DEBUG='bf:*' npx jest` or `DEBUG='*'
npx jest`).

In most (but not all) cases, this exit code is indicative of improper use
of Black Flag by the developer.

***

### DefaultError

> **DefaultError**: `1`

Defined in: [src/constant.ts:59](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/constant.ts#L59)

Hard-coded default fallback exit code when fatal errors occur.

***

### NotImplemented

> **NotImplemented**: `2`

Defined in: [src/constant.ts:63](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/constant.ts#L63)

The exit code used when executing an unimplemented child command.

***

### Ok

> **Ok**: `0`

Defined in: [src/constant.ts:55](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/constant.ts#L55)

The exit code used when execution succeeds and exits gracefully.
