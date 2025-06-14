# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @black-flag/extensions[@3.1.0][3] (2025-05-28)

### ✨ Features

- **packages/extensions:** ensure new and old `withUsageExtensions` call signatures are supported ([c5ada65][4])

<br />

### 🏗️ Patch @black-flag/extensions[@3.1.1][5] (2025-06-14)

#### ⚙️ Build System

- **deps:** bump @-xun/js from 1.1.1 to 2.0.0 ([0a72bcf][6])
- **deps:** bump core-js from 3.42.0 to 3.43.0 ([7960967][7])
- **deps:** bump rejoinder from 1.2.5 to 2.0.1 ([a24941c][8])

<br />

## @black-flag/extensions[@3.0.0][9] (2025-05-28)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ✨ Features

- **packages/extensions:** add `includeSubCommand` option to `withUsageExtensions` ([0866421][10])

### ⚙️ Build System

- Bump yargs from 17.7.2 to 18.0.0 and adjust usage accordingly ([379d98d][11])
- **deps:** bump core-js from 3.41.0 to 3.42.0 ([ea1cae3][12])
- **deps:** bump type-fest from 4.38.0 to 4.41.0 ([316c3f3][13])
- **package:** drop support for node\@18 ([7a70c7e][14])

<br />

### 🏗️ Patch @black-flag/extensions[@3.0.1][15] (2025-05-28)

#### 🪄 Fixes

- **packages/extensions:** use breaking `withUsageExtensions` call signature ([65863de][16])

<br />

## @black-flag/extensions[@2.2.0][17] (2025-03-19)

### ✨ Features

- **packages/extensions:** allow tweaking `safeDeepClone` operations in `getInvocableExtendedHandler` ([f24e683][18])

### 🪄 Fixes

- **packages/extensions:** delete undefined defaults (as docs say should happen) instead of throwing framework error ([96ef5ef][19])
- **packages/extensions:** improve `safeDeepClone` to account for own symbol properties ([119919e][20])
- **packages/extensions:** replace internal `safeDeepClone` implementation with @-xun/js ([fff47db][21])

### ⚙️ Build System

- **deps:** bump @-xun/js from 1.0.0 to 1.1.0 ([c14d3cf][22])
- **deps:** bump @-xun/js from 1.1.0 to 1.1.1 ([5f6dfff][23])

<br />

### 🏗️ Patch @black-flag/extensions[@2.2.2][24] (2025-03-25)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.37.0 to 4.38.0 ([73e99db][25])

<br />

### 🏗️ Patch @black-flag/extensions[@2.2.1][26] (2025-03-20)

#### 🪄 Fixes

- **packages/extensions:** replace option defaults with resolved implications when outputting help text ([f95c583][27])

<br />

## @black-flag/extensions[@2.1.0][28] (2025-03-17)

### ✨ Features

- **packages/extensions:** implement `enableAutomaticSorting` option for `withBuilderExtensions` ([3b93860][29]) <sup>see [#182][30]</sup>

### 🪄 Fixes

- **packages/extensions:** fix `getInvocableExtendedHandler` contextual "cross-talk" issue ([1adf708][31]) <sup>see [#175][32]</sup>

### ⚙️ Build System

- **deps:** bump core-js from 3.40.0 to 3.41.0 ([12658b9][33])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([9371719][34])

<br />

## @black-flag/extensions[@2.0.0][35] (2025-03-14)

### 💥 BREAKING CHANGES 💥

- **All instances in source where `commandModulePath` appeared have been replaced by `commandModulesPath`. This includes the call signatures of functions like `makeRunner`.**

  The fix is simple: find-and-replace all instances of `commandModulePath` with `commandModulesPath`.

- `$executionContext` and `$artificiallyInvoked` symbols are now drawn from the global symbol registry. They will not match symbols from previous versions!

### ✨ Features

- **packages/extensions:** implement @black-flag/extensions ([f0525c5][36])

### 🪄 Fixes

- Fix Windows interop issues ([b3abf95][37]) <sup>see [#174][38]</sup>

### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([80350cc][39])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([7c8ff7a][40])
- **husky:** force lint-staged (via husky) to only use global config file ([5d3f2cc][41])
- **packages/extensions:** use correct git repo metadata in package.json ([0548f8f][42])

### 🧙🏿 Refactored

- Make exported symbols cross-realm ([af78a8f][43])
- Rename and restructure exports for better docs generation ([8303ba7][44])

### 🔥 Reverted

- _"build(deps): bump core-js from 3.40.0 to 3.41.0"_ ([aebeab7][45])

## @black-flag/extensions[@1.0.2][46] (2025-02-21)

#### ⚙️ Build System

- **husky:** update to latest hooks ([75d5c66][47])
- **tsconfig:** fix internal path resolution ([fbe3a69][48])
- **tsconfig:** upgrade to NodeNext ([d3a499e][49])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@3.0.1...@black-flag/extensions@3.1.0
[4]: https://github.com/Xunnamius/black-flag/commit/c5ada654b2eb8206c373e88bdba1d3a12ccec944
[5]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@3.1.0...@black-flag/extensions@3.1.1
[6]: https://github.com/Xunnamius/black-flag/commit/0a72bcfc2f4842af61a33b8a0383bd68c8a1183e
[7]: https://github.com/Xunnamius/black-flag/commit/79609674d9a47e68e61f0f8fd1bd66d93b33abc1
[8]: https://github.com/Xunnamius/black-flag/commit/a24941c83b747b99c1596ad5f09f5c81ca294528
[9]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.2.2...@black-flag/extensions@3.0.0
[10]: https://github.com/Xunnamius/black-flag/commit/0866421689eb12206a72880c2087d3fcf02f097e
[11]: https://github.com/Xunnamius/black-flag/commit/379d98d3658e906242f405ab4234d58967b5d218
[12]: https://github.com/Xunnamius/black-flag/commit/ea1cae3c0090577caeddd1155855334a6a3398ba
[13]: https://github.com/Xunnamius/black-flag/commit/316c3f3f2a74bee2d8d5836119a527a8605a58a5
[14]: https://github.com/Xunnamius/black-flag/commit/7a70c7e44633bf3b15b0662ce212ece66de038c8
[15]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@3.0.0...@black-flag/extensions@3.0.1
[16]: https://github.com/Xunnamius/black-flag/commit/65863debdad33d702508c3459cced432c1437abf
[17]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.1.0...@black-flag/extensions@2.2.0
[18]: https://github.com/Xunnamius/black-flag/commit/f24e683503f57d7c6785584366260d2a19cae1f1
[19]: https://github.com/Xunnamius/black-flag/commit/96ef5ef271071d7886664e00b661d5f21655c0f3
[20]: https://github.com/Xunnamius/black-flag/commit/119919ef40e6a89644ec3156b9bae57c5e24b459
[21]: https://github.com/Xunnamius/black-flag/commit/fff47db4d3a0610fec0fdd48ba7a5cf006993ac7
[22]: https://github.com/Xunnamius/black-flag/commit/c14d3cf8c1964184f8d222e6586eb6c95c5b4fbb
[23]: https://github.com/Xunnamius/black-flag/commit/5f6dfffed3686aa83522ed99127c8acc6eff7158
[24]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.2.1...@black-flag/extensions@2.2.2
[25]: https://github.com/Xunnamius/black-flag/commit/73e99dbbbcc8a2954ffc14a653e893e01b7d050e
[26]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.2.0...@black-flag/extensions@2.2.1
[27]: https://github.com/Xunnamius/black-flag/commit/f95c583e511ffd5017418cd59d849f0c324c1189
[28]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.0.0...@black-flag/extensions@2.1.0
[29]: https://github.com/Xunnamius/black-flag/commit/3b9386082ffb4c7b2987c0f2b2e00e6cd48ad4bb
[30]: https://github.com/Xunnamius/black-flag/issues/182
[31]: https://github.com/Xunnamius/black-flag/commit/1adf7086f5837a4166d7bdfc87028a031d772480
[32]: https://github.com/Xunnamius/black-flag/issues/175
[33]: https://github.com/Xunnamius/black-flag/commit/12658b92d7bda44a0105775dae2db2cb0a1fcdee
[34]: https://github.com/Xunnamius/black-flag/commit/937171967cd8887a8aba12cbb23c0adffacc6c78
[35]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@1.0.2...@black-flag/extensions@2.0.0
[36]: https://github.com/Xunnamius/black-flag/commit/f0525c5f4bf72b0f28fedf4f6d66f4a1b7353b05
[37]: https://github.com/Xunnamius/black-flag/commit/b3abf95ca2958d5d2fca1091178c050ef88fe5f5
[38]: https://github.com/Xunnamius/black-flag/issues/174
[39]: https://github.com/Xunnamius/black-flag/commit/80350cca61bef915d737fb097e4e3838118a1167
[40]: https://github.com/Xunnamius/black-flag/commit/7c8ff7ad8ffd4d822329278da0a21db54f904f25
[41]: https://github.com/Xunnamius/black-flag/commit/5d3f2ccdfcd615917892d27a5c2cfa1b28879e0c
[42]: https://github.com/Xunnamius/black-flag/commit/0548f8fe3c7daa363173184e34f2307f8964dbed
[43]: https://github.com/Xunnamius/black-flag/commit/af78a8fbc5839e0d3db1b07312bbc854ef1b7a0d
[44]: https://github.com/Xunnamius/black-flag/commit/8303ba7f438ae7f7dedfc2b6f5fd396cab32b252
[45]: https://github.com/Xunnamius/black-flag/commit/aebeab7d2567bc70eedd5920ea51c02bfe3dc081
[46]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...@black-flag/extensions@1.0.2
[47]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[48]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[49]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
