[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / Program

# Type Alias: Program\<CustomCliArguments, CustomExecutionContext\>

> **Program**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Omit`\<`_Program`\<[`FrameworkArguments`](FrameworkArguments.md)\<`CustomExecutionContext`\> & `CustomCliArguments`\>, `"command"` \| `"onFinishCommand"` \| `"showHelpOnFail"` \| `"version"` \| `"help"` \| `"exitProcess"` \| `"commandDir"` \| `"parse"` \| `"parsed"` \| `"parseSync"` \| `"argv"`\> & `object`

Defined in: [src/types/program.ts:55](https://github.com/Xunnamius/black-flag/blob/d6004b46e3ac5a451e4e0f05bf5c8726ce157ac9/src/types/program.ts#L55)

Represents a pre-configured yargs instance ready for argument parsing and
execution.

`Program` is essentially a drop-in replacement for the `Argv` type exported
by yargs but with several differences and should be preferred.

## Type declaration

### showHelpOnFail()

> **showHelpOnFail**: (`configuration`) => `Program`\<`CustomCliArguments`, `CustomExecutionContext`\>

Similar in intent to `yargs::showHelpOnFail` except (1) it has no second
`message` parameter, (2) it determines if the "full" or "short" help text
is shown by default, (3) it determines if help text is shown when executing
an unimplemented parent command, and (4) it determines on which kinds of
errors help text is output (by default).

If you want to configure how error messages are communicated to the user,
or otherwise output some specific error message instead, use the
`configureErrorHandlingEpilogue` configuration hook.

As this method is just sugar around manipulating
[ExecutionContext.state.showHelpOnFail](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md#showhelponfail),
invoking this method will affect _all programs in your command hierarchy_,
not just the program on which it was invoked.

#### Parameters

##### configuration

[`ExecutionContext`](ExecutionContext.md)\[`"state"`\]\[`"showHelpOnFail"`\]

#### Returns

`Program`\<`CustomCliArguments`, `CustomExecutionContext`\>

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
