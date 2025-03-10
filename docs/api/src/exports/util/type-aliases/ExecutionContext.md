[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / ExecutionContext

# Type Alias: ExecutionContext

> **ExecutionContext**: `object`

Defined in: [src/types/program.ts:332](https://github.com/Xunnamius/black-flag/blob/5e1e5b553c79657a97e5923bcba77a292781de9e/src/types/program.ts#L332)

Represents a globally-accessible shared context object singleton.

## Type declaration

## Index Signature

\[`key`: `string`\]: `unknown`

### commands

> **commands**: `Map`\<`string`, \{ `metadata`: [`ProgramMetadata`](ProgramMetadata.md); `programs`: [`Programs`](Programs.md); \}\>

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

### debug

> **debug**: `ExtendedDebugger`

The `ExtendedDebugger` for the current runtime level.

This property is used internally by Black Flag.

### state

> **state**: `object`

The current state of the execution environment.

This property is used internally by Black Flag.

#### Index Signature

\[`key`: `string`\]: `unknown`

#### state.deepestParseResult

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

#### state.didAlreadyHandleError

> **didAlreadyHandleError**: `boolean`

If `true`, Black Flag already handled whatever error has made its way to
the highest error handling layer (typically through the
`configureErrorHandlingEpilogue` hook).

Otherwise, if the error is unhandled by the time this property is
checked, a framework error will occur.

This property is ignored when no error has occurred.

#### state.didOutputHelpOrVersionText

> **didOutputHelpOrVersionText**: `boolean`

If `true`, Black Flag sent either help or version text to stdout or
stderr.

##### Default

```ts
false
```

#### state.finalError

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

#### state.firstPassArgv

> **firstPassArgv**: [`Arguments`](../../type-aliases/Arguments.md) \| `undefined`

Allows helper and effector programs to keep track of pre-pared arguments.

Note: this property should not be relied upon or mutated by
end-developers.

##### Default

```ts
undefined
```

#### state.globalHelpOption

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

#### state.globalVersionOption

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

#### state.initialTerminalWidth

> **initialTerminalWidth**: `number`

The detected width of the terminal. This value is determined by yargs
when `configureProgram` is called.

#### state.isGracefullyExiting

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

#### state.isHandlingHelpOption

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

#### state.isHandlingVersionOption

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

#### state.rawArgv

> **rawArgv**: *typeof* `process.argv`

A subset of the original argv returned by [ConfigureArguments](../../type-aliases/ConfigureArguments.md). It
is used internally to give the final command in the arguments list the
chance to parse argv. Further, it is used to enforce the ordering
invariant on chained child program invocations. That is: all
non-positional arguments must appear _after_ the last command name in any
arguments list parsed by this program.

Since it will be actively manipulated by each command in the arguments
list, **do not rely on `rawArgv` for anything other than checking
invariant satisfaction.**

##### Default

```ts
[]
```

#### state.showHelpOnFail

> **showHelpOnFail**: `boolean` \| `"full"` \| `"short"`

If truthy, Black Flag will dump help text to stderr when an error occurs.
This is also set when `Program::showHelpOnFail` is called. If `false`,
error text will not be sent to stderr (by default) when an error occurs.

Further, this property determines how a command's `usage` string will be
included in said help text. All but the first line of `usage` is excluded
when `outputStyle` is `true` (the default) or `"short"`; if `outputStyle`
is `"full"`, the entire `usage` string is always included when outputting
help text during errors.

Note that the full usage string is always output when the `--help` flag
(or the equivalent) is explicitly given.

Also note that this property is a getter/setter and should not be
redefined (e.g. by `Object.defineProperty`).

##### Default

```ts
"short"
```
