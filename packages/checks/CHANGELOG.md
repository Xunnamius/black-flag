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

## @black-flag/checks[@1.0.0][6] (2025-03-14)

### 💥 BREAKING CHANGES 💥

- **All instances in source where `commandModulePath` appeared have been replaced by `commandModulesPath`. This includes the call signatures of functions like `makeRunner`.**

  The fix is simple: find-and-replace all instances of `commandModulePath` with `commandModulesPath`.

### ✨ Features

- **packages/checks:** implement @black-flag/checks ([64029b9][7])
- **packages/checks:** implement `checkArrayNoConflicts` and `checkArrayUnique` ([10cd0eb][8])

### 🪄 Fixes

- Fix Windows interop issues ([b3abf95][9]) <sup>see [#174][10]</sup>

### ⚙️ Build System

- **husky:** force lint-staged (via husky) to only use global config file ([5d3f2cc][11])
- **husky:** update to latest hooks ([75d5c66][12])
- **tsconfig:** fix internal path resolution ([fbe3a69][13])
- **tsconfig:** upgrade to NodeNext ([d3a499e][14])

### 🧙🏿 Refactored

- Rename and restructure exports for better docs generation ([8303ba7][15])

### 🔥 Reverted

- _"build(deps): bump core-js from 3.40.0 to 3.41.0"_ ([e75f6f8][16])

<br />

### 🏗️ Patch @black-flag/checks[@1.0.1][17] (2025-03-17)

#### ⚙️ Build System

- **deps:** bump core-js from 3.40.0 to 3.41.0 ([9e54cd6][18])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([9371719][19])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/@black-flag/checks@1.0.1...@black-flag/checks@2.0.0
[4]: https://github.com/Xunnamius/black-flag/commit/5ea5c70550ccc2a12215d01814d269abf0a5a82a
[5]: https://github.com/Xunnamius/black-flag/commit/7a70c7e44633bf3b15b0662ce212ece66de038c8
[6]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...@black-flag/checks@1.0.0
[7]: https://github.com/Xunnamius/black-flag/commit/64029b9dc0d1e8224d65d2e6c9653b2c09abb962
[8]: https://github.com/Xunnamius/black-flag/commit/10cd0ebc0304d033218ec4dffba0c41cb2e85ff6
[9]: https://github.com/Xunnamius/black-flag/commit/b3abf95ca2958d5d2fca1091178c050ef88fe5f5
[10]: https://github.com/Xunnamius/black-flag/issues/174
[11]: https://github.com/Xunnamius/black-flag/commit/5d3f2ccdfcd615917892d27a5c2cfa1b28879e0c
[12]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[13]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[14]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
[15]: https://github.com/Xunnamius/black-flag/commit/8303ba7f438ae7f7dedfc2b6f5fd396cab32b252
[16]: https://github.com/Xunnamius/black-flag/commit/e75f6f8fa90784f1aefab49305a99e7b839b615b
[17]: https://github.com/Xunnamius/black-flag/compare/@black-flag/checks@1.0.0...@black-flag/checks@1.0.1
[18]: https://github.com/Xunnamius/black-flag/commit/9e54cd6bf33b63e1035fbaa43931944266cfe21b
[19]: https://github.com/Xunnamius/black-flag/commit/937171967cd8887a8aba12cbb23c0adffacc6c78
