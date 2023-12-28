[black-flag](../README.md) / index

# Module: index

## Table of contents

### Enumerations

- [FrameworkExitCode](../enums/index.FrameworkExitCode.md)

### Classes

- [CliError](../classes/index.CliError.md)
- [GracefulEarlyExitError](../classes/index.GracefulEarlyExitError.md)

### Type Aliases

- [Arguments](index.md#arguments)
- [ChildConfiguration](index.md#childconfiguration)
- [Configuration](index.md#configuration)
- [ConfigurationHooks](index.md#configurationhooks)
- [ConfigureArguments](index.md#configurearguments)
- [ConfigureErrorHandlingEpilogue](index.md#configureerrorhandlingepilogue)
- [ConfigureExecutionContext](index.md#configureexecutioncontext)
- [ConfigureExecutionEpilogue](index.md#configureexecutionepilogue)
- [ConfigureExecutionPrologue](index.md#configureexecutionprologue)
- [ImportedConfigurationModule](index.md#importedconfigurationmodule)
- [NullArguments](index.md#nullarguments)
- [ParentConfiguration](index.md#parentconfiguration)
- [RootConfiguration](index.md#rootconfiguration)

### Variables

- [$executionContext](index.md#$executioncontext)

### Functions

- [configureProgram](index.md#configureprogram)
- [isCliError](index.md#isclierror)
- [isGracefulEarlyExitError](index.md#isgracefulearlyexiterror)
- [runProgram](index.md#runprogram)

## Type Aliases

### Arguments

Ƭ **Arguments**\<`CustomCliArguments`\>: `_Arguments`\<[`FrameworkArguments`](util.md#frameworkarguments) & `CustomCliArguments`\>

Represents the parsed CLI arguments, plus `_` and `$0`, any (hidden)
arguments/properties specific to Black Flag, and an indexer falling back to
`unknown` for unrecognized arguments.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/program.ts:18](https://github.com/Xunnamius/black-flag/blob/8df9305/types/program.ts#L18)

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

[types/module.ts:153](https://github.com/Xunnamius/black-flag/blob/8df9305/types/module.ts#L153)

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
| `aliases` | `string`[] | An array of `command` aliases [as interpreted](https://github.com/yargs/yargs/pull/647) by [yargs](https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases). **WARNING: positional arguments ARE NOT ALLOWED HERE** and including them will lead to strange behavior! If you want to add positional arguments, export [Configuration.command](index.md#command) instead. Note: when a command file is interpreted as a [RootConfiguration](index.md#rootconfiguration), `aliases` is effectively ignored. **`Default`** ```ts [] ``` |
| `builder` | \{ `[key: string]`: `_Options`;  } \| (`blackFlag`: `Omit`\<[`EffectorProgram`](util.md#effectorprogram)\<`CustomCliArguments`\>, ``"parseAsync"`` \| ``"fail"`` \| ``"command"`` \| ``"command_deferred"`` \| ``"command_finalize_deferred"``\>, `helpOrVersionSet`: `boolean`, `argv?`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => `void` \| [`EffectorProgram`](util.md#effectorprogram)\<`CustomCliArguments`\> \| \{ `[key: string]`: `_Options`;  } \| `_Program` | An object containing yargs options configuration or a function that will receive the current Black Flag program. Unlike with vanilla yargs, you do not need to return anything at all; "returning" `undefined`/`void` is equivalent. If you return something other than the `blackFlag` parameter, such as an object of options, it will be passed to `yargs::options` for you. Note 1: **if `builder` is a function, it cannot be async or return a promise** due to a yargs bug present at time of writing. However, a [Configuration](index.md#configuration) module can export an async function, so hoist any async logic out of the builder function to work around this bug for now. Note 2: if positional arguments are given and your command accepts them (i.e. provided via [Configuration.command](index.md#command) and configured via `yargs::positional`), they are only accessible from `argv?._` (`builder`'s third parameter). This is because positional arguments, while fully supported by Black Flag, **are parsed and validated _after_ `builder` is first invoked** and so aren't available until a little later. **`Default`** ```ts {} ``` |
| `command` | ``"$0"`` \| \`$0 $\{string}\` | The command as interpreted by yargs. May contain positional arguments. It is usually unnecessary to change or use this property if you're not using positional arguments. If you want to change your command's name, use [Configuration.name](index.md#name). If you want to change the usage text, use [Configuration.usage](index.md#usage). **`Default`** ```ts "$0" ``` |
| `deprecated` | `string` \| `boolean` | If truthy, the command will be considered "deprecated" by yargs. If `deprecated` is a string, it will additionally be treated as a deprecation message that will appear alongside the command in help text. **`Default`** ```ts false ``` |
| `description` | `string` \| ``false`` | The description for the command in help text. If `false`, the command will be considered "hidden" by yargs. **`Default`** ```ts "" ``` |
| `handler` | (`args`: [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>) => `Promisable`\<`void`\> | A function called when this command is invoked. It will receive an object of parsed arguments. If `undefined`, a `CommandNotImplementedError` will be thrown. **`Default`** ```ts undefined ``` |
| `name` | `string` | The name of the command. Any spaces will be replaced with hyphens. Including a character that yargs does not consider valid for a command name will result in an error. Defaults to the filename containing the configuration, excluding its extension, or the directory name (with spaces replaced) if the filename without extension is "index". |
| `usage` | `string` | Set a usage message shown at the top of the command's help text. Several replacements are made to the `usage` string before it is output. In order: - `$000` will be replaced by the entire command itself (including full canonical name and parameters). - `$1` will be replaced by the description of the command. - `$0` will be replaced with the full canonical name of the command. **`Default`** ```ts "Usage: $000\n\n$1" ``` |

#### Defined in

[types/module.ts:11](https://github.com/Xunnamius/black-flag/blob/8df9305/types/module.ts#L11)

___

### ConfigurationHooks

Ƭ **ConfigurationHooks**: `Object`

An object containing zero or more configuration hooks. See each hook type
definition for details.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `configureArguments?` | [`ConfigureArguments`](index.md#configurearguments) | This function is called once towards the beginning of the execution of `PreExecutionContext::execute` and should return a `process.argv`-like array. This is where yargs middleware and other argument pre-processing can be implemented. |
| `configureErrorHandlingEpilogue?` | [`ConfigureErrorHandlingEpilogue`](index.md#configureerrorhandlingepilogue) | This function is called once at the very end of the error handling process after an error has occurred. Note that this function is _always_ called whenever there is an error, regardless of which other functions have already been called. The only exceptions to this are if (1) the error occurs within `configureErrorHandlingEpilogue` itself or (2) the error is an instance of `GracefulEarlyExitError`. This function is also called even after yargs internally handles and reports an argument parsing/validation error. |
| `configureExecutionContext?` | [`ConfigureExecutionContext`](index.md#configureexecutioncontext) | This function is called once towards the beginning of the execution of `configureProgram` and should return what will become the global [ExecutionContext](util.md#executioncontext) singleton. Note that any errors thrown this early in the initialization process will be thrown as-is and will NOT trigger [ConfigureErrorHandlingEpilogue](index.md#configureerrorhandlingepilogue). |
| `configureExecutionEpilogue?` | [`ConfigureExecutionEpilogue`](index.md#configureexecutionepilogue) | This function is called once after CLI argument parsing completes and either (1) handler execution succeeds or (2) a `GracefulEarlyExitError` is thrown. The value returned by this function is used as the return value of the `PreExecutionContext::execute` method. This function will _not_ be called when yargs argument validation fails. This function is the complement of [ConfigureExecutionPrologue](index.md#configureexecutionprologue). |
| `configureExecutionPrologue?` | [`ConfigureExecutionPrologue`](index.md#configureexecutionprologue) | This function is called once towards the end of the execution of `configureProgram`, after all commands have been discovered but before any have been executed, and should apply any final configurations to the programs that constitute the command line interface. All commands and sub-commands known to Black Flag are available in the [ExecutionContext.commands](util.md#commands) map, which can be accessed from the `context` parameter or from the [Arguments](index.md#arguments) object returned by `Program::parseAsync` et al. This function is the complement of [ConfigureExecutionEpilogue](index.md#configureexecutionepilogue). Note that any errors thrown this early in the initialization process will be thrown as-is and will NOT trigger [ConfigureErrorHandlingEpilogue](index.md#configureerrorhandlingepilogue). |

#### Defined in

[types/configure.ts:96](https://github.com/Xunnamius/black-flag/blob/8df9305/types/configure.ts#L96)

___

### ConfigureArguments

Ƭ **ConfigureArguments**\<`CustomContext`\>: (`rawArgv`: typeof `process.argv`, `context`: `CustomContext`) => `Promisable`\<typeof `process.argv`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](util.md#executioncontext) = [`ExecutionContext`](util.md#executioncontext) |

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

[types/configure.ts:48](https://github.com/Xunnamius/black-flag/blob/8df9305/types/configure.ts#L48)

___

### ConfigureErrorHandlingEpilogue

Ƭ **ConfigureErrorHandlingEpilogue**\<`CustomContext`\>: (`meta`: \{ `error`: `unknown` ; `exitCode`: `number` ; `message`: `string`  }, `argv`: `Omit`\<`Partial`\<[`Arguments`](index.md#arguments)\>, typeof [`$executionContext`](index.md#$executioncontext)\> & \{ `[$executionContext]`: [`ExecutionContext`](util.md#executioncontext)  }, `context`: `CustomContext`) => `Promisable`\<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](util.md#executioncontext) = [`ExecutionContext`](util.md#executioncontext) |

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
| `argv` | `Omit`\<`Partial`\<[`Arguments`](index.md#arguments)\>, typeof [`$executionContext`](index.md#$executioncontext)\> & \{ `[$executionContext]`: [`ExecutionContext`](util.md#executioncontext)  } |
| `context` | `CustomContext` |

##### Returns

`Promisable`\<`void`\>

#### Defined in

[types/configure.ts:81](https://github.com/Xunnamius/black-flag/blob/8df9305/types/configure.ts#L81)

___

### ConfigureExecutionContext

Ƭ **ConfigureExecutionContext**\<`CustomContext`\>: (`context`: [`ExecutionContext`](util.md#executioncontext)) => `Promisable`\<`CustomContext`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](util.md#executioncontext) = [`ExecutionContext`](util.md#executioncontext) |

#### Type declaration

▸ (`context`): `Promisable`\<`CustomContext`\>

This function is called once towards the beginning of the execution of
`configureProgram` and should return what will become the global
[ExecutionContext](util.md#executioncontext) singleton.

Note that any errors thrown this early in the initialization process will be
thrown as-is and will NOT trigger [ConfigureErrorHandlingEpilogue](index.md#configureerrorhandlingepilogue).

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ExecutionContext`](util.md#executioncontext) |

##### Returns

`Promisable`\<`CustomContext`\>

#### Defined in

[types/configure.ts:17](https://github.com/Xunnamius/black-flag/blob/8df9305/types/configure.ts#L17)

___

### ConfigureExecutionEpilogue

Ƭ **ConfigureExecutionEpilogue**\<`CustomContext`\>: (`argv`: [`Arguments`](index.md#arguments), `context`: `CustomContext`) => `Promisable`\<[`Arguments`](index.md#arguments)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](util.md#executioncontext) = [`ExecutionContext`](util.md#executioncontext) |

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

[types/configure.ts:64](https://github.com/Xunnamius/black-flag/blob/8df9305/types/configure.ts#L64)

___

### ConfigureExecutionPrologue

Ƭ **ConfigureExecutionPrologue**\<`CustomContext`\>: (`rootPrograms`: [`Programs`](util.md#programs), `context`: `CustomContext`) => `Promisable`\<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](util.md#executioncontext) = [`ExecutionContext`](util.md#executioncontext) |

#### Type declaration

▸ (`rootPrograms`, `context`): `Promisable`\<`void`\>

This function is called once towards the end of the execution of
`configureProgram`, after all commands have been discovered but before any
have been executed, and should apply any final configurations to the programs
that constitute the command line interface.

All commands and sub-commands known to Black Flag are available in the
[ExecutionContext.commands](util.md#commands) map, which can be accessed from the
`context` parameter or from the [Arguments](index.md#arguments) object returned by
`Program::parseAsync` et al.

This function is the complement of [ConfigureExecutionEpilogue](index.md#configureexecutionepilogue).

Note that any errors thrown this early in the initialization process will be
thrown as-is and will NOT trigger [ConfigureErrorHandlingEpilogue](index.md#configureerrorhandlingepilogue).

##### Parameters

| Name | Type |
| :------ | :------ |
| `rootPrograms` | [`Programs`](util.md#programs) |
| `context` | `CustomContext` |

##### Returns

`Promisable`\<`void`\>

#### Defined in

[types/configure.ts:37](https://github.com/Xunnamius/black-flag/blob/8df9305/types/configure.ts#L37)

___

### ImportedConfigurationModule

Ƭ **ImportedConfigurationModule**\<`CustomCliArguments`\>: (`context`: [`ExecutionContext`](util.md#executioncontext)) => `Promisable`\<`Partial`\<[`RootConfiguration`](index.md#rootconfiguration)\<`CustomCliArguments`\> \| [`ParentConfiguration`](index.md#parentconfiguration)\<`CustomCliArguments`\> \| [`ChildConfiguration`](index.md#childconfiguration)\<`CustomCliArguments`\>\>\> \| `Partial`\<[`RootConfiguration`](index.md#rootconfiguration)\<`CustomCliArguments`\> \| [`ParentConfiguration`](index.md#parentconfiguration)\<`CustomCliArguments`\> \| [`ChildConfiguration`](index.md#childconfiguration)\<`CustomCliArguments`\>\> & \{ `__esModule?`: ``false`` ; `default?`: [`ImportedConfigurationModule`](index.md#importedconfigurationmodule)\<`CustomCliArguments`\>  } \| \{ `__esModule`: ``true``  }

Represents a Configuration object imported from a CJS/ESM module external to
the CLI framework (e.g. importing an auto-discovered config module from a
file).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Defined in

[types/module.ts:162](https://github.com/Xunnamius/black-flag/blob/8df9305/types/module.ts#L162)

___

### NullArguments

Ƭ **NullArguments**: \{ `$0`: ``"<NullArguments: no parse result available due to exception>"`` ; `_`: []  } & [`FrameworkArguments`](util.md#frameworkarguments)

Represents an empty or "null" `Arguments` object devoid of useful data.

This result type is fed to certain configuration hooks and returned by
various `Arguments`-returning functions when an exceptional event prevents
yargs from returning a real `Arguments` parse result.

#### Defined in

[types/program.ts:29](https://github.com/Xunnamius/black-flag/blob/8df9305/types/program.ts#L29)

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

[types/module.ts:144](https://github.com/Xunnamius/black-flag/blob/8df9305/types/module.ts#L144)

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

[types/module.ts:135](https://github.com/Xunnamius/black-flag/blob/8df9305/types/module.ts#L135)

## Variables

### $executionContext

• `Const` **$executionContext**: typeof [`$executionContext`](index.md#$executioncontext)

A symbol allowing access to the `ExecutionContext` object "hidden" within
each `Arguments` instance.

#### Defined in

[src/constant.ts:5](https://github.com/Xunnamius/black-flag/blob/8df9305/src/constant.ts#L5)

## Functions

### configureProgram

▸ **configureProgram**\<`CustomContext`\>(`commandModulePath`, `configurationHooks?`): `Promise`\<[`PreExecutionContext`](util.md#preexecutioncontext)\>

Create and return a [PreExecutionContext](util.md#preexecutioncontext) containing fully-configured
[Program](util.md#program) instances and an [Executor](util.md#executor) entry point function.

Command auto-discovery will occur at `commandModulePath`. An exception will
occur if no commands are loadable from the given `commandModulePath`.

**This function throws whenever an exception occurs**, making it not ideal as
an entry point for a CLI. See [runProgram](index.md#runprogram) for a wrapper function that
handles exceptions and sets the exit code for you.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomContext` | extends [`ExecutionContext`](util.md#executioncontext) = [`ExecutionContext`](util.md#executioncontext) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandModulePath` | `string` |
| `configurationHooks?` | `Promisable`\<[`ConfigurationHooks`](index.md#configurationhooks)\> |

#### Returns

`Promise`\<[`PreExecutionContext`](util.md#preexecutioncontext)\>

#### Defined in

[src/index.ts:59](https://github.com/Xunnamius/black-flag/blob/8df9305/src/index.ts#L59)

___

### isCliError

▸ **isCliError**(`parameter`): parameter is CliError

Type guard for [CliError](../classes/index.CliError.md).

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameter` | `unknown` |

#### Returns

parameter is CliError

#### Defined in

[src/error.ts:25](https://github.com/Xunnamius/black-flag/blob/8df9305/src/error.ts#L25)

___

### isGracefulEarlyExitError

▸ **isGracefulEarlyExitError**(`parameter`): parameter is GracefulEarlyExitError

Type guard for [GracefulEarlyExitError](../classes/index.GracefulEarlyExitError.md).

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameter` | `unknown` |

#### Returns

parameter is GracefulEarlyExitError

#### Defined in

[src/error.ts:38](https://github.com/Xunnamius/black-flag/blob/8df9305/src/error.ts#L38)

___

### runProgram

▸ **runProgram**\<`CustomCliArguments`\>(`...args`): `Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the dynamically imported
`configureProgram(commandModulePath).execute()` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string] |

#### Returns

`Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

#### Defined in

[src/util.ts:172](https://github.com/Xunnamius/black-flag/blob/8df9305/src/util.ts#L172)

▸ **runProgram**\<`CustomCliArguments`\>(`...args`): `Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the dynamically imported `configureProgram(commandModulePath,
configurationHooks).execute()` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, configurationHooks: Promisable\<ConfigurationHooks\>] |

#### Returns

`Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

#### Defined in

[src/util.ts:193](https://github.com/Xunnamius/black-flag/blob/8df9305/src/util.ts#L193)

▸ **runProgram**\<`CustomCliArguments`\>(`...args`): `Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the `preExecutionContext.execute()` function.

**WARNING: reusing the same `preExecutionContext` with multiple invocations
of `runProgram` will cause successive invocations to fail.** This is because
yargs does not support calling `yargs::parseAsync` more than once. If this is
unacceptable, do not pass `runProgram` a `preExecutionContext` property.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, preExecutionContext: Promisable\<PreExecutionContext\>] |

#### Returns

`Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\> \| `undefined`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

#### Defined in

[src/util.ts:214](https://github.com/Xunnamius/black-flag/blob/8df9305/src/util.ts#L214)

▸ **runProgram**\<`CustomCliArguments`\>(`...args`): `Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

Invokes the dynamically imported
`configureProgram(commandModulePath).execute(argv)` function. If `argv` is a
string, `argv = argv.split(' ')` is applied first.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, argv: string \| string[]] |

#### Returns

`Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

#### Defined in

[src/util.ts:238](https://github.com/Xunnamius/black-flag/blob/8df9305/src/util.ts#L238)

▸ **runProgram**\<`CustomCliArguments`\>(`...args`): `Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

Invokes the dynamically imported `configureProgram(commandModulePath,
configurationHooks).execute(argv)` function. If `argv` is a string, `argv =
argv.split(' ')` is applied first.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, argv: string \| string[], configurationHooks: Promisable\<ConfigurationHooks\>] |

#### Returns

`Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

#### Defined in

[src/util.ts:260](https://github.com/Xunnamius/black-flag/blob/8df9305/src/util.ts#L260)

▸ **runProgram**\<`CustomCliArguments`\>(`...args`): `Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

Invokes the `preExecutionContext.execute(argv)` function. If `argv` is a
string, `argv = argv.split(' ')` is applied first.

**WARNING: reusing the same `preExecutionContext` with multiple invocations
of `runProgram` will cause successive invocations to fail.** This is because
yargs does not support calling `yargs::parseAsync` more than once. If this is
unacceptable, do not pass `runProgram` a `preExecutionContext` property.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomCliArguments` | extends `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [commandModulePath: string, argv: string \| string[], preExecutionContext: Promisable\<PreExecutionContext\>] |

#### Returns

`Promise`\<[`NullArguments`](index.md#nullarguments) \| [`Arguments`](index.md#arguments)\<`CustomCliArguments`\>\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

#### Defined in

[src/util.ts:286](https://github.com/Xunnamius/black-flag/blob/8df9305/src/util.ts#L286)
