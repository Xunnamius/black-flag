[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / Program

# Type Alias: Program\<CustomCliArguments, CustomExecutionContext\>

> **Program**\<`CustomCliArguments`, `CustomExecutionContext`\>: `Omit`\<`_Program`\<[`FrameworkArguments`](FrameworkArguments.md)\<`CustomExecutionContext`\> & `CustomCliArguments`\>, `"command"` \| `"onFinishCommand"` \| `"showHelpOnFail"` \| `"version"` \| `"help"` \| `"exitProcess"` \| `"commandDir"` \| `"parse"` \| `"parsed"` \| `"parseSync"` \| `"argv"`\> & `object`

Defined in: [src/types/program.ts:45](https://github.com/Xunnamius/black-flag/blob/41bcd587ae1e5e4c88c48238363c70e315cd242a/src/types/program.ts#L45)

Represents a pre-configured yargs instance ready for argument parsing and
execution.

`Program` is essentially a drop-in replacement for the `Argv` type exported
by yargs but with several differences and should be preferred.

## Type declaration

### showHelpOnFail()

> **showHelpOnFail**: (`enabled`) => [`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Like `yargs::showHelpOnFail` except (1) it also determines if help text is
shown when executing an unimplemented parent command and (2) it has no
second `message` parameter. If you want to output some specific error
message, use a configuration hook or `yargs::epilogue`.

Invoking this method will affect all programs in your command hierarchy,
not just the program on which it was invoked.

#### Parameters

##### enabled

`boolean`

#### Returns

[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

#### See

https://yargs.js.org/docs/#api-reference-showhelponfailenable-message

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
