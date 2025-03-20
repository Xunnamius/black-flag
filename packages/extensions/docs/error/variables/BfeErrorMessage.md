[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [error](../README.md) / BfeErrorMessage

# Variable: BfeErrorMessage

> `const` **BfeErrorMessage**: `object`

Defined in: [packages/extensions/src/error.ts:14](https://github.com/Xunnamius/black-flag/blob/170aa97d281b546ae8a3014f985324d5c71f08f4/packages/extensions/src/error.ts#L14)

A collection of possible error and warning messages.

## Type declaration

### GuruMeditation()

> **GuruMeditation**: () => `string`

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

### BuilderCalledOnInvalidPass()

#### Parameters

##### pass

`"first-pass"` | `"second-pass"`

#### Returns

`string`

### BuilderCannotBeAsync()

#### Parameters

##### commandName

`string`

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

### InvalidCommandExportBadPositionals()

#### Parameters

##### name

`string`

#### Returns

`string`

### InvalidCommandExportBadStart()

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
