# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

### [1.2.6][3] (2024-06-02)

#### 🪄 Fixes

- **src:** ignore --help and --version if they occur after -- in argv ([35f66cc][4])

### [1.2.5][5] (2024-05-30)

#### 🪄 Fixes

- **src:** permanently fix --version support regression in node\@22 ([c201c2f][6])

#### ⚙️ Build System

- **package:** append node\@22 to supported node versions ([98815d1][7])

### [1.2.4][8] (2024-03-27)

#### 🪄 Fixes

- **src:** explicitly ignore .d.ts files within command dirs ([d6618d3][9])

### [1.2.3][10] (2024-03-27)

#### 🪄 Fixes

- **package:** bump minimum node support to 20 LTS ([4b8c975][11])
- **src:** ignore unknown file extension errors when discovering commands ([4babf12][12])

### [1.2.2][13] (2024-03-21)

#### 🪄 Fixes

- No longer include default command when listing subcommands ([be2960a][14])

#### ⚙️ Build System

- **husky:** update to latest hooks ([75d5c66][15])
- **src:** do not filter to own methods when proxying and rebinding ([8bb0254][16])

### [1.2.1][17] (2024-03-19)

#### ⚙️ Build System

- **babel:** fix import specifier rewrite oversight ([2369534][18])

## [1.2.0][19] (2024-03-18)

#### ✨ Features

- Add `showHelp` option to `CliError` ([b5a1e58][20])

### [1.1.4][21] (2024-03-16)

#### 🪄 Fixes

- **types:** allow exported types to specify custom `ExecutionContext` ([f66599b][22])

### [1.1.3][23] (2024-03-15)

#### 🪄 Fixes

- Add support for `export default X` syntax ([bad391d][24])
- Ensure `demandOption` is properly supported ([2f205c1][25])

### [1.1.2][26] (2023-12-31)

#### 🪄 Fixes

- **readme:** move parserConfiguration call out of dead zone in example ([f79c114][27])

### [1.1.1][28] (2023-12-31)

#### 🪄 Fixes

- Fix Node10 type resolution failure ([b6178c9][29])

## [1.1.0][30] (2023-12-31)

#### ✨ Features

- **src:** support file://-style URLs ([0e5067e][31])

#### 🪄 Fixes

- **src:** ensure --version is included in help text output when relevant ([4f159dc][32])

#### ⚙️ Build System

- **babel:** fix ESM<=>CJS interop issue ([5470091][33])

## [1.0.0][34] (2023-12-29)

#### ✨ Features

- **src:** disallow creating commands with conflicting names/aliases ([78bf8ff][35])

#### 🪄 Fixes

- Rename package from "black-flag" to "[@black-][36]flag/core" npm typosquat workaround ([292ead5][37])

#### ⚙️ Build System

- Fix horrible decision by marked devs to break output for no reason ([036e350][38])
- **jest:** ensure pkg-up is transformed ([c7f4aef][39])
- **jest:** fix transformIgnorePatterns ([0548d34][40])
- **jest:** transpile node\_modules ([5cf7a6c][41])
- **tsconfig:** fix internal path resolution ([fbe3a69][42])
- **tsconfig:** upgrade to NodeNext ([d3a499e][43])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/v1.2.5...v1.2.6
[4]: https://github.com/Xunnamius/black-flag/commit/35f66cc9d69f8434d03db49f067b4f7e03d4c58c
[5]: https://github.com/Xunnamius/black-flag/compare/v1.2.4...v1.2.5
[6]: https://github.com/Xunnamius/black-flag/commit/c201c2ff87c1119b9678e38acdc12918d2ed7fc2
[7]: https://github.com/Xunnamius/black-flag/commit/98815d1ef218af56e07493a921c66294f91101cf
[8]: https://github.com/Xunnamius/black-flag/compare/v1.2.3...v1.2.4
[9]: https://github.com/Xunnamius/black-flag/commit/d6618d370bd9a7264dad240856dc989a61071986
[10]: https://github.com/Xunnamius/black-flag/compare/v1.2.2...v1.2.3
[11]: https://github.com/Xunnamius/black-flag/commit/4b8c9759bc09f9b07593ce89446d4ec0e614db71
[12]: https://github.com/Xunnamius/black-flag/commit/4babf12308b7aab0ed319077701eb6f3a1fdf1d3
[13]: https://github.com/Xunnamius/black-flag/compare/v1.2.1...v1.2.2
[14]: https://github.com/Xunnamius/black-flag/commit/be2960a507c43b3db598157de4dcafe22ee8906e
[15]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[16]: https://github.com/Xunnamius/black-flag/commit/8bb025436d219c024a5d4a4a0ac59999440b7c13
[17]: https://github.com/Xunnamius/black-flag/compare/v1.2.0...v1.2.1
[18]: https://github.com/Xunnamius/black-flag/commit/2369534f63aa3858714bb81505d3fff4ed77c6b1
[19]: https://github.com/Xunnamius/black-flag/compare/v1.1.4...v1.2.0
[20]: https://github.com/Xunnamius/black-flag/commit/b5a1e58add31902fd9ec80b93dd37305b8fd0684
[21]: https://github.com/Xunnamius/black-flag/compare/v1.1.3...v1.1.4
[22]: https://github.com/Xunnamius/black-flag/commit/f66599bfdbb70ada6ec662e0d220a0a2e7047824
[23]: https://github.com/Xunnamius/black-flag/compare/v1.1.2...v1.1.3
[24]: https://github.com/Xunnamius/black-flag/commit/bad391da3019a5743a76ca2e510903f34c84ca53
[25]: https://github.com/Xunnamius/black-flag/commit/2f205c1e8c94d3e6683816e5bbc3ae152e3c83e8
[26]: https://github.com/Xunnamius/black-flag/compare/v1.1.1...v1.1.2
[27]: https://github.com/Xunnamius/black-flag/commit/f79c11476de47bee3fa01e139269393b604b4271
[28]: https://github.com/Xunnamius/black-flag/compare/v1.1.0...v1.1.1
[29]: https://github.com/Xunnamius/black-flag/commit/b6178c9670a95084bca34424e71498f2d29ac48c
[30]: https://github.com/Xunnamius/black-flag/compare/v1.0.0...v1.1.0
[31]: https://github.com/Xunnamius/black-flag/commit/0e5067e2b0913a19bdc6975b50b272bb5872ba98
[32]: https://github.com/Xunnamius/black-flag/commit/4f159dc4b84223dd6b07456c0b50da16d2816bea
[33]: https://github.com/Xunnamius/black-flag/commit/5470091e385ca344e12a280ff95be793742874b8
[34]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...v1.0.0
[35]: https://github.com/Xunnamius/black-flag/commit/78bf8ffb0a6931fb3b131c42ce4b84146bfec842
[36]: https://github.com/black-
[37]: https://github.com/Xunnamius/black-flag/commit/292ead5aa3f18c556d72d714830dcf07b9253e6d
[38]: https://github.com/Xunnamius/black-flag/commit/036e3506edc863da86372163c91dd650d6ac1e87
[39]: https://github.com/Xunnamius/black-flag/commit/c7f4aef48366dc13685fb9805086be52d3561eff
[40]: https://github.com/Xunnamius/black-flag/commit/0548d34f559c3b8ba6d9514f1586aeeb3b382f72
[41]: https://github.com/Xunnamius/black-flag/commit/5cf7a6c79bba3125ce47838e5cfd24a1a08bbd17
[42]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[43]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
