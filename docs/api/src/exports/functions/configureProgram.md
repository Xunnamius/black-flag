[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / configureProgram

# Function: configureProgram()

> **configureProgram**(`commandModulesPath`, `configurationHooks`?): `Promise`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>

Defined in: [src/index.ts:190](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/index.ts#L190)

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

`Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>

## Returns

`Promise`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>
