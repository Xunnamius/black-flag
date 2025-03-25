[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / ExecutionContext

# Type Alias: ExecutionContext

> **ExecutionContext** = `object`

Defined in: [src/types/program.ts:342](https://github.com/Xunnamius/black-flag/blob/f3086f07a0f4cf661850599e370f220c47febbd1/src/types/program.ts#L342)

Represents a globally-accessible shared context object singleton.

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### commands

> **commands**: `Map`\<`string`, \{ `metadata`: [`ProgramMetadata`](ProgramMetadata.md); `programs`: [`Programs`](Programs.md); \}\>

Defined in: [src/types/program.ts:357](https://github.com/Xunnamius/black-flag/blob/f3086f07a0f4cf661850599e370f220c47febbd1/src/types/program.ts#L357)

A Map consisting of auto-discovered [Program](Program.md) instances and their
associated [ProgramMetadata](ProgramMetadata.md) as singular object values with their
respective _full names_ as keys.

Note that the insertion order of these entries is for all intents and
purposes non-deterministic with the exception of the first entry, which
will always be the root command. This is because Black Flag inserts entries
as they are encountered while walking the filesystem. **This means you can
NEVER rely on insertion order remaining consistent between OSes,
filesystems, or even Node.js versions.**

This property is used internally by Black Flag.

***

### debug

> **debug**: `ExtendedDebugger`

Defined in: [src/types/program.ts:363](https://github.com/Xunnamius/black-flag/blob/f3086f07a0f4cf661850599e370f220c47febbd1/src/types/program.ts#L363)

The `ExtendedDebugger` for the current runtime level.

This property is used internally by Black Flag.

***

### state

> **state**: `object`

Defined in: [src/types/program.ts:369](https://github.com/Xunnamius/black-flag/blob/f3086f07a0f4cf661850599e370f220c47febbd1/src/types/program.ts#L369)

The current state of the execution environment.

This property is used internally by Black Flag.

#### Index Signature

\[`key`: `string`\]: `unknown`

#### deepestParseResult

> **deepestParseResult**: [`Arguments`](../../type-aliases/Arguments.md) \| `undefined`

Stores the result of the latest call to `EffectorProgram::parseAsync`.

This is necessary because, with our depth-first multi-yargs architecture,
the parse job done by shallower programs in the chain must not mutate the
result of the deepest call to `EffectorProgram::parseAsync` in the
execution chain.

Note: this property should not be relied upon or mutated by
end-developers.

##### Default

```ts
undefined
```

#### didAlreadyHandleError

> **didAlreadyHandleError**: `boolean`

If `true`, Black Flag already handled whatever error has made its way to
the highest error handling layer (typically through the
`configureErrorHandlingEpilogue` hook).

Otherwise, if the error is unhandled by the time this property is
checked, a framework error will occur.

This property is ignored when no error has occurred.

#### didOutputHelpOrVersionText

> **didOutputHelpOrVersionText**: `boolean`

If `true`, Black Flag sent either help or version text to stdout or
stderr.

##### Default

```ts
false
```

#### finalError

> **finalError**: `unknown`

Contains the final error that will be communicated to the user, if
defined. Ideally we wouldn't have to track this and we could just rely on
yargs's exception handling plumbing, but there are trap doors where yargs
will simply swallow errors and do other weird stuff.

Instead of trying to deal with all that, we'll just handle it ourselves.

This property is also leveraged by `makeRunner`'s `errorHandlingBehavior`
option.

##### Default

```ts
undefined
```

#### firstPassArgv

> **firstPassArgv**: [`Arguments`](../../type-aliases/Arguments.md) \| `undefined`

Allows helper and effector programs to keep track of prepared arguments.

Note: this property should not be relied upon or mutated by
end-developers.

##### Default

```ts
undefined
```

#### globalHelpOption

> **globalHelpOption**: \{ `description`: `string`; `name`: `string`; \} \| `undefined`

`globalHelpOption` replaces the functionality of the disabled vanilla
yargs `yargs::help` method. Set this to the value you want using the
`configureExecutionContext` configuration hook (any other hook is run too
late).

Alternatively, set `globalHelpOption = undefined` to disable the built-in
`--help` flag (or the equivalent) on the root command.

Note: this property should not be relied upon or mutated by
end-developers _outside of the `configureExecutionContext` configuration
hook_. Doing so will result in undefined behavior.

##### Type declaration

\{ `description`: `string`; `name`: `string`; \}

`undefined`

#### globalVersionOption

> **globalVersionOption**: \{ `description`: `string`; `name`: `string`; `text`: `string`; \} \| `undefined`

`globalVersionOption` replaces the functionality of the disabled vanilla
yargs `yargs::version` method. Set this to the value you want using the
`configureExecutionContext` configuration hook (any other hook is run too
late).

Alternatively, set `globalVersionOption = undefined` to disable the
built-in `--version` flag on the root command.

Note: this property should not be relied upon or mutated by
end-developers _outside of the `configureExecutionContext` configuration
hook_. Doing so will result in undefined behavior.

##### Type declaration

\{ `description`: `string`; `name`: `string`; `text`: `string`; \}

`undefined`

#### initialTerminalWidth

> **initialTerminalWidth**: `number`

The detected width of the terminal. This value is determined by yargs
when `configureProgram` is called.

#### isGracefullyExiting

> **isGracefullyExiting**: `boolean`

If `true`, Black Flag is currently in the process of handling a graceful
exit.

Checking the value of this flag is useful in configuration hooks like
`configureExecutionEpilogue`, which are still executed when a
`GracefulEarlyExitError` is thrown. In almost every other context, this
will _always_ be `false`.

##### Default

```ts
false
```

#### isHandlingHelpOption

> **isHandlingHelpOption**: `boolean`

If `isHandlingHelpOption` is `true`, Black Flag is currently in the
process of getting yargs to generate help text for some command.

Checking the value of this property is useful when you want to know if
the `--help` flag (or the equivalent) was passed to the root command. The
value of `isHandlingHelpOption` is also used to determine the value of
`helpOrVersionSet` in commands' `builder` functions.

We have to track this separately from yargs since we're stacking multiple
yargs instances and they all want to be the one that handles generating
help text.

Note: setting `isHandlingHelpOption` to `true` manually via
`configureExecutionContext` will cause Black Flag to output help text as
if the user had specified the `--help` flag (or the equivalent) as one of
their arguments.

##### Default

```ts
false
```

#### isHandlingVersionOption

> **isHandlingVersionOption**: `boolean`

If `isHandlingVersionOption` is `true`, Black Flag is currently in the
process of getting yargs to generate version text for some command.

Checking the value of this property is useful when you want to know if
the `--version` flag (or the equivalent) was passed to the root command.
The value of `isHandlingVersionOption` is also used to determine the
value of `helpOrVersionSet` in commands' `builder` functions.

We have to track this separately from yargs since we're stacking multiple
yargs instances and they all want to be the one that handles generating
version text.

Note: setting `isHandlingVersionOption` to `true` manually via
`configureExecutionContext` will cause Black Flag to output version text
as if the user had specified `--version` (or the equivalent) as one of
their arguments.

##### Default

```ts
false
```

#### rawArgv

> **rawArgv**: *typeof* `process.argv`

A subset of the original argv returned by [ConfigureArguments](../../type-aliases/ConfigureArguments.md). It
is used internally to give the final command in the arguments list the
chance to parse argv. Further, it is used to enforce the ordering
invariant on chained child program invocations. That is: all arguments
that are not a valid command name must appear _after_ the last command
name in any arguments list parsed by this program.

Since it will be actively manipulated by each command in the arguments
list, **do not rely on `rawArgv` for anything other than checking
invariant satisfaction.**

##### Default

```ts
[]
```

#### showHelpOnFail

> **showHelpOnFail**: `boolean` \| `"full"` \| `"short"` \| \{ `outputStyle`: `"full"` \| `"short"`; `showFor`: `Record`\<`"yargs"` \| `"cli"` \| `"other"`, `boolean`\>; \}

If `true` or a string, Black Flag will send help text to stderr when any
error occurs. If `false`, no help text will be sent to stderr when an
error occurs.

This property can be updated by invoking [Program.showHelpOnFail](Program.md)
on a Black Flag instance, or through the `configureExecutionContext`
configuration hook. Either way, the update will be applied globally
across all instances.

`showHelpOnFail` determines two things:

1. How a command's `usage` string will be included in help text displayed
   during errors. All but the first line of `usage` is excluded when
   `showHelpOnFail` is `true`/`"short"` or when
   `showHelpOnFail.outputStyle` is `"short"`; this is the default. If
   `showHelpOnFail`/`showHelpOnFail.outputStyle` is `"full"`, the entire
   `usage` string is included instead.

<br />

2. On which errors help text will be displayed. By default, help text is
   only displayed when yargs itself throws (e.g. an "unknown argument"
   error), but not when a [CliError](../../classes/CliError.md) or other kind of error is
   thrown. This can be overridden globally by configuring
   `showHelpOnFail.showFor`, or locally by individual [CliError](../../classes/CliError.md)
   instances (via [CliError.showHelp](../../classes/CliError.md#showhelp)).

Note that, regardless of this property, the full usage string is always
output when the `--help` flag (or the equivalent) is explicitly given.

Similarly, help text is always output when a parent command is invoked
that (1) has one or more child commands and (2) lacks its own handler
implementation or implements a handler that throws
[CommandNotImplementedError](../classes/CommandNotImplementedError.md).

##### Type declaration

`boolean`

`"full"`

`"short"`

\{ `outputStyle`: `"full"` \| `"short"`; `showFor`: `Record`\<`"yargs"` \| `"cli"` \| `"other"`, `boolean`\>; \}

##### Default

```ts
{}
```
