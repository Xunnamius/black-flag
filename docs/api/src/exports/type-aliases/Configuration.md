[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / Configuration

# Type Alias: Configuration\<CustomCliArguments, CustomExecutionContext\>

> **Configuration**\<`CustomCliArguments`, `CustomExecutionContext`\>: `object`

Defined in: [src/types/module.ts:15](https://github.com/Xunnamius/black-flag/blob/e6eca023803f0a1815dfc34f6bdb68feb61e8119/src/types/module.ts#L15)

A replacement for the `CommandModule` type that comes with yargs.
Auto-discovered configuration modules must implement this interface or a
subtype of this interface.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)

## Type declaration

### aliases

> **aliases**: `string`[]

An array of `command` aliases [as
interpreted](https://github.com/yargs/yargs/pull/647) by
[yargs](https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases).

**WARNING: positional arguments ARE NOT ALLOWED HERE** and including them
will lead to strange behavior! If you want to add positional arguments,
export [Configuration.command](Configuration.md#command) instead.

Note: when a command file is interpreted as a [RootConfiguration](RootConfiguration.md),
`aliases` is effectively ignored.

#### Default

```ts
[]
```

### builder

> **builder**: \{\} \| (`blackFlag`, `helpOrVersionSet`, `argv`?) => `undefined` \| [`EffectorProgram`](../util/type-aliases/EffectorProgram.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| \{\} \| `_Program`

An object containing yargs options configuration or a function that will
receive the current Black Flag program. Unlike with vanilla yargs, you do
not need to return anything at all; "returning" `undefined`/`void` is
equivalent. If you return something other than the `blackFlag` parameter,
such as an object of options, it will be passed to `yargs::options` for
you.

Note 1: **if `builder` is a function, it cannot be async or return a
promise** due to a yargs bug present at time of writing. However, a
[Configuration](Configuration.md) module can export an async function, so hoist any
async logic out of the builder function to work around this bug for now.

Note 2: if positional arguments are given and your command accepts them
(i.e. provided via [Configuration.command](Configuration.md#command) and configured via
`yargs::positional`), they are only accessible from `argv?._` (`builder`'s
third parameter). This is because positional arguments, while fully
supported by Black Flag, **are parsed and validated _after_ `builder` is
first invoked** and so aren't available until a little later.

#### Default

```ts
{}
```

### command

> **command**: `"$0"` \| `` `$0 ${string}` ``

The command as interpreted by yargs. May contain positional arguments.

It is usually unnecessary to change or use this property if you're not
using positional arguments. If you want to change your command's name, use
[Configuration.name](Configuration.md#name). If you want to change the usage text, use
[Configuration.usage](Configuration.md#usage).

#### Default

```ts
"$0"
```

### deprecated

> **deprecated**: `string` \| `boolean`

If truthy, the command will be considered "deprecated" by yargs. If
`deprecated` is a string, it will additionally be treated as a deprecation
message that will appear alongside the command in help text.

#### Default

```ts
false
```

### description

> **description**: `string` \| `false`

The description for the command in help text. If `false`, the command will
be considered "hidden" by yargs.

#### Default

```ts
""
```

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

A function called when this command is invoked. It will receive an object
of parsed arguments.

If `undefined`, a `CommandNotImplementedError` will be thrown.

#### Parameters

##### argv

[`Arguments`](Arguments.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

#### Returns

`Promisable`\<`void`\>

#### Default

```ts
undefined
```

### name

> **name**: `string`

The name of the command. Any spaces will be replaced with hyphens.
Including a character that yargs does not consider valid for a
command name will result in an error.

Defaults to the filename containing the configuration, excluding its
extension, or the directory name (with spaces replaced) if the
filename without extension is "index".

### usage

> **usage**: `string`

Set a usage message shown at the top of the command's help text.

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
