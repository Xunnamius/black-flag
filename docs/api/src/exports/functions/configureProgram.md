[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / configureProgram

# Function: configureProgram()

> **configureProgram**(`commandModulePath`, `configurationHooks`?): `Promise`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>

Defined in: [src/index.ts:113](https://github.com/Xunnamius/black-flag/blob/a0f00d5a2809e5f4f75ecb90bce738d38590143c/src/index.ts#L113)

Create and return a [PreExecutionContext](../util/type-aliases/PreExecutionContext.md) containing fully-configured
[Program](../util/type-aliases/Program.md) instances and an [Executor](../util/type-aliases/Executor.md) entry point function.

Command auto-discovery will occur at `commandModulePath`. An exception will
occur if no commands are loadable from the given `commandModulePath`.

**This function throws whenever an exception occurs**, making it not ideal as
an entry point for a CLI, but perhaps useful during testing. See
[runProgram](runProgram.md) for a wrapper function that handles exceptions and sets
the exit code automatically.

## Parameters

### commandModulePath

`string`

Command auto-discovery will occur at `commandModulePath`. An exception will
occur if no commands are loadable from the given `commandModulePath`.

`'file://...'`-style URLs are also accepted.

### configurationHooks?

`Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>

## Returns

`Promise`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>
