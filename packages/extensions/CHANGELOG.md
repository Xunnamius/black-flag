# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @black-flag/extensions[@3.1.0][3] (2025-05-28)

### ✨ Features

- **packages/extensions:** ensure new and old `withUsageExtensions` call signatures are supported ([c5ada65][4])

<br />

## @black-flag/extensions[@3.0.0][5] (2025-05-28)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ✨ Features

- **packages/extensions:** add `includeSubCommand` option to `withUsageExtensions` ([0866421][6])

### ⚙️ Build System

- Bump yargs from 17.7.2 to 18.0.0 and adjust usage accordingly ([379d98d][7])
- **deps:** bump core-js from 3.41.0 to 3.42.0 ([ea1cae3][8])
- **deps:** bump type-fest from 4.38.0 to 4.41.0 ([316c3f3][9])
- **package:** drop support for node\@18 ([7a70c7e][10])

<br />

### 🏗️ Patch @black-flag/extensions[@3.0.1][11] (2025-05-28)

#### 🪄 Fixes

- **packages/extensions:** use breaking `withUsageExtensions` call signature ([65863de][12])

<br />

## @black-flag/extensions[@2.2.0][13] (2025-03-19)

### ✨ Features

- **packages/extensions:** allow tweaking `safeDeepClone` operations in `getInvocableExtendedHandler` ([f24e683][14])

### 🪄 Fixes

- **packages/extensions:** delete undefined defaults (as docs say should happen) instead of throwing framework error ([96ef5ef][15])
- **packages/extensions:** improve `safeDeepClone` to account for own symbol properties ([119919e][16])
- **packages/extensions:** replace internal `safeDeepClone` implementation with @-xun/js ([fff47db][17])

### ⚙️ Build System

- **deps:** bump @-xun/js from 1.0.0 to 1.1.0 ([c14d3cf][18])
- **deps:** bump @-xun/js from 1.1.0 to 1.1.1 ([5f6dfff][19])

<br />

### 🏗️ Patch @black-flag/extensions[@2.2.2][20] (2025-03-25)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.37.0 to 4.38.0 ([73e99db][21])

<br />

### 🏗️ Patch @black-flag/extensions[@2.2.1][22] (2025-03-20)

#### 🪄 Fixes

- **packages/extensions:** replace option defaults with resolved implications when outputting help text ([f95c583][23])

<br />

## @black-flag/extensions[@2.1.0][24] (2025-03-17)

### ✨ Features

- **packages/extensions:** implement `enableAutomaticSorting` option for `withBuilderExtensions` ([3b93860][25]) <sup>see [#182][26]</sup>

### 🪄 Fixes

- **packages/extensions:** fix `getInvocableExtendedHandler` contextual "cross-talk" issue ([1adf708][27]) <sup>see [#175][28]</sup>

### ⚙️ Build System

- **deps:** bump core-js from 3.40.0 to 3.41.0 ([12658b9][29])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([9371719][30])

<br />

## @black-flag/extensions[@2.0.0][31] (2025-03-14)

### 💥 BREAKING CHANGES 💥

- **All instances in source where `commandModulePath` appeared have been replaced by `commandModulesPath`. This includes the call signatures of functions like `makeRunner`.**

  The fix is simple: find-and-replace all instances of `commandModulePath` with `commandModulesPath`.

- `$executionContext` and `$artificiallyInvoked` symbols are now drawn from the global symbol registry. They will not match symbols from previous versions!

### ✨ Features

- **packages/extensions:** implement @black-flag/extensions ([f0525c5][32])

### 🪄 Fixes

- Fix Windows interop issues ([b3abf95][33]) <sup>see [#174][34]</sup>

### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([80350cc][35])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([7c8ff7a][36])
- **husky:** force lint-staged (via husky) to only use global config file ([5d3f2cc][37])
- **packages/extensions:** use correct git repo metadata in package.json ([0548f8f][38])

### 🧙🏿 Refactored

- Make exported symbols cross-realm ([af78a8f][39])
- Rename and restructure exports for better docs generation ([8303ba7][40])

### 🔥 Reverted

- _"build(deps): bump core-js from 3.40.0 to 3.41.0"_ ([aebeab7][41])

## @black-flag/extensions[@1.0.2][42] (2025-02-21)

#### ⚙️ Build System

- **husky:** update to latest hooks ([75d5c66][43])
- **tsconfig:** fix internal path resolution ([fbe3a69][44])
- **tsconfig:** upgrade to NodeNext ([d3a499e][45])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@3.0.1...@black-flag/extensions@3.1.0
[4]: https://github.com/Xunnamius/black-flag/commit/c5ada654b2eb8206c373e88bdba1d3a12ccec944
[5]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.2.2...@black-flag/extensions@3.0.0
[6]: https://github.com/Xunnamius/black-flag/commit/0866421689eb12206a72880c2087d3fcf02f097e
[7]: https://github.com/Xunnamius/black-flag/commit/379d98d3658e906242f405ab4234d58967b5d218
[8]: https://github.com/Xunnamius/black-flag/commit/ea1cae3c0090577caeddd1155855334a6a3398ba
[9]: https://github.com/Xunnamius/black-flag/commit/316c3f3f2a74bee2d8d5836119a527a8605a58a5
[10]: https://github.com/Xunnamius/black-flag/commit/7a70c7e44633bf3b15b0662ce212ece66de038c8
[11]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@3.0.0...@black-flag/extensions@3.0.1
[12]: https://github.com/Xunnamius/black-flag/commit/65863debdad33d702508c3459cced432c1437abf
[13]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.1.0...@black-flag/extensions@2.2.0
[14]: https://github.com/Xunnamius/black-flag/commit/f24e683503f57d7c6785584366260d2a19cae1f1
[15]: https://github.com/Xunnamius/black-flag/commit/96ef5ef271071d7886664e00b661d5f21655c0f3
[16]: https://github.com/Xunnamius/black-flag/commit/119919ef40e6a89644ec3156b9bae57c5e24b459
[17]: https://github.com/Xunnamius/black-flag/commit/fff47db4d3a0610fec0fdd48ba7a5cf006993ac7
[18]: https://github.com/Xunnamius/black-flag/commit/c14d3cf8c1964184f8d222e6586eb6c95c5b4fbb
[19]: https://github.com/Xunnamius/black-flag/commit/5f6dfffed3686aa83522ed99127c8acc6eff7158
[20]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.2.1...@black-flag/extensions@2.2.2
[21]: https://github.com/Xunnamius/black-flag/commit/73e99dbbbcc8a2954ffc14a653e893e01b7d050e
[22]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.2.0...@black-flag/extensions@2.2.1
[23]: https://github.com/Xunnamius/black-flag/commit/f95c583e511ffd5017418cd59d849f0c324c1189
[24]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.0.0...@black-flag/extensions@2.1.0
[25]: https://github.com/Xunnamius/black-flag/commit/3b9386082ffb4c7b2987c0f2b2e00e6cd48ad4bb
[26]: https://github.com/Xunnamius/black-flag/issues/182
[27]: https://github.com/Xunnamius/black-flag/commit/1adf7086f5837a4166d7bdfc87028a031d772480
[28]: https://github.com/Xunnamius/black-flag/issues/175
[29]: https://github.com/Xunnamius/black-flag/commit/12658b92d7bda44a0105775dae2db2cb0a1fcdee
[30]: https://github.com/Xunnamius/black-flag/commit/937171967cd8887a8aba12cbb23c0adffacc6c78
[31]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@1.0.2...@black-flag/extensions@2.0.0
[32]: https://github.com/Xunnamius/black-flag/commit/f0525c5f4bf72b0f28fedf4f6d66f4a1b7353b05
[33]: https://github.com/Xunnamius/black-flag/commit/b3abf95ca2958d5d2fca1091178c050ef88fe5f5
[34]: https://github.com/Xunnamius/black-flag/issues/174
[35]: https://github.com/Xunnamius/black-flag/commit/80350cca61bef915d737fb097e4e3838118a1167
[36]: https://github.com/Xunnamius/black-flag/commit/7c8ff7ad8ffd4d822329278da0a21db54f904f25
[37]: https://github.com/Xunnamius/black-flag/commit/5d3f2ccdfcd615917892d27a5c2cfa1b28879e0c
[38]: https://github.com/Xunnamius/black-flag/commit/0548f8fe3c7daa363173184e34f2307f8964dbed
[39]: https://github.com/Xunnamius/black-flag/commit/af78a8fbc5839e0d3db1b07312bbc854ef1b7a0d
[40]: https://github.com/Xunnamius/black-flag/commit/8303ba7f438ae7f7dedfc2b6f5fd396cab32b252
[41]: https://github.com/Xunnamius/black-flag/commit/aebeab7d2567bc70eedd5920ea51c02bfe3dc081
[42]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...@black-flag/extensions@1.0.2
[43]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[44]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[45]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
