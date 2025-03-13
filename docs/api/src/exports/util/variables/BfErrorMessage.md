[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / BfErrorMessage

# Variable: BfErrorMessage

> `const` **BfErrorMessage**: `object`

Defined in: [src/error.ts:304](https://github.com/Xunnamius/black-flag/blob/40d21584fb01de3f46f2fedf60011594304c55d4/src/error.ts#L304)

A collection of possible error and warning messages emitted by Black Flag.

## Type declaration

### GuruMeditation()

> **GuruMeditation**: () => `string` = `NamedErrorMessage.GuruMeditation`

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

### CommandNotImplemented()

#### Returns

`string`

### ConfigLoadFailure()

#### Parameters

##### path

`string`

#### Returns

`string`

### DuplicateCommandName()

#### Parameters

##### parentFullName

`undefined` | `string`

##### name1

`string`

##### type1

`"alias"` | `"name"`

##### name2

`string`

##### type2

`"alias"` | `"name"`

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

### NoConfigurationLoaded()

#### Parameters

##### path

`string`

#### Returns

`string`

### PathIsNotDirectory()

#### Returns

`string`

### UseParseAsyncInstead()

#### Returns

`string`
