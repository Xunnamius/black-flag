[black-flag](../README.md) / index

# Module: index

## Table of contents

### Enumerations

- [FrameworkExitCode](../enums/index.FrameworkExitCode.md)

### Classes

- [AssertionFailedError](../classes/index.AssertionFailedError.md)
- [CliError](../classes/index.CliError.md)
- [CommandNotImplementedError](../classes/index.CommandNotImplementedError.md)
- [GracefulEarlyExitError](../classes/index.GracefulEarlyExitError.md)

### Type Aliases

- [Arguments](index.md#arguments)
- [ChildConfiguration](index.md#childconfiguration)
- [CliErrorOptions](index.md#clierroroptions)
- [Configuration](index.md#configuration)
- [ConfigurationHooks](index.md#configurationhooks)
- [ConfigureArguments](index.md#configurearguments)
- [ConfigureErrorHandlingEpilogue](index.md#configureerrorhandlingepilogue)
- [ConfigureExecutionContext](index.md#configureexecutioncontext)
- [ConfigureExecutionEpilogue](index.md#configureexecutionepilogue)
- [ConfigureExecutionPrologue](index.md#configureexecutionprologue)
- [ExecutionContext](index.md#executioncontext)
- [Executor](index.md#executor)
- [FrameworkArguments](index.md#frameworkarguments)
- [ImportedConfigurationModule](index.md#importedconfigurationmodule)
- [ParentConfiguration](index.md#parentconfiguration)
- [PreExecutionContext](index.md#preexecutioncontext)
- [Program](index.md#program)
- [ProgramMetadata](index.md#programmetadata)
- [RootConfiguration](index.md#rootconfiguration)

### Variables

- [$executionContext](index.md#$executioncontext)
- [ErrorMessage](index.md#errormessage)
- [defaultUsageText](index.md#defaultusagetext)

### Functions

- [configureProgram](index.md#configureprogram)
- [runProgram](index.md#runprogram)

## Type Aliases

### Arguments

Ƭ **Arguments**\<`CustomCliArguments`\>: `_Arguments`\<[`FrameworkArguments`](index.md#frameworkarguments) & `CustomCliArguments`\>

Represents the parsed CLI arguments, plus `_` and `$0`, any (hidden)
arguments/properties specific to Black Flag, and an indexer falling back to
`unknown` for unrecognized arguments.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:17](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/program.ts#L17)

___

### ChildConfiguration

Ƭ **ChildConfiguration**\<`CustomCliArguments`\>: `Partial`\<[`Configuration`](index.md#configuration)\<`CustomCliArguments`\>\>

A partial extension to the [Configuration](index.md#configuration) interface for child
configurations. This type was designed for use in external ESM/CJS module
files that will eventually get imported via auto-discovery.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/module.ts:141](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/module.ts#L141)

___

### CliErrorOptions

Ƭ **CliErrorOptions**: `Object`

Options available when constructing a new `CliError` object.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `suggestedExitCode?` | `number` | The exit code that will be returned when the application exits, given nothing else goes wrong in the interim. **`Default`** ```ts FrameworkExitCode.DefaultError ``` |

#### Defined in

[src/error.ts:48](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/error.ts#L48)

___

### Configuration

Ƭ **Configuration**\<`CustomCliArguments`\>: `Object`

A replacement for the `CommandModule` type that comes with yargs.
Auto-discovered configuration modules must implement this interface or a
subtype of this interface.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `aliases` | `string`[] | An array of `command` aliases [as interpreted](https://github.com/yargs/yargs/pull/647) by [yargs](https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases). Note that positional arguments defined in aliases are ignored. **`Default`** ```ts [] ``` |
| `builder` | \{ `[key: string]`: `_Options`;  } \| \<T\>(`blackFlag`: `Omit`\<`T`, ``"parseAsync"`` \| ``"fail"`` \| ``"command"`` \| ``"command_deferred"`` \| ``"command_finalize_deferred"``\>, `helpOrVersionSet`: `boolean`, `argv?`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => `void` \| `T` \| \{ `[key: string]`: `_Options`;  } \| `_Program` | An object containing yargs options configuration or a function that will receive the current Black Flag program. Unlike with vanilla yargs, you do not need to return anything at all; "returning" `undefined`/`void` is equivalent. If you return something other than the received program, such as an object of options, it will be passed to `yargs::options` for you. **If `builder` is a function, it cannot be async or return a promise** due to a yargs bug present at time of writing. However, a [Configuration](index.md#configuration) module can export an async function, so hoist any async logic out of the builder function to work around this bug for now. **`Default`** ```ts {} ``` |
| `command` | ``"$0"`` \| \`$0 $\{string}\` | The command as interpreted by yargs. May contain positional arguments. It is usually unnecessary to change or use this property. **`Default`** ```ts "$0" ``` |
| `deprecated` | `string` \| `boolean` | If truthy, the command will be considered "deprecated" by yargs. If `deprecated` is a string, it will additionally be treated as a deprecation message and printed. **`Default`** ```ts false ``` |
| `description` | `string` \| ``false`` | The description for the command in help text. If `false`, the command will be considered "hidden" by yargs. **`Default`** ```ts "" ``` |
| `handler` | (`args`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => `Promisable`\<`void`\> | A function called when this command is invoked. It will receive an object of parsed arguments. If `undefined`, a `CommandNotImplementedError` will be thrown. **`Default`** ```ts undefined ``` |
| `name` | `string` | The name of the command. **Must not contain any spaces** or any characters that yargs does not consider valid for a command name. An error will be thrown if known problematic characters are present. Defaults to the filename containing the configuration, excluding its extension, or the directory name (converted to [kebab case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case)) if the filename without extension is "index". |
| `usage` | `string` | Set a usage message shown at the top of the command's help text. Several replacements are made to the `usage` string before it is output. In order: - `$000` will be replaced by the entire command itself (including full canonical name and parameters). - `$1` will be replaced by the description of the command. - `$0` will be replaced with the full canonical name of the command. **`Default`** ```ts "Usage: $000\n\n$1" ``` |

#### Defined in

[types/module.ts:16](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/module.ts#L16)

___

### ConfigurationHooks

Ƭ **ConfigurationHooks**\<`CustomContext`\>: `Object`

An object containing zero or more configuration hooks. See each hook type
definition for details.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `configureArguments?` | [`ConfigureArguments`](index.md#configurearguments)\<`CustomContext`\> | This function is called once towards the beginning of the execution of `PreExecutionContext::execute` and should return a `process.argv`-like array. This is where yargs middleware and other argument pre-processing can be implemented. |
| `configureErrorHandlingEpilogue?` | [`ConfigureErrorHandlingEpilogue`](index.md#configureerrorhandlingepilogue)\<`CustomContext`\> | This function is called once at the very end of the error handling process after an error has occurred. Note that this function is _always_ called whenever there is an error, regardless of which other functions have already been called. The only exceptions to this are if (1) the error occurs within `configureErrorHandlingEpilogue` itself or (2) the error is an instance of `GracefulEarlyExitError`. This function is also called even after yargs internally handles and reports an argument parsing/validation error. |
| `configureExecutionContext?` | [`ConfigureExecutionContext`](index.md#configureexecutioncontext)\<`CustomContext`\> | This function is called once towards the beginning of the execution of `configureProgram` and should return what will become the global [ExecutionContext](index.md#executioncontext) singleton. |
| `configureExecutionEpilogue?` | [`ConfigureExecutionEpilogue`](index.md#configureexecutionepilogue)\<`CustomContext`\> | This function is called once after CLI argument parsing completes and either (1) handler execution succeeds or (2) a `GracefulEarlyExitError` is thrown. The value returned by this function is used as the return value of the `PreExecutionContext::execute` method. This function will _not_ be called when yargs argument validation fails. This function is the complement of [ConfigureExecutionPrologue](index.md#configureexecutionprologue). |
| `configureExecutionPrologue?` | [`ConfigureExecutionPrologue`](index.md#configureexecutionprologue)\<`CustomContext`\> | This function is called once towards the end of the execution of `configureProgram`, after all commands have been discovered but before any have been executed, and should apply any final configurations to the programs that constitute the command line interface. All commands and sub-commands known to Black Flag are available in the [ExecutionContext.commands](index.md#commands) map, which can be accessed from the `context` parameter or from the [Arguments](index.md#arguments) object returned by Program.parseAsync et al. This function is the complement of [ConfigureExecutionEpilogue](index.md#configureexecutionepilogue). |

#### Defined in

[types/configure.ts:92](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/configure.ts#L92)

___

### ConfigureArguments

Ƭ **ConfigureArguments**\<`CustomContext`\>: (`rawArgv`: typeof `process.argv`, `context`: `CustomContext`) => `Promisable`\<typeof `process.argv`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Type declaration

▸ (`rawArgv`, `context`): `Promisable`\<typeof `process.argv`\>

This function is called once towards the beginning of the execution of
`PreExecutionContext::execute` and should return a `process.argv`-like array.

This is where yargs middleware and other argument pre-processing can be
implemented.

##### Parameters

| Name | Type |
| :------ | :------ |
| `rawArgv` | typeof `process.argv` |
| `context` | `CustomContext` |

##### Returns

`Promisable`\<typeof `process.argv`\>

#### Defined in

[types/configure.ts:44](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/configure.ts#L44)

___

### ConfigureErrorHandlingEpilogue

Ƭ **ConfigureErrorHandlingEpilogue**\<`CustomContext`\>: (`meta`: \{ `error`: `unknown` ; `exitCode`: `number` ; `message`: `string`  }, `argv`: `Omit`\<`Partial`\<[`Arguments`](index.md#arguments)\>, typeof [`$executionContext`](index.md#$executioncontext)\> & \{ `[$executionContext]`: [`ExecutionContext`](index.md#executioncontext)  }, `context`: `CustomContext`) => `Promisable`\<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Type declaration

▸ (`meta`, `argv`, `context`): `Promisable`\<`void`\>

This function is called once at the very end of the error handling process
after an error has occurred.

Note that this function is _always_ called whenever there is an error,
regardless of which other functions have already been called. The only
exceptions to this are if (1) the error occurs within
`configureErrorHandlingEpilogue` itself or (2) the error is an instance of
`GracefulEarlyExitError`.

This function is also called even after yargs internally handles and reports
an argument parsing/validation error.

##### Parameters

| Name | Type |
| :------ | :------ |
| `meta` | `Object` |
| `meta.error` | `unknown` |
| `meta.exitCode` | `number` |
| `meta.message` | `string` |
| `argv` | `Omit`\<`Partial`\<[`Arguments`](index.md#arguments)\>, typeof [`$executionContext`](index.md#$executioncontext)\> & \{ `[$executionContext]`: [`ExecutionContext`](index.md#executioncontext)  } |
| `context` | `CustomContext` |

##### Returns

`Promisable`\<`void`\>

#### Defined in

[types/configure.ts:77](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/configure.ts#L77)

___

### ConfigureExecutionContext

Ƭ **ConfigureExecutionContext**\<`CustomContext`\>: (`context`: [`ExecutionContext`](index.md#executioncontext)) => `Promisable`\<`CustomContext`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Type declaration

▸ (`context`): `Promisable`\<`CustomContext`\>

This function is called once towards the beginning of the execution of
`configureProgram` and should return what will become the global
[ExecutionContext](index.md#executioncontext) singleton.

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ExecutionContext`](index.md#executioncontext) |

##### Returns

`Promisable`\<`CustomContext`\>

#### Defined in

[types/configure.ts:16](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/configure.ts#L16)

___

### ConfigureExecutionEpilogue

Ƭ **ConfigureExecutionEpilogue**\<`CustomContext`\>: (`argv`: [`Arguments`](index.md#arguments), `context`: `CustomContext`) => `Promisable`\<[`Arguments`](index.md#arguments)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Type declaration

▸ (`argv`, `context`): `Promisable`\<[`Arguments`](index.md#arguments)\>

This function is called once after CLI argument parsing completes and either
(1) handler execution succeeds or (2) a `GracefulEarlyExitError` is thrown.
The value returned by this function is used as the return value of the
`PreExecutionContext::execute` method. This function will _not_ be called
when yargs argument validation fails.

This function is the complement of [ConfigureExecutionPrologue](index.md#configureexecutionprologue).

##### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | [`Arguments`](index.md#arguments) |
| `context` | `CustomContext` |

##### Returns

`Promisable`\<[`Arguments`](index.md#arguments)\>

#### Defined in

[types/configure.ts:60](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/configure.ts#L60)

___

### ConfigureExecutionPrologue

Ƭ **ConfigureExecutionPrologue**\<`CustomContext`\>: (`root`: [`Programs`](util.md#programs), `context`: `CustomContext`) => `Promisable`\<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Type declaration

▸ (`root`, `context`): `Promisable`\<`void`\>

This function is called once towards the end of the execution of
`configureProgram`, after all commands have been discovered but before any
have been executed, and should apply any final configurations to the programs
that constitute the command line interface.

All commands and sub-commands known to Black Flag are available in the
[ExecutionContext.commands](index.md#commands) map, which can be accessed from the
`context` parameter or from the [Arguments](index.md#arguments) object returned by
Program.parseAsync et al.

This function is the complement of [ConfigureExecutionEpilogue](index.md#configureexecutionepilogue).

##### Parameters

| Name | Type |
| :------ | :------ |
| `root` | [`Programs`](util.md#programs) |
| `context` | `CustomContext` |

##### Returns

`Promisable`\<`void`\>

#### Defined in

[types/configure.ts:33](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/configure.ts#L33)

___

### ExecutionContext

Ƭ **ExecutionContext**: `Object`

Represents a globally-accessible shared context object singleton.

#### Index signature

▪ [key: `string`]: `unknown`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `commands` | `Map`\<`string`, \{ `metadata`: [`ProgramMetadata`](index.md#programmetadata) ; `programs`: [`Programs`](util.md#programs)  }\> | A Map consisting of auto-discovered [Program](index.md#program) instances and their associated [ProgramMetadata](index.md#programmetadata) as singular object values with their respective _full names_ as keys. Note that key-value pairs will always be iterated in insertion order, implying the first pair in the Map will always be the root command. |
| `debug` | `ExtendedDebugger` | The ExtendedDebugger for the current runtime level. |
| `state` | \{ `[key: string]`: `unknown`; `deepestParseResult`: [`Arguments`](index.md#arguments) \| `undefined` ; `firstPassArgv`: [`Arguments`](index.md#arguments) \| `undefined` ; `globalHelpOption`: \{ `description`: `string` ; `name`: `string`  } \| `undefined` ; `initialTerminalWidth`: `number` ; `isGracefullyExiting`: `boolean` ; `isHandlingHelpOption`: `boolean` ; `rawArgv`: typeof `process.argv` ; `showHelpOnFail`: `boolean`  } | The current state of the execution environment. |
| `state.deepestParseResult` | [`Arguments`](index.md#arguments) \| `undefined` | Stores the result of the latest call to `EffectorProgram::parseAsync`. This is necessary because, with our depth-first multi-yargs architecture, the parse job done by shallower programs in the chain must not mutate the result of the deepest call to `EffectorProgram::parseAsync` in the execution chain. Note: this property should not be relied upon or mutated by end-developers. **`Default`** ```ts undefined ``` |
| `state.firstPassArgv` | [`Arguments`](index.md#arguments) \| `undefined` | Allows helper and effector programs to keep track of pre-pared arguments. Note: this property should not be relied upon or mutated by end-developers. **`Default`** ```ts undefined ``` |
| `state.globalHelpOption` | \{ `description`: `string` ; `name`: `string`  } \| `undefined` | `globalHelpOption` replaces the functionality of the disabled vanilla yargs `yargs::help` method. Set this to the value you want using the `configureExecutionContext` configuration hook (any other hook is run too late). `name`, if provided, must be >= 1 character in length. If `name` is exactly one character in length, the help option will take the form of `-${name}`, otherwise `--${name}`. Note: this property should not be relied upon or mutated by end-developers outside of the `configureExecutionContext` configuration hook. Doing so will result in undefined behavior. **`Default`** ```ts { name: "help", description: defaultHelpTextDescription } ``` |
| `state.initialTerminalWidth` | `number` | The detected width of the terminal. This value is determined by yargs when `configureProgram` is called. |
| `state.isGracefullyExiting` | `boolean` | If `true`, Black Flag is currently in the process of handling a graceful exit. Checking the value of this flag is useful in configuration hooks like `configureExecutionEpilogue`, which are still executed when a `GracefulEarlyExitError` is thrown. In almost every other context, this will _always_ be `false`. **`Default`** ```ts false ``` |
| `state.isHandlingHelpOption` | `boolean` | If `isHandlingHelpOption` is `true`, Black Flag is currently in the process of getting yargs to generate help text for a child command. Checking the value of this property is useful when you want to know if `--help` (or whatever your equivalent option is) was passed to the root command. The value of `isHandlingHelpOption` is also used to determine the value of `helpOrVersionSet` in commands' `builder` functions. We have to track this separately from yargs since we're stacking multiple yargs instances and they all want to be the one that handles generating help text. Note: setting `isHandlingHelpOption` to `true` manually will cause Black Flag to output help text as if the user had specified `--help` (or an equivalent) as one of their arguments. **`Default`** ```ts false ``` |
| `state.rawArgv` | typeof `process.argv` | A subset of the original argv returned by [ConfigureArguments](index.md#configurearguments). It is used internally to give the final command in the arguments list the chance to parse argv. Further, it is used to enforce the ordering invariant on chained child program invocations. That is: all non-positional arguments must appear _after_ the last command name in any arguments list parsed by this program. Since it will be actively manipulated by each command in the arguments list, **do not rely on `rawArgv` for anything other than checking invariant satisfaction.** **`Default`** ```ts [] ``` |
| `state.showHelpOnFail` | `boolean` | If `true`, Black Flag will dump help text to stderr when an error occurs. This is also set when `Program::showHelpOnFail` is called. **`Default`** ```ts true ``` |

#### Defined in

[types/program.ts:255](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/program.ts#L255)

___

### Executor

Ƭ **Executor**: (`rawArgv?`: `Parameters`\<[`ConfigureArguments`](index.md#configurearguments)\>[``0``]) => `Promise`\<[`Arguments`](index.md#arguments)\>

#### Type declaration

▸ (`rawArgv?`): `Promise`\<[`Arguments`](index.md#arguments)\>

This function accepts an optional `rawArgv` array that defaults to
`yargs::hideBin(process.argv)` and returns an arguments object representing
the parsed and validated arguments object returned by the root router
[Program](index.md#program) instance.

**This function throws whenever an exception occurs**, making it not ideal as
an entry point for a CLI. See [runProgram](index.md#runprogram) for a wrapper function that
handles exceptions and sets the exit code for you.

##### Parameters

| Name | Type |
| :------ | :------ |
| `rawArgv?` | `Parameters`\<[`ConfigureArguments`](index.md#configurearguments)\>[``0``] |

##### Returns

`Promise`\<[`Arguments`](index.md#arguments)\>

#### Defined in

[types/program.ts:221](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/program.ts#L221)

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
| `[$executionContext]` | [`ExecutionContext`](index.md#executioncontext) |

#### Defined in

[types/program.ts:207](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/program.ts#L207)

___

### ImportedConfigurationModule

Ƭ **ImportedConfigurationModule**\<`CustomCliArguments`\>: (`context`: [`ExecutionContext`](index.md#executioncontext)) => `Promisable`\<`Partial`\<[`RootConfiguration`](index.md#rootconfiguration)\<`CustomCliArguments`\> \| [`ParentConfiguration`](index.md#parentconfiguration)\<`CustomCliArguments`\> \| [`ChildConfiguration`](index.md#childconfiguration)\<`CustomCliArguments`\>\>\> \| `Partial`\<[`RootConfiguration`](index.md#rootconfiguration)\<`CustomCliArguments`\> \| [`ParentConfiguration`](index.md#parentconfiguration)\<`CustomCliArguments`\> \| [`ChildConfiguration`](index.md#childconfiguration)\<`CustomCliArguments`\>\> & \{ `__esModule?`: ``false`` ; `default?`: [`ImportedConfigurationModule`](index.md#importedconfigurationmodule)\<`CustomCliArguments`\>  } \| \{ `__esModule`: ``true``  }

Represents a Configuration object imported from a CJS/ESM module external to
the CLI framework (e.g. importing an auto-discovered config module from a
file).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/module.ts:150](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/module.ts#L150)

___

### ParentConfiguration

Ƭ **ParentConfiguration**\<`CustomCliArguments`\>: `Partial`\<[`Configuration`](index.md#configuration)\<`CustomCliArguments`\>\>

A partial extension to the [Configuration](index.md#configuration) interface for non-root
parent configurations. This type was designed for use in external ESM/CJS
module files that will eventually get imported via auto-discovery.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/module.ts:132](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/module.ts#L132)

___

### PreExecutionContext

Ƭ **PreExecutionContext**\<`CustomContext`\>: `CustomContext` & \{ `execute`: [`Executor`](index.md#executor) ; `programs`: [`Programs`](util.md#programs)  }

Represents the pre-execution context that is the result of calling
`configureProgram`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Defined in

[types/program.ts:232](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/program.ts#L232)

___

### Program

Ƭ **Program**\<`CustomCliArguments`\>: `Omit`\<`_Program`\<[`FrameworkArguments`](index.md#frameworkarguments) & `CustomCliArguments`\>, ``"command"`` \| ``"showHelpOnFail"`` \| ``"version"`` \| ``"help"`` \| ``"exitProcess"`` \| ``"commandDir"`` \| ``"parse"`` \| ``"parsed"`` \| ``"parseSync"`` \| ``"argv"``\> & \{ `command`: (`command`: `string`[], `description`: `string` \| ``false``, `builder`: (`yargs`: `Argv`\<{}\>, `helpOrVersionSet`: `boolean`) => `Argv`\<{}\> \| `Record`\<`string`, `never`\>, `handler`: (`args`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => `Promisable`\<`void`\>, `middlewares`: [], `deprecated`: `string` \| `boolean`) => [`Program`](index.md#program)\<`CustomCliArguments`\> ; `command_deferred`: [`Program`](index.md#program)\<`CustomCliArguments`\>[``"command"``] ; `command_finalize_deferred`: () => `void` ; `showHelpOnFail`: (`enabled`: `boolean`) => [`Program`](index.md#program)\<`CustomCliArguments`\> ; `version`: (`version`: `string` \| ``false``) => [`Program`](index.md#program)\<`CustomCliArguments`\>  }

Represents a pre-configured yargs instance ready for argument parsing and
execution.

`Program` is essentially a drop-in replacement for the `Argv` type exported
by yargs but with several differences and should be preferred.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:40](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/program.ts#L40)

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
| `type` | [`ProgramType`](util.md#programtype) | The "type" of [Configuration](index.md#configuration) that was loaded, indicating which interface to expect when interacting with `configuration`. The possibilities are: - **root**: implements `RootConfiguration` (the only pure `ParentConfiguration`) - **parent-child**: implements `ParentConfiguration`, `ChildConfiguration` - **child**: implements `ChildConfiguration` Note that "root" `type` configurations are unique in that there will only ever be one `RootConfiguration`, and it **MUST** be the first command module auto-discovered and loaded (invariant). |

#### Defined in

[types/program.ts:164](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/program.ts#L164)

___

### RootConfiguration

Ƭ **RootConfiguration**\<`CustomCliArguments`\>: `Partial`\<[`ParentConfiguration`](index.md#parentconfiguration)\<`CustomCliArguments`\>\>

A partial extension to the [Configuration](index.md#configuration) interface for root
configurations. This type was designed for use in external ESM/CJS module
files that will eventually get imported via auto-discovery.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/module.ts:123](https://github.com/Xunnamius/black-flag/blob/74f8d53/types/module.ts#L123)

## Variables

### $executionContext

• `Const` **$executionContext**: typeof [`$executionContext`](index.md#$executioncontext)

A symbol allowing access to the `ExecutionContext` object "hidden" within
each `Arguments` instance.

#### Defined in

[src/constant.ts:5](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/constant.ts#L5)

___

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
| `AssertionFailureInvocationNotAllowed` | (`name`: `string`) => `string` |
| `AssertionFailureNamingInvariant` | (`name`: `string`) => `string` |
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

[src/error.ts:163](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/error.ts#L163)

___

### defaultUsageText

• `Const` **defaultUsageText**: ``"Usage: $000\n\n$1"``

Hard-coded default command `usage` text provided to programs via
`.usage(...)` after string interpolation. "$000", "$0", and "$1" are replaced
with a command's usage DSL (`command` export), name (`name` export), and
description (`description` export) respectively.

#### Defined in

[src/constant.ts:13](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/constant.ts#L13)

## Functions

### configureProgram

▸ **configureProgram**\<`CustomContext`\>(`commandModulePath`, `configurationHooks?`): `Promise`\<[`PreExecutionContext`](index.md#preexecutioncontext)\<`CustomContext`\>\>

Create and return a [PreExecutionContext](index.md#preexecutioncontext) containing fully-configured
[Program](index.md#program) instances and an [Executor](index.md#executor) entry point function.

Command auto-discovery will occur at `commandModulePath`. An exception will
occur if no commands are loadable from the given `commandModulePath`.

**This function throws whenever an exception occurs**, making it not ideal as
an entry point for a CLI. See [runProgram](index.md#runprogram) for a wrapper function that
handles exceptions and sets the exit code for you.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandModulePath` | `string` |
| `configurationHooks?` | `Promisable`\<[`ConfigurationHooks`](index.md#configurationhooks)\<`CustomContext`\>\> |

#### Returns

`Promise`\<[`PreExecutionContext`](index.md#preexecutioncontext)\<`CustomContext`\>\>

#### Defined in

[src/index.ts:59](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/index.ts#L59)

___

### runProgram

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the dynamically imported
`configureProgram(commandModulePath).execute()` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and `undefined` is
returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string] |

#### Returns

`Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

`undefined` if `configureProgram` throws, `NullArguments` if
`execute` throws, or `Arguments` otherwise.

#### Defined in

[src/util.ts:174](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/util.ts#L174)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the dynamically imported `configureProgram(commandModulePath,
configurationHooks).execute()` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and `undefined` is
returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, configurationHooks: Promisable\<ConfigurationHooks\<CustomContext\>\>] |

#### Returns

`Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

`undefined` if `configureProgram` throws, `NullArguments` if
`execute` throws, or `Arguments` otherwise.

#### Defined in

[src/util.ts:196](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/util.ts#L196)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the `preExecutionContext.execute()` function.

**WARNING: reusing the same `preExecutionContext` with multiple invocations
of `runProgram` will cause successive invocations to fail.** This is because
yargs does not support calling `yargs::parseAsync` more than once. If this is
unacceptable, do not pass `runProgram` a `preExecutionContext` property.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and `undefined` is
returned.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, preExecutionContext: Promisable\<PreExecutionContext\<CustomContext\>\>] |

#### Returns

`Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

`NullArguments` if `execute` throws or `Arguments` otherwise.

#### Defined in

[src/util.ts:220](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/util.ts#L220)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

Invokes the dynamically imported
`configureProgram(commandModulePath).execute(argv)` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and `undefined` is
returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, argv: string \| string[]] |

#### Returns

`Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

`undefined` if `configureProgram` throws, `NullArguments` if
`execute` throws, or `Arguments` otherwise.

#### Defined in

[src/util.ts:244](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/util.ts#L244)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

Invokes the dynamically imported `configureProgram(commandModulePath,
configurationHooks).execute(argv)` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and `undefined` is
returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, argv: string \| string[], configurationHooks: Promisable\<ConfigurationHooks\<CustomContext\>\>] |

#### Returns

`Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

`undefined` if `configureProgram` throws, `NullArguments` if
`execute` throws, or `Arguments` otherwise.

#### Defined in

[src/util.ts:266](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/util.ts#L266)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

Invokes the `preExecutionContext.execute(argv)` function.

**WARNING: reusing the same `preExecutionContext` with multiple invocations
of `runProgram` will cause successive invocations to fail.** This is because
yargs does not support calling `yargs::parseAsync` more than once. If this is
unacceptable, do not pass `runProgram` a `preExecutionContext` property.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and `undefined` is
returned.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, argv: string \| string[], preExecutionContext: Promisable\<PreExecutionContext\<CustomContext\>\>] |

#### Returns

`Promise`\<`NullArguments` \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

`NullArguments` if `execute` throws or `Arguments` otherwise.

#### Defined in

[src/util.ts:291](https://github.com/Xunnamius/black-flag/blob/74f8d53/src/util.ts#L291)
