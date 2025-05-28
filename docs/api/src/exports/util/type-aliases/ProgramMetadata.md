[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / ProgramMetadata

# Type Alias: ProgramMetadata

> **ProgramMetadata** = `object`

Defined in: [src/types/program.ts:199](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L199)

Represents the meta information about a discovered command and its
corresponding [Configuration](../../type-aliases/Configuration.md) object/file.

## Properties

### filename

> **filename**: `string`

Defined in: [src/types/program.ts:222](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L222)

The basename of `filepath`.

***

### filenameWithoutExtension

> **filenameWithoutExtension**: `string`

Defined in: [src/types/program.ts:226](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L226)

The basename of `filepath` with the trailing extension trimmed.

***

### filepath

> **filepath**: `string`

Defined in: [src/types/program.ts:218](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L218)

Absolute filesystem path to the loaded configuration file.

***

### fullUsageText

> **fullUsageText**: `string`

Defined in: [src/types/program.ts:261](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L261)

The full usage text computed from the command's `usage` value with all
special tokens (e.g. "$0") replaced.

***

### hasChildren

> **hasChildren**: `boolean`

Defined in: [src/types/program.ts:256](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L256)

If `true`, this command is a "pure parent" or "parent-child" that has at
least one child command.

***

### isImplemented

> **isImplemented**: `boolean`

Defined in: [src/types/program.ts:251](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L251)

If `true`, this command exported a `handler` function. Black Flag therefore
considers this command as "not unimplemented".

When executed, unimplemented commands will show help text before throwing a
context-specific error.

***

### parentDirName

> **parentDirName**: `string`

Defined in: [src/types/program.ts:230](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L230)

The basename of the direct parent directory containing `filepath`.

***

### reservedCommandNames

> **reservedCommandNames**: `string`[]

Defined in: [src/types/program.ts:243](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L243)

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

Defined in: [src/types/program.ts:214](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L214)

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
