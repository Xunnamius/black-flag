[**@black-flag/checks**](../../README.md)

***

[@black-flag/checks](../../README.md) / [error](../README.md) / BfcErrorMessage

# Variable: BfcErrorMessage

> `const` **BfcErrorMessage**: `object`

Defined in: [error.ts:5](https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/checks/src/error.ts#L5)

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
