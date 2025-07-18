[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / configureProgram

# Function: configureProgram()

> **configureProgram**(`commandModulesPath`, `configurationHooks?`): `Promise`\<[`PreExecutionContext`](../util/type-aliases/PreExecutionContext.md)\>

Defined in: [src/index.ts:201](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/index.ts#L201)

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
