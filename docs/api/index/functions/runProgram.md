[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / runProgram

# Function: runProgram()

## runProgram(args)

> **runProgram**\<`CustomCliArguments`\>(...`args`): `Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the dynamically imported
`configureProgram(commandModulePath).execute()` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

• ...**args**: [`string`]

### Returns

`Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\> \| `undefined`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

### Defined in

[src/util.ts:173](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/util.ts#L173)

## runProgram(args)

> **runProgram**\<`CustomCliArguments`\>(...`args`): `Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the dynamically imported `configureProgram(commandModulePath,
configurationHooks).execute()` function.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

• ...**args**: [`string`, `Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>]

### Returns

`Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\> \| `undefined`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

### Defined in

[src/util.ts:194](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/util.ts#L194)

## runProgram(args)

> **runProgram**\<`CustomCliArguments`\>(...`args`): `Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\> \| `undefined`\>

Invokes the `preExecutionContext.execute()` function.

**WARNING: reusing the same `preExecutionContext` with multiple invocations
of `runProgram` will cause successive invocations to fail.** This is because
yargs does not support calling `yargs::parseAsync` more than once. If this is
unacceptable, do not pass `runProgram` a `preExecutionContext` property.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

• ...**args**: [`string`, `Promisable`\<[`PreExecutionContext`](../../util/type-aliases/PreExecutionContext.md)\>]

### Returns

`Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\> \| `undefined`\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

### Defined in

[src/util.ts:215](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/util.ts#L215)

## runProgram(args)

> **runProgram**\<`CustomCliArguments`\>(...`args`): `Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\>\>

Invokes the dynamically imported
`configureProgram(commandModulePath).execute(argv)` function. If `argv` is a
string, `argv = argv.split(' ')` is applied first.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

• ...**args**: [`string`, `string` \| `string`[]]

### Returns

`Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\>\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

### Defined in

[src/util.ts:239](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/util.ts#L239)

## runProgram(args)

> **runProgram**\<`CustomCliArguments`\>(...`args`): `Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\>\>

Invokes the dynamically imported `configureProgram(commandModulePath,
configurationHooks).execute(argv)` function. If `argv` is a string, `argv =
argv.split(' ')` is applied first.

This function is suitable for a CLI entry point since it will **never throw
or reject no matter what.** Instead, when an error is caught,
`process.exitCode` is set to the appropriate value and either `NullArguments`
(only if `GracefulEarlyExitError` was thrown) or `undefined` is returned.

Note: It is always safe to invoke this form of `runProgram` as many times as
desired.

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

• ...**args**: [`string`, `string` \| `string`[], `Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>]

### Returns

`Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\>\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

### Defined in

[src/util.ts:261](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/util.ts#L261)

## runProgram(args)

> **runProgram**\<`CustomCliArguments`\>(...`args`): `Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\>\>

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

### Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Parameters

• ...**args**: [`string`, `string` \| `string`[], `Promisable`\<[`PreExecutionContext`](../../util/type-aliases/PreExecutionContext.md)\>]

### Returns

`Promise`\<[`NullArguments`](../type-aliases/NullArguments.md) \| [`Arguments`](../type-aliases/Arguments.md)\<`CustomCliArguments`\>\>

`NullArguments` if `GracefulEarlyExitError` is thrown, `undefined`
if any other error occurs, or `Arguments` otherwise.

### Defined in

[src/util.ts:287](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/src/util.ts#L287)
