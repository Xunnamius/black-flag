[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / getDeepestErrorCause

# Function: getDeepestErrorCause()

> **getDeepestErrorCause**(`error`): `unknown`

Defined in: [src/util.ts:107](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/util.ts#L107)

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
