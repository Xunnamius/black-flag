# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

### [1.2.4][3] (2024-03-27)

#### 🪄 Fixes

- **src:** explicitly ignore .d.ts files within command dirs ([d6618d3][4])

### [1.2.3][5] (2024-03-27)

#### 🪄 Fixes

- **package:** bump minimum node support to 20 LTS ([4b8c975][6])
- **src:** ignore unknown file extension errors when discovering commands ([4babf12][7])

### [1.2.2][8] (2024-03-21)

#### 🪄 Fixes

- No longer include default command when listing subcommands ([be2960a][9])

#### ⚙️ Build System

- **husky:** update to latest hooks ([75d5c66][10])
- **src:** do not filter to own methods when proxying and rebinding ([8bb0254][11])

### [1.2.1][12] (2024-03-19)

#### ⚙️ Build System

- **babel:** fix import specifier rewrite oversight ([2369534][13])

## [1.2.0][14] (2024-03-18)

#### ✨ Features

- Add `showHelp` option to `CliError` ([b5a1e58][15])

### [1.1.4][16] (2024-03-16)

#### 🪄 Fixes

- **types:** allow exported types to specify custom `ExecutionContext` ([f66599b][17])

### [1.1.3][18] (2024-03-15)

#### 🪄 Fixes

- Add support for `export default X` syntax ([bad391d][19])
- Ensure `demandOption` is properly supported ([2f205c1][20])

### [1.1.2][21] (2023-12-31)

#### 🪄 Fixes

- **readme:** move parserConfiguration call out of dead zone in example ([f79c114][22])

### [1.1.1][23] (2023-12-31)

#### 🪄 Fixes

- Fix Node10 type resolution failure ([b6178c9][24])

## [1.1.0][25] (2023-12-31)

#### ✨ Features

- **src:** support file://-style URLs ([0e5067e][26])

#### 🪄 Fixes

- **src:** ensure --version is included in help text output when relevant ([4f159dc][27])

#### ⚙️ Build System

- **babel:** fix ESM<=>CJS interop issue ([5470091][28])

## [1.0.0][29] (2023-12-29)

#### ✨ Features

- **src:** disallow creating commands with conflicting names/aliases ([78bf8ff][30])

#### 🪄 Fixes

- Rename package from "black-flag" to "[@black-][31]flag/core" npm typosquat workaround ([292ead5][32])

#### ⚙️ Build System

- Fix horrible decision by marked devs to break output for no reason ([036e350][33])
- **jest:** ensure pkg-up is transformed ([c7f4aef][34])
- **jest:** fix transformIgnorePatterns ([0548d34][35])
- **jest:** transpile node\_modules ([5cf7a6c][36])
- **tsconfig:** fix internal path resolution ([fbe3a69][37])
- **tsconfig:** upgrade to NodeNext ([d3a499e][38])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/v1.2.3...v1.2.4
[4]: https://github.com/Xunnamius/black-flag/commit/d6618d370bd9a7264dad240856dc989a61071986
[5]: https://github.com/Xunnamius/black-flag/compare/v1.2.2...v1.2.3
[6]: https://github.com/Xunnamius/black-flag/commit/4b8c9759bc09f9b07593ce89446d4ec0e614db71
[7]: https://github.com/Xunnamius/black-flag/commit/4babf12308b7aab0ed319077701eb6f3a1fdf1d3
[8]: https://github.com/Xunnamius/black-flag/compare/v1.2.1...v1.2.2
[9]: https://github.com/Xunnamius/black-flag/commit/be2960a507c43b3db598157de4dcafe22ee8906e
[10]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[11]: https://github.com/Xunnamius/black-flag/commit/8bb025436d219c024a5d4a4a0ac59999440b7c13
[12]: https://github.com/Xunnamius/black-flag/compare/v1.2.0...v1.2.1
[13]: https://github.com/Xunnamius/black-flag/commit/2369534f63aa3858714bb81505d3fff4ed77c6b1
[14]: https://github.com/Xunnamius/black-flag/compare/v1.1.4...v1.2.0
[15]: https://github.com/Xunnamius/black-flag/commit/b5a1e58add31902fd9ec80b93dd37305b8fd0684
[16]: https://github.com/Xunnamius/black-flag/compare/v1.1.3...v1.1.4
[17]: https://github.com/Xunnamius/black-flag/commit/f66599bfdbb70ada6ec662e0d220a0a2e7047824
[18]: https://github.com/Xunnamius/black-flag/compare/v1.1.2...v1.1.3
[19]: https://github.com/Xunnamius/black-flag/commit/bad391da3019a5743a76ca2e510903f34c84ca53
[20]: https://github.com/Xunnamius/black-flag/commit/2f205c1e8c94d3e6683816e5bbc3ae152e3c83e8
[21]: https://github.com/Xunnamius/black-flag/compare/v1.1.1...v1.1.2
[22]: https://github.com/Xunnamius/black-flag/commit/f79c11476de47bee3fa01e139269393b604b4271
[23]: https://github.com/Xunnamius/black-flag/compare/v1.1.0...v1.1.1
[24]: https://github.com/Xunnamius/black-flag/commit/b6178c9670a95084bca34424e71498f2d29ac48c
[25]: https://github.com/Xunnamius/black-flag/compare/v1.0.0...v1.1.0
[26]: https://github.com/Xunnamius/black-flag/commit/0e5067e2b0913a19bdc6975b50b272bb5872ba98
[27]: https://github.com/Xunnamius/black-flag/commit/4f159dc4b84223dd6b07456c0b50da16d2816bea
[28]: https://github.com/Xunnamius/black-flag/commit/5470091e385ca344e12a280ff95be793742874b8
[29]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...v1.0.0
[30]: https://github.com/Xunnamius/black-flag/commit/78bf8ffb0a6931fb3b131c42ce4b84146bfec842
[31]: https://github.com/black-
[32]: https://github.com/Xunnamius/black-flag/commit/292ead5aa3f18c556d72d714830dcf07b9253e6d
[33]: https://github.com/Xunnamius/black-flag/commit/036e3506edc863da86372163c91dd650d6ac1e87
[34]: https://github.com/Xunnamius/black-flag/commit/c7f4aef48366dc13685fb9805086be52d3561eff
[35]: https://github.com/Xunnamius/black-flag/commit/0548d34f559c3b8ba6d9514f1586aeeb3b382f72
[36]: https://github.com/Xunnamius/black-flag/commit/5cf7a6c79bba3125ce47838e5cfd24a1a08bbd17
[37]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[38]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
