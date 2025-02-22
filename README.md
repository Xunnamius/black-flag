<!-- symbiote-template-region-start 1 -->

<p align="center" width="100%">
  <img width="300" src="https://raw.githubusercontent.com/Xunnamius/black-flag/refs/heads/main/logo.png">
</p>

<p align="center" width="100%">
<!-- symbiote-template-region-end -->
A declarative wrapper around Yargs for building beautiful, fluent command line interfaces <br /> <code>$ black-pearl hoist the colors --black-flag</code>
<!-- symbiote-template-region-start 2 -->
</p>

<hr />

<div align="center">

[![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]
[![Last commit timestamp][x-badge-lastcommit-image]][x-badge-repo-link]
[![Codecov][x-badge-codecov-image]][x-badge-codecov-link]
[![Source license][x-badge-license-image]][x-badge-license-link]
[![Uses Semantic Release!][x-badge-semanticrelease-image]][x-badge-semanticrelease-link]

[![NPM version][x-badge-npm-image]][x-badge-npm-link]
[![Monthly Downloads][x-badge-downloads-image]][x-badge-downloads-link]

</div>

<br />

# Black Flag 🏴

<!-- symbiote-template-region-end -->

Black Flag is a fairly thin library that wraps [yargs][1], extending its
capabilities with several powerful **declarative** features. It can be used to
create simple single-level CLIs or deeply nested sprawling interfaces alike.

Black Flag was built as a drop-in replacement for vanilla Yargs, specifically
for users of [`yargs::commandDir()`][2].

Its killer features include:

- [Declarative-first APIs](#declaratively-build-deep-command-hierarchies-) ✨
- [Zero configuration required](#convention-over-configuration-) ✨
- [It's still yargs all the way down](#its-yargs-all-the-way-down-) ✨ (nothing
  brand new to learn!)
- [Built-in support for dynamic options](#built-in-support-for-dynamic-options-)
  ✨ (a Yargs [white whale](https://github.com/yargs/yargs/issues/793))
- [Consistent and safe CLI execution](#run-your-tool-safely-and-consistently-)
  ✨
- [Simple comprehensive error handling and reporting](#simple-comprehensive-error-handling-and-reporting-)
  ✨
- [A pleasant unit, integration, and e2e testing experience](#a-pleasant-testing-experience-)
  ✨
- [Extensive intellisense support via TypeScript](#extensive-intellisense-support-)
  ✨

Black Flag is tested on Ubuntu and Windows 10, and like Yargs tracks Node.js LTS
versions.

- [Quick start](#quick-start)
- [Step-by-step getting started guide][28]
- [Black Flag versus vanilla Yargs][5]
- [Simple demo CLI project][10] (or `npx -p @black-flag/demo myctl --help`)
- [Black Flag recipes for solving common CLI design problems](./examples)
- [Yargs's intro documentation][5]

> [!TIP]
>
> If you find yourself a fan of Black Flag's more declarative DX and want to go
> all the way, check out [Black Flag Extensions][3] (BFE). BFE is a collection
> of surprisingly simple set-theoretic APIs that build on
> [`yargs::options()`](https://yargs.js.org/docs/#api-reference-optionskey-opt)
> for a **fully declarative developer experience**. BFE also protects you from
> [a couple Yargs footguns][4] that Black Flag by itself cannot.
>
> You may also be interested in
> [Black Flag Checks](https://github.com/Xunnamius/black-flag/blob/main/packages/checks)
> (BFC), which offers several pluggable
> [`yargs::check`](https://yargs.js.org/docs/#api-reference-checkfn-globaltrue)
> functions—like `checkIsNotNegative` and `checkArrayNotEmpty`—built to work
> with BFE.

<!-- symbiote-template-region-start 3 -->

---

<!-- remark-ignore-start -->
<!-- symbiote-template-region-end -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Features](#features)
  - [Declaratively Build Deep Command Hierarchies ✨](#declaratively-build-deep-command-hierarchies-)
  - [Built-In Support for Dynamic Options ✨](#built-in-support-for-dynamic-options-)
  - [It's Yargs All the Way down ✨](#its-yargs-all-the-way-down-)
  - [Run Your Tool Safely and Consistently ✨](#run-your-tool-safely-and-consistently-)
  - [Convention over Configuration ✨](#convention-over-configuration-)
  - [Simple Comprehensive Error Handling and Reporting ✨](#simple-comprehensive-error-handling-and-reporting-)
  - [A Pleasant Testing Experience ✨](#a-pleasant-testing-experience-)
  - [Built-In `debug` Integration for Runtime Insights ✨](#built-in-debug-integration-for-runtime-insights-)
  - [Extensive Intellisense Support ✨](#extensive-intellisense-support-)
- [Usage](#usage)
  - [Building and Running Your CLI](#building-and-running-your-cli)
  - [Testing Your CLI](#testing-your-cli)
- [Appendix 🏴](#appendix-)
  - [Terminology](#terminology)
  - [Differences between Black Flag and Yargs](#differences-between-black-flag-and-yargs)
  - [Advanced Usage](#advanced-usage)
  - [Inspiration](#inspiration)
  - [Published Package Details](#published-package-details)
  - [License](#license)
- [Contributing and Support](#contributing-and-support)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- symbiote-template-region-start 4 -->
<!-- remark-ignore-end -->

<br />

## Install

<!-- symbiote-template-region-end -->

To install:

```shell
npm install @black-flag/core
```

And if you're ready to go all in on Black Flag's declarative API, check out
[Black Flag Extensions][3]:

```shell
npm install @black-flag/extensions
```

## Quick Start

TODO

See also:

- [Step-by-step getting started guide][28]
- [Black Flag versus vanilla Yargs][5]
- [Simple demo CLI project][10] (or `npx -p @black-flag/demo myctl --help`)
- [Black Flag recipes for solving common CLI design problems](./examples)
- [Yargs's intro documentation][5]

For an example of a production CLI tool that puts Black Flag through its paces,
check out the source code for my meta project: [`@-xun/symbiote`][29].

## Appendix 🏴

<!-- symbiote-template-region-end -->

Further documentation can be found under [`docs/`][x-repo-docs] and
[`docs/api`](./docs/api). Common CLI design "recipes" can be found under
[`examples/`](./examples).

### Terminology

|      Term       | Description                                                                                                                                                                                                                                                                                                   |
| :-------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     command     | A "command" is a functional unit associated with a [configuration][27] file and represented internally as a trio of programs: [effector, helper, and router][42]. Further, each command is classified as one of: "pure parent" (root and parent), "parent-child" (parent and child), or "pure child" (child). |
|     program     | A "program" is a Yargs instance wrapped in a [`Proxy`][43] granting the instance an expanded set of features. Programs are represented internally by the [`Program`][44] type.                                                                                                                                |
|      root       | The tippy top command in your hierarchy of commands and the entry point for any Black Flag application. Also referred to as the "root command".                                                                                                                                                               |
| default command | A "default command" is [Yargs parlance][45] for the CLI entry point. Technically there is no concept of a "default command" at the Black Flag level, though there is the _root command_.                                                                                                                      |

### Inspiration

I love Yargs 💕 Yargs is the greatest! I've made dozens of CLI tools with Yargs,
each with drastically different interfaces and requirements. Some help manage
critical systems.

As I was copying-and-pasting some configs from past projects for yet another
tool, I realized the (irritatingly disparate 😖) structures of my CLI projects
up until this point were converging on a set of personal conventions around
Yargs. And, as I'm [always eager][63] to ["optimize" my workflows][64], I
wondered how much common functionality could be abstracted away.

The goal: make my CLIs more stable upon release, much faster to build, and more
pleasant to test. And also avoid Yargs's most egregious footguns. But perhaps
most important: I wanted CLIs that would remain simple and consistent to
maintain.

Throw in a re-watch of the PotC series and Black Flag was born! 🏴‍☠🍾

<!-- symbiote-template-region-start 6 -->

### Published Package Details

This is a [CJS2 package][x-pkg-cjs-mojito] with statically-analyzable exports
built by Babel for use in Node.js versions that are not end-of-life. For
TypeScript users, this package supports both `"Node10"` and `"Node16"` module
resolution strategies.

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start 7 -->

<details><summary>Expand details</summary>

That means both CJS2 (via `require(...)`) and ESM (via `import { ... } from ...`
or `await import(...)`) source will load this package from the same entry points
when using Node. This has several benefits, the foremost being: less code
shipped/smaller package size, avoiding [dual package
hazard][x-pkg-dual-package-hazard] entirely, distributables are not
packed/bundled/uglified, a drastically less complex build process, and CJS
consumers aren't shafted.

Each entry point (i.e. `ENTRY`) in [`package.json`'s
`exports[ENTRY]`][x-repo-package-json] object includes one or more [export
conditions][x-pkg-exports-conditions]. These entries may or may not include: an
[`exports[ENTRY].types`][x-pkg-exports-types-key] condition pointing to a type
declaration file for TypeScript and IDEs, a
[`exports[ENTRY].module`][x-pkg-exports-module-key] condition pointing to
(usually ESM) source for Webpack/Rollup, a `exports[ENTRY].node` and/or
`exports[ENTRY].default` condition pointing to (usually CJS2) source for Node.js
`require`/`import` and for browsers and other environments, and [other
conditions][x-pkg-exports-conditions] not enumerated here. Check the
[package.json][x-repo-package-json] file to see which export conditions are
supported.

Note that, regardless of the [`{ "type": "..." }`][x-pkg-type] specified in
[`package.json`][x-repo-package-json], any JavaScript files written in ESM
syntax (including distributables) will always have the `.mjs` extension. Note
also that [`package.json`][x-repo-package-json] may include the
[`sideEffects`][x-pkg-side-effects-key] key, which is almost always `false` for
optimal [tree shaking][x-pkg-tree-shaking] where appropriate.

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start 8 -->

</details>

### License

<!-- symbiote-template-region-end -->

See [LICENSE][x-repo-license].

<!-- symbiote-template-region-start 9 -->

## Contributing and Support

**[New issues][x-repo-choose-new-issue] and [pull requests][x-repo-pr-compare]
are always welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟
this project][x-badge-repo-link] to let me know you found it useful! ✊🏿 Or [buy
me a beer][x-repo-sponsor], I'd appreciate it. Thank you!

See [CONTRIBUTING.md][x-repo-contributing] and [SUPPORT.md][x-repo-support] for
more information.

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start 10 -->

### Contributors

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start root-package-only -->
<!-- remark-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- remark-ignore-end -->

Thanks goes to these wonderful people ([emoji
key][x-repo-all-contributors-emojis]):

<!-- remark-ignore-start -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://xunn.io/"><img src="https://avatars.githubusercontent.com/u/656017?v=4?s=100" width="100px;" alt="Bernard"/><br /><sub><b>Bernard</b></sub></a><br /><a href="#infra-Xunnamius" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/Xunnamius/black-flag/commits?author=Xunnamius" title="Code">💻</a> <a href="https://github.com/Xunnamius/black-flag/commits?author=Xunnamius" title="Documentation">📖</a> <a href="#maintenance-Xunnamius" title="Maintenance">🚧</a> <a href="https://github.com/Xunnamius/black-flag/commits?author=Xunnamius" title="Tests">⚠️</a> <a href="https://github.com/Xunnamius/black-flag/pulls?q=is%3Apr+reviewed-by%3AXunnamius" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- remark-ignore-end -->

This project follows the [all-contributors][x-repo-all-contributors]
specification. Contributions of any kind welcome!

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start workspace-package-only -->
<!-- (section elided by symbiote) -->
<!-- symbiote-template-region-end -->

[x-badge-blm-image]: https://xunn.at/badge-blm 'Join the movement!'
[x-badge-blm-link]: https://xunn.at/donate-blm
[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/Xunnamius/black-flag/main?style=flat-square&token=HWRIOBAAPW&flag=package.main_root
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/Xunnamius/black-flag
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/@black-flag/core?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-downloads-link]: https://npmtrends.com/@black-flag/core
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/Xunnamius/black-flag?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/@black-flag/core?style=flat-square
  "This package's source license"
[x-badge-license-link]:
  https://github.com/Xunnamius/black-flag/blob/main/LICENSE
[x-badge-npm-image]:
  https://xunn.at/npm-pkg-version/@black-flag/core
  'Install this package using npm or yarn!'
[x-badge-npm-link]: https://npm.im/@black-flag/core
[x-badge-repo-link]: https://github.com/Xunnamius/black-flag
[x-badge-semanticrelease-image]:
  https://xunn.at/badge-semantic-release
  'This repo practices continuous integration and deployment!'
[x-badge-semanticrelease-link]:
  https://github.com/semantic-release/semantic-release
[x-pkg-cjs-mojito]:
  https://dev.to/jakobjingleheimer/configuring-commonjs-es-modules-for-nodejs-12ed#publish-only-a-cjs-distribution-with-property-exports
[x-pkg-dual-package-hazard]:
  https://nodejs.org/api/packages.html#dual-package-hazard
[x-pkg-exports-conditions]:
  https://webpack.js.org/guides/package-exports#reference-syntax
[x-pkg-exports-module-key]:
  https://webpack.js.org/guides/package-exports#providing-commonjs-and-esm-version-stateless
[x-pkg-exports-types-key]:
  https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta#packagejson-exports-imports-and-self-referencing
[x-pkg-side-effects-key]:
  https://webpack.js.org/guides/tree-shaking#mark-the-file-as-side-effect-free
[x-pkg-tree-shaking]: https://webpack.js.org/guides/tree-shaking
[x-pkg-type]:
  https://github.com/nodejs/node/blob/8d8e06a345043bec787e904edc9a2f5c5e9c275f/doc/api/packages.md#type
[x-repo-all-contributors]: https://github.com/all-contributors/all-contributors
[x-repo-all-contributors-emojis]: https://allcontributors.org/docs/en/emoji-key
[x-repo-choose-new-issue]:
  https://github.com/Xunnamius/black-flag/issues/new/choose
[x-repo-contributing]: /CONTRIBUTING.md
[x-repo-docs]: docs
[x-repo-license]: ./LICENSE
[x-repo-package-json]: package.json
[x-repo-pr-compare]: https://github.com/Xunnamius/black-flag/compare
[x-repo-sponsor]: https://github.com/sponsors/Xunnamius
[x-repo-support]: /.github/SUPPORT.md
[1]: https://yargs.js.org
[2]: https://yargs.js.org/docs#api-reference-commanddirdirectory-opts
[3]: https://github.com/Xunnamius/black-flag/blob/main/packages/extensions
[4]: #irrelevant-differences
[5]: https://github.com/yargs/yargs/blob/HEAD/docs/examples.md
[6]: https://github.com/yargs/yargs/issues/793
[7]:
  https://github.com/yargs/yargs/blob/e517318cea0087b813f5de414b3cdec7b70efe33/docs/api.md
[8]: #differences-between-black-flag-and-yargs
[9]: #built-in-support-for-dynamic-options-
[10]: https://github.com/Xunnamius/black-flag-demo
[11]: ./docs/index/type-aliases/Configuration.md#type-declaration
[12]: ./docs/index/functions/runProgram.md
[13]:
  https://kostasbariotis.com/why-you-should-not-use-process-exit#what-should-we-do
[14]: ./docs/index/functions/configureProgram.md
[15]: ./docs/util/type-aliases/PreExecutionContext.md
[16]: https://en.wikipedia.org/wiki/Convention_over_configuration
[17]: ./docs/index/type-aliases/ConfigureErrorHandlingEpilogue.md
[18]: ./docs/util/classes/AssertionFailedError.md
[19]: ./docs/util/functions/makeRunner.md
[20]: ./docs/index/enumerations/FrameworkExitCode.md
[21]: #built-in-debug-integration-for-runtime-insights-
[22]: https://www.npmjs.com/package/debug
[23]: https://www.npmjs.com/package/debug#usage
[24]: ./docs/index/type-aliases/RootConfiguration.md
[25]: ./docs/index/type-aliases/ParentConfiguration.md
[26]: ./docs/index/type-aliases/ChildConfiguration.md
[27]: ./docs/index/type-aliases/Configuration.md
[28]: #building-and-running-your-cli
[29]: https://github.com/Xunnamius/symbiote/blob/main/src
[30]: #features
[31]: https://nodejs.org/api/packages.html#type
[32]: ./docs/util/type-aliases/ExecutionContext.md
[33]: ./docs/index/type-aliases/ConfigureExecutionContext.md
[34]:
  https://github.com/Xunnamius/black-flag/blob/fc0b42b7afe725aa3834fb3c5f83dd02223bbde7/src/constant.ts#L13
[35]: ./docs/index/type-aliases/ConfigureExecutionPrologue.md
[36]: https://www.npmjs.com/package/alpha-sort
[37]:
  https://github.com/yargs/yargs/blob/e517318cea0087b813f5de414b3cdec7b70efe33/docs/pi.md#user-content-groupkeys-groupname
[38]: https://www.npmjs.com/package/jest
[39]: https://builtin.com/software-engineering-perspectives/currying-javascript
[40]: https://jestjs.io/docs/jest-object#jestresetmodules
[41]: https://github.com/yargs/yargs/issues/2191
[42]: #advanced-usage
[43]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[44]: ./docs/util/type-aliases/Program.md
[45]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#default-commands
[46]:
  https://github.com/jestjs/jest/blob/e7280a2132f454d5939b22c4e9a7a05b30cfcbe6/packages/jest-util/Readme.md#deepcycliccopy
[47]:
  https://github.com/yargs/yargs/blob/HEAD/docs/api.md#user-content-middlewarecallbacks-applybeforevalidation
[48]: ./docs/index/type-aliases/ConfigureArguments.md
[49]: https://github.com/yargs/yargs/issues/733
[50]: https://github.com/yargs/yargs/issues/1323
[51]: https://github.com/yargs/yargs/issues/793#issuecomment-704749472
[52]: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
[53]: #generating-help-text
[54]: https://github.com/yargs/yargs/blob/main/docs/advanced.md#command-aliases
[55]: https://github.com/yargs/yargs-parser?tab=readme-ov-file#configuration
[56]: https://yargs.js.org/docs#api-reference-parseargs-context-parsecallback
[57]: https://github.com/yargs/yargs/issues/1137
[58]: #execution-flow-diagram
[59]: ./docs/util/type-aliases/ProgramMetadata.md
[60]: ./example-1.png
[61]: ./example-2.png
[63]: https://xkcd.com/1205
[64]: https://i.redd.it/0cm6yx27tez21.jpg
