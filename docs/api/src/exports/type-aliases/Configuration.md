[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / Configuration

# Type Alias: Configuration\<CustomCliArguments, CustomExecutionContext\>

> **Configuration**\<`CustomCliArguments`, `CustomExecutionContext`\> = `object`

Defined in: [src/types/module.ts:15](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/module.ts#L15)

A replacement for the `CommandModule` type that comes with yargs.
Auto-discovered configuration modules must implement this interface or a
subtype of this interface.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Properties

### aliases

> **aliases**: `string`[]

Defined in: [src/types/module.ts:33](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/module.ts#L33)

An array of `command` aliases [as
interpreted](https://github.com/yargs/yargs/pull/647) by
[yargs](https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases).

**WARNING: positional arguments ARE NOT ALLOWED HERE** and including them
will lead to strange behavior! If you want to add positional arguments,
export [Configuration.command](#command) instead.

Note: when a command file is interpreted as a [RootConfiguration](RootConfiguration.md),
`aliases` is effectively ignored.

#### Default

```ts
[]
```

***

### builder

> **builder**: \{[`key`: `string`]: `Options`; \} \| (`blackFlag`, `helpOrVersionSet`, `argv?`) => `undefined` \| `void` \| `object` \| \{[`key`: `string`]: `Options`; \}

Defined in: [src/types/module.ts:49](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/module.ts#L49)

An object containing yargs options configuration or a function that will
receive the current Black Flag program. Unlike with vanilla yargs, you do
not need to return anything at all; "returning" `undefined`/`void` is
equivalent. If you return something other than the `blackFlag` parameter,
such as an object of options, it will be passed to `yargs::options` for
you.

Note: **if `builder` is a function, it cannot be async or return a
promise** due to a yargs bug present at time of writing. However, a
Configuration module can export an async function, so hoist any
async logic out of the builder function to work around this bug for now.

#### Default

```ts
{}
```

***

### command

> **command**: `"$0"` \| `` `$0 ${string}` ``

Defined in: [src/types/module.ts:81](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/module.ts#L81)

The command as interpreted by yargs. Must always begin with `$0`. May
contain positional arguments declared using the [`yargs::command`
DSL](https://github.com/yargs/yargs/blob/main/docs/advanced.md#positional-arguments).

It is usually unnecessary to change or use this property if you're not
using positional arguments. If you want to change your command's name, use
[Configuration.name](#name). If you want to change the usage text, use
[Configuration.usage](#usage).

#### Default

```ts
"$0"
```

***

### deprecated

> **deprecated**: `string` \| `boolean`

Defined in: [src/types/module.ts:89](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/module.ts#L89)

If truthy, the command will be considered "deprecated" by yargs. If
`deprecated` is a string, it will additionally be treated as a deprecation
message that will appear alongside the command in help text.

#### Default

```ts
false
```

***

### description

> **description**: `string` \| `false`

Defined in: [src/types/module.ts:96](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/module.ts#L96)

The description for the command in help text. If `false`, the command will
be considered "hidden" by yargs.

#### Default

```ts
""
```

***

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

Defined in: [src/types/module.ts:106](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/module.ts#L106)

A function called when this command is invoked. It will receive an object
of parsed arguments.

If `undefined`, the command will be considered "unimplemented" and a
`CommandNotImplementedError` will be thrown.

#### Parameters

##### argv

[`Arguments`](Arguments.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

#### Returns

`Promisable`\<`void`\>

#### Default

```ts
undefined
```

***

### name

> **name**: `string`

Defined in: [src/types/module.ts:118](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/module.ts#L118)

The name of the command. Any spaces will be replaced with hyphens.
Including a character that yargs does not consider valid for a
command name will result in an error.

Defaults to the filename containing the configuration, excluding its
extension, or the directory name (with spaces replaced) if the
filename without extension is "index".

***

### usage

> **usage**: `string`

Defined in: [src/types/module.ts:138](https://github.com/Xunnamius/black-flag/blob/54f69b5502007e20a8937998cea6e285d5db6d7c/src/types/module.ts#L138)

Set a usage message shown at the top of the command's help text.

Depending on the value of
[ExecutionContext.state.showHelpOnFail](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md#showhelponfail),
either the "short" first line of usage text will be output during errors or
the "full" usage string. Either way, whenever help text is explicitly
requested (e.g. `--help` is given), the full usage string will be output.

Several replacements are made to the `usage` string before it is output. In
order:

- `$000` will be replaced by the entire command itself (including full
  canonical name and parameters).
- `$1` will be replaced by the description of the command.
- `$0` will be replaced with the full canonical name of the command.

#### Default

```ts
"Usage: $000\n\n$1"
```
