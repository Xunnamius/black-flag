[**@black-flag/checks**](../../README.md)

***

[@black-flag/checks](../../README.md) / [index](../README.md) / checkArrayNoConflicts

# Function: checkArrayNoConflicts()

> **checkArrayNoConflicts**(`argName`, `conflicts`): (`currentArg`) => `string` \| `true`

Defined in: [index.ts:54](https://github.com/Xunnamius/black-flag/blob/10cd0ebc0304d033218ec4dffba0c41cb2e85ff6/packages/checks/src/index.ts#L54)

A Black Flag check that passes when at most only one element from each
`conflict` tuple is present in the array.

## Parameters

### argName

`string`

### conflicts

`unknown`[][]

## Returns

`Function`

### Parameters

#### currentArg

`unknown`

### Returns

`string` \| `true`
