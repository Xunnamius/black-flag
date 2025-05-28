[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / defaultUsageText

# Variable: defaultUsageText

> `const` **defaultUsageText**: "Usage: $000\n\n$1" = `'Usage: $000\n\n$1'`

Defined in: [src/constant.ts:24](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/constant.ts#L24)

Hard-coded default command `usage` text provided to programs via
`.usage(...)` after string interpolation. "$000", "$0", and "$1" are replaced
with a command's usage DSL (i.e. `command` export), name (i.e. `name`
export), and description (i.e. `description` export) respectively.
