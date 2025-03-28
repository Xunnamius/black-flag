[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / Program

# Type Alias: Program\<CustomCliArguments, CustomExecutionContext\>

> **Program**\<`CustomCliArguments`, `CustomExecutionContext`\> = `Omit`\<`_Program`\<[`FrameworkArguments`](FrameworkArguments.md)\<`CustomExecutionContext`\> & `CustomCliArguments`\>, `"command"` \| `"onFinishCommand"` \| `"showHelpOnFail"` \| `"version"` \| `"help"` \| `"exitProcess"` \| `"commandDir"` \| `"parse"` \| `"parsed"` \| `"parseSync"` \| `"argv"`\> & `object`

Defined in: [src/types/program.ts:55](https://github.com/Xunnamius/black-flag/blob/d52d6ef8a8da5a82b265a7ff9d65b74350896d3b/src/types/program.ts#L55)

Represents a pre-configured yargs instance ready for argument parsing and
execution.

`Program` is essentially a drop-in replacement for the `Argv` type exported
by yargs but with several differences and should be preferred.

## Type declaration

### showHelpOnFail()

> **showHelpOnFail**: (`enabled`) => `Program`\<`CustomCliArguments`, `CustomExecutionContext`\>

Like `yargs::showHelpOnFail` except (1) it determines if the "full" or
"short" help text is shown by default, (2) it determines if help text is
shown when executing an unimplemented parent command, and (3) it has no
second `message` parameter.

If you want to output some specific error message instead, use a
configuration hook or `yargs::epilogue`.

Invoking this method will affect all programs in your command hierarchy,
not just the program on which it was invoked.

#### Parameters

##### enabled

[`ExecutionContext`](ExecutionContext.md)\[`"state"`\]\[`"showHelpOnFail"`\]

#### Returns

`Program`\<`CustomCliArguments`, `CustomExecutionContext`\>

#### See

https://yargs.js.org/docs/#api-reference-showhelponfailenable-message

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
