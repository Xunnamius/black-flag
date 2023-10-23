<p align="center" width="100%">
  <img width="300" src="./black-flag.png">
</p>

<p align="center" width="100%">
  <code>$ black-pearl hoist the colors --black-flag</code>
</p>

<hr />

<!-- badges-start -->

<div align="center">

[![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]
[![Last commit timestamp][x-badge-lastcommit-image]][x-badge-repo-link]
[![Codecov][x-badge-codecov-image]][x-badge-codecov-link]
[![Source license][x-badge-license-image]][x-badge-license-link]
[![Uses Semantic Release!][x-badge-semanticrelease-image]][x-badge-semanticrelease-link]

[![NPM version][x-badge-npm-image]][x-badge-npm-link]
[![Monthly Downloads][x-badge-downloads-image]][x-badge-npm-link]

</div>

<!-- badges-end -->

<br />

# Black Flag

Though the code is already written (yay), the documentation is a work in
progress!

## Features 🏴

- Built on top of the amazing [yargs](https://www.npmjs.com/package/yargs)
  library.

- First-class support for creating sprawling deeply nested tree-like
  command/sub-command structures easily, consistently, and without incident.

- Filesystem-based command auto-discovery decouples your commands'
  implementations from Black Flag itself, which makes adding new commands as
  easy as dropping in a new file. Commands can be written in CJS (`.js`/`.cjs`)
  or ESM (`.js`/`.mjs`).

- Built-in support for
  [dynamic options](https://github.com/yargs/yargs/issues/793) (options that
  rely on the value of other options) via a new `argv` parameter on the
  [builder functions](https://github.com/yargs/yargs/blob/main/docs/api.md#commandmodule)
  of auto-discovered command modules. The extended builder signature looks like
  `builder(yargs: Yargs, helpOrVersionSet: boolean, argv: ParsedArguments | undefined)`.
  `argv` will be `undefined` when the builder should add all possible options
  and choices to `yargs`; otherwise, `argv` will be the same parsed arguments
  object that yargs passes to handler functions, allowing options to be
  configured/added to `yargs` conditionally.

- Easily retrieve a mapping of all registered commands and their corresponding
  yargs instances.

- Built from the ground up with a pleasant unit/integration testing experience
  in mind:

  - Auto-discovered commands are provided via individual importable modules
    entirely decoupled from yargs and Black Flag.
  - Configuration hooks, if used, are thin simple testable/mockable functions.
  - Black Flag provides a helper function for easily running commands:
    `runProgram(...)`.
  - See [`docs/`](#) and [`tests/`](#) for examples.

- Simple comprehensive error handling and reporting, including suggesting an
  exit code at the handler level without having to call `process.exit` (which is
  a disaster for unit testing).

- Consistent help text generation
  [across runtimes and operating systems](https://stackoverflow.com/a/56926465/1367414)
  (i.e. commands will appear alpha-sorted by full name rather than insertion
  order,
  [command groupings](https://github.com/yargs/yargs/blob/main/docs/api.md#user-content-groupkeys-groupname)
  are still respected, options are still enumerated in insertion order).

- Extensive [`debug`](https://www.npmjs.com/package/debug) integration allows
  deep insight into your commands' runtime without significant overhead or code
  changes. Simply set the `DEBUG` environment variable to the
  [appropriate value](https://www.npmjs.com/package/debug#usage).

- Easily stub out complex deeply-nested interfaces without having to provide
  implementation details right away (running an "unimplemented" command as an
  end-user will result in a `NotImplementedError`).

- Bring your own mutations to a global context object shared between all
  [command modules](https://github.com/yargs/yargs/blob/main/docs/api.md#commandmodule),
  handlers, builder functions, and the Black Flag framework itself, allowing for
  safe easy shared state and other advanced behavior.

- Convention is favored over configuration (Black Flag is so-called "zero
  config").

- Optional configuration hooks still available.

- You're still working with yargs instances, so there's no new interface to
  learn, all the current
  [yargs documentation](https://github.com/yargs/yargs/blob/main/docs/api.md)
  still applies, and there should be few if any compatibility issues with the
  existing yargs ecosystem.

- Yargs instances are configured with useful defaults (easily overridden in a
  configuration hook):

  - `fail(...)` (Black Flag configures a custom failure handler)
  - `showHelpOnFail(false)`
  - `wrap(yargs.terminalWidth())`
  - `strict(true)`
  - `exitProcess(false)`
  - `scriptName(fullName)`
  - `usage(...)`
  - `version(false)` (`version(pkgVersion || false)` for the root command)
  - `help(false).option('help', { boolean: true })` (parent commands only)

- Written in TypeScript with love.

## Deviations From Upstream 🏴

- The
  [`argv`](https://github.com/yargs/yargs/blob/main/docs/api.md#user-content-argv)
  magic property is soft-disabled (always returns `undefined`) so that deep
  cloning a yargs instance doesn't result in `parse` (_and command handlers!_)
  getting invoked several times, _even after an error occurred in an earlier
  invocation_, all of which can lead to undefined or even dangerous behavior.
  Who in their right mind is out here cloning yargs instances, you may ask?
  [Jest does so whenever you use certain asymmetric matchers.](https://github.com/jestjs/jest/blob/e7280a2132f454d5939b22c4e9a7a05b30cfcbe6/packages/jest-util/Readme.md#deepcycliccopy)
  Just use `parse()`/`parseAsync()` instead, it's only a few more characters 🙂

- Arbitrary parameters cannot appear in the command until the final
  command/sub-command is provided. For example:
  `treasure-chest retrieve --name piece-of-8` is okay while
  `treasure-chest --name piece-of-8 retrieve` will result in an error.
  Similarly: `treasure-chest retrieve --help` will work while
  `treasure-chest --help retrieve` will not.

- Though it would be trivial, yargs
  [middleware](https://github.com/yargs/yargs/blob/HEAD/docs/api.md#user-content-middlewarecallbacks-applybeforevalidation)
  isn't supported since the functionality is essentially covered by
  configuration hooks.

- A bug in yargs prevents `showHelp()`/`--help` from printing anything when
  using an async builder function (or promise-returning function) for a default
  command. I'm not the only one that has encountered
  [something like this](https://github.com/yargs/yargs/issues/793#issuecomment-704749472).
  However, Black Flag supports an asynchronous function as the value of
  `module.exports` in CJS code, and top-level await in ESM code, so if you
  really need an async builder function, hoist the async logic to work around
  this bug for now.

- `process.exit(...)` is never called (`process.exitCode` is used instead).

- Black Flag disables built-in `--help` handling for parent commands, replacing
  it with a custom functionally-identical solution where necessary.
  End-developers and their users will not notice the difference. The built-in
  functionality was disabled because it was interfering with the handoff between
  parent and child commands.

## Notes 🏴

- The types shipped with Yargs have a few small inconsistencies with the
  documentation, such as `BuilderCallback` not showing that vanilla yargs
  [builder functions](https://github.com/yargs/yargs/blob/main/docs/api.md#commandmodule)
  are invoked with a second parameter `helpOrVersionSet`.

[x-badge-blm-image]: https://xunn.at/badge-blm 'Join the movement!'
[x-badge-blm-link]: https://xunn.at/donate-blm
[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/Xunnamius/black-flag/main?style=flat-square&token=HWRIOBAAPW
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/Xunnamius/black-flag
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/black-flag?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/xunnamius/black-flag?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/black-flag?style=flat-square
  "This package's source license"
[x-badge-license-link]:
  https://github.com/Xunnamius/black-flag/blob/main/LICENSE
[x-badge-npm-image]:
  https://xunn.at/npm-pkg-version/black-flag
  'Install this package using npm or yarn!'
[x-badge-npm-link]: https://www.npmjs.com/package/black-flag
[x-badge-repo-link]: https://github.com/xunnamius/black-flag
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
  https://github.com/xunnamius/black-flag/issues/new/choose
[x-repo-contributing]: /CONTRIBUTING.md
[x-repo-docs]: docs
[x-repo-license]: ./LICENSE
[x-repo-package-json]: package.json
[x-repo-pr-compare]: https://github.com/xunnamius/black-flag/compare
[x-repo-support]: /.github/SUPPORT.md
