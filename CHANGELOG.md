# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

### [1.1.2][3] (2023-12-31)

#### 🪄 Fixes

- **readme:** move parserConfiguration call out of dead zone in example ([f79c114][4])

### [1.1.1][5] (2023-12-31)

#### 🪄 Fixes

- Fix Node10 type resolution failure ([b6178c9][6])

## [1.1.0][7] (2023-12-31)

#### ✨ Features

- **src:** support file://-style URLs ([0e5067e][8])

#### 🪄 Fixes

- **src:** ensure --version is included in help text output when relevant ([4f159dc][9])

#### ⚙️ Build System

- **babel:** fix ESM<=>CJS interop issue ([5470091][10])

## [1.0.0][11] (2023-12-29)

#### ✨ Features

- **src:** disallow creating commands with conflicting names/aliases ([78bf8ff][12])

#### 🪄 Fixes

- Rename package from "black-flag" to "[@black-][13]flag/core" npm typosquat workaround ([292ead5][14])

#### ⚙️ Build System

- Fix horrible decision by marked devs to break output for no reason ([036e350][15])
- **jest:** ensure pkg-up is transformed ([c7f4aef][16])
- **jest:** fix transformIgnorePatterns ([0548d34][17])
- **jest:** transpile node\_modules ([5cf7a6c][18])
- **tsconfig:** fix internal path resolution ([fbe3a69][19])
- **tsconfig:** upgrade to NodeNext ([d3a499e][20])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/v1.1.1...v1.1.2
[4]: https://github.com/Xunnamius/black-flag/commit/f79c11476de47bee3fa01e139269393b604b4271
[5]: https://github.com/Xunnamius/black-flag/compare/v1.1.0...v1.1.1
[6]: https://github.com/Xunnamius/black-flag/commit/b6178c9670a95084bca34424e71498f2d29ac48c
[7]: https://github.com/Xunnamius/black-flag/compare/v1.0.0...v1.1.0
[8]: https://github.com/Xunnamius/black-flag/commit/0e5067e2b0913a19bdc6975b50b272bb5872ba98
[9]: https://github.com/Xunnamius/black-flag/commit/4f159dc4b84223dd6b07456c0b50da16d2816bea
[10]: https://github.com/Xunnamius/black-flag/commit/5470091e385ca344e12a280ff95be793742874b8
[11]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...v1.0.0
[12]: https://github.com/Xunnamius/black-flag/commit/78bf8ffb0a6931fb3b131c42ce4b84146bfec842
[13]: https://github.com/black-
[14]: https://github.com/Xunnamius/black-flag/commit/292ead5aa3f18c556d72d714830dcf07b9253e6d
[15]: https://github.com/Xunnamius/black-flag/commit/036e3506edc863da86372163c91dd650d6ac1e87
[16]: https://github.com/Xunnamius/black-flag/commit/c7f4aef48366dc13685fb9805086be52d3561eff
[17]: https://github.com/Xunnamius/black-flag/commit/0548d34f559c3b8ba6d9514f1586aeeb3b382f72
[18]: https://github.com/Xunnamius/black-flag/commit/5cf7a6c79bba3125ce47838e5cfd24a1a08bbd17
[19]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[20]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
