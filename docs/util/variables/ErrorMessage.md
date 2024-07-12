[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / ErrorMessage

# Variable: ErrorMessage

> `const` **ErrorMessage**: `object`

A collection of possible error and warning messages emitted by Black Flag.

## Type declaration

### AppValidationFailure()

> **AppValidationFailure**: () => `string`

#### Returns

`string`

### AuthFailure()

> **AuthFailure**: () => `string`

#### Returns

`string`

### ClientValidationFailure()

> **ClientValidationFailure**: () => `string`

#### Returns

`string`

### GuruMeditation()

> **GuruMeditation**: () => `string`

#### Returns

`string`

### HttpFailure()

> **HttpFailure**: (`error`?) => `string`

#### Parameters

• **error?**: `string`

#### Returns

`string`

### HttpSubFailure()

> **HttpSubFailure**: (`error`, `statusCode`) => `string`

#### Parameters

• **error**: `null` \| `string`

• **statusCode**: `number`

#### Returns

`string`

### InvalidAppConfiguration()

> **InvalidAppConfiguration**: (`details`?) => `string`

#### Parameters

• **details?**: `string`

#### Returns

`string`

### InvalidAppEnvironment()

> **InvalidAppEnvironment**: (`details`?) => `string`

#### Parameters

• **details?**: `string`

#### Returns

`string`

### InvalidClientConfiguration()

> **InvalidClientConfiguration**: (`details`?) => `string`

#### Parameters

• **details?**: `string`

#### Returns

`string`

### InvalidItem()

> **InvalidItem**: (`item`, `itemName`) => `string`

#### Parameters

• **item**: `unknown`

• **itemName**: `string`

#### Returns

`string`

### InvalidSecret()

> **InvalidSecret**: (`secretType`) => `string`

#### Parameters

• **secretType**: `string`

#### Returns

`string`

### ItemNotFound()

> **ItemNotFound**: (`item`, `itemName`) => `string`

#### Parameters

• **item**: `unknown`

• **itemName**: `string`

#### Returns

`string`

### ItemOrItemsNotFound()

> **ItemOrItemsNotFound**: (`itemsName`) => `string`

#### Parameters

• **itemsName**: `string`

#### Returns

`string`

### NotAuthenticated()

> **NotAuthenticated**: () => `string`

#### Returns

`string`

### NotAuthorized()

> **NotAuthorized**: () => `string`

#### Returns

`string`

### NotFound()

> **NotFound**: () => `string`

#### Returns

`string`

### NotImplemented()

> **NotImplemented**: () => `string`

#### Returns

`string`

### ValidationFailure()

> **ValidationFailure**: () => `string`

#### Returns

`string`

### AssertionFailureBadConfigurationPath()

#### Parameters

• **path**: `unknown`

#### Returns

`string`

### AssertionFailureBadParameterCombination()

#### Returns

`string`

### AssertionFailureCannotExecuteMultipleTimes()

#### Returns

`string`

### AssertionFailureConfigureExecutionEpilogue()

#### Returns

`string`

### AssertionFailureDuplicateCommandName()

#### Parameters

• **parentFullName**: `undefined` \| `string`

• **name1**: `string`

• **type1**: `"alias"` \| `"name"`

• **name2**: `string`

• **type2**: `"alias"` \| `"name"`

#### Returns

`string`

### AssertionFailureInvalidCommandExport()

#### Parameters

• **name**: `string`

#### Returns

`string`

### AssertionFailureInvocationNotAllowed()

#### Parameters

• **name**: `string`

#### Returns

`string`

### AssertionFailureNoConfigurationLoaded()

#### Parameters

• **path**: `string`

#### Returns

`string`

### AssertionFailureReachedTheUnreachable()

#### Returns

`string`

### AssertionFailureUseParseAsyncInstead()

#### Returns

`string`

### CommandNotImplemented()

#### Returns

`string`

### ConfigLoadFailure()

#### Parameters

• **path**: `string`

#### Returns

`string`

### FrameworkError()

#### Parameters

• **error**: `unknown`

#### Returns

`string`

### Generic()

#### Returns

`string`

### GracefulEarlyExit()

#### Returns

`string`

### InvalidCharacters()

#### Parameters

• **str**: `string`

• **violation**: `string`

#### Returns

`string`

### InvalidConfigureArgumentsReturnType()

#### Returns

`string`

### InvalidConfigureExecutionContextReturnType()

#### Returns

`string`

### InvalidSubCommandInvocation()

#### Returns

`string`

## Defined in

[src/error.ts:251](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/src/error.ts#L251)
