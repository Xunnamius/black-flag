[black-flag](../README.md) / util

# Module: util

## Table of contents

### Classes

- [AssertionFailedError](../classes/util.AssertionFailedError.md)
- [CommandNotImplementedError](../classes/util.CommandNotImplementedError.md)

### Type Aliases

- [CliErrorOptions](util.md#clierroroptions)
- [DescriptorToProgram](util.md#descriptortoprogram)
- [EffectorProgram](util.md#effectorprogram)
- [ExecutionContext](util.md#executioncontext)
- [Executor](util.md#executor)
- [FrameworkArguments](util.md#frameworkarguments)
- [HelperProgram](util.md#helperprogram)
- [PreExecutionContext](util.md#preexecutioncontext)
- [Program](util.md#program)
- [ProgramDescriptor](util.md#programdescriptor)
- [ProgramMetadata](util.md#programmetadata)
- [ProgramType](util.md#programtype)
- [Programs](util.md#programs)
- [RouterProgram](util.md#routerprogram)

### Variables

- [ErrorMessage](util.md#errormessage)
- [defaultHelpOptionName](util.md#defaulthelpoptionname)
- [defaultHelpTextDescription](util.md#defaulthelptextdescription)
- [defaultUsageText](util.md#defaultusagetext)
- [defaultVersionOptionName](util.md#defaultversionoptionname)
- [defaultVersionTextDescription](util.md#defaultversiontextdescription)

### Functions

- [hideBin](util.md#hidebin)
- [isArguments](util.md#isarguments)
- [isNullArguments](util.md#isnullarguments)
- [isPreExecutionContext](util.md#ispreexecutioncontext)
- [makeRunner](util.md#makerunner)

## Type Aliases

### CliErrorOptions

Ƭ **CliErrorOptions**: `Object`

Options available when constructing a new `CliError` object.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `suggestedExitCode?` | `number` | The exit code that will be returned when the application exits, given nothing else goes wrong in the interim. **`Default`** ```ts FrameworkExitCode.DefaultError ``` |

#### Defined in

[src/error.ts:48](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/error.ts#L48)

___

### DescriptorToProgram

Ƭ **DescriptorToProgram**\<`Descriptor`, `CustomCliArguments`\>: ``"effector"`` extends `Descriptor` ? [`EffectorProgram`](util.md#effectorprogram)\<`CustomCliArguments`\> : ``"helper"`` extends `Descriptor` ? [`HelperProgram`](util.md#helperprogram)\<`CustomCliArguments`\> : [`RouterProgram`](util.md#routerprogram)\<`CustomCliArguments`\>

Accepts a `Descriptor` type and maps it to one of the `XProgram` types.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Descriptor` | extends [`ProgramDescriptor`](util.md#programdescriptor) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:137](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L137)

___

### EffectorProgram

Ƭ **EffectorProgram**\<`CustomCliArguments`\>: `Omit`\<[`Program`](util.md#program)\<`CustomCliArguments`\>, ``"command_deferred"`` \| ``"command_finalize_deferred"``\>

Represents an "effector" [Program](util.md#program) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:106](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L106)

___

### ExecutionContext

Ƭ **ExecutionContext**: `Object`

Represents a globally-accessible shared context object singleton.

#### Index signature

▪ [key: `string`]: `unknown`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `commands` | `Map`\<`string`, \{ `metadata`: [`ProgramMetadata`](util.md#programmetadata) ; `programs`: [`Programs`](util.md#programs)  }\> | A Map consisting of auto-discovered [Program](util.md#program) instances and their associated [ProgramMetadata](util.md#programmetadata) as singular object values with their respective _full names_ as keys. Note that key-value pairs will always be iterated in insertion order, implying the first pair in the Map will always be the root command. |
| `debug` | `ExtendedDebugger` | The ExtendedDebugger for the current runtime level. |
| `state` | \{ `[key: string]`: `unknown`; `deepestParseResult`: [`Arguments`](index.md#arguments) \| `undefined` ; `firstPassArgv`: [`Arguments`](index.md#arguments) \| `undefined` ; `globalHelpOption`: \{ `description`: `string` ; `name`: `string`  } \| `undefined` ; `globalVersionOption`: \{ `description`: `string` ; `name`: `string` ; `text`: `string`  } \| `undefined` ; `initialTerminalWidth`: `number` ; `isGracefullyExiting`: `boolean` ; `isHandlingHelpOption`: `boolean` ; `isHandlingVersionOption`: `boolean` ; `rawArgv`: typeof `process.argv` ; `showHelpOnFail`: `boolean`  } | The current state of the execution environment. |
| `state.deepestParseResult` | [`Arguments`](index.md#arguments) \| `undefined` | Stores the result of the latest call to `EffectorProgram::parseAsync`. This is necessary because, with our depth-first multi-yargs architecture, the parse job done by shallower programs in the chain must not mutate the result of the deepest call to `EffectorProgram::parseAsync` in the execution chain. Note: this property should not be relied upon or mutated by end-developers. **`Default`** ```ts undefined ``` |
| `state.firstPassArgv` | [`Arguments`](index.md#arguments) \| `undefined` | Allows helper and effector programs to keep track of pre-pared arguments. Note: this property should not be relied upon or mutated by end-developers. **`Default`** ```ts undefined ``` |
| `state.globalHelpOption` | \{ `description`: `string` ; `name`: `string`  } \| `undefined` | `globalHelpOption` replaces the functionality of the disabled vanilla yargs `yargs::help` method. Set this to the value you want using the `configureExecutionContext` configuration hook (any other hook is run too late). `name`, if provided, must be >= 1 character in length. If `name` is exactly one character in length, the help option will take the form of `-${name}`, otherwise `--${name}`. Note: this property should not be relied upon or mutated by end-developers outside of the `configureExecutionContext` configuration hook. Doing so will result in undefined behavior. **`Default`** ```ts { name: "help", description: defaultHelpTextDescription } ``` |
| `state.globalVersionOption` | \{ `description`: `string` ; `name`: `string` ; `text`: `string`  } \| `undefined` | `globalVersionOption` replaces the functionality of the disabled vanilla yargs `yargs::version` method. Set this to the value you want using the `configureExecutionContext` configuration hook (any other hook is run too late). `name`, if provided, must be >= 1 character in length. If `name` is exactly one character in length, the version option will take the form of `-${name}`, otherwise `--${name}`. `text`, if provided, will be the version text sent to stdout and defaults to the "version" property in the nearest `package.json`. Note: this property should not be relied upon or mutated by end-developers outside of the `configureExecutionContext` configuration hook. Doing so will result in undefined behavior. **`Default`** ```ts { name: "version", description: defaultVersionTextDescription, text: `${packageJson.version}` } ``` |
| `state.initialTerminalWidth` | `number` | The detected width of the terminal. This value is determined by yargs when `configureProgram` is called. |
| `state.isGracefullyExiting` | `boolean` | If `true`, Black Flag is currently in the process of handling a graceful exit. Checking the value of this flag is useful in configuration hooks like `configureExecutionEpilogue`, which are still executed when a `GracefulEarlyExitError` is thrown. In almost every other context, this will _always_ be `false`. **`Default`** ```ts false ``` |
| `state.isHandlingHelpOption` | `boolean` | If `isHandlingHelpOption` is `true`, Black Flag is currently in the process of getting yargs to generate help text for some command. Checking the value of this property is useful when you want to know if `--help` (or whatever your equivalent option is) was passed to the root command. The value of `isHandlingHelpOption` is also used to determine the value of `helpOrVersionSet` in commands' `builder` functions. We have to track this separately from yargs since we're stacking multiple yargs instances and they all want to be the one that handles generating help text. Note: setting `isHandlingHelpOption` to `true` manually via `configureExecutionContext` will cause Black Flag to output help text as if the user had specified `--help` (or the equivalent) as one of their arguments. **`Default`** ```ts false ``` |
| `state.isHandlingVersionOption` | `boolean` | If `isHandlingVersionOption` is `true`, Black Flag is currently in the process of getting yargs to generate version text for some command. Checking the value of this property is useful when you want to know if `--version` (or whatever your equivalent option is) was passed to the root command. The value of `isHandlingVersionOption` is also used to determine the value of `helpOrVersionSet` in commands' `builder` functions. We have to track this separately from yargs since we're stacking multiple yargs instances and they all want to be the one that handles generating version text. Note: setting `isHandlingVersionOption` to `true` manually via `configureExecutionContext` will cause Black Flag to output version text as if the user had specified `--version` (or the equivalent) as one of their arguments. **`Default`** ```ts false ``` |
| `state.rawArgv` | typeof `process.argv` | A subset of the original argv returned by [ConfigureArguments](index.md#configurearguments). It is used internally to give the final command in the arguments list the chance to parse argv. Further, it is used to enforce the ordering invariant on chained child program invocations. That is: all non-positional arguments must appear _after_ the last command name in any arguments list parsed by this program. Since it will be actively manipulated by each command in the arguments list, **do not rely on `rawArgv` for anything other than checking invariant satisfaction.** **`Default`** ```ts [] ``` |
| `state.showHelpOnFail` | `boolean` | If `true`, Black Flag will dump help text to stderr when an error occurs. This is also set when `Program::showHelpOnFail` is called. **`Default`** ```ts true ``` |

#### Defined in

[types/program.ts:285](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L285)

___

### Executor

Ƭ **Executor**: (`rawArgv?`: `Parameters`\<[`ConfigureArguments`](index.md#configurearguments)\>[``0``]) => `Promise`\<[`Arguments`](index.md#arguments)\>

#### Type declaration

▸ (`rawArgv?`): `Promise`\<[`Arguments`](index.md#arguments)\>

This function accepts an optional `rawArgv` array that defaults to
`yargs::hideBin(process.argv)` and returns an `Arguments` object representing
the arguments parsed and validated by yargs (i.e.
`context.state.deepestParseResult`).

**This function throws whenever\* an exception occurs**, making it not ideal
as an entry point for a CLI. See [runProgram](index.md#runprogram) for a wrapper function
that handles exceptions and sets the exit code for you.

Note: when the special `GracefulEarlyExitError` exception is thrown _from
within a command's handler or builder_, `Executor` will set
`context.state.deepestParseResult` to `NullArguments` and
`context.state.isGracefullyExiting` to `true`. Further, `Executor` **will
not** re-throw the exception in this special case, returning `NullArguments`
instead.

##### Parameters

| Name | Type |
| :------ | :------ |
| `rawArgv?` | `Parameters`\<[`ConfigureArguments`](index.md#configurearguments)\>[``0``] |

##### Returns

`Promise`\<[`Arguments`](index.md#arguments)\>

#### Defined in

[types/program.ts:237](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L237)

___

### FrameworkArguments

Ƭ **FrameworkArguments**: `Object`

Represents the CLI arguments/properties added by Black Flag rather than the
end developer.

Instead of using this type directly, your project's custom arguments (e.g.
`MyCustomArgs`) should be wrapped with the [Arguments](index.md#arguments) generic type
(e.g. `Arguments<MyCustomArgs>`), which will extend `FrameworkArguments` for
you.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `[$executionContext]` | [`ExecutionContext`](util.md#executioncontext) |

#### Defined in

[types/program.ts:216](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L216)

___

### HelperProgram

Ƭ **HelperProgram**\<`CustomCliArguments`\>: `Omit`\<[`Program`](util.md#program)\<`CustomCliArguments`\>, ``"command"``\>

Represents an "helper" [Program](util.md#program) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:113](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L113)

___

### PreExecutionContext

Ƭ **PreExecutionContext**\<`CustomContext`\>: `CustomContext` & \{ `execute`: [`Executor`](util.md#executor) ; `executionContext`: `CustomContext` ; `rootPrograms`: [`Programs`](util.md#programs)  }

Represents the pre-execution context that is the result of calling
`configureProgram`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](util.md#executioncontext) = [`ExecutionContext`](util.md#executioncontext) |

#### Defined in

[types/program.ts:248](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L248)

___

### Program

Ƭ **Program**\<`CustomCliArguments`\>: `Omit`\<`_Program`\<[`FrameworkArguments`](util.md#frameworkarguments) & `CustomCliArguments`\>, ``"command"`` \| ``"showHelpOnFail"`` \| ``"version"`` \| ``"help"`` \| ``"exitProcess"`` \| ``"commandDir"`` \| ``"parse"`` \| ``"parsed"`` \| ``"parseSync"`` \| ``"argv"``\> & \{ `command`: (`command`: `string`[], `description`: `string` \| ``false``, `builder`: (`yargs`: `Argv`\<{}\>, `helpOrVersionSet`: `boolean`) => `Argv`\<{}\> \| `Record`\<`string`, `never`\>, `handler`: (`args`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => `Promisable`\<`void`\>, `middlewares`: [], `deprecated`: `string` \| `boolean`) => [`Program`](util.md#program)\<`CustomCliArguments`\> ; `command_deferred`: [`Program`](util.md#program)\<`CustomCliArguments`\>[``"command"``] ; `command_finalize_deferred`: () => `void` ; `showHelpOnFail`: (`enabled`: `boolean`) => [`Program`](util.md#program)\<`CustomCliArguments`\>  }

Represents a pre-configured yargs instance ready for argument parsing and
execution.

`Program` is essentially a drop-in replacement for the `Argv` type exported
by yargs but with several differences and should be preferred.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:40](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L40)

___

### ProgramDescriptor

Ƭ **ProgramDescriptor**: ``"effector"`` \| ``"helper"`` \| ``"router"``

Represents the three program types that comprise any Black Flag command.

#### Defined in

[types/program.ts:132](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L132)

___

### ProgramMetadata

Ƭ **ProgramMetadata**: `Object`

Represents the meta information about a discovered command and its
corresponding [Configuration](index.md#configuration) object/file.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | The basename of `filepath`. |
| `filenameWithoutExtension` | `string` | The basename of `filepath` with the trailing extension trimmed. |
| `filepath` | `string` | Absolute filesystem path to the loaded configuration file. |
| `parentDirName` | `string` | The basename of the direct parent directory containing `filepath`. |
| `reservedCommandNames` | `string`[] | The names "reserved" by this command. When a name is reserved by a command, no other sibling command (i.e. a command with the same parent command) can use that name as an name or alias. When attempting to add a command that uses the same name as its sibling, an error with be thrown. All commands attempt to reserve their `name` and `aliases` exports upon discovery. **Invariant: `name` must be at index 0; `...aliases` must start at index 1.** |
| `type` | [`ProgramType`](util.md#programtype) | The "type" of [Configuration](index.md#configuration) that was loaded, indicating which interface to expect when interacting with `configuration`. The possibilities are: - **root**: implements `RootConfiguration` (the only pure `ParentConfiguration`) - **parent-child**: implements `ParentConfiguration`, `ChildConfiguration` - **child**: implements `ChildConfiguration` Note that "root" `type` configurations are unique in that there will only ever be one `RootConfiguration`, and it **MUST** be the first command module auto-discovered and loaded (invariant). |

#### Defined in

[types/program.ts:160](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L160)

___

### ProgramType

Ƭ **ProgramType**: ``"pure parent"`` \| ``"parent-child"`` \| ``"pure child"``

Represents valid [Configuration](index.md#configuration) module types that can be loaded.

#### Defined in

[types/program.ts:127](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L127)

___

### Programs

Ƭ **Programs**\<`CustomCliArguments`\>: \{ [Descriptor in ProgramDescriptor]: DescriptorToProgram\<Descriptor, CustomCliArguments\> }

Represents the program types that represent every Black Flag command as
aptly-named values in an object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:150](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L150)

___

### RouterProgram

Ƭ **RouterProgram**\<`CustomCliArguments`\>: `Pick`\<[`Program`](util.md#program)\<`CustomCliArguments`\>, ``"parseAsync"`` \| ``"command"``\>

Represents an "router" [Program](util.md#program) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:120](https://github.com/Xunnamius/black-flag/blob/78bf8ff/types/program.ts#L120)

## Variables

### ErrorMessage

• `Const` **ErrorMessage**: `Object`

A collection of possible error and warning messages emitted by Black Flag.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AppValidationFailure` | () => `string` |
| `AuthFailure` | () => `string` |
| `ClientValidationFailure` | () => `string` |
| `GuruMeditation` | () => `string` |
| `HttpFailure` | (`error?`: `string`) => `string` |
| `HttpSubFailure` | (`error`: ``null`` \| `string`, `statusCode`: `number`) => `string` |
| `InvalidAppConfiguration` | (`details?`: `string`) => `string` |
| `InvalidAppEnvironment` | (`details?`: `string`) => `string` |
| `InvalidClientConfiguration` | (`details?`: `string`) => `string` |
| `InvalidItem` | (`item`: `unknown`, `itemName`: `string`) => `string` |
| `InvalidSecret` | (`secretType`: `string`) => `string` |
| `ItemNotFound` | (`item`: `unknown`, `itemName`: `string`) => `string` |
| `ItemOrItemsNotFound` | (`itemsName`: `string`) => `string` |
| `NotAuthenticated` | () => `string` |
| `NotAuthorized` | () => `string` |
| `NotFound` | () => `string` |
| `NotImplemented` | () => `string` |
| `ValidationFailure` | () => `string` |
| `AssertionFailureBadConfigurationPath` | (`path`: `unknown`) => `string` |
| `AssertionFailureBadParameterCombination` | () => `string` |
| `AssertionFailureCannotExecuteMultipleTimes` | () => `string` |
| `AssertionFailureConfigureExecutionEpilogue` | () => `string` |
| `AssertionFailureDuplicateCommandName` | (`parentFullName`: `string`, `name1`: `string`, `type1`: ``"alias"`` \| ``"name"``, `name2`: `string`, `type2`: ``"alias"`` \| ``"name"``) => `string` |
| `AssertionFailureInvalidCommandExport` | (`name`: `string`) => `string` |
| `AssertionFailureInvocationNotAllowed` | (`name`: `string`) => `string` |
| `AssertionFailureNoConfigurationLoaded` | (`path`: `string`) => `string` |
| `AssertionFailureOrderingInvariant` | () => `string` |
| `AssertionFailureReachedTheUnreachable` | () => `string` |
| `AssertionFailureUseParseAsyncInstead` | () => `string` |
| `ConfigLoadFailure` | (`path`: `string`) => `string` |
| `Generic` | () => `string` |
| `GracefulEarlyExit` | () => `string` |
| `InvalidCharacters` | (`str`: `string`, `violation`: `string`) => `string` |
| `InvalidConfigureArgumentsReturnType` | () => `string` |
| `InvalidConfigureExecutionContextReturnType` | () => `string` |

#### Defined in

[src/error.ts:163](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/error.ts#L163)

___

### defaultHelpOptionName

• `Const` **defaultHelpOptionName**: ``"help"``

Hard-coded default option name for dumping help text to stdout. For example:
`--${defaultHelpOptionName}`.

#### Defined in

[src/constant.ts:19](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/constant.ts#L19)

___

### defaultHelpTextDescription

• `Const` **defaultHelpTextDescription**: ``"Show help text"``

Hard-coded default help option description text.

#### Defined in

[src/constant.ts:24](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/constant.ts#L24)

___

### defaultUsageText

• `Const` **defaultUsageText**: ``"Usage: $000\n\n$1"``

Hard-coded default command `usage` text provided to programs via
`.usage(...)` after string interpolation. "$000", "$0", and "$1" are replaced
with a command's usage DSL (`command` export), name (`name` export), and
description (`description` export) respectively.

#### Defined in

[src/constant.ts:13](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/constant.ts#L13)

___

### defaultVersionOptionName

• `Const` **defaultVersionOptionName**: ``"version"``

Hard-coded default option name for dumping version text to stdout. For
example: `--${defaultVersionOptionName}`.

#### Defined in

[src/constant.ts:30](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/constant.ts#L30)

___

### defaultVersionTextDescription

• `Const` **defaultVersionTextDescription**: ``"Show version number"``

Hard-coded default version option description text.

#### Defined in

[src/constant.ts:35](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/constant.ts#L35)

## Functions

### hideBin

▸ **hideBin**(`argv`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |

#### Returns

`string`[]

**`See`**

https://yargs.js.org/docs/#api-reference

#### Defined in

node_modules/@types/yargs/helpers.d.ts:4

___

### isArguments

▸ **isArguments**(`obj`): obj is Arguments

Type-guard for [Arguments](index.md#arguments).

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `unknown` |

#### Returns

obj is Arguments

#### Defined in

[src/util.ts:464](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/util.ts#L464)

___

### isNullArguments

▸ **isNullArguments**(`obj`): obj is NullArguments

Type-guard for [NullArguments](index.md#nullarguments).

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `unknown` |

#### Returns

obj is NullArguments

#### Defined in

[src/util.ts:453](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/util.ts#L453)

___

### isPreExecutionContext

▸ **isPreExecutionContext**(`obj`): obj is PreExecutionContext

Type-guard for [PreExecutionContext](util.md#preexecutioncontext).

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `unknown` |

#### Returns

obj is PreExecutionContext

#### Defined in

[src/util.ts:440](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/util.ts#L440)

___

### makeRunner

▸ **makeRunner**\<`CustomContext`, `CustomCliArguments`\>(`options`): \<T\>(...`args`: `T` extends [`_`, ...Tail[]] ? `Tail` : []) => `Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

A high-order factory function that returns a "low-order" [runProgram](index.md#runprogram)
function that can be called multiple times while only having to provide a
subset of the required parameters at initialization.

This is useful when unit/integration testing your CLI, which will likely
require multiple calls to `runProgram(...)`.

Note: when an exception (e.g. bad arguments) occurs in the low-order
function, `undefined` will be returned if `configureProgram` threw or
`NullArguments` if `execute` threw. Otherwise, upon success, `Arguments` is
returned as expected. That is: **the promise returned by the low-order
function will never reject and no exception will ever be thrown.** Keep this
in mind when writing your unit tests and see [runProgram](index.md#runprogram) for more
details.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](util.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.commandModulePath` | `string` | **`See`** [runProgram](index.md#runprogram) |
| `options.configurationHooks?` | `Promisable`\<[`ConfigurationHooks`](index.md#configurationhooks)\<[`ExecutionContext`](util.md#executioncontext)\>\> | Note: cannot be used with `preExecutionContext`. **`See`** [runProgram](index.md#runprogram) |
| `options.preExecutionContext?` | `Promisable`\<[`PreExecutionContext`](util.md#preexecutioncontext)\<[`ExecutionContext`](util.md#executioncontext)\>\> | Note: cannot be used with `configurationHooks`. **`See`** [runProgram](index.md#runprogram) |

#### Returns

`fn`

▸ \<`T`\>(`...args`): `Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [commandModulePath: string] \| [commandModulePath: string, configurationHooks: Promisable\<ConfigurationHooks\<CustomContext\>\>] \| [commandModulePath: string, preExecutionContext: Promisable\<PreExecutionContext\<CustomContext\>\>] \| [commandModulePath: string, argv: string \| string[]] \| [commandModulePath: string, argv: string \| string[], configurationHooks: Promisable\<ConfigurationHooks\<CustomContext\>\>] \| [commandModulePath: string, argv: string \| string[], preExecutionContext: Promisable\<PreExecutionContext\<CustomContext\>\>] |

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `T` extends [`_`, ...Tail[]] ? `Tail` : [] |

##### Returns

`Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

#### Defined in

[src/util.ts:45](https://github.com/Xunnamius/black-flag/blob/78bf8ff/src/util.ts#L45)
