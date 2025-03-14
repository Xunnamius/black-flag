[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / isAssertionSystemError

# Function: isAssertionSystemError()

> **isAssertionSystemError**(`error`): `error is ErrnoException & { actual?: unknown; code: "ERR_ASSERTION"; expected?: unknown; generatedMessage: boolean; operator: string }`

Defined in: [src/util.ts:62](https://github.com/Xunnamius/black-flag/blob/aaa1a74457790f285cb2c85d4d6a7ee05978fc42/src/util.ts#L62)

Type-guard for Node's "ERR_ASSERTION" so-called `SystemError`.

## Parameters

### error

`unknown`

## Returns

`error is ErrnoException & { actual?: unknown; code: "ERR_ASSERTION"; expected?: unknown; generatedMessage: boolean; operator: string }`
