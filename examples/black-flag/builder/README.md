[examples][1] / [black-flag][2] / builder

# Black Flag: `builder` options

In this example we demonstrate using every relevant [Yargs builder `opt`][3] in
Black Flag. They are:

- [`alias`][4]: alias(es) for the canonical option key
- [`array`][5]: interpret option as an array
- [`boolean`][6]: interpret option as a boolean flag
- [`choices`][7]: limit valid option arguments to a predefined set
- [`coerce`][8]: coerce or transform parsed command line values into another
  value
- [`config`][9]: interpret option as a path to a JSON config file
- [`configParser`][10]: provide a custom config parsing function
- [`conflicts`][11]: require certain keys not to be set
- [`count`][12]: interpret option as a count of boolean flags
- [`default`][13]: set a default value for the option
- [`defaultDescription`][13]: use this description for the default value in help
  content
- [`demandOption`][14]: demand the option be given with optional error message
- [`deprecate/deprecated`][15]: mark option as deprecated
- [`desc/describe/description`][16]: the option description for help content
- [`group`][17]: when displaying usage instructions place the option under an
  alternative group heading
- [`hidden`][18]: don’t display option in help output
- [`implies`][19]: require certain keys to be set
- [`nargs`][20]: specify how many arguments should be consumed for the option
- [`normalize`][21]: apply `path.normalize()` to the option
- [`number`][22]: interpret option as a number
- [`string`][23]: interpret option as a string
- [`type`][24]: one of: `'array'`, `'boolean'`, `'count'`, `'number'`,
  `'string'`

The following builder `opts`, while still technically valid, are not useful (or
necessary) in Black Flag:

<!-- lint ignore -->

- ~~global~~ Doesn't really mean anything in Black Flag ([why?][25])
- ~~skipValidation~~ Seems to have no effect when using `yargs@17.7.2`'s
  commands-based API (possibly a bug in Yargs) (see [`subOptionOf`][26] instead)

## Run This Example

1. Change directory to this example
2. Run `npm install`
3. Execute `npx builder`

You can also run this example's tests by executing `npm test`.

[1]: ../../README.md
[2]: ../README.md
[3]: https://yargs.js.org/docs#api-reference-optionskey-opt
[4]: https://yargs.js.org/docs#api-reference-aliaskey-alias
[5]: https://yargs.js.org/docs#array
[6]: https://yargs.js.org/docs#boolean
[7]: https://yargs.js.org/docs#choices
[8]: https://yargs.js.org/docs#coerce
[9]: https://yargs.js.org/docs#config
[10]: https://yargs.js.org/docs#configParser
[11]: https://yargs.js.org/docs#conflicts
[12]: https://yargs.js.org/docs#count
[13]: https://yargs.js.org/docs#default
[14]: https://yargs.js.org/docs#demandOption
[15]: https://yargs.js.org/docs#deprecated
[16]: https://yargs.js.org/docs#description
[17]: https://yargs.js.org/docs#group
[18]: https://yargs.js.org/docs#hidden
[19]: https://yargs.js.org/docs#implies
[20]: https://yargs.js.org/docs#nargs
[21]: https://yargs.js.org/docs#normalize
[22]: https://yargs.js.org/docs#number
[23]: https://yargs.js.org/docs#string
[24]: https://yargs.js.org/docs#type
[25]: ../../../docs/advanced.md
[26]: ../../../packages/extensions/README.md#suboptionof
