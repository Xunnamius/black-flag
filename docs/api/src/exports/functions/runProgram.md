[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / runProgram

# Function: runProgram()

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulesPath`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:668](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/index.ts#L668)

Invokes the dynamically imported
`configureProgram(commandModulesPath).execute()` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an exception occurs,
`process.exitCode` is set to the appropriate value, the
[ConfigureErrorHandlingEpilogue](../type-aliases/ConfigureErrorHandlingEpilogue.md) hook is triggered, and either
`NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

#### commandModulesPath

`string`

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulesPath`, `configurationHooks`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:688](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/index.ts#L688)

Invokes the dynamically imported `configureProgram(commandModulesPath,
configurationHooks).execute()` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an exception occurs,
`process.exitCode` is set to the appropriate value, the
[ConfigureErrorHandlingEpilogue](../type-aliases/ConfigureErrorHandlingEpilogue.md) hook is triggered, and either
`NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

#### commandModulesPath

`string`

#### configurationHooks

`Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulesPath`, `preExecutionContext`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:712](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/index.ts#L712)

Invokes the `preExecutionContext.execute()` function.

**WARNING: reusing the same `preExecutionContext` with multiple invocations
of `runProgram` will cause successive invocations to fail.** This is because
yargs does not support calling `yargs::parseAsync` more than once. If this is
unacceptable, do not pass `runProgram` a `preExecutionContext` property.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an exception occurs,
`process.exitCode` is set to the appropriate value, the
[ConfigureErrorHandlingEpilogue](../type-aliases/ConfigureErrorHandlingEpilogue.md) hook is triggered, and either
`NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
is returned.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

#### commandModulesPath

`string`

#### preExecutionContext

`Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulesPath`, `argv`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:736](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/index.ts#L736)

Invokes the dynamically imported
`configureProgram(commandModulesPath).execute(argv)` function. If `argv` is a
string, `argv = argv.split(' ')` is applied first.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an exception occurs,
`process.exitCode` is set to the appropriate value, the
[ConfigureErrorHandlingEpilogue](../type-aliases/ConfigureErrorHandlingEpilogue.md) hook is triggered, and either
`NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

#### commandModulesPath

`string`

#### argv

`string` | `string`[]

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulesPath`, `argv`, `configurationHooks`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:760](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/index.ts#L760)

Invokes the dynamically imported `configureProgram(commandModulesPath,
configurationHooks).execute(argv)` function. If `argv` is a string, `argv =
argv.split(' ')` is applied first.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an exception occurs,
`process.exitCode` is set to the appropriate value, the
[ConfigureErrorHandlingEpilogue](../type-aliases/ConfigureErrorHandlingEpilogue.md) hook is triggered, and either
`NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

#### commandModulesPath

`string`

#### argv

`string` | `string`[]

#### configurationHooks

`Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulesPath`, `argv`, `preExecutionContext`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:786](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/index.ts#L786)

Invokes the `preExecutionContext.execute(argv)` function. If `argv` is a
string, `argv = argv.split(' ')` is applied first.

**WARNING: reusing the same `preExecutionContext` with multiple invocations
of `runProgram` will cause successive invocations to fail.** This is because
yargs does not support calling `yargs::parseAsync` more than once. If this is
unacceptable, do not pass `runProgram` a `preExecutionContext` property.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an exception occurs,
`process.exitCode` is set to the appropriate value, the
[ConfigureErrorHandlingEpilogue](../type-aliases/ConfigureErrorHandlingEpilogue.md) hook is triggered, and either
`NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
is returned.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

#### commandModulesPath

`string`

#### argv

`string` | `string`[]

#### preExecutionContext

`Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(...`args`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:806](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/index.ts#L806)

Run the given program with the configuration given in `args`.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an exception occurs,
`process.exitCode` is set to the appropriate value, the
[ConfigureErrorHandlingEpilogue](../type-aliases/ConfigureErrorHandlingEpilogue.md) hook is triggered, and either
`NullArguments` (only if `GracefulEarlyExitError` was thrown) or `undefined`
is returned.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

#### args

...[`RunProgramParameters`](../type-aliases/RunProgramParameters.md)

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.
