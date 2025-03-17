# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @black-flag/core[@2.0.0][3] (2025-03-14)

### 💥 BREAKING CHANGES 💥

- **All instances in source where `commandModulePath` appeared have been replaced by `commandModulesPath`. This includes the call signatures of functions like `makeRunner`.**

  The fix is simple: find-and-replace all instances of `commandModulePath` with `commandModulesPath`.

- **Along with implementing the `errorHandlingBehavior` DX improvement in `makeRunner`, this update also addresses several small discrepancies in the behavior of `configureProgram`, `runProgram`, and `makeRunner`. These functions should now behave identically where appropriate (i.e. as described in their documentation), including consistently triggering the same error handling behavior at the same points for the same reasons given the same inputs.**

  Additionally, non-graceful errors that are not handled by `ConfigureErrorHandlingEpilogue` will be consistently presented to the user as framework errors (assertion failures). As such, `runProgram` (and the low-order function returned by `makeRunner`) should no longer throw in some edge cases, such as when being passed a rejected promise or when a hook that is evaluated early throws.

- **Better help text output for dynamic options**

  With this change, Black Flag lets Yargs fully parse `argv` and run through the builder twice before bailing to print help text when `--help` (or the equivalent option) is given.

  This allows input that triggers dynamic options like `my-command --flag-1 --flag-2 --help` to show help text specific to the final resolved builder configurations of `--flag-1 --flag-2` rather than always showing the most generic help text, which was the behavior of older Black Flag versions. See documentation for details.

- **Do not output entire help text when a command fails**

  Skip all but the first line of `usage` text in output by default.

- **Positionals are now available to builders alongside all other flags**

  This is how vanilla Yargs does it. In earlier versions, builders' `argv` param had all positionals dumped into `argv._` due to a suboptimal parsing extension.

- **Show any available child commands in ALL error text**

  This includes when trying to use a command that is not found.

- **Surface new `CliError::showHelp` parameter values**

  - `"short"`/`true`, which will print the command help text without all but the   first line of `usage` text.

  - `"default"`, which will defer to `ExecutionContext::state.showHelpOnFail`.

  - `"full"`, which will force the old functionality.

  - `false`, which ensures help text is never printed with respect to the current   error instance.

- **Upgrade `ExecutionContext::state.showHelpOnFail` to allow configuration of help text output style**

  New output style options include "short" (first line of `usage` only, this is now the default) and "full" (full `usage` string). Also allows configuration of which error kinds trigger help text output and which do not. See documentation for details.

- `$executionContext` and `$artificiallyInvoked` symbols are now drawn from the global symbol registry. They will not match symbols from previous versions!

- `ErrorMessage` export was renamed to `BfErrorMessage`

### ✨ Features

- **src:** export `getDeepestErrorCause` under `/util` ([bf001c4][4])
- **src:** implement `errorHandlingBehavior` option in `makeRunner` ([5e4eb3d][5])
- **src:** make `expectedHelpTextRegExp` utility a public export ([8f2cb13][6])
- **src:** make positionals available to builders normally (no longer in `argv._`) ([42367ce][7])
- **src:** output help text with greater fidelity ([02a497f][8]) <sup>see [#172][9]</sup>
- Support Windows-style paths ([cd288c5][10])

### 🪄 Fixes

- Fix Windows interop issues ([b3abf95][11]) <sup>see [#174][12]</sup>
- **package:** add @types/yargs as production dependency ([8d50a56][13])
- **src:** ensure ESM file bare exports are seen by black flag ([389a2dc][14])
- **src:** fix node\@18 interop issue ([c1b5f61][15]) <sup>see [#173][16]</sup>
- **src:** improve `isX` type assertion exports ([b980544][17])
- **src:** improve intellisense across various exports ([d6b1e73][18])
- **src:** more consistently handle various errors; improve output fidelity ([9412aa6][19])
- **src:** throw upon encountering a `command` export with invalid yargs DSL ([7312b8d][20])
- **src:** throw upon encountering an async `builder` export ([78eb0a2][21])

### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([33b2099][22])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([cdd8f61][23])
- **husky:** force lint-staged (via husky) to only use global config file ([5d3f2cc][24])
- **package:** add @-xun/symbiote dev dependency ([074a930][25])
- **package:** prune unnecessary dependencies ([1b5cdbf][26])
- Throw in `runProgram` when an incompatible Node.js runtime version is detected ([cb56f8d][27])

### 🧙🏿 Refactored

- Make exported symbols cross-realm ([af78a8f][28])
- Rename and restructure exports for better docs generation ([8303ba7][29])
- **src:** `ErrorMessage` export is now `BfErrorMessage` ([3918a29][30])

### 🔥 Reverted

- _"build(deps): bump core-js from 3.40.0 to 3.41.0"_ ([488206d][31])

<br />

### 🏗️ Patch @black-flag/core[@2.0.1][32] (2025-03-17)

#### 🪄 Fixes

- Work around yargs-parser bug ([565fbb9][33]) <sup>see [#171][34]</sup>

#### ⚙️ Build System

- **deps:** bump core-js from 3.40.0 to 3.41.0 ([9371719][35])

<br />

## @black-flag/core[@1.3.0][36] (2024-07-12)

### ✨ Features

- **`clierror`:** add `dangerouslyFatal` option, update `cause` option handling ([1c369fb][37])

<br />

### 🏗️ Patch @black-flag/core[@1.3.2][38] (2024-07-12)

#### 🪄 Fixes

- **src:** tweak error handling debug verboseness in certain edge cases ([96ce293][39])

<br />

### 🏗️ Patch @black-flag/core[@1.3.1][40] (2024-07-12)

#### 🪄 Fixes

- **src:** add trap door to alert developer when erroneously re-entering top-level error handler ([99e2b3a][41])

<br />

## @black-flag/core[@1.2.0][42] (2024-03-18)

### ✨ Features

- Add `showHelp` option to `CliError` ([b5a1e58][43])

<br />

### 🏗️ Patch @black-flag/core[@1.2.7][44] (2024-06-30)

<br />

### 🏗️ Patch @black-flag/core[@1.2.6][45] (2024-06-02)

#### 🪄 Fixes

- **src:** ignore --help and --version if they occur after -- in argv ([35f66cc][46])

<br />

### 🏗️ Patch @black-flag/core[@1.2.5][47] (2024-05-30)

#### 🪄 Fixes

- **src:** permanently fix --version support regression in node\@22 ([c201c2f][48])

#### ⚙️ Build System

- **package:** append node\@22 to supported node versions ([98815d1][49])

<br />

### 🏗️ Patch @black-flag/core[@1.2.4][50] (2024-03-27)

#### 🪄 Fixes

- **src:** explicitly ignore .d.ts files within command dirs ([d6618d3][51])

<br />

### 🏗️ Patch @black-flag/core[@1.2.3][52] (2024-03-27)

#### 🪄 Fixes

- **package:** bump minimum node support to 20 LTS ([4b8c975][53])
- **src:** ignore unknown file extension errors when discovering commands ([4babf12][54])

<br />

### 🏗️ Patch @black-flag/core[@1.2.2][55] (2024-03-21)

#### 🪄 Fixes

- No longer include default command when listing subcommands ([be2960a][56])

#### ⚙️ Build System

- **husky:** update to latest hooks ([75d5c66][57])
- **src:** do not filter to own methods when proxying and rebinding ([8bb0254][58])

<br />

### 🏗️ Patch @black-flag/core[@1.2.1][59] (2024-03-19)

<br />

## @black-flag/core[@1.1.0][60] (2023-12-31)

### ✨ Features

- **src:** support file://-style URLs ([0e5067e][61])

### 🪄 Fixes

- **src:** ensure --version is included in help text output when relevant ([4f159dc][62])

<br />

### 🏗️ Patch @black-flag/core[@1.1.4][63] (2024-03-16)

<br />

### 🏗️ Patch @black-flag/core[@1.1.3][64] (2024-03-15)

#### 🪄 Fixes

- Add support for `export default X` syntax ([bad391d][65])
- Ensure `demandOption` is properly supported ([2f205c1][66])

<br />

### 🏗️ Patch @black-flag/core[@1.1.2][67] (2023-12-31)

#### 🪄 Fixes

- **readme:** move parserConfiguration call out of dead zone in example ([f79c114][68])

<br />

### 🏗️ Patch @black-flag/core[@1.1.1][69] (2023-12-31)

#### 🪄 Fixes

- Fix Node10 type resolution failure ([b6178c9][70])

<br />

## @black-flag/core[@1.0.0][71] (2023-12-29)

### ✨ Features

- **src:** disallow creating commands with conflicting names/aliases ([78bf8ff][72])

### 🪄 Fixes

- Rename package from "black-flag" to "@black-flag/core" npm typosquat workaround ([292ead5][73])

### ⚙️ Build System

- **tsconfig:** fix internal path resolution ([fbe3a69][74])
- **tsconfig:** upgrade to NodeNext ([d3a499e][75])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.3.2...@black-flag/core@2.0.0
[4]: https://github.com/Xunnamius/black-flag/commit/bf001c4b5e6286abb85da0b372c2d2ee0f00b960
[5]: https://github.com/Xunnamius/black-flag/commit/5e4eb3da2cd136b47551a1f62b19987bc096af83
[6]: https://github.com/Xunnamius/black-flag/commit/8f2cb133a16b25b7b160cc276594956a3c401a39
[7]: https://github.com/Xunnamius/black-flag/commit/42367ceeaeea18d9a9e577c9a116af0ea3ff1962
[8]: https://github.com/Xunnamius/black-flag/commit/02a497f1e4cbbaaca295bfe5db1cb43e1e795fc5
[9]: https://github.com/Xunnamius/black-flag/issues/172
[10]: https://github.com/Xunnamius/black-flag/commit/cd288c5d3ea079f6139f8db1f1b44cedc8db79ea
[11]: https://github.com/Xunnamius/black-flag/commit/b3abf95ca2958d5d2fca1091178c050ef88fe5f5
[12]: https://github.com/Xunnamius/black-flag/issues/174
[13]: https://github.com/Xunnamius/black-flag/commit/8d50a566fedd54ed75aaa9edb0b384da5a6f565b
[14]: https://github.com/Xunnamius/black-flag/commit/389a2dc949f34a8e434634d74c63760ce53283d0
[15]: https://github.com/Xunnamius/black-flag/commit/c1b5f616ef0b7752072ad21e3e13adf115cd3f6a
[16]: https://github.com/Xunnamius/black-flag/issues/173
[17]: https://github.com/Xunnamius/black-flag/commit/b9805441bf3552e9d9123f38465f01eb4eb18fbe
[18]: https://github.com/Xunnamius/black-flag/commit/d6b1e73696ffd02ee3a41289f8ffa551a32686ce
[19]: https://github.com/Xunnamius/black-flag/commit/9412aa606a250fbfcd672d788d9aee034c9c85e1
[20]: https://github.com/Xunnamius/black-flag/commit/7312b8d46a00a18d610b7f964c11b13cdec6bd5a
[21]: https://github.com/Xunnamius/black-flag/commit/78eb0a296467f3043824090a6a52d0f297c47b7f
[22]: https://github.com/Xunnamius/black-flag/commit/33b209962cf9780d9656da09bcc2bf4ffb069b2b
[23]: https://github.com/Xunnamius/black-flag/commit/cdd8f61cb208376331f76ec7c9126c1351060e21
[24]: https://github.com/Xunnamius/black-flag/commit/5d3f2ccdfcd615917892d27a5c2cfa1b28879e0c
[25]: https://github.com/Xunnamius/black-flag/commit/074a930b38702e7283f0e8e1d97cea2f61f56ca6
[26]: https://github.com/Xunnamius/black-flag/commit/1b5cdbfd37f2ad76586f4bb9cb5ac8cf6c1a87b2
[27]: https://github.com/Xunnamius/black-flag/commit/cb56f8d35f5dc446e3de931295f476e7e6cca443
[28]: https://github.com/Xunnamius/black-flag/commit/af78a8fbc5839e0d3db1b07312bbc854ef1b7a0d
[29]: https://github.com/Xunnamius/black-flag/commit/8303ba7f438ae7f7dedfc2b6f5fd396cab32b252
[30]: https://github.com/Xunnamius/black-flag/commit/3918a29cc17f8c7e9f1d21c7484b365dde361363
[31]: https://github.com/Xunnamius/black-flag/commit/488206dd6dae6b658af2691ae0230a76dbb59f50
[32]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@2.0.0...@black-flag/core@2.0.1
[33]: https://github.com/Xunnamius/black-flag/commit/565fbb928f3ab96b424ef4932f8833e05bfb0842
[34]: https://github.com/Xunnamius/black-flag/issues/171
[35]: https://github.com/Xunnamius/black-flag/commit/937171967cd8887a8aba12cbb23c0adffacc6c78
[36]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.2.7...@black-flag/core@1.3.0
[37]: https://github.com/Xunnamius/black-flag/commit/1c369fb8570c0b42acad78af66168f9b7f688dfc
[38]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.3.1...@black-flag/core@1.3.2
[39]: https://github.com/Xunnamius/black-flag/commit/96ce293f8a136c82839c1e658d19dc9a2441c0ab
[40]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.3.0...@black-flag/core@1.3.1
[41]: https://github.com/Xunnamius/black-flag/commit/99e2b3aa8ebef83fdf414dda22ad11405c1907df
[42]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.1.4...@black-flag/core@1.2.0
[43]: https://github.com/Xunnamius/black-flag/commit/b5a1e58add31902fd9ec80b93dd37305b8fd0684
[44]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.2.6...@black-flag/core@1.2.7
[45]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.2.5...@black-flag/core@1.2.6
[46]: https://github.com/Xunnamius/black-flag/commit/35f66cc9d69f8434d03db49f067b4f7e03d4c58c
[47]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.2.4...@black-flag/core@1.2.5
[48]: https://github.com/Xunnamius/black-flag/commit/c201c2ff87c1119b9678e38acdc12918d2ed7fc2
[49]: https://github.com/Xunnamius/black-flag/commit/98815d1ef218af56e07493a921c66294f91101cf
[50]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.2.3...@black-flag/core@1.2.4
[51]: https://github.com/Xunnamius/black-flag/commit/d6618d370bd9a7264dad240856dc989a61071986
[52]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.2.2...@black-flag/core@1.2.3
[53]: https://github.com/Xunnamius/black-flag/commit/4b8c9759bc09f9b07593ce89446d4ec0e614db71
[54]: https://github.com/Xunnamius/black-flag/commit/4babf12308b7aab0ed319077701eb6f3a1fdf1d3
[55]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.2.1...@black-flag/core@1.2.2
[56]: https://github.com/Xunnamius/black-flag/commit/be2960a507c43b3db598157de4dcafe22ee8906e
[57]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[58]: https://github.com/Xunnamius/black-flag/commit/8bb025436d219c024a5d4a4a0ac59999440b7c13
[59]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.2.0...@black-flag/core@1.2.1
[60]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.0.0...@black-flag/core@1.1.0
[61]: https://github.com/Xunnamius/black-flag/commit/0e5067e2b0913a19bdc6975b50b272bb5872ba98
[62]: https://github.com/Xunnamius/black-flag/commit/4f159dc4b84223dd6b07456c0b50da16d2816bea
[63]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.1.3...@black-flag/core@1.1.4
[64]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.1.2...@black-flag/core@1.1.3
[65]: https://github.com/Xunnamius/black-flag/commit/bad391da3019a5743a76ca2e510903f34c84ca53
[66]: https://github.com/Xunnamius/black-flag/commit/2f205c1e8c94d3e6683816e5bbc3ae152e3c83e8
[67]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.1.1...@black-flag/core@1.1.2
[68]: https://github.com/Xunnamius/black-flag/commit/f79c11476de47bee3fa01e139269393b604b4271
[69]: https://github.com/Xunnamius/black-flag/compare/@black-flag/core@1.1.0...@black-flag/core@1.1.1
[70]: https://github.com/Xunnamius/black-flag/commit/b6178c9670a95084bca34424e71498f2d29ac48c
[71]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...@black-flag/core@1.0.0
[72]: https://github.com/Xunnamius/black-flag/commit/78bf8ffb0a6931fb3b131c42ce4b84146bfec842
[73]: https://github.com/Xunnamius/black-flag/commit/292ead5aa3f18c556d72d714830dcf07b9253e6d
[74]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[75]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
