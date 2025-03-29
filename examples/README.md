# Black Flag: Recipes and Examples

In this directory are a variety of recipes/examples for solving common CLI
design problems using [Black Flag][1], [Black Flag Extensions][2], and [Black
Flag Checks][3].

Several of these examples are inspired by [Yargs's own examples directory][4].

All examples are easy and simple to run:

1. Clone this repository
2. Change directory to the example you wish to run
3. Run `npm install` (and then `npm run build` for TypeScript-based examples) 
4. Execute `npx cli-name` (replace "cli-name" with the name of the example's
   CLI)

The only exception is [yargs-intro][5], which consists of a single `README.md`
file containing code examples instead of an actual runnable program.

## Black Flag Recipes

- [Builder][6] — how to use every available builder `opt`
- [Deep hierarchy][7] — creating a deep hierarchy of nested commands
- [ESM and CJS][8] — mixing different module styles in the same CLI
- [Export styles][9] — different syntaxes for exporting commands
- [Configuration hooks][10] — fine-tuning the BF runtime
- [Shared builder and handler][11] — reusing builders/handlers across commands
- [CLI-wide defaults][12] — reconfiguring yargs/yargs-parser across all commands
- [Custom context][13] — modifying custom context
- [Dynamic options][14] — taking advantage of dynamic options
- [Positional][15] — configuring normal and dynamic conditionals
- [Error handling][16] — handling graceful, CLI, yargs, and custom errors
- [Testing][17] — tricks for testing commands, hooks, and CLIs
- [TypeScript][18] — building a fully-typed CLI in TypeScript

## Black Flag Extensions Recipes

- [`myctl` re-implementation][19] — upgrading [`myctl`][20] from BF to BFE
- [Builder/handler extensions][21] — how to use every new extended builder `opt`
- [Usage extensions][22] — how to use usage extensions
- [Command passthrough][23] — using one command as an alias for another
- [Declarative suboptions][24] — creating powerful dynamic options declaratively
- [Declarative checks][25] — taking advantage of declarative per-option checks
- [Artificial invocation][26] — running command functions directly (bypass BF)
- [Automatic sorting][27] — configuring automatic option sorting (alpha sort)
- [Automatic grouping][28] — configuring automatic option grouping

[1]: ../README.md
[2]: ../packages/extensions/README.md
[3]: ../packages/checks/README.md
[4]: https://github.com/yargs/yargs/tree/main/example
[5]: ./yargs-intro/README.md
[6]: ./black-flag/builder
[7]: ./black-flag/hierarchy
[8]: ./black-flag/esm-cjs
[9]: ./black-flag/exports
[10]: ./black-flag/hooks
[11]: ./black-flag/shared
[12]: ./black-flag/advanced
[13]: ./black-flag/context
[14]: ./black-flag/dynamic
[15]: ./black-flag/positional
[16]: ./black-flag/error
[17]: ./black-flag/testing
[18]: ./black-flag/typescript
[19]: ./black-flag-extensions/myctl
[20]: ../docs/getting-started.md
[21]: ./black-flag-extensions/builder
[22]: ./black-flag-extensions/usage
[23]: ./black-flag-extensions/passthrough
[24]: ./black-flag-extensions/suboptionof
[25]: ./black-flag-extensions/checks
[26]: ./black-flag-extensions/artificial
[27]: ./black-flag-extensions/sorting
[28]: ./black-flag-extensions/grouping
