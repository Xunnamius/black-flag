[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / defaultUsageText

# Variable: defaultUsageText

> `const` **defaultUsageText**: "Usage: $000\n\n$1" = `'Usage: $000\n\n$1'`

Hard-coded default command `usage` text provided to programs via
`.usage(...)` after string interpolation. "$000", "$0", and "$1" are replaced
with a command's usage DSL (`command` export), name (`name` export), and
description (`description` export) respectively.

## Defined in

[src/constant.ts:13](https://github.com/Xunnamius/black-flag/blob/20623d626b4c283cf81bd3e79356045673c5c3fb/src/constant.ts#L13)
