[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [error](../README.md) / BfeErrorMessage

# Variable: BfeErrorMessage

> `const` **BfeErrorMessage**: `object`

Defined in: [packages/extensions/src/error.ts:14](https://github.com/Xunnamius/black-flag/blob/65863debdad33d702508c3459cced432c1437abf/packages/extensions/src/error.ts#L14)

A collection of possible error and warning messages.

## Type declaration

### GuruMeditation()

> **GuruMeditation**: () => `string`

#### Returns

`string`

### BadConfigurationPath()

> **BadConfigurationPath**(`path`): `string`

#### Parameters

##### path

`unknown`

#### Returns

`string`

### BadParameterCombination()

> **BadParameterCombination**(): `string`

#### Returns

`string`

### BuilderCalledOnInvalidPass()

> **BuilderCalledOnInvalidPass**(`pass`): `string`

#### Parameters

##### pass

`"first-pass"` | `"second-pass"`

#### Returns

`string`

### BuilderCannotBeAsync()

> **BuilderCannotBeAsync**(`commandName`): `string`

#### Parameters

##### commandName

`string`

#### Returns

`string`

### CannotExecuteMultipleTimes()

> **CannotExecuteMultipleTimes**(): `string`

#### Returns

`string`

### CheckFailed()

> **CheckFailed**(`currentArgument`): `string`

#### Parameters

##### currentArgument

`string`

#### Returns

`string`

### CommandHandlerNotAFunction()

> **CommandHandlerNotAFunction**(): `string`

#### Returns

`string`

### CommandNotImplemented()

> **CommandNotImplemented**(): `string`

#### Returns

`string`

### ConfigLoadFailure()

> **ConfigLoadFailure**(`path`): `string`

#### Parameters

##### path

`string`

#### Returns

`string`

### ConflictsViolation()

> **ConflictsViolation**(`conflicter`, `seenConflictingKeyValues`): `string`

#### Parameters

##### conflicter

`string`

##### seenConflictingKeyValues

`ObjectEntries`

#### Returns

`string`

### DemandGenericXorViolation()

> **DemandGenericXorViolation**(`demanded`): `string`

#### Parameters

##### demanded

`ObjectEntries`

#### Returns

`string`

### DemandIfViolation()

> **DemandIfViolation**(`demanded`, `demander`): `string`

#### Parameters

##### demanded

`string`

##### demander

`ObjectEntry`

#### Returns

`string`

### DemandOrViolation()

> **DemandOrViolation**(`demanded`): `string`

#### Parameters

##### demanded

`ObjectEntries`

#### Returns

`string`

### DemandSpecificXorViolation()

> **DemandSpecificXorViolation**(`firstArgument`, `secondArgument`): `string`

#### Parameters

##### firstArgument

`ObjectEntry`

##### secondArgument

`ObjectEntry`

#### Returns

`string`

### DuplicateCommandName()

> **DuplicateCommandName**(`parentFullName`, `name1`, `type1`, `name2`, `type2`): `string`

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

> **DuplicateOptionName**(`name`): `string`

#### Parameters

##### name

`string`

#### Returns

`string`

### FalsyCommandExport()

> **FalsyCommandExport**(): `string`

#### Returns

`string`

### FrameworkError()

> **FrameworkError**(`error`): `string`

#### Parameters

##### error

`unknown`

#### Returns

`string`

### Generic()

> **Generic**(): `string`

#### Returns

`string`

### GracefulEarlyExit()

> **GracefulEarlyExit**(): `string`

#### Returns

`string`

### IllegalHandlerInvocation()

> **IllegalHandlerInvocation**(): `string`

#### Returns

`string`

### ImpliesViolation()

> **ImpliesViolation**(`implier`, `seenConflictingKeyValues`): `string`

#### Parameters

##### implier

`string`

##### seenConflictingKeyValues

`ObjectEntries`

#### Returns

`string`

### InvalidCharacters()

> **InvalidCharacters**(`str`, `violation`): `string`

#### Parameters

##### str

`string`

##### violation

`string`

#### Returns

`string`

### InvalidCommandExportBadPositionals()

> **InvalidCommandExportBadPositionals**(`name`): `string`

#### Parameters

##### name

`string`

#### Returns

`string`

### InvalidCommandExportBadStart()

> **InvalidCommandExportBadStart**(`name`): `string`

#### Parameters

##### name

`string`

#### Returns

`string`

### InvalidConfigureArgumentsReturnType()

> **InvalidConfigureArgumentsReturnType**(): `string`

#### Returns

`string`

### InvalidConfigureExecutionContextReturnType()

> **InvalidConfigureExecutionContextReturnType**(): `string`

#### Returns

`string`

### InvalidConfigureExecutionEpilogueReturnType()

> **InvalidConfigureExecutionEpilogueReturnType**(): `string`

#### Returns

`string`

### InvalidExecutionContextBadField()

> **InvalidExecutionContextBadField**(`fieldName`): `string`

#### Parameters

##### fieldName

`string`

#### Returns

`string`

### InvalidSubCommandInvocation()

> **InvalidSubCommandInvocation**(): `string`

#### Returns

`string`

### InvocationNotAllowed()

> **InvocationNotAllowed**(`name`): `string`

#### Parameters

##### name

`string`

#### Returns

`string`

### MetadataInvariantViolated()

> **MetadataInvariantViolated**(`afflictedKey`): `string`

#### Parameters

##### afflictedKey

`string`

#### Returns

`string`

### NoConfigurationLoaded()

> **NoConfigurationLoaded**(`path`): `string`

#### Parameters

##### path

`string`

#### Returns

`string`

### PathIsNotDirectory()

> **PathIsNotDirectory**(): `string`

#### Returns

`string`

### ReferencedNonExistentOption()

> **ReferencedNonExistentOption**(`referrerName`, `doesNotExistName`): `string`

#### Parameters

##### referrerName

`string`

##### doesNotExistName

`string`

#### Returns

`string`

### RequiresViolation()

> **RequiresViolation**(`requirer`, `missingRequiredKeyValues`): `string`

#### Parameters

##### requirer

`string`

##### missingRequiredKeyValues

`ObjectEntries`

#### Returns

`string`

### UnexpectedlyFalsyDetailedArguments()

> **UnexpectedlyFalsyDetailedArguments**(): `string`

#### Returns

`string`

### UnexpectedValueFromInternalYargsMethod()

> **UnexpectedValueFromInternalYargsMethod**(): `string`

#### Returns

`string`

### UseParseAsyncInstead()

> **UseParseAsyncInstead**(): `string`

#### Returns

`string`
