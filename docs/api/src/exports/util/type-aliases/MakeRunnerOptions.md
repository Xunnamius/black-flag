[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / MakeRunnerOptions

# Type Alias: MakeRunnerOptions

> **MakeRunnerOptions**: `object` & \{ `configurationHooks`: `Promisable`\<[`ConfigurationHooks`](../../type-aliases/ConfigurationHooks.md)\>; `preExecutionContext`: `undefined`; \} \| \{ `configurationHooks`: `undefined`; `preExecutionContext`: `Promisable`\<[`PreExecutionContext`](PreExecutionContext.md)\>; \}

Defined in: [src/index.ts:112](https://github.com/Xunnamius/black-flag/blob/40d21584fb01de3f46f2fedf60011594304c55d4/src/index.ts#L112)

The options accepted by the [makeRunner](../functions/makeRunner.md) function.

## Type declaration

### commandModulesPath

> **commandModulesPath**: `string`

#### See

[runProgram](../../functions/runProgram.md)

### configurationHooks?

> `optional` **configurationHooks**: `Promisable`\<[`ConfigurationHooks`](../../type-aliases/ConfigurationHooks.md)\>

The [ConfigurationHooks](../../type-aliases/ConfigurationHooks.md) to be used by each low-order
invocation by default. Each low-order function can provide its own
[ConfigurationHooks](../../type-aliases/ConfigurationHooks.md) argument, which will be merged on top of
this option. A low-order function supplying a
[PreExecutionContext](PreExecutionContext.md) argument instead will completely override
this option.

Note: this option cannot be used with `preExecutionContext`.

#### See

[runProgram](../../functions/runProgram.md)

### errorHandlingBehavior?

> `optional` **errorHandlingBehavior**: `"default"` \| `"throw"`

This is a special option exclusive to `makeRunner` that determines how
errors will be surfaced, which can be useful during testing.

In production and during testing, Black Flag surfaces errors via
`process.stderr` (e.g. `console.error`), or whichever error handling
method was implemented in [ConfigureErrorHandlingEpilogue](../../type-aliases/ConfigureErrorHandlingEpilogue.md). This is
the default behavior, and is what end-users will see and experience.

However, by setting this option to `'throw'` instead of `'default'`,
exceptions that would normally cause [runProgram](../../functions/runProgram.md) to return
`undefined` (including framework errors) or `NullArguments` (such as
`GracefulEarlyExitError`) will instead be thrown after they are handled
by Black Flag.

**Asserting expectations against how the CLI will actually behave in
production, which is what end-users will actually experience, should be
preferred over testing against an artificially surfaced error**. However,
surfacing errors in test cases that are failing unexpectedly can be
crucial when debugging. Discretion is advised.

#### Default

```ts
'default'
```

### preExecutionContext?

> `optional` **preExecutionContext**: `Promisable`\<[`PreExecutionContext`](PreExecutionContext.md)\>

The [PreExecutionContext](PreExecutionContext.md) to be used by each low-order
invocation. Each low-order function can provide its own
[PreExecutionContext](PreExecutionContext.md) or [ConfigurationHooks](../../type-aliases/ConfigurationHooks.md) argument,
both of which which will completely override this option.

Note: this option cannot be used with `configurationHooks`.

#### See

[runProgram](../../functions/runProgram.md)
