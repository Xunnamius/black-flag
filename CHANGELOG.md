# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

### [1.3.2][3] (2024-07-12)

#### 🪄 Fixes

- **src:** tweak error handling debug verboseness in certain edge cases ([96ce293][4])

### [1.3.1][5] (2024-07-12)

#### 🪄 Fixes

- **src:** add trap door to alert developer when erroneously re-entering top-level error handler ([99e2b3a][6])

## [1.3.0][7] (2024-07-12)

#### ✨ Features

- **`clierror`:** add `dangerouslyFatal` option, update `cause` option handling ([1c369fb][8])

### [1.2.7][9] (2024-06-30)

#### 🪄 Fixes

- **types:** pass through `CustomExecutionContext` as context type in `ImportedConfigurationModule` ([cdc6af5][10])

#### ⚙️ Build System

- **spellcheck-commit:** fix commit spellchecker ([6e7a268][11])

### [1.2.6][12] (2024-06-02)

#### 🪄 Fixes

- **src:** ignore --help and --version if they occur after -- in argv ([35f66cc][13])

### [1.2.5][14] (2024-05-30)

#### 🪄 Fixes

- **src:** permanently fix --version support regression in node\@22 ([c201c2f][15])

#### ⚙️ Build System

- **package:** append node\@22 to supported node versions ([98815d1][16])

### [1.2.4][17] (2024-03-27)

#### 🪄 Fixes

- **src:** explicitly ignore .d.ts files within command dirs ([d6618d3][18])

### [1.2.3][19] (2024-03-27)

#### 🪄 Fixes

- **package:** bump minimum node support to 20 LTS ([4b8c975][20])
- **src:** ignore unknown file extension errors when discovering commands ([4babf12][21])

### [1.2.2][22] (2024-03-21)

#### 🪄 Fixes

- No longer include default command when listing subcommands ([be2960a][23])

#### ⚙️ Build System

- **husky:** update to latest hooks ([75d5c66][24])
- **src:** do not filter to own methods when proxying and rebinding ([8bb0254][25])

### [1.2.1][26] (2024-03-19)

#### ⚙️ Build System

- **babel:** fix import specifier rewrite oversight ([2369534][27])

## [1.2.0][28] (2024-03-18)

#### ✨ Features

- Add `showHelp` option to `CliError` ([b5a1e58][29])

### [1.1.4][30] (2024-03-16)

#### 🪄 Fixes

- **types:** allow exported types to specify custom `ExecutionContext` ([f66599b][31])

### [1.1.3][32] (2024-03-15)

#### 🪄 Fixes

- Add support for `export default X` syntax ([bad391d][33])
- Ensure `demandOption` is properly supported ([2f205c1][34])

### [1.1.2][35] (2023-12-31)

#### 🪄 Fixes

- **readme:** move parserConfiguration call out of dead zone in example ([f79c114][36])

### [1.1.1][37] (2023-12-31)

#### 🪄 Fixes

- Fix Node10 type resolution failure ([b6178c9][38])

## [1.1.0][39] (2023-12-31)

#### ✨ Features

- **src:** support file://-style URLs ([0e5067e][40])

#### 🪄 Fixes

- **src:** ensure --version is included in help text output when relevant ([4f159dc][41])

#### ⚙️ Build System

- **babel:** fix ESM<=>CJS interop issue ([5470091][42])

## [1.0.0][43] (2023-12-29)

#### ✨ Features

- **src:** disallow creating commands with conflicting names/aliases ([78bf8ff][44])

#### 🪄 Fixes

- Rename package from "black-flag" to "[@black-][45]flag/core" npm typosquat workaround ([292ead5][46])

#### ⚙️ Build System

- Fix horrible decision by marked devs to break output for no reason ([036e350][47])
- **jest:** ensure pkg-up is transformed ([c7f4aef][48])
- **jest:** fix transformIgnorePatterns ([0548d34][49])
- **jest:** transpile node\_modules ([5cf7a6c][50])
- **tsconfig:** fix internal path resolution ([fbe3a69][51])
- **tsconfig:** upgrade to NodeNext ([d3a499e][52])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/v1.3.1...v1.3.2
[4]: https://github.com/Xunnamius/black-flag/commit/96ce293f8a136c82839c1e658d19dc9a2441c0ab
[5]: https://github.com/Xunnamius/black-flag/compare/v1.3.0...v1.3.1
[6]: https://github.com/Xunnamius/black-flag/commit/99e2b3aa8ebef83fdf414dda22ad11405c1907df
[7]: https://github.com/Xunnamius/black-flag/compare/v1.2.7...v1.3.0
[8]: https://github.com/Xunnamius/black-flag/commit/1c369fb8570c0b42acad78af66168f9b7f688dfc
[9]: https://github.com/Xunnamius/black-flag/compare/v1.2.6...v1.2.7
[10]: https://github.com/Xunnamius/black-flag/commit/cdc6af55387aac92b7d9fc16a57790068e4b6d49
[11]: https://github.com/Xunnamius/black-flag/commit/6e7a268bebe71f19120fd926b004f3cb9e490760
[12]: https://github.com/Xunnamius/black-flag/compare/v1.2.5...v1.2.6
[13]: https://github.com/Xunnamius/black-flag/commit/35f66cc9d69f8434d03db49f067b4f7e03d4c58c
[14]: https://github.com/Xunnamius/black-flag/compare/v1.2.4...v1.2.5
[15]: https://github.com/Xunnamius/black-flag/commit/c201c2ff87c1119b9678e38acdc12918d2ed7fc2
[16]: https://github.com/Xunnamius/black-flag/commit/98815d1ef218af56e07493a921c66294f91101cf
[17]: https://github.com/Xunnamius/black-flag/compare/v1.2.3...v1.2.4
[18]: https://github.com/Xunnamius/black-flag/commit/d6618d370bd9a7264dad240856dc989a61071986
[19]: https://github.com/Xunnamius/black-flag/compare/v1.2.2...v1.2.3
[20]: https://github.com/Xunnamius/black-flag/commit/4b8c9759bc09f9b07593ce89446d4ec0e614db71
[21]: https://github.com/Xunnamius/black-flag/commit/4babf12308b7aab0ed319077701eb6f3a1fdf1d3
[22]: https://github.com/Xunnamius/black-flag/compare/v1.2.1...v1.2.2
[23]: https://github.com/Xunnamius/black-flag/commit/be2960a507c43b3db598157de4dcafe22ee8906e
[24]: https://github.com/Xunnamius/black-flag/commit/75d5c66bcce8f0c2c139962f7ddd28aa0c9499d7
[25]: https://github.com/Xunnamius/black-flag/commit/8bb025436d219c024a5d4a4a0ac59999440b7c13
[26]: https://github.com/Xunnamius/black-flag/compare/v1.2.0...v1.2.1
[27]: https://github.com/Xunnamius/black-flag/commit/2369534f63aa3858714bb81505d3fff4ed77c6b1
[28]: https://github.com/Xunnamius/black-flag/compare/v1.1.4...v1.2.0
[29]: https://github.com/Xunnamius/black-flag/commit/b5a1e58add31902fd9ec80b93dd37305b8fd0684
[30]: https://github.com/Xunnamius/black-flag/compare/v1.1.3...v1.1.4
[31]: https://github.com/Xunnamius/black-flag/commit/f66599bfdbb70ada6ec662e0d220a0a2e7047824
[32]: https://github.com/Xunnamius/black-flag/compare/v1.1.2...v1.1.3
[33]: https://github.com/Xunnamius/black-flag/commit/bad391da3019a5743a76ca2e510903f34c84ca53
[34]: https://github.com/Xunnamius/black-flag/commit/2f205c1e8c94d3e6683816e5bbc3ae152e3c83e8
[35]: https://github.com/Xunnamius/black-flag/compare/v1.1.1...v1.1.2
[36]: https://github.com/Xunnamius/black-flag/commit/f79c11476de47bee3fa01e139269393b604b4271
[37]: https://github.com/Xunnamius/black-flag/compare/v1.1.0...v1.1.1
[38]: https://github.com/Xunnamius/black-flag/commit/b6178c9670a95084bca34424e71498f2d29ac48c
[39]: https://github.com/Xunnamius/black-flag/compare/v1.0.0...v1.1.0
[40]: https://github.com/Xunnamius/black-flag/commit/0e5067e2b0913a19bdc6975b50b272bb5872ba98
[41]: https://github.com/Xunnamius/black-flag/commit/4f159dc4b84223dd6b07456c0b50da16d2816bea
[42]: https://github.com/Xunnamius/black-flag/commit/5470091e385ca344e12a280ff95be793742874b8
[43]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...v1.0.0
[44]: https://github.com/Xunnamius/black-flag/commit/78bf8ffb0a6931fb3b131c42ce4b84146bfec842
[45]: https://github.com/black-
[46]: https://github.com/Xunnamius/black-flag/commit/292ead5aa3f18c556d72d714830dcf07b9253e6d
[47]: https://github.com/Xunnamius/black-flag/commit/036e3506edc863da86372163c91dd650d6ac1e87
[48]: https://github.com/Xunnamius/black-flag/commit/c7f4aef48366dc13685fb9805086be52d3561eff
[49]: https://github.com/Xunnamius/black-flag/commit/0548d34f559c3b8ba6d9514f1586aeeb3b382f72
[50]: https://github.com/Xunnamius/black-flag/commit/5cf7a6c79bba3125ce47838e5cfd24a1a08bbd17
[51]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[52]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
