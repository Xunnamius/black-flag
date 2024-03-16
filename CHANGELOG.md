# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

### [1.1.4][3] (2024-03-16)

#### 🪄 Fixes

- **types:** allow exported types to specify custom `ExecutionContext` ([f66599b][4])

### [1.1.3][5] (2024-03-15)

#### 🪄 Fixes

- Add support for `export default X` syntax ([bad391d][6])
- Ensure `demandOption` is properly supported ([2f205c1][7])

### [1.1.2][8] (2023-12-31)

#### 🪄 Fixes

- **readme:** move parserConfiguration call out of dead zone in example ([f79c114][9])

### [1.1.1][10] (2023-12-31)

#### 🪄 Fixes

- Fix Node10 type resolution failure ([b6178c9][11])

## [1.1.0][12] (2023-12-31)

#### ✨ Features

- **src:** support file://-style URLs ([0e5067e][13])

#### 🪄 Fixes

- **src:** ensure --version is included in help text output when relevant ([4f159dc][14])

#### ⚙️ Build System

- **babel:** fix ESM<=>CJS interop issue ([5470091][15])

## [1.0.0][16] (2023-12-29)

#### ✨ Features

- **src:** disallow creating commands with conflicting names/aliases ([78bf8ff][17])

#### 🪄 Fixes

- Rename package from "black-flag" to "[@black-][18]flag/core" npm typosquat workaround ([292ead5][19])

#### ⚙️ Build System

- Fix horrible decision by marked devs to break output for no reason ([036e350][20])
- **jest:** ensure pkg-up is transformed ([c7f4aef][21])
- **jest:** fix transformIgnorePatterns ([0548d34][22])
- **jest:** transpile node\_modules ([5cf7a6c][23])
- **tsconfig:** fix internal path resolution ([fbe3a69][24])
- **tsconfig:** upgrade to NodeNext ([d3a499e][25])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/v1.1.3...v1.1.4
[4]: https://github.com/Xunnamius/black-flag/commit/f66599bfdbb70ada6ec662e0d220a0a2e7047824
[5]: https://github.com/Xunnamius/black-flag/compare/v1.1.2...v1.1.3
[6]: https://github.com/Xunnamius/black-flag/commit/bad391da3019a5743a76ca2e510903f34c84ca53
[7]: https://github.com/Xunnamius/black-flag/commit/2f205c1e8c94d3e6683816e5bbc3ae152e3c83e8
[8]: https://github.com/Xunnamius/black-flag/compare/v1.1.1...v1.1.2
[9]: https://github.com/Xunnamius/black-flag/commit/f79c11476de47bee3fa01e139269393b604b4271
[10]: https://github.com/Xunnamius/black-flag/compare/v1.1.0...v1.1.1
[11]: https://github.com/Xunnamius/black-flag/commit/b6178c9670a95084bca34424e71498f2d29ac48c
[12]: https://github.com/Xunnamius/black-flag/compare/v1.0.0...v1.1.0
[13]: https://github.com/Xunnamius/black-flag/commit/0e5067e2b0913a19bdc6975b50b272bb5872ba98
[14]: https://github.com/Xunnamius/black-flag/commit/4f159dc4b84223dd6b07456c0b50da16d2816bea
[15]: https://github.com/Xunnamius/black-flag/commit/5470091e385ca344e12a280ff95be793742874b8
[16]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...v1.0.0
[17]: https://github.com/Xunnamius/black-flag/commit/78bf8ffb0a6931fb3b131c42ce4b84146bfec842
[18]: https://github.com/black-
[19]: https://github.com/Xunnamius/black-flag/commit/292ead5aa3f18c556d72d714830dcf07b9253e6d
[20]: https://github.com/Xunnamius/black-flag/commit/036e3506edc863da86372163c91dd650d6ac1e87
[21]: https://github.com/Xunnamius/black-flag/commit/c7f4aef48366dc13685fb9805086be52d3561eff
[22]: https://github.com/Xunnamius/black-flag/commit/0548d34f559c3b8ba6d9514f1586aeeb3b382f72
[23]: https://github.com/Xunnamius/black-flag/commit/5cf7a6c79bba3125ce47838e5cfd24a1a08bbd17
[24]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[25]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
