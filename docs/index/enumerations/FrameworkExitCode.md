[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / FrameworkExitCode

# Enumeration: FrameworkExitCode

Well-known exit codes shared across CLI implementations.

## Enumeration Members

### AssertionFailed

> **AssertionFailed**: `3`

The exit code used when a sanity check fails. If your CLI is spitting out
this code, that's a hint to re-run things in debug mode (example:
`DEBUG='black-flag*' npx jest`) since an error is being suppressed.

In most cases, this exit code is indicative of improper use of Black Flag.

#### Defined in

[src/constant.ts:60](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/constant.ts#L60)

***

### DefaultError

> **DefaultError**: `1`

Hard-coded default fallback exit code when fatal errors occur.

#### Defined in

[src/constant.ts:48](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/constant.ts#L48)

***

### NotImplemented

> **NotImplemented**: `2`

The exit code used when executing an unimplemented child command.

#### Defined in

[src/constant.ts:52](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/constant.ts#L52)

***

### Ok

> **Ok**: `0`

The exit code used when execution succeeds and exits gracefully.

#### Defined in

[src/constant.ts:44](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/src/constant.ts#L44)
