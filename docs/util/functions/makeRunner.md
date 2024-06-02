[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / makeRunner

# Function: makeRunner()

> **makeRunner**\<`CustomCliArguments`\>(`options`): \<`T`\>(...`args`) => `Promise`\<[`NullArguments`](../../index/type-aliases/NullArguments.md) \| [`Arguments`](../../index/type-aliases/Arguments.md)\<`CustomCliArguments`\>\>

A high-order factory function that returns a "low-order" [runProgram](../../index/functions/runProgram.md)
function that can be called multiple times while only having to provide a
subset of the required parameters at initialization.

This is useful when unit/integration testing your CLI, which will likely
require multiple calls to `runProgram(...)`.

Note: when an exception (e.g. bad arguments) occurs in the low-order
function, `undefined` will be returned if `configureProgram` threw or
`NullArguments` if `execute` threw. Otherwise, upon success, `Arguments` is
returned as expected. That is: **the promise returned by the low-order
function will never reject and no exception will ever be thrown.** Keep this
in mind when writing your unit tests and see [runProgram](../../index/functions/runProgram.md) for more
details.

## Type parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Parameters

• **options**: `object` & `object` \| `object`

## Returns

`Function`

### Type parameters

• **T** *extends* [`string`] \| [`string`, `Promisable`\<[`ConfigurationHooks`](../../index/type-aliases/ConfigurationHooks.md)\>] \| [`string`, `Promisable`\<[`PreExecutionContext`](../type-aliases/PreExecutionContext.md)\>] \| [`string`, `string` \| `string`[]] \| [`string`, `string` \| `string`[], `Promisable`\<[`ConfigurationHooks`](../../index/type-aliases/ConfigurationHooks.md)\>] \| [`string`, `string` \| `string`[], `Promisable`\<[`PreExecutionContext`](../type-aliases/PreExecutionContext.md)\>]

### Parameters

• ...**args**: `T` *extends* [`_`, `...Tail[]`] ? `Tail` : []

### Returns

`Promise`\<[`NullArguments`](../../index/type-aliases/NullArguments.md) \| [`Arguments`](../../index/type-aliases/Arguments.md)\<`CustomCliArguments`\>\>

## Source

[src/util.ts:50](https://github.com/Xunnamius/black-flag/blob/35f66cc9d69f8434d03db49f067b4f7e03d4c58c/src/util.ts#L50)
