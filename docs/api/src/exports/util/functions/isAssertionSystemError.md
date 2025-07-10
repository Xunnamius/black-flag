[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / isAssertionSystemError

# Function: isAssertionSystemError()

> **isAssertionSystemError**(`error`): `error is ErrnoException & { actual?: unknown; code: "ERR_ASSERTION"; expected?: unknown; generatedMessage: boolean; operator: string }`

Defined in: [src/util.ts:62](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/util.ts#L62)

Type-guard for Node's "ERR_ASSERTION" so-called `SystemError`.

## Parameters

### error

`unknown`

## Returns

`error is ErrnoException & { actual?: unknown; code: "ERR_ASSERTION"; expected?: unknown; generatedMessage: boolean; operator: string }`
