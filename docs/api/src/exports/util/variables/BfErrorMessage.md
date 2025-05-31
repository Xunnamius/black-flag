[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / BfErrorMessage

# Variable: BfErrorMessage

> `const` **BfErrorMessage**: `object`

Defined in: [src/error.ts:323](https://github.com/Xunnamius/black-flag/blob/d6004b46e3ac5a451e4e0f05bf5c8726ce157ac9/src/error.ts#L323)

A collection of possible error and warning messages emitted by Black Flag.

## Type declaration

### GuruMeditation()

> **GuruMeditation**: () => `string` = `NamedErrorMessage.GuruMeditation`

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

### UseParseAsyncInstead()

> **UseParseAsyncInstead**(): `string`

#### Returns

`string`
