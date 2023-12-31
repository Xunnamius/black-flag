# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

## [1.1.0][3] (2023-12-31)

#### ✨ Features

- **src:** support file://-style URLs ([0e5067e][4])

#### 🪄 Fixes

- **src:** ensure --version is included in help text output when relevant ([4f159dc][5])

#### ⚙️ Build System

- **babel:** fix ESM<=>CJS interop issue ([5470091][6])

## [1.0.0][7] (2023-12-29)

#### ✨ Features

- **src:** disallow creating commands with conflicting names/aliases ([78bf8ff][8])

#### 🪄 Fixes

- Rename package from "black-flag" to "[@black-][9]flag/core" npm typosquat workaround ([292ead5][10])

#### ⚙️ Build System

- Fix horrible decision by marked devs to break output for no reason ([036e350][11])
- **jest:** ensure pkg-up is transformed ([c7f4aef][12])
- **jest:** fix transformIgnorePatterns ([0548d34][13])
- **jest:** transpile node\_modules ([5cf7a6c][14])
- **tsconfig:** fix internal path resolution ([fbe3a69][15])
- **tsconfig:** upgrade to NodeNext ([d3a499e][16])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/black-flag/compare/v1.0.0...v1.1.0
[4]: https://github.com/Xunnamius/black-flag/commit/0e5067e2b0913a19bdc6975b50b272bb5872ba98
[5]: https://github.com/Xunnamius/black-flag/commit/4f159dc4b84223dd6b07456c0b50da16d2816bea
[6]: https://github.com/Xunnamius/black-flag/commit/5470091e385ca344e12a280ff95be793742874b8
[7]: https://github.com/Xunnamius/black-flag/compare/d3a499e7aeddf23d392479b2cf99cc98bce8226f...v1.0.0
[8]: https://github.com/Xunnamius/black-flag/commit/78bf8ffb0a6931fb3b131c42ce4b84146bfec842
[9]: https://github.com/black-
[10]: https://github.com/Xunnamius/black-flag/commit/292ead5aa3f18c556d72d714830dcf07b9253e6d
[11]: https://github.com/Xunnamius/black-flag/commit/036e3506edc863da86372163c91dd650d6ac1e87
[12]: https://github.com/Xunnamius/black-flag/commit/c7f4aef48366dc13685fb9805086be52d3561eff
[13]: https://github.com/Xunnamius/black-flag/commit/0548d34f559c3b8ba6d9514f1586aeeb3b382f72
[14]: https://github.com/Xunnamius/black-flag/commit/5cf7a6c79bba3125ce47838e5cfd24a1a08bbd17
[15]: https://github.com/Xunnamius/black-flag/commit/fbe3a699a9063ed7da08311a22fe798672583b0f
[16]: https://github.com/Xunnamius/black-flag/commit/d3a499e7aeddf23d392479b2cf99cc98bce8226f
