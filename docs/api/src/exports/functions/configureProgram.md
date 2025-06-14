[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / configureProgram

# Function: configureProgram()

> **configureProgram**(`commandModulesPath`, `configurationHooks?`): `Promise`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>

Defined in: [src/index.ts:202](https://github.com/Xunnamius/black-flag/blob/b4a32322c214182f04aaa04d9c05f164415f17c8/src/index.ts#L202)

Create and return a [PreExecutionContext](../util/type-aliases/PreExecutionContext.md) containing fully-configured
[Program](../util/type-aliases/Program.md) instances and an [Executor](../util/type-aliases/Executor.md) entry point function.

Command auto-discovery will occur at `commandModulesPath`. An exception will
occur if no commands are loadable from the given `commandModulesPath`.

**This function throws whenever an exception occurs**, making it not ideal as
an entry point for a CLI, but perhaps useful during testing. See
[runProgram](runProgram.md) for a wrapper function that handles exceptions and sets
the exit code automatically.

## Parameters

### commandModulesPath

`string`

Command auto-discovery will occur at `commandModulesPath`. An exception will
occur if no commands are loadable from the given `commandModulesPath`.

`'file://...'`-style URLs are also accepted.

### configurationHooks?

`Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\<`any`\>\>

## Returns

`Promise`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>
