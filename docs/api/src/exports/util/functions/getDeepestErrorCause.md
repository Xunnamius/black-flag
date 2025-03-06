[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / getDeepestErrorCause

# Function: getDeepestErrorCause()

> **getDeepestErrorCause**(`error`): `unknown`

Defined in: [src/util.ts:98](https://github.com/Xunnamius/black-flag/blob/29a6a8eee6470040d4cbaf8ff2f3ff851bd9e0bf/src/util.ts#L98)

Accepts an `error` and returns the value of its `.cause` property if (1)
`error` extends `Error` and (2) the `.cause` property exists and is not
falsy; otherwise, `error` itself is returned. This action is performed
recursively (.e.g. `error.cause.cause.cause...`) until a value without a
non-falsy `.cause` property is encountered.

This function can be used to extract the true cause of a `CliError` and/or
nested `Error`s.

## Parameters

### error

`unknown`

## Returns

`unknown`
