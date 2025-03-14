# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @black-flag/checks\@1.0.0 (2025-03-14)

### 💥 BREAKING CHANGES 💥

- **All instances in source where `commandModulePath` appeared have been replaced by `commandModulesPath`. This includes the call signatures of functions like `makeRunner`.**

  The fix is simple: find-and-replace all instances of `commandModulePath` with `commandModulesPath`.

### ✨ Features

- **packages/checks:** implement @black-flag/checks ([64029b9][3])
- **packages/checks:** implement `checkArrayNoConflicts` and `checkArrayUnique` ([10cd0eb][4])

### 🪄 Fixes

- Fix Windows interop issues ([b3abf95][5]) <sup>see [#174][6]</sup>

### ⚙️ Build System

- **husky:** force lint-staged (via husky) to only use global config file ([5d3f2cc][7])
- **husky:** update to latest hooks ([75d5c66][8])
- **tsconfig:** fix internal path resolution ([fbe3a69][9])
- **tsconfig:** upgrade to NodeNext ([d3a499e][10])

### 🧙🏿 Refactored

- Rename and restructure exports for better docs generation ([8303ba7][11])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/commit/64029b9dc0d1e8224d65d2e6c9653b2c09abb962
[4]: https://github.com/Xunnamius/black-flag/commit/10cd0ebc0304d033218ec4dffba0c41cb2e85ff6
[5]: https://github.com/Xunnamius/black-flag/commit/b3abf95ca2958d5d2fca1091178c050ef88fe5f5
[6]: https://github.com/Xunnamius/black-flag/issues/174
[7]: https://github.com/Xunnamius/black-flag/commit/5d3f2ccdfcd615917892d27a5c2cfa1b28879e0c
[8]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[9]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[10]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
[11]: https://github.com/Xunnamius/black-flag/commit/8303ba7f438ae7f7dedfc2b6f5fd396cab32b252
