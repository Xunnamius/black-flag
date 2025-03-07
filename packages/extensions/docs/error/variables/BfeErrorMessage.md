[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [error](../README.md) / BfeErrorMessage

# Variable: BfeErrorMessage

> `const` **BfeErrorMessage**: `object`

Defined in: [packages/extensions/src/error.ts:14](https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/error.ts#L14)

A collection of possible error and warning messages.

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

##### error?

`string`

#### Returns

`string`

### HttpSubFailure()

> **HttpSubFailure**: (`error`, `statusCode`) => `string`

#### Parameters

##### error

`null` | `string`

##### statusCode

`number`

#### Returns

`string`

### InvalidAppConfiguration()

> **InvalidAppConfiguration**: (`details`?) => `string`

#### Parameters

##### details?

`string`

#### Returns

`string`

### InvalidAppEnvironment()

> **InvalidAppEnvironment**: (`details`?) => `string`

#### Parameters

##### details?

`string`

#### Returns

`string`

### InvalidClientConfiguration()

> **InvalidClientConfiguration**: (`details`?) => `string`

#### Parameters

##### details?

`string`

#### Returns

`string`

### InvalidItem()

> **InvalidItem**: (`item`, `itemName`) => `string`

#### Parameters

##### item

`unknown`

##### itemName

`string`

#### Returns

`string`

### InvalidSecret()

> **InvalidSecret**: (`secretType`) => `string`

#### Parameters

##### secretType

`string`

#### Returns

`string`

### ItemNotFound()

> **ItemNotFound**: (`item`, `itemName`) => `string`

#### Parameters

##### item

`unknown`

##### itemName

`string`

#### Returns

`string`

### ItemOrItemsNotFound()

> **ItemOrItemsNotFound**: (`itemsName`) => `string`

#### Parameters

##### itemsName

`string`

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

### BadConfigurationPath()

#### Parameters

##### path

`unknown`

#### Returns

`string`

### BadParameterCombination()

#### Returns

`string`

### CannotExecuteMultipleTimes()

#### Returns

`string`

### CheckFailed()

#### Parameters

##### currentArgument

`string`

#### Returns

`string`

### CommandHandlerNotAFunction()

#### Returns

`string`

### CommandNotImplemented()

#### Returns

`string`

### ConfigLoadFailure()

#### Parameters

##### path

`string`

#### Returns

`string`

### ConflictsViolation()

#### Parameters

##### conflicter

`string`

##### seenConflictingKeyValues

`ObjectEntries`

#### Returns

`string`

### DemandGenericXorViolation()

#### Parameters

##### demanded

`ObjectEntries`

#### Returns

`string`

### DemandIfViolation()

#### Parameters

##### demanded

`string`

##### demander

`ObjectEntry`

#### Returns

`string`

### DemandOrViolation()

#### Parameters

##### demanded

`ObjectEntries`

#### Returns

`string`

### DemandSpecificXorViolation()

#### Parameters

##### firstArgument

`ObjectEntry`

##### secondArgument

`ObjectEntry`

#### Returns

`string`

### DuplicateCommandName()

#### Parameters

##### parentFullName

`undefined` | `string`

##### name1

`string`

##### type1

`"name"` | `"alias"`

##### name2

`string`

##### type2

`"name"` | `"alias"`

#### Returns

`string`

### DuplicateOptionName()

#### Parameters

##### name

`string`

#### Returns

`string`

### FalsyCommandExport()

#### Returns

`string`

### FrameworkError()

#### Parameters

##### error

`unknown`

#### Returns

`string`

### Generic()

#### Returns

`string`

### GracefulEarlyExit()

#### Returns

`string`

### IllegalExplicitlyUndefinedDefault()

#### Returns

`string`

### IllegalHandlerInvocation()

#### Returns

`string`

### ImpliesViolation()

#### Parameters

##### implier

`string`

##### seenConflictingKeyValues

`ObjectEntries`

#### Returns

`string`

### InvalidCharacters()

#### Parameters

##### str

`string`

##### violation

`string`

#### Returns

`string`

### InvalidCommandExport()

#### Parameters

##### name

`string`

#### Returns

`string`

### InvalidConfigureArgumentsReturnType()

#### Returns

`string`

### InvalidConfigureExecutionContextReturnType()

#### Returns

`string`

### InvalidConfigureExecutionEpilogueReturnType()

#### Returns

`string`

### InvalidExecutionContextBadField()

#### Parameters

##### fieldName

`string`

#### Returns

`string`

### InvalidSubCommandInvocation()

#### Returns

`string`

### InvocationNotAllowed()

#### Parameters

##### name

`string`

#### Returns

`string`

### MetadataInvariantViolated()

#### Parameters

##### afflictedKey

`string`

#### Returns

`string`

### NoConfigurationLoaded()

#### Parameters

##### path

`string`

#### Returns

`string`

### PathIsNotDirectory()

#### Returns

`string`

### ReferencedNonExistentOption()

#### Parameters

##### referrerName

`string`

##### doesNotExistName

`string`

#### Returns

`string`

### RequiresViolation()

#### Parameters

##### requirer

`string`

##### missingRequiredKeyValues

`ObjectEntries`

#### Returns

`string`

### UnexpectedlyFalsyDetailedArguments()

#### Returns

`string`

### UnexpectedValueFromInternalYargsMethod()

#### Returns

`string`

### UseParseAsyncInstead()

#### Returns

`string`
