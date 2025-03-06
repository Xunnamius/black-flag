[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / runProgram

# Function: runProgram()

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulePath`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:662](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/index.ts#L662)

Invokes the dynamically imported
`configureProgram(commandModulePath).execute()` function.

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

#### commandModulePath

`string`

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulePath`, `configurationHooks`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:682](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/index.ts#L682)

Invokes the dynamically imported `configureProgram(commandModulePath,
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

#### commandModulePath

`string`

#### configurationHooks

`Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulePath`, `preExecutionContext`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:706](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/index.ts#L706)

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

#### commandModulePath

`string`

#### preExecutionContext

`Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulePath`, `argv`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:730](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/index.ts#L730)

Invokes the dynamically imported
`configureProgram(commandModulePath).execute(argv)` function. If `argv` is a
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

#### commandModulePath

`string`

#### argv

`string` | `string`[]

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(`commandModulePath`, `argv`, `configurationHooks`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:754](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/index.ts#L754)

Invokes the dynamically imported `configureProgram(commandModulePath,
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

#### commandModulePath

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

> **runProgram**\<`CustomCliArguments`\>(`commandModulePath`, `argv`, `preExecutionContext`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:780](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/index.ts#L780)

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

#### commandModulePath

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

Defined in: [src/index.ts:800](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/index.ts#L800)

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
