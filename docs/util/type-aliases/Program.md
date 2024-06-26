[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / Program

# Type Alias: Program\<CustomCliArguments, CustomExecutionContext\>

> **Program**\<`CustomCliArguments`, `CustomExecutionContext`\>: `Omit`\<`_Program`\<[`FrameworkArguments`](FrameworkArguments.md)\<`CustomExecutionContext`\> & `CustomCliArguments`\>, `"command"` \| `"onFinishCommand"` \| `"showHelpOnFail"` \| `"version"` \| `"help"` \| `"exitProcess"` \| `"commandDir"` \| `"parse"` \| `"parsed"` \| `"parseSync"` \| `"argv"`\> & `object`

Represents a pre-configured yargs instance ready for argument parsing and
execution.

`Program` is essentially a drop-in replacement for the `Argv` type exported
by yargs but with several differences and should be preferred.

## Type declaration

### command()

> **command**: (`command`, `description`, `builder`, `handler`, `middlewares`, `deprecated`) => [`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

**`Internal`**

#### See

_Program.command

#### Parameters

• **command**: `string`[]

• **description**: `string` \| `false`

• **builder**: (`yargs`, `helpOrVersionSet`) => `Argv`\<`object`\> \| `Record`\<`string`, `never`\>

• **handler**

• **middlewares**: []

• **deprecated**: `string` \| `boolean`

#### Returns

[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

### command\_deferred

> **command\_deferred**: [`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\[`"command"`\]

**`Internal`**

Identical to `yargs::command` except its execution is enqueued and
deferred until Program.command_finalize_deferred is called.

#### See

_Program.command

### command\_finalize\_deferred()

> **command\_finalize\_deferred**: () => `void`

**`Internal`**

#### See

Program.command_deferred

#### Returns

`void`

### showHelpOnFail()

> **showHelpOnFail**: (`enabled`) => [`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

Like `yargs::showHelpOnFail` except (1) it also determines if help text is
shown when executing an unimplemented parent command and (2) it has no
second `message` parameter. If you want to output some specific error
message, use a configuration hook or `yargs::epilogue`.

Invoking this method will affect all programs in your command hierarchy,
not just the program on which it was invoked.

#### See

_Program.showHelpOnFail

#### Parameters

• **enabled**: `boolean`

#### Returns

[`Program`](Program.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Defined in

[types/program.ts:44](https://github.com/Xunnamius/black-flag/blob/cdc6af55387aac92b7d9fc16a57790068e4b6d49/types/program.ts#L44)
