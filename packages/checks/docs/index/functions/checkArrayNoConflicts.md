[**@black-flag/checks**](../../README.md)

***

[@black-flag/checks](../../README.md) / [index](../README.md) / checkArrayNoConflicts

# Function: checkArrayNoConflicts()

> **checkArrayNoConflicts**(`argName`, `conflicts`): (`currentArg`) => `string` \| `true`

Defined in: [index.ts:54](https://github.com/Xunnamius/black-flag/blob/359cb940c512f8ac3f63e33c0f88a34c8e1d62ec/packages/checks/src/index.ts#L54)

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
