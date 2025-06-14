[**@black-flag/checks**](../../README.md)

***

[@black-flag/checks](../../README.md) / [index](../README.md) / checkArrayNotEmpty

# Function: checkArrayNotEmpty()

> **checkArrayNotEmpty**(`argName`, `adjective`): (`currentArg`) => `string` \| `true`

Defined in: [index.ts:31](https://github.com/Xunnamius/black-flag/blob/b36077d96948b9d710b24de4e7cdd82d7bab8303/packages/checks/src/index.ts#L31)

A Black Flag check that passes when each member of an array-type argument
is a non-empty non-nullish value and the array itself is non-empty.

## Parameters

### argName

`string`

### adjective

`string` = `'non-empty'`

## Returns

> (`currentArg`): `string` \| `true`

### Parameters

#### currentArg

`unknown`

### Returns

`string` \| `true`
