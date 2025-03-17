# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @black-flag/extensions[@2.1.0][3] (2025-03-17)

### ✨ Features

- **packages/extensions:** implement `enableAutomaticSorting` option for `withBuilderExtensions` ([3b93860][4]) <sup>see [#182][5]</sup>

### 🪄 Fixes

- **packages/extensions:** fix `getInvocableExtendedHandler` contextual "cross-talk" issue ([1adf708][6]) <sup>see [#175][7]</sup>

### ⚙️ Build System

- **deps:** bump core-js from 3.40.0 to 3.41.0 ([12658b9][8])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([9371719][9])

<br />

## @black-flag/extensions[@2.0.0][10] (2025-03-14)

### 💥 BREAKING CHANGES 💥

- **All instances in source where `commandModulePath` appeared have been replaced by `commandModulesPath`. This includes the call signatures of functions like `makeRunner`.**

  The fix is simple: find-and-replace all instances of `commandModulePath` with `commandModulesPath`.

- `$executionContext` and `$artificiallyInvoked` symbols are now drawn from the global symbol registry. They will not match symbols from previous versions!

### ✨ Features

- **packages/extensions:** implement @black-flag/extensions ([f0525c5][11])

### 🪄 Fixes

- Fix Windows interop issues ([b3abf95][12]) <sup>see [#174][13]</sup>

### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([80350cc][14])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([7c8ff7a][15])
- **husky:** force lint-staged (via husky) to only use global config file ([5d3f2cc][16])
- **packages/extensions:** use correct git repo metadata in package.json ([0548f8f][17])

### 🧙🏿 Refactored

- Make exported symbols cross-realm ([af78a8f][18])
- Rename and restructure exports for better docs generation ([8303ba7][19])

### 🔥 Reverted

- _"build(deps): bump core-js from 3.40.0 to 3.41.0"_ ([aebeab7][20])

## @black-flag/extensions[@1.0.2][21] (2025-02-21)

#### ⚙️ Build System

- **husky:** update to latest hooks ([75d5c66][22])
- **tsconfig:** fix internal path resolution ([fbe3a69][23])
- **tsconfig:** upgrade to NodeNext ([d3a499e][24])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@2.0.0...@black-flag/extensions@2.1.0
[4]: https://github.com/Xunnamius/black-flag/commit/3b9386082ffb4c7b2987c0f2b2e00e6cd48ad4bb
[5]: https://github.com/Xunnamius/black-flag/issues/182
[6]: https://github.com/Xunnamius/black-flag/commit/1adf7086f5837a4166d7bdfc87028a031d772480
[7]: https://github.com/Xunnamius/black-flag/issues/175
[8]: https://github.com/Xunnamius/black-flag/commit/12658b92d7bda44a0105775dae2db2cb0a1fcdee
[9]: https://github.com/Xunnamius/black-flag/commit/937171967cd8887a8aba12cbb23c0adffacc6c78
[10]: https://github.com/Xunnamius/black-flag/compare/@black-flag/extensions@1.0.2...@black-flag/extensions@2.0.0
[11]: https://github.com/Xunnamius/black-flag/commit/f0525c5f4bf72b0f28fedf4f6d66f4a1b7353b05
[12]: https://github.com/Xunnamius/black-flag/commit/b3abf95ca2958d5d2fca1091178c050ef88fe5f5
[13]: https://github.com/Xunnamius/black-flag/issues/174
[14]: https://github.com/Xunnamius/black-flag/commit/80350cca61bef915d737fb097e4e3838118a1167
[15]: https://github.com/Xunnamius/black-flag/commit/7c8ff7ad8ffd4d822329278da0a21db54f904f25
[16]: https://github.com/Xunnamius/black-flag/commit/5d3f2ccdfcd615917892d27a5c2cfa1b28879e0c
[17]: https://github.com/Xunnamius/black-flag/commit/0548f8fe3c7daa363173184e34f2307f8964dbed
[18]: https://github.com/Xunnamius/black-flag/commit/af78a8fbc5839e0d3db1b07312bbc854ef1b7a0d
[19]: https://github.com/Xunnamius/black-flag/commit/8303ba7f438ae7f7dedfc2b6f5fd396cab32b252
[20]: https://github.com/Xunnamius/black-flag/commit/aebeab7d2567bc70eedd5920ea51c02bfe3dc081
[21]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...@black-flag/extensions@1.0.2
[22]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[23]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[24]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
