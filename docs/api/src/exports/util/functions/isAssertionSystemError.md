[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / isAssertionSystemError

# Function: isAssertionSystemError()

> **isAssertionSystemError**(`error`): `error is ErrnoException & { actual?: unknown; code: "ERR_ASSERTION"; expected?: unknown; generatedMessage: boolean; operator: string }`

Defined in: [src/util.ts:62](https://github.com/Xunnamius/black-flag/blob/80aa4a39c172096a78cb27464b3ff055c511121d/src/util.ts#L62)

Type-guard for Node's "ERR_ASSERTION" so-called `SystemError`.

## Parameters

### error

`unknown`

## Returns

`error is ErrnoException & { actual?: unknown; code: "ERR_ASSERTION"; expected?: unknown; generatedMessage: boolean; operator: string }`
