[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / configureProgram

# Function: configureProgram()

> **configureProgram**\<`CustomContext`\>(`commandModulePath`, `configurationHooks`?): `Promise`\<[`PreExecutionContext`](../../util/type-aliases/PreExecutionContext.md)\>

Create and return a [PreExecutionContext](../../util/type-aliases/PreExecutionContext.md) containing fully-configured
[Program](../../util/type-aliases/Program.md) instances and an [Executor](../../util/type-aliases/Executor.md) entry point function.

Command auto-discovery will occur at `commandModulePath`. An exception will
occur if no commands are loadable from the given `commandModulePath`.

**This function throws whenever an exception occurs**, making it not ideal as
an entry point for a CLI. See [runProgram](runProgram.md) for a wrapper function that
handles exceptions and sets the exit code for you.

## Type parameters

• **CustomContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Parameters

• **commandModulePath**: `string`

Command auto-discovery will occur at `commandModulePath`. An exception will
occur if no commands are loadable from the given `commandModulePath`.

`'file://...'`-style URLs are also accepted.

• **configurationHooks?**: `Promisable`\<[`ConfigurationHooks`](../type-aliases/ConfigurationHooks.md)\>

## Returns

`Promise`\<[`PreExecutionContext`](../../util/type-aliases/PreExecutionContext.md)\>

## Source

[src/index.ts:59](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/src/index.ts#L59)
