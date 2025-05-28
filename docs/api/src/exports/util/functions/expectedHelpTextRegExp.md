[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / expectedHelpTextRegExp

# Function: expectedHelpTextRegExp()

> **expectedHelpTextRegExp**(`__namedParameters`): `RegExp`

Defined in: [src/util.ts:132](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/util.ts#L132)

`expectedHelpTextRegExp` is a testing helper function that returns a regular
expression capable of matching standard Black Flag help text output with high
fidelity. Use this function to easily match the result of calling `--help` on
a command or otherwise examining a command's help text output, such as when
an error occurs that shows help text.

You can pass `false` to `usage`, or `undefined` to
`commandGroups`/`optionGroups` to omit that property from the regular
expression entirely. You can also pass `true` to `usage`, which will add an
expression matching the rest of the line (including the final newline).

Any strings given will have any regular expression characters escaped via
`RegExp.escape`.

Any RegExps given will have their flags (`/.../g`, `/.../i`, etc) and other
properties stripped, leaving only their source. The expression returned by
this function will similarly use no flags.

Newlines will be inserted between sections/groups automatically.

## Parameters

### \_\_namedParameters

#### commandGroups?

`Record`\<`string`, `Lines`\>

`commandGroups` is an mapping of command groups (e.g. `"Positionals"`,
`"Commands"`) to their lines and accepts an array of: strings, regular
expressions, or arrays of tuples of the form `[expectedName: string/RegExp,
expectedDescription: string/RegExp]`, each matching a line. If a line's
description is omitted, an expression matching to the end of the line
(including the final newline) will be appended.

If `parentFullName` is given, command names will have `parentFullName + '
'` prepended to them.

If `commandGroups` is undefined, no additional characters will be added to
the resulting regular expression.

**Default**

```ts
undefined
```

#### endsWith?

`StringOrRegExp` = `...`

`endsWith` describes the characters that must exist at the very end of the
text. This can be used to make an expression that partially matches.

Note that the assembled regular expression, before `endsWith` is appended
to it, is trimmed.

**Default**

```ts
/$/
```

#### optionGroups?

`Record`\<`string`, `Lines`\>

`optionGroups` is an mapping of option groups (e.g. `"Options"`) to their
lines and accepts an array of: strings, regular expressions, or arrays of
tuples of the form `[expectedName: string/RegExp, expectedDescription:
string/RegExp]`, each matching a line. If a line's description is omitted,
an expression matching to the end of the line (including the final newline)
will be appended.

If `optionGroups` is undefined, no additional characters will be added to
the resulting regular expression.

**Default**

```ts
undefined
```

#### parentFullName?

`StringOrRegExp`

The full name of the parent command as a string or regular expression. It
will be appended to the beginning of each child command name in
`commandGroups`.

#### startsWith?

`StringOrRegExp` = `...`

`startsWith` describes the characters that must exist at the very start of
the text. This can be used to make an expression that partially matches.

Note that the assembled regular expression, before `startsWith` is
prepended to it, is trimmed.

**Default**

```ts
/^/
```

#### usage?

`string` \| `boolean` \| `RegExp` = `true`

Accepts a usage string or regular expression, `false` to skip matching the
usage section entirely, or `true` to match at least one character
non-greedily.

**Default**

```ts
true
```

## Returns

`RegExp`
