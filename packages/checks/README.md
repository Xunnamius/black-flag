<!-- symbiote-template-region-start 1 -->

<p align="center" width="100%">
  <img width="300" src="https://raw.githubusercontent.com/Xunnamius/black-flag/refs/heads/main/packages/checks/logo.png">
</p>

<p align="center" width="100%">
<!-- symbiote-template-region-end -->
A collection of general purpose check functions for yargs and Black Flag
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

# @black-flag/checks

<!-- symbiote-template-region-end -->

A collection of general purpose [check functions][1] for yargs and Black Flag.

<!-- symbiote-template-region-start 3 -->

---

<!-- remark-ignore-start -->
<!-- symbiote-template-region-end -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Usage](#usage)
  - [`checkArrayNoConflicts`](#checkarraynoconflicts)
  - [`checkArrayNotEmpty`](#checkarraynotempty)
  - [`checkArrayUnique`](#checkarrayunique)
  - [`checkIsNotNegative`](#checkisnotnegative)
  - [`checkIsNotNil`](#checkisnotnil)
- [Appendix](#appendix)
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
npm install @black-flag/checks
```

## Usage

BFC provides the below functions, each of which can be plugged into Black Flag's
(or Yargs's) [`check` builder property][1].

### `checkArrayNoConflicts`

> ⪢ API reference: [`checkArrayNoConflicts`][2]

> [!WARNING]
>
> A non-[array type option][3] will always fail this check regardless of the
> argument value.

This check passes when at most only one element from each `conflict` tuple is
present in the array.

```typescript
import { withBuilderExtensions } from '@black-flag/extensions';
import { checkArrayNoConflicts } from '@black-flag/checks';

export const name = 'my-command';

export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    string: true,
    array: true,
    check: checkArrayNoConflicts('x', [
      ['1', '2'], // <-- one "conflict tuple"
      ['3', '4', '5'] // <-- another "conflict tuple"
    ])
  }
});

export const handler = withHandlerExtensions(async (argv) => {
  // ...
});
```

```shell
$ my-command            ✅
$ my-command -x         ✅
$ my-command -x 1       ✅
$ my-command -x 2       ✅
$ my-command -x 1 3 6   ✅

$ my-command -x 2 1     ❌
Array option "x" allows only one of the following values: 1, 2
$ my-command -x 2 4 0 5 ❌
Array option "x" allows only one of the following values: 3, 4, 5
```

### `checkArrayNotEmpty`

> ⪢ API reference: [`checkArrayNotEmpty`][4]

> [!WARNING]
>
> A non-[array type option][3] will always fail this check regardless of the
> argument value.

This check passes when each member of an array-type argument is a non-empty
non-nullish value and the array itself is non-empty.

```typescript
import { withBuilderExtensions } from '@black-flag/extensions';
import { checkArrayNoConflicts } from '@black-flag/checks';

export const name = 'my-command';

export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    string: true,
    array: true,
    check: checkArrayNotEmpty('x')
  }
});

export const handler = withHandlerExtensions(async (argv) => {
  // ...
});
```

```shell
$ my-command            ✅
$ my-command -x 1       ✅
$ my-command -x 2       ✅
$ my-command -x 1 3 6   ✅

$ my-command -x         ❌
Array option "x" requires at least one non-empty value
$ my-command -x ''      ❌
Array option "x" requires at least one non-empty value
```

### `checkArrayUnique`

> ⪢ API reference: [`checkArrayUnique`][5]

> [!WARNING]
>
> A non-[array type option][3] will always fail this check regardless of the
> argument value.

This check passes when each element in the array is unique.

```typescript
import { withBuilderExtensions } from '@black-flag/extensions';
import { checkArrayNoConflicts } from '@black-flag/checks';

export const name = 'my-command';

export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    string: true,
    array: true,
    check: checkArrayUnique('x')
  }
});

export const handler = withHandlerExtensions(async (argv) => {
  // ...
});
```

```shell
$ my-command              ✅
$ my-command -x           ✅
$ my-command -x 1         ✅
$ my-command -x 2         ✅
$ my-command -x 1 3 6     ✅

$ my-command -x 1 1       ❌
Array option "x" must contain only unique values
$ my-command -x true true ❌
Array option "x" must contain only unique values
```

### `checkIsNotNegative`

> ⪢ API reference: [`checkIsNotNegative`][6]

This check passes when an argument value is a non-negative number.

```typescript
import { withBuilderExtensions } from '@black-flag/extensions';
import { checkArrayNoConflicts } from '@black-flag/checks';

export const name = 'my-command';

export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    number: true,
    check: checkIsNotNegative('x')
  }
});

export const handler = withHandlerExtensions(async (argv) => {
  // ...
});
```

```shell
$ my-command              ✅
$ my-command -x           ✅
$ my-command -x 1         ✅
$ my-command -x 2         ✅
$ my-command -x 0         ✅

$ my-command -x -1        ❌
Array option "x" must have a non-negative value
$ my-command -x -5        ❌
Array option "x" must have a non-negative value
```

### `checkIsNotNil`

> ⪢ API reference: [`checkIsNotNil`][7]

This check passes when an argument value is not falsy.

```typescript
import { withBuilderExtensions } from '@black-flag/extensions';
import { checkArrayNoConflicts } from '@black-flag/checks';

export const name = 'my-command';

export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    string: true,
    check: checkIsNotNil('x'),
    coerce(arg: string) {
      switch (arg) {
        case '0': {
          return 0;
        }

        case 'false': {
          return false;
        }

        case 'null': {
          return null;
        }

        case 'undefined': {
          return undefined;
        }
      }

      return arg;
    }
  }
});

export const handler = withHandlerExtensions(async (argv) => {
  // ...
});
```

```shell
$ my-command              ✅
$ my-command -x 1         ✅
$ my-command -x -1        ✅
$ my-command -x zero      ✅
$ my-command -x '!true'   ✅

$ my-command -x           ❌
Array option "x" must have a non-empty (non-falsy) value
$ my-command -x ''        ❌
Array option "x" must have a non-empty (non-falsy) value
$ my-command -x 0         ❌
Array option "x" must have a non-empty (non-falsy) value
$ my-command -x false     ❌
Array option "x" must have a non-empty (non-falsy) value
$ my-command -x null      ❌
Array option "x" must have a non-empty (non-falsy) value
$ my-command -x undefined ❌
Array option "x" must have a non-empty (non-falsy) value
```

<!-- symbiote-template-region-start 5 -->

## Appendix

<!-- symbiote-template-region-end -->

Further documentation can be found under [`docs/`][x-repo-docs].

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
<!-- (section elided by symbiote) -->
<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start workspace-package-only -->

See the [table of contributors][x-repo-contributors].

<!-- symbiote-template-region-end -->

[x-badge-blm-image]: https://xunn.at/badge-blm 'Join the movement!'
[x-badge-blm-link]: https://xunn.at/donate-blm
[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/Xunnamius/black-flag/main?style=flat-square&token=HWRIOBAAPW&flag=package.main_checks
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/Xunnamius/black-flag
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/@black-flag/checks?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-downloads-link]: https://npmtrends.com/@black-flag/checks
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/Xunnamius/black-flag?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/@black-flag/checks?style=flat-square
  "This package's source license"
[x-badge-license-link]:
  https://github.com/Xunnamius/black-flag/blob/main/LICENSE
[x-badge-npm-image]:
  https://xunn.at/npm-pkg-version/@black-flag/checks
  'Install this package using npm or yarn!'
[x-badge-npm-link]: https://npm.im/@black-flag/checks
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
[x-repo-choose-new-issue]:
  https://github.com/Xunnamius/black-flag/issues/new/choose
[x-repo-contributing]: /CONTRIBUTING.md
[x-repo-contributors]: /README.md#contributors
[x-repo-docs]: docs
[x-repo-license]: ./LICENSE
[x-repo-package-json]: package.json
[x-repo-pr-compare]: https://github.com/Xunnamius/black-flag/compare
[x-repo-sponsor]: https://github.com/sponsors/Xunnamius
[x-repo-support]: /.github/SUPPORT.md
[1]:
  ../extensions/docs/index/type-aliases/BfeBuilderObjectValueExtensions.md#check
[2]: ./docs/index/functions/checkArrayNoConflicts.md
[3]: https://yargs.js.org/docs#api-reference-arraykey
[4]: ./docs/index/functions/checkArrayNotEmpty.md
[5]: ./docs/index/functions/checkArrayUnique.md
[6]: ./docs/index/functions/checkIsNotNegative.md
[7]: ./docs/index/functions/checkIsNotNil.md
