[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / ProgramMetadata

# Type Alias: ProgramMetadata

> **ProgramMetadata** = `object`

Defined in: [src/types/program.ts:197](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L197)

Represents the meta information about a discovered command and its
corresponding [Configuration](../../type-aliases/Configuration.md) object/file.

## Properties

### filename

> **filename**: `string`

Defined in: [src/types/program.ts:220](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L220)

The basename of `filepath`.

***

### filenameWithoutExtension

> **filenameWithoutExtension**: `string`

Defined in: [src/types/program.ts:224](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L224)

The basename of `filepath` with the trailing extension trimmed.

***

### filepath

> **filepath**: `string`

Defined in: [src/types/program.ts:216](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L216)

Absolute filesystem path to the loaded configuration file.

***

### fullUsageText

> **fullUsageText**: `string`

Defined in: [src/types/program.ts:259](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L259)

The full usage text computed from the command's `usage` value with all
special tokens (e.g. "$0") replaced.

***

### hasChildren

> **hasChildren**: `boolean`

Defined in: [src/types/program.ts:254](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L254)

If `true`, this command is a "pure parent" or "parent-child" that has at
least one child command.

***

### isImplemented

> **isImplemented**: `boolean`

Defined in: [src/types/program.ts:249](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L249)

If `true`, this command exported a `handler` function. Black Flag therefore
considers this command as "not unimplemented".

When executed, unimplemented commands will show help text before throwing a
context-specific error.

***

### parentDirName

> **parentDirName**: `string`

Defined in: [src/types/program.ts:228](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L228)

The basename of the direct parent directory containing `filepath`.

***

### reservedCommandNames

> **reservedCommandNames**: `string`[]

Defined in: [src/types/program.ts:241](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L241)

The names "reserved" by this command. When a name is reserved by a command,
no other sibling command (i.e. a command with the same parent command) can
use that name as an name or alias. When attempting to add a command that
uses the same name as its sibling, an error with be thrown.

All commands attempt to reserve their `name` and `aliases` exports upon
discovery.

**Invariant: `name` must be at index 0; `...aliases` must start at index
1.**

***

### type

> **type**: [`ProgramType`](ProgramType.md)

Defined in: [src/types/program.ts:212](https://github.com/Xunnamius/black-flag/blob/dca16a7cbf43b7d8428fc9b34cc49fc69b7b6672/src/types/program.ts#L212)

The "type" of [Configuration](../../type-aliases/Configuration.md) that was loaded, indicating which
interface to expect when interacting with `configuration`. The
possibilities are:

- **root**: implements `RootConfiguration` (the only pure
  `ParentConfiguration`)
- **parent-child**: implements `ParentConfiguration`, `ChildConfiguration`
- **child**: implements `ChildConfiguration`

Note that "root" `type` configurations are unique in that there will only
ever be one `RootConfiguration`, and it **MUST** be the first command
module auto-discovered and loaded (invariant).
