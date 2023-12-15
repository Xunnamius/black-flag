[black-flag](../README.md) / [index](../modules/index.md) / FrameworkExitCode

# Enumeration: FrameworkExitCode

[index](../modules/index.md).FrameworkExitCode

Well-known exit codes shared across CLI implementations.

## Table of contents

### Enumeration Members

- [AssertionFailed](index.FrameworkExitCode.md#assertionfailed)
- [DefaultError](index.FrameworkExitCode.md#defaulterror)
- [NotImplemented](index.FrameworkExitCode.md#notimplemented)
- [Ok](index.FrameworkExitCode.md#ok)

## Enumeration Members

### AssertionFailed

• **AssertionFailed** = ``3``

The exit code used when a sanity check fails. If your CLI is spitting out
this code, that's a hint to re-run things in debug mode (example:
`DEBUG='black-flag*' npx jest`) since an error is being suppressed.

In most cases, this exit code is indicative of improper use of Black Flag.

#### Defined in

[src/constant.ts:50](https://github.com/Xunnamius/black-flag/blob/6d30d4b/src/constant.ts#L50)

___

### DefaultError

• **DefaultError** = ``1``

Hard-coded default fallback exit code when fatal errors occur.

#### Defined in

[src/constant.ts:38](https://github.com/Xunnamius/black-flag/blob/6d30d4b/src/constant.ts#L38)

___

### NotImplemented

• **NotImplemented** = ``2``

The exit code used when executing an unimplemented child command.

#### Defined in

[src/constant.ts:42](https://github.com/Xunnamius/black-flag/blob/6d30d4b/src/constant.ts#L42)

___

### Ok

• **Ok** = ``0``

The exit code used when execution succeeds and exits gracefully.

#### Defined in

[src/constant.ts:34](https://github.com/Xunnamius/black-flag/blob/6d30d4b/src/constant.ts#L34)
