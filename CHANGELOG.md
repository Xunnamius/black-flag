# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

### [1.2.2][3] (2024-03-21)

#### 🪄 Fixes

- No longer include default command when listing subcommands ([be2960a][4])

#### ⚙️ Build System

- **husky:** update to latest hooks ([75d5c66][5])
- **src:** do not filter to own methods when proxying and rebinding ([8bb0254][6])

### [1.2.1][7] (2024-03-19)

#### ⚙️ Build System

- **babel:** fix import specifier rewrite oversight ([2369534][8])

## [1.2.0][9] (2024-03-18)

#### ✨ Features

- Add `showHelp` option to `CliError` ([b5a1e58][10])

### [1.1.4][11] (2024-03-16)

#### 🪄 Fixes

- **types:** allow exported types to specify custom `ExecutionContext` ([f66599b][12])

### [1.1.3][13] (2024-03-15)

#### 🪄 Fixes

- Add support for `export default X` syntax ([bad391d][14])
- Ensure `demandOption` is properly supported ([2f205c1][15])

### [1.1.2][16] (2023-12-31)

#### 🪄 Fixes

- **readme:** move parserConfiguration call out of dead zone in example ([f79c114][17])

### [1.1.1][18] (2023-12-31)

#### 🪄 Fixes

- Fix Node10 type resolution failure ([b6178c9][19])

## [1.1.0][20] (2023-12-31)

#### ✨ Features

- **src:** support file://-style URLs ([0e5067e][21])

#### 🪄 Fixes

- **src:** ensure --version is included in help text output when relevant ([4f159dc][22])

#### ⚙️ Build System

- **babel:** fix ESM<=>CJS interop issue ([5470091][23])

## [1.0.0][24] (2023-12-29)

#### ✨ Features

- **src:** disallow creating commands with conflicting names/aliases ([78bf8ff][25])

#### 🪄 Fixes

- Rename package from "black-flag" to "[@black-][26]flag/core" npm typosquat workaround ([292ead5][27])

#### ⚙️ Build System

- Fix horrible decision by marked devs to break output for no reason ([036e350][28])
- **jest:** ensure pkg-up is transformed ([c7f4aef][29])
- **jest:** fix transformIgnorePatterns ([0548d34][30])
- **jest:** transpile node\_modules ([5cf7a6c][31])
- **tsconfig:** fix internal path resolution ([fbe3a69][32])
- **tsconfig:** upgrade to NodeNext ([d3a499e][33])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/v1.2.1...v1.2.2
[4]: https://github.com/Xunnamius/black-flag/commit/be2960a507c43b3db598157de4dcafe22ee8906e
[5]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[6]: https://github.com/Xunnamius/black-flag/commit/8bb025436d219c024a5d4a4a0ac59999440b7c13
[7]: https://github.com/Xunnamius/black-flag/compare/v1.2.0...v1.2.1
[8]: https://github.com/Xunnamius/black-flag/commit/2369534f63aa3858714bb81505d3fff4ed77c6b1
[9]: https://github.com/Xunnamius/black-flag/compare/v1.1.4...v1.2.0
[10]: https://github.com/Xunnamius/black-flag/commit/b5a1e58add31902fd9ec80b93dd37305b8fd0684
[11]: https://github.com/Xunnamius/black-flag/compare/v1.1.3...v1.1.4
[12]: https://github.com/Xunnamius/black-flag/commit/f66599bfdbb70ada6ec662e0d220a0a2e7047824
[13]: https://github.com/Xunnamius/black-flag/compare/v1.1.2...v1.1.3
[14]: https://github.com/Xunnamius/black-flag/commit/bad391da3019a5743a76ca2e510903f34c84ca53
[15]: https://github.com/Xunnamius/black-flag/commit/2f205c1e8c94d3e6683816e5bbc3ae152e3c83e8
[16]: https://github.com/Xunnamius/black-flag/compare/v1.1.1...v1.1.2
[17]: https://github.com/Xunnamius/black-flag/commit/f79c11476de47bee3fa01e139269393b604b4271
[18]: https://github.com/Xunnamius/black-flag/compare/v1.1.0...v1.1.1
[19]: https://github.com/Xunnamius/black-flag/commit/b6178c9670a95084bca34424e71498f2d29ac48c
[20]: https://github.com/Xunnamius/black-flag/compare/v1.0.0...v1.1.0
[21]: https://github.com/Xunnamius/black-flag/commit/0e5067e2b0913a19bdc6975b50b272bb5872ba98
[22]: https://github.com/Xunnamius/black-flag/commit/4f159dc4b84223dd6b07456c0b50da16d2816bea
[23]: https://github.com/Xunnamius/black-flag/commit/5470091e385ca344e12a280ff95be793742874b8
[24]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...v1.0.0
[25]: https://github.com/Xunnamius/black-flag/commit/78bf8ffb0a6931fb3b131c42ce4b84146bfec842
[26]: https://github.com/black-
[27]: https://github.com/Xunnamius/black-flag/commit/292ead5aa3f18c556d72d714830dcf07b9253e6d
[28]: https://github.com/Xunnamius/black-flag/commit/036e3506edc863da86372163c91dd650d6ac1e87
[29]: https://github.com/Xunnamius/black-flag/commit/c7f4aef48366dc13685fb9805086be52d3561eff
[30]: https://github.com/Xunnamius/black-flag/commit/0548d34f559c3b8ba6d9514f1586aeeb3b382f72
[31]: https://github.com/Xunnamius/black-flag/commit/5cf7a6c79bba3125ce47838e5cfd24a1a08bbd17
[32]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[33]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
