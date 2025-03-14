[**@black-flag/checks**](../../README.md)

***

[@black-flag/checks](../../README.md) / [error](../README.md) / BfcErrorMessage

# Variable: BfcErrorMessage

> `const` **BfcErrorMessage**: `object`

Defined in: [error.ts:5](https://github.com/Xunnamius/black-flag/blob/10cd0ebc0304d033218ec4dffba0c41cb2e85ff6/packages/checks/src/error.ts#L5)

A collection of possible error and warning messages.

## Type declaration

### BadType()

#### Parameters

##### name

`string`

##### expected

`string`

##### actual

`string`

#### Returns

`string`

### OptionMustBeNonNegative()

#### Parameters

##### name

`string`

#### Returns

`string`

### OptionMustNotBeFalsy()

#### Parameters

##### name

`string`

#### Returns

`string`

### OptionRequiresMinArgs()

#### Parameters

##### name

`string`

##### adjective?

`string`

#### Returns

`string`

### OptionRequiresNoConflicts()

#### Parameters

##### name

`string`

##### tuple

`unknown`[]

#### Returns

`string`

### OptionRequiresUniqueArgs()

#### Parameters

##### name

`string`

#### Returns

`string`

### OptionValueMustBeAlone()

#### Parameters

##### option

`string`

##### noun

`string`

#### Returns

`string`

### OptionValueMustBeAloneWhenBaseline()

#### Parameters

##### option

`string`

##### noun

`string`

#### Returns

`string`
