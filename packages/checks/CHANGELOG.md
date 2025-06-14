# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @black-flag/checks[@2.0.0][3] (2025-05-28)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ⚙️ Build System

- **deps:** bump core-js from 3.41.0 to 3.42.0 ([5ea5c70][4])
- **package:** drop support for node\@18 ([7a70c7e][5])

<br />

### 🏗️ Patch @black-flag/checks[@2.0.1][6] (2025-06-14)

#### ⚙️ Build System

- **deps:** bump core-js from 3.42.0 to 3.43.0 ([c3efcf9][7])

<br />

## @black-flag/checks[@1.0.0][8] (2025-03-14)

### 💥 BREAKING CHANGES 💥

- **All instances in source where `commandModulePath` appeared have been replaced by `commandModulesPath`. This includes the call signatures of functions like `makeRunner`.**

  The fix is simple: find-and-replace all instances of `commandModulePath` with `commandModulesPath`.

### ✨ Features

- **packages/checks:** implement @black-flag/checks ([64029b9][9])
- **packages/checks:** implement `checkArrayNoConflicts` and `checkArrayUnique` ([10cd0eb][10])

### 🪄 Fixes

- Fix Windows interop issues ([b3abf95][11]) <sup>see [#174][12]</sup>

### ⚙️ Build System

- **husky:** force lint-staged (via husky) to only use global config file ([5d3f2cc][13])
- **husky:** update to latest hooks ([75d5c66][14])
- **tsconfig:** fix internal path resolution ([fbe3a69][15])
- **tsconfig:** upgrade to NodeNext ([d3a499e][16])

### 🧙🏿 Refactored

- Rename and restructure exports for better docs generation ([8303ba7][17])

### 🔥 Reverted

- _"build(deps): bump core-js from 3.40.0 to 3.41.0"_ ([e75f6f8][18])

<br />

### 🏗️ Patch @black-flag/checks[@1.0.1][19] (2025-03-17)

#### ⚙️ Build System

- **deps:** bump core-js from 3.40.0 to 3.41.0 ([9e54cd6][20])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([9371719][21])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/@black-flag/checks@1.0.1...@black-flag/checks@2.0.0
[4]: https://github.com/Xunnamius/black-flag/commit/5ea5c70550ccc2a12215d01814d269abf0a5a82a
[5]: https://github.com/Xunnamius/black-flag/commit/7a70c7e44633bf3b15b0662ce212ece66de038c8
[6]: https://github.com/Xunnamius/black-flag/compare/@black-flag/checks@2.0.0...@black-flag/checks@2.0.1
[7]: https://github.com/Xunnamius/black-flag/commit/c3efcf96f063e046e6686e81d7a948af135031e5
[8]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...@black-flag/checks@1.0.0
[9]: https://github.com/Xunnamius/black-flag/commit/64029b9dc0d1e8224d65d2e6c9653b2c09abb962
[10]: https://github.com/Xunnamius/black-flag/commit/10cd0ebc0304d033218ec4dffba0c41cb2e85ff6
[11]: https://github.com/Xunnamius/black-flag/commit/b3abf95ca2958d5d2fca1091178c050ef88fe5f5
[12]: https://github.com/Xunnamius/black-flag/issues/174
[13]: https://github.com/Xunnamius/black-flag/commit/5d3f2ccdfcd615917892d27a5c2cfa1b28879e0c
[14]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[15]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[16]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
[17]: https://github.com/Xunnamius/black-flag/commit/8303ba7f438ae7f7dedfc2b6f5fd396cab32b252
[18]: https://github.com/Xunnamius/black-flag/commit/e75f6f8fa90784f1aefab49305a99e7b839b615b
[19]: https://github.com/Xunnamius/black-flag/compare/@black-flag/checks@1.0.0...@black-flag/checks@1.0.1
[20]: https://github.com/Xunnamius/black-flag/commit/9e54cd6bf33b63e1035fbaa43931944266cfe21b
[21]: https://github.com/Xunnamius/black-flag/commit/937171967cd8887a8aba12cbb23c0adffacc6c78
