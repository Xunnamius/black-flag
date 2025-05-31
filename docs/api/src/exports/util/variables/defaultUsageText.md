[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / defaultUsageText

# Variable: defaultUsageText

> `const` **defaultUsageText**: "Usage: $000\n\n$1" = `'Usage: $000\n\n$1'`

Defined in: [src/constant.ts:24](https://github.com/Xunnamius/black-flag/blob/d6004b46e3ac5a451e4e0f05bf5c8726ce157ac9/src/constant.ts#L24)

Hard-coded default command `usage` text provided to programs via
`.usage(...)` after string interpolation. "$000", "$0", and "$1" are replaced
with a command's usage DSL (i.e. `command` export), name (i.e. `name`
export), and description (i.e. `description` export) respectively.
