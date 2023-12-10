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

- [AnyArguments](index.md#anyarguments)
- [AnyConfiguration](index.md#anyconfiguration)
- [AnyProgram](index.md#anyprogram)
- [Arguments](index.md#arguments)
- [ChildConfiguration](index.md#childconfiguration)
- [CliErrorOptions](index.md#clierroroptions)
- [Configuration](index.md#configuration)
- [ConfigureArguments](index.md#configurearguments)
- [ConfigureErrorHandlingEpilogue](index.md#configureerrorhandlingepilogue)
- [ConfigureExecutionContext](index.md#configureexecutioncontext)
- [ConfigureExecutionEpilogue](index.md#configureexecutionepilogue)
- [ConfigureExecutionPrologue](index.md#configureexecutionprologue)
- [ConfigureHooks](index.md#configurehooks)
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
- [DEFAULT\_USAGE\_TEXT](index.md#default_usage_text)
- [ErrorMessage](index.md#errormessage)

### Functions

- [configureProgram](index.md#configureprogram)
- [makeProgram](index.md#makeprogram)
- [runProgram](index.md#runprogram)

## Type Aliases

### AnyArguments

Ƭ **AnyArguments**: [`Arguments`](index.md#arguments)\<`Record`\<`string`, `unknown`\>\>

Represents the most generic form of [Arguments](index.md#arguments).

#### Defined in

[types/program.ts:16](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/program.ts#L16)

___

### AnyConfiguration

Ƭ **AnyConfiguration**: [`Configuration`](index.md#configuration)\<`Record`\<`string`, `unknown`\>\>

Represents the most generic implementation type of [Configuration](index.md#configuration).

#### Defined in

[types/module.ts:9](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/module.ts#L9)

___

### AnyProgram

Ƭ **AnyProgram**: [`Program`](index.md#program)\<`Record`\<`string`, `unknown`\>\>

Represents the most generic form of [Program](index.md#program).

#### Defined in

[types/program.ts:29](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/program.ts#L29)

___

### Arguments

Ƭ **Arguments**\<`CustomCliArguments`\>: `_Arguments`\<[`FrameworkArguments`](index.md#frameworkarguments) & `CustomCliArguments`\>

Represents the parsed CLI arguments, plus `_` and `$0`, any (hidden)
arguments/properties specific to Black Flag, and an indexer falling back to
`unknown` for unrecognized arguments.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/program.ts:23](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/program.ts#L23)

___

### ChildConfiguration

Ƭ **ChildConfiguration**\<`CustomCliArguments`\>: `Partial`\<[`Configuration`](index.md#configuration)\<`CustomCliArguments`\>\>

A partial extension to the [Configuration](index.md#configuration) interface for child
configurations. This type was designed for use in external ESM/CJS module
files that will eventually get imported via auto-discovery.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/module.ts:129](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/module.ts#L129)

___

### CliErrorOptions

Ƭ **CliErrorOptions**: `Object`

Options available when constructing a new `CliError` object.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `suggestedExitCode?` | `number` | The exit code that will be returned when the program exits, given nothing else goes wrong in the interim. **`Default`** ```ts FrameworkExitCode.DefaultError ``` |

#### Defined in

[src/error.ts:48](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/error.ts#L48)

___

### Configuration

Ƭ **Configuration**\<`CustomCliArguments`\>: `Object`

A replacement for the `CommandModule` type that comes with yargs.
Auto-discovered configuration modules must implement this interface or a
subtype of this interface.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `aliases` | `string`[] | An array of `command` aliases [as interpreted](https://github.com/yargs/yargs/pull/647) by [yargs](https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases). Note that positional arguments defined in aliases are ignored. **`Default`** ```ts [] ``` |
| `builder` | \{ `[key: string]`: `_Options`;  } \| (`yargs`: [`Program`](index.md#program)\<`CustomCliArguments`\>, `helpOrVersionSet`: `boolean`, `argv?`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => [`Program`](index.md#program)\<`CustomCliArguments`\> \| `_Program` | An object containing yargs options configuration or a function that will receive and return the current yargs instance. **If `builder` is a function, it cannot be async or return a promise** due to a yargs bug present at time of writing. However, a [Configuration](index.md#configuration) module can export an async function, so hoist any async logic out of the builder function to work around this bug for now. **`Default`** ```ts {} ``` |
| `command` | ``"$0"`` \| \`$0 $\{string}\` | The command as interpreted by yargs. May contain positional arguments. It is usually unnecessary to change or use this property. **`Default`** ```ts "$0" ``` |
| `deprecated` | `string` \| `boolean` | If truthy, the command will be considered "deprecated" by yargs. If `deprecated` is a string, it will additionally be treated as a deprecation message and printed. **`Default`** ```ts false ``` |
| `description` | `string` \| ``false`` | The description for the command in help text. If `false`, the command will be considered "hidden" by yargs. **`Default`** ```ts "" ``` |
| `handler` | (`args`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => `Promisable`\<`void`\> | A function called when this command is invoked. It will receive an object of parsed arguments. If `undefined`, a `CommandNotImplementedError` will be thrown. **`Default`** ```ts undefined ``` |
| `name` | `string` | The name of the command. **Must not contain any spaces** or any characters that yargs does not consider valid for a command name. An error will be thrown if known problematic characters are present. Defaults to the filename containing the configuration, excluding its extension, or the directory name (converted to [kebab case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case)) if the filename without extension is "index". |
| `usage` | `string` | Set a usage message shown at the top of the command's help text. Several replacements are made to the `usage` string before it is output. In order: - `$000` will be replaced by the entire command itself (including full canonical name and parameters). - `$1` will be replaced by the description of the command. - `$0` will be replaced with the full canonical name of the command. **`Default`** ```ts "Usage: $000\n\n$1" ``` |

#### Defined in

[types/module.ts:16](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/module.ts#L16)

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

[types/configure.ts:39](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/configure.ts#L39)

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

[types/configure.ts:72](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/configure.ts#L72)

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

[types/configure.ts:11](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/configure.ts#L11)

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

[types/configure.ts:55](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/configure.ts#L55)

___

### ConfigureExecutionPrologue

Ƭ **ConfigureExecutionPrologue**\<`CustomContext`\>: (`program`: [`Program`](index.md#program), `context`: `CustomContext`) => `Promisable`\<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Type declaration

▸ (`program`, `context`): `Promisable`\<`void`\>

This function is called once towards the end of the execution of
`configureProgram`, after all commands have been discovered but before any
have been executed, and should apply any final configurations to the yargs
instances that constitute the command line interface.

All commands and sub-commands known to Black Flag are available in the
[ExecutionContext.commands](index.md#commands) map, which can be accessed from the
`context` parameter or from the [Arguments](index.md#arguments) object returned by
Program.parseAsync et al.

This function is the complement of [ConfigureExecutionEpilogue](index.md#configureexecutionepilogue).

##### Parameters

| Name | Type |
| :------ | :------ |
| `program` | [`Program`](index.md#program) |
| `context` | `CustomContext` |

##### Returns

`Promisable`\<`void`\>

#### Defined in

[types/configure.ts:28](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/configure.ts#L28)

___

### ConfigureHooks

Ƭ **ConfigureHooks**\<`CustomContext`\>: `Object`

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
| `configureExecutionPrologue?` | [`ConfigureExecutionPrologue`](index.md#configureexecutionprologue)\<`CustomContext`\> | This function is called once towards the end of the execution of `configureProgram`, after all commands have been discovered but before any have been executed, and should apply any final configurations to the yargs instances that constitute the command line interface. All commands and sub-commands known to Black Flag are available in the [ExecutionContext.commands](index.md#commands) map, which can be accessed from the `context` parameter or from the [Arguments](index.md#arguments) object returned by Program.parseAsync et al. This function is the complement of [ConfigureExecutionEpilogue](index.md#configureexecutionepilogue). |

#### Defined in

[types/configure.ts:87](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/configure.ts#L87)

___

### ExecutionContext

Ƭ **ExecutionContext**: `Object`

Represents a globally-accessible shared context object singleton.

#### Index signature

▪ [key: `string`]: `unknown`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `commands` | `Map`\<`string`, \{ `metadata`: [`ProgramMetadata`](index.md#programmetadata) ; `program`: [`AnyProgram`](index.md#anyprogram)  }\> | A Map consisting of auto-discovered [Program](index.md#program) instances and their associated [ProgramMetadata](index.md#programmetadata) (including shadow [Program](index.md#program) instances) as values with their respective _full names_ as keys. Note that key-value pairs will always be iterated in insertion order, implying the first pair in the Map, if there are any pairs, will always be the root program. |
| `debug` | `ExtendedDebugger` | The ExtendedDebugger for the current runtime level. |
| `state` | \{ `[key: string]`: `unknown`; `globalHelpOption`: `string` \| `undefined` ; `initialTerminalWidth`: `number` ; `isGracefullyExiting`: `boolean` ; `isHandlingHelpOption`: `boolean` ; `rawArgv`: typeof `process.argv`  } | The current state of the execution environment. |
| `state.globalHelpOption` | `string` \| `undefined` | `globalHelpOption` caches the latest first argument passed to `yargs::help` method of any [Program](index.md#program). This property is used as part of a strategy to mimic yargs's short-circuiting when the `--help` parameter is given and should not be tampered with or relied upon. **`Default`** ```ts "help" ``` |
| `state.initialTerminalWidth` | `number` | The detected width of the terminal. This value is determined by yargs when `configureProgram` is called. |
| `state.isGracefullyExiting` | `boolean` | If `true`, Black Flag is currently in the process of handling a graceful exit. Checking the value of this flag is useful in configuration hooks like `configureExecutionEpilogue`, which are still executed when a `GracefulEarlyExitError` is thrown. In almost every other case, this will always be `false`. **`Default`** ```ts false ``` |
| `state.isHandlingHelpOption` | `boolean` | If `isHandlingHelpOption` is `true`, Black Flag is currently in the process of getting yargs to generate help text for a child command. Checking the value of this property is useful when you want to know if `--help` (or whatever your equivalent option is) was passed to the root command. We have to track this separately from yargs since we're stacking multiple yargs instances and they all want to be the one that handles generating help text. **`Default`** ```ts false ``` |
| `state.rawArgv` | typeof `process.argv` | A subset of the original argv returned by [ConfigureArguments](index.md#configurearguments). It is used internally to give the final command in the arguments list the chance to parse argv. Further, it is used to enforce the ordering invariant on chained child program invocations. That is: all non-positional arguments must appear _after_ the last command name in any arguments list parsed by this program. For example: - Good (satisfies invariant): `rootcmd subcmd subsubcmd --help` - Bad (violation of invariant): `rootcmd --help subcmd subsubcmd` Since it will be actively manipulated by each command in the arguments list, **do not rely on `rawArgv` for anything other than checking invariant satisfaction.** |

#### Defined in

[types/program.ts:222](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/program.ts#L222)

___

### Executor

Ƭ **Executor**: (`rawArgv?`: `Parameters`\<[`ConfigureArguments`](index.md#configurearguments)\>[``0``]) => `Promise`\<`Awaited`\<`ReturnType`\<[`ConfigureExecutionEpilogue`](index.md#configureexecutionepilogue)\>\>\>

#### Type declaration

▸ (`rawArgv?`): `Promise`\<`Awaited`\<`ReturnType`\<[`ConfigureExecutionEpilogue`](index.md#configureexecutionepilogue)\>\>\>

This function accepts an optional `rawArgv` array that defaults to
`yargs::hideBin(process.argv)` and returns an arguments object representing
the parsed CLI input for the given root [Program](index.md#program).

**This function throws whenever an exception occurs** (including exceptions
representing a graceful exit), making it not ideal as an entry point for a
CLI. See [runProgram](index.md#runprogram) for a wrapper function that handles exceptions
and sets the exit code for you.

##### Parameters

| Name | Type |
| :------ | :------ |
| `rawArgv?` | `Parameters`\<[`ConfigureArguments`](index.md#configurearguments)\>[``0``] |

##### Returns

`Promise`\<`Awaited`\<`ReturnType`\<[`ConfigureExecutionEpilogue`](index.md#configureexecutionepilogue)\>\>\>

#### Defined in

[types/program.ts:188](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/program.ts#L188)

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

[types/program.ts:174](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/program.ts#L174)

___

### ImportedConfigurationModule

Ƭ **ImportedConfigurationModule**\<`CustomCliArguments`\>: (`context`: [`ExecutionContext`](index.md#executioncontext)) => `Promisable`\<`Partial`\<[`RootConfiguration`](index.md#rootconfiguration)\<`CustomCliArguments`\> \| [`ParentConfiguration`](index.md#parentconfiguration)\<`CustomCliArguments`\> \| [`ChildConfiguration`](index.md#childconfiguration)\<`CustomCliArguments`\>\>\> \| `Partial`\<[`RootConfiguration`](index.md#rootconfiguration)\<`CustomCliArguments`\> \| [`ParentConfiguration`](index.md#parentconfiguration)\<`CustomCliArguments`\> \| [`ChildConfiguration`](index.md#childconfiguration)\<`CustomCliArguments`\>\> & \{ `__esModule?`: ``false`` ; `default?`: [`ImportedConfigurationModule`](index.md#importedconfigurationmodule)\<`CustomCliArguments`\>  } \| \{ `__esModule`: ``true``  }

Represents a Configuration object imported from a CJS/ESM module external to
the CLI framework (e.g. importing an auto-discovered config module from a
file).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/module.ts:138](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/module.ts#L138)

___

### ParentConfiguration

Ƭ **ParentConfiguration**\<`CustomCliArguments`\>: `Partial`\<[`Configuration`](index.md#configuration)\<`CustomCliArguments`\>\>

A partial extension to the [Configuration](index.md#configuration) interface for non-root
parent configurations. This type was designed for use in external ESM/CJS
module files that will eventually get imported via auto-discovery.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/module.ts:120](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/module.ts#L120)

___

### PreExecutionContext

Ƭ **PreExecutionContext**\<`CustomContext`\>: `CustomContext` & \{ `execute`: [`Executor`](index.md#executor) ; `program`: [`Program`](index.md#program)  }

Represents the pre-execution context that is the result of calling
`configureProgram`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Defined in

[types/program.ts:199](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/program.ts#L199)

___

### Program

Ƭ **Program**\<`CustomCliArguments`\>: `Omit`\<`_Program`\<[`FrameworkArguments`](index.md#frameworkarguments) & `CustomCliArguments`\>, ``"command"`` \| ``"showHelpOnFail"`` \| ``"version"``\> & \{ `command`: `_Program`\<`CustomCliArguments`\>[``"command"``] & (`command`: `string` \| `string`[], `description`: `string` \| ``false``, `builder`: \{ `[key: string]`: `_Options`;  } \| (`yargs`: [`Program`](index.md#program)\<`CustomCliArguments`\>, `helpOrVersionSet`: `boolean`, `argv?`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => `Argv`\<{}\> \| [`Program`](index.md#program)\<`CustomCliArguments`\>, `handler`: (`args`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => `Promisable`\<`void`\>, `middlewares`: [], `deprecated`: `string` \| `boolean`) => [`Program`](index.md#program)\<`CustomCliArguments`\> ; `command_deferred`: [`Program`](index.md#program)\<`CustomCliArguments`\>[``"command"``] ; `command_finalize_deferred`: () => `void` ; `help_force`: [`Program`](index.md#program)\<`CustomCliArguments`\>[``"help"``] ; `showHelpOnFail`: (`enabled`: `boolean`) => [`Program`](index.md#program)\<`CustomCliArguments`\> ; `strict_force`: (`enabled`: `boolean`) => `void` ; `version`: `_Program`\<`CustomCliArguments`\>[``"version"``] & (`version`: `string` \| ``false``) => [`Program`](index.md#program)\<`CustomCliArguments`\>  }

Represents a pre-configured yargs instance ready for argument parsing and
execution.

`Program` is essentially a drop-in replacement for the `Argv` type exported
by yargs but with several differences and should be preferred.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/program.ts:38](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/program.ts#L38)

___

### ProgramMetadata

Ƭ **ProgramMetadata**: `Object`

Represents the meta information about a discovered [Program](index.md#program) instance
and its corresponding [Configuration](index.md#configuration) object/file.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | The basename of `filepath`. |
| `filenameWithoutExtension` | `string` | The basename of `filepath` with the trailing extension trimmed. |
| `filepath` | `string` | Absolute filesystem path to the configuration file used to configure the program. |
| `parentDirName` | `string` | The basename of the direct parent directory containing `filepath`. |
| `shadow` | [`AnyProgram`](index.md#anyprogram) | Each individual program is represented in memory as two distinct [Program](index.md#program) instances: the "actual" command instance and a clone of this instance, i.e. its "shadow" available here. Check [the docs](https://github.com/Xunnamius/black-flag#readme) for more details. |
| `type` | ``"root"`` \| ``"parent-child"`` \| ``"child"`` | The "type" of [Configuration](index.md#configuration) that was loaded, indicating which interface to expect when interacting with `configuration`. The possibilities are: - **root**: implements `RootConfiguration` (the only pure `ParentConfiguration`) - **parent-child**: implements `ParentConfiguration`, `ChildConfiguration` - **child**: implements `ChildConfiguration` Note that "root" `type` configurations are unique in that there will only ever be one `RootConfiguration` instance, and it **MUST** be the first command module auto-discovered and loaded (invariant). |

#### Defined in

[types/program.ts:121](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/program.ts#L121)

___

### RootConfiguration

Ƭ **RootConfiguration**\<`CustomCliArguments`\>: `Partial`\<[`ParentConfiguration`](index.md#parentconfiguration)\<`CustomCliArguments`\>\>

A partial extension to the [Configuration](index.md#configuration) interface for root
configurations. This type was designed for use in external ESM/CJS module
files that will eventually get imported via auto-discovery.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Defined in

[types/module.ts:111](https://github.com/Xunnamius/black-flag/blob/5a95f1c/types/module.ts#L111)

## Variables

### $executionContext

• `Const` **$executionContext**: typeof [`$executionContext`](index.md#$executioncontext)

A symbol allowing access to the `ExecutionContext` object "hidden" within
each `Arguments` instance.

#### Defined in

[src/constant.ts:7](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/constant.ts#L7)

___

### DEFAULT\_USAGE\_TEXT

• `Const` **DEFAULT\_USAGE\_TEXT**: ``"Usage: $000\n\n$1"``

Hard-coded default program `usage` text provided to yargs instances via
`.usage(...)` after string interpolation. "$000", "$0", and "$1" are replaced
with a command's usage DSL (`command` export), name (`name` export), and
description (`description` export) respectively.

#### Defined in

[src/constant.ts:15](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/constant.ts#L15)

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
| `AssertionFailureBadParameterCombination` | () => `string` |
| `AssertionFailureCannotExecuteMultipleTimes` | () => `string` |
| `AssertionFailureConfigureExecutionEpilogue` | () => `string` |
| `AssertionFailureExistenceInvariant` | () => `string` |
| `AssertionFailureInvocationNotAllowed` | (`name`: `string`) => `string` |
| `AssertionFailureNamingInvariant` | (`name`: `string`) => `string` |
| `AssertionFailureOrderingInvariant` | () => `string` |
| `ConfigLoadFailure` | (`path`: `string`) => `string` |
| `Generic` | () => `string` |
| `GracefulEarlyExit` | () => `string` |
| `InvalidCharacters` | (`str`: `string`, `violation`: `string`) => `string` |
| `InvalidConfigureArgumentsReturnType` | () => `string` |
| `InvalidConfigureExecutionContextReturnType` | () => `string` |
| `UseParseAsyncInstead` | () => `string` |

#### Defined in

[src/error.ts:161](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/error.ts#L161)

## Functions

### configureProgram

▸ **configureProgram**\<`CustomContext`\>(`commandModulePath?`, `configurationHooks?`): `Promise`\<[`PreExecutionContext`](index.md#preexecutioncontext)\<`CustomContext`\>\>

Create and return a [PreExecutionContext](index.md#preexecutioncontext) containing a fully-configured
[Program](index.md#program) instance with the provided configuration hooks and an
[Executor](index.md#executor) function.

Command auto-discovery will occur at `commandModulePath`, if defined;
otherwise, command auto-discovery is disabled.

If command auto-discovery is disabled, `PreExecutionContext::program` will be
set to the return value of [makeProgram](index.md#makeprogram); i.e. a semi-functional
lightly-decorated yargs instance. It is therefore not useful to invoke this
function with auto-discovery disabled outside of a testing environment.

On the other hand, an exception will occur if no commands are loadable from
the given `commandModulePath`, if defined.

**This function throws whenever an exception occurs** (including exceptions
representing a graceful exit), making it not ideal as an entry point for a
CLI. See [runProgram](index.md#runprogram) for a wrapper function that handles exceptions
and sets the exit code for you.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandModulePath?` | `string` |
| `configurationHooks?` | `Promisable`\<[`ConfigureHooks`](index.md#configurehooks)\<`CustomContext`\>\> |

#### Returns

`Promise`\<[`PreExecutionContext`](index.md#preexecutioncontext)\<`CustomContext`\>\>

#### Defined in

[src/index.ts:68](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/index.ts#L68)

▸ **configureProgram**\<`CustomContext`\>(`configurationHooks?`): `Promise`\<[`PreExecutionContext`](index.md#preexecutioncontext)\<`CustomContext`\>\>

Create and return a [PreExecutionContext](index.md#preexecutioncontext) containing a semi-functional
lightly-decorated yargs instance (the return value of [makeProgram](index.md#makeprogram)).

When called in this form, command auto-discovery is disabled. It is therefore
not useful to invoke this call signature outside of a testing environment.

**This function throws whenever an exception occurs** (including exceptions
representing a graceful exit), making it not ideal as an entry point for a
CLI. See [runProgram](index.md#runprogram) for a wrapper function that handles exceptions
and sets the exit code for you.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) = [`ExecutionContext`](index.md#executioncontext) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `configurationHooks?` | `Promisable`\<[`ConfigureHooks`](index.md#configurehooks)\<`CustomContext`\>\> |

#### Returns

`Promise`\<[`PreExecutionContext`](index.md#preexecutioncontext)\<`CustomContext`\>\>

#### Defined in

[src/index.ts:86](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/index.ts#L86)

___

### makeProgram

▸ **makeProgram**\<`CustomCliArguments`\>(`«destructured»?`): `Promise`\<[`Program`](index.md#program)\<`CustomCliArguments`\>\>

Returns a non-configured "semi-broken" [Program](index.md#program) instance, which is
just a lightly-decorated yargs instance.

**You probably don't want to use this function.** If you want to make a new
`Program` instance with auto-discovered commands, configuration hooks,
metadata tracking, and support for other Black Flag features, you want
[runProgram](index.md#runprogram) or [configureProgram](index.md#configureprogram), both of which call
`makeProgram` internally.

Among other things, this function is sugar for `return (await
import('yargs/yargs')).default()`. Note that the returned yargs instance has
its magical `::argv` property disabled via a [this-recovering `Proxy`
object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#no_private_property_forwarding).
The instance also exposes several new internal methods.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `isShadowClone` | `undefined` \| `boolean` |

#### Returns

`Promise`\<[`Program`](index.md#program)\<`CustomCliArguments`\>\>

#### Defined in

[src/index.ts:404](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/index.ts#L404)

___

### runProgram

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the dynamically imported `configureProgram().execute()` function.

This function is suitable for a CLI entry point since it will **never throw
no matter what.** Instead, when an error is caught, `process.exitCode` is set
to the appropriate value and `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath?: string] |

#### Returns

`Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

#### Defined in

[src/util.ts:150](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/util.ts#L150)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the dynamically imported
`configureProgram(configurationHooks).execute()` function.

This function is suitable for a CLI entry point since it will **never throw
no matter what.** Instead, when an error is caught, `process.exitCode` is set
to the appropriate value and `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, configurationHooks: Promisable\<ConfigureHooks\<CustomContext\>\>] |

#### Returns

`Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

#### Defined in

[src/util.ts:168](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/util.ts#L168)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the `preExecutionContext.execute()` function.

**WARNING: reusing the same `preExecutionContext` with multiple invocations
of `runProgram` will cause successive invocations to fail.** This is because
yargs does not support calling `yargs::parseAsync` more than once. If this is
unacceptable, do not pass `runProgram` a `preExecutionContext` property.

This function is suitable for a CLI entry point since it will **never throw
no matter what.** Instead, when an error is caught, `process.exitCode` is set
to the appropriate value and `undefined` is returned.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, preExecutionContext: PreExecutionContext\<CustomContext\>] |

#### Returns

`Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

#### Defined in

[src/util.ts:189](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/util.ts#L189)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

Invokes the dynamically imported `configureProgram().execute(argv)` function.

This function is suitable for a CLI entry point since it will **never throw
no matter what.** Instead, when an error is caught, `process.exitCode` is set
to the appropriate value and `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, argv: string \| string[]] |

#### Returns

`Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

#### Defined in

[src/util.ts:208](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/util.ts#L208)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

Invokes the dynamically imported
`configureProgram(configurationHooks).execute(argv)` function.

This function is suitable for a CLI entry point since it will **never throw
no matter what.** Instead, when an error is caught, `process.exitCode` is set
to the appropriate value and `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, argv: string \| string[], configurationHooks: Promisable\<ConfigureHooks\<CustomContext\>\>] |

#### Returns

`Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

#### Defined in

[src/util.ts:226](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/util.ts#L226)

▸ **runProgram**\<`CustomContext`, `CustomCliArguments`\>(`...args`): `Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

Invokes the `preExecutionContext.execute(argv)` function.

**WARNING: reusing the same `preExecutionContext` with multiple invocations
of `runProgram` will cause successive invocations to fail.** This is because
yargs does not support calling `yargs::parseAsync` more than once. If this is
unacceptable, do not pass `runProgram` a `preExecutionContext` property.

This function is suitable for a CLI entry point since it will **never throw
no matter what.** Instead, when an error is caught, `process.exitCode` is set
to the appropriate value and `undefined` is returned.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](index.md#executioncontext) |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `EmptyObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, argv: string \| string[], preExecutionContext: PreExecutionContext\<CustomContext\>] |

#### Returns

`Promise`\<[`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

#### Defined in

[src/util.ts:248](https://github.com/Xunnamius/black-flag/blob/5a95f1c/src/util.ts#L248)
