[**@black-flag/checks**](../../README.md)

***

[@black-flag/checks](../../README.md) / [error](../README.md) / BfcErrorMessage

# Variable: BfcErrorMessage

> `const` **BfcErrorMessage**: `object`

Defined in: [error.ts:5](https://github.com/Xunnamius/black-flag/blob/71fb899c234fc323c29cb18953ef38f3487604b2/packages/checks/src/error.ts#L5)

A collection of possible error and warning messages.

## Type declaration

### BadType()

> **BadType**(`name`, `expected`, `actual`): `string`

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

> **OptionMustBeNonNegative**(`name`): `string`

#### Parameters

##### name

`string`

#### Returns

`string`

### OptionMustNotBeFalsy()

> **OptionMustNotBeFalsy**(`name`): `string`

#### Parameters

##### name

`string`

#### Returns

`string`

### OptionRequiresMinArgs()

> **OptionRequiresMinArgs**(`name`, `adjective?`): `string`

#### Parameters

##### name

`string`

##### adjective?

`string`

#### Returns

`string`

### OptionRequiresNoConflicts()

> **OptionRequiresNoConflicts**(`name`, `tuple`): `string`

#### Parameters

##### name

`string`

##### tuple

`unknown`[]

#### Returns

`string`

### OptionRequiresUniqueArgs()

> **OptionRequiresUniqueArgs**(`name`): `string`

#### Parameters

##### name

`string`

#### Returns

`string`

### OptionValueMustBeAlone()

> **OptionValueMustBeAlone**(`option`, `noun`): `string`

#### Parameters

##### option

`string`

##### noun

`string`

#### Returns

`string`

### OptionValueMustBeAloneWhenBaseline()

> **OptionValueMustBeAloneWhenBaseline**(`option`, `noun`): `string`

#### Parameters

##### option

`string`

##### noun

`string`

#### Returns

`string`
