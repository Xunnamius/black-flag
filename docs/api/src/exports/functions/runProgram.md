[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / runProgram

# Function: runProgram()

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(...`args`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:649](https://github.com/Xunnamius/black-flag/blob/a0f00d5a2809e5f4f75ecb90bce738d38590143c/src/index.ts#L649)

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

#### args

...\[`string`\]

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(...`args`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:669](https://github.com/Xunnamius/black-flag/blob/a0f00d5a2809e5f4f75ecb90bce738d38590143c/src/index.ts#L669)

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

#### args

...\[`string`, `Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>\]

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(...`args`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:695](https://github.com/Xunnamius/black-flag/blob/a0f00d5a2809e5f4f75ecb90bce738d38590143c/src/index.ts#L695)

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

#### args

...\[`string`, `Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>\]

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(...`args`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:721](https://github.com/Xunnamius/black-flag/blob/a0f00d5a2809e5f4f75ecb90bce738d38590143c/src/index.ts#L721)

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

#### args

...\[`string`, `string` \| `string`[]\]

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(...`args`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:744](https://github.com/Xunnamius/black-flag/blob/a0f00d5a2809e5f4f75ecb90bce738d38590143c/src/index.ts#L744)

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

#### args

...\[`string`, `string` \| `string`[], `Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>\]

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(...`args`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:772](https://github.com/Xunnamius/black-flag/blob/a0f00d5a2809e5f4f75ecb90bce738d38590143c/src/index.ts#L772)

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

#### args

...\[`string`, `string` \| `string`[], `Promisable`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>\]

### Returns

[`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other exception occurs, or `Arguments` otherwise.

## Call Signature

> **runProgram**\<`CustomCliArguments`\>(...`args`): [`RunProgramReturnType`](../type-aliases/RunProgramReturnType.md)\<`CustomCliArguments`\>

Defined in: [src/index.ts:794](https://github.com/Xunnamius/black-flag/blob/a0f00d5a2809e5f4f75ecb90bce738d38590143c/src/index.ts#L794)

Run the given program with the given configuration.

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
