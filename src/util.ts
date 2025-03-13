import { isNativeError } from 'node:util/types';

import { $executionContext, nullArguments$0 } from 'universe:constant.ts';

import type {
  Arguments,
  ExecutionContext,
  NullArguments,
  PreExecutionContext
} from 'universe:types/program.ts';

type StringOrRegExp = string | RegExp;

type Lines = (
  | StringOrRegExp
  | [name: StringOrRegExp | RegExp, description: string | RegExp]
)[];

const trimEscapedNewlinesRegExp = /^(?:\\n|\s)*(.*?)(?:\\n|\s)*$/s;

/**
 * Type-guard for {@link PreExecutionContext}.
 */
export function isPreExecutionContext(obj: unknown): obj is PreExecutionContext {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'commands' in obj &&
    'debug' in obj &&
    'state' in obj &&
    'execute' in obj &&
    'rootPrograms' in obj &&
    'executionContext' in obj
  );
}

/**
 * Type-guard for {@link NullArguments}.
 */
export function isNullArguments(obj: unknown): obj is NullArguments {
  return isArguments(obj) && obj.$0 === nullArguments$0 && obj._.length === 0;
}

/**
 * Type-guard for {@link Arguments}.
 */
export function isArguments(obj: unknown): obj is Arguments {
  return (
    !!obj &&
    typeof obj === 'object' &&
    '$0' in obj &&
    typeof obj.$0 === 'string' &&
    '_' in obj &&
    Array.isArray(obj._) &&
    $executionContext in obj
  );
}

/**
 * Type-guard for Node's "ERR_ASSERTION" so-called `SystemError`.
 */
export function isAssertionSystemError(
  error: unknown
): error is NodeJS.ErrnoException & {
  generatedMessage: boolean;
  code: 'ERR_ASSERTION';
  actual?: unknown;
  expected?: unknown;
  operator: string;
} {
  return (
    isNativeError(error) &&
    'code' in error &&
    error.code === 'ERR_ASSERTION' &&
    'actual' in error &&
    'expected' in error &&
    'operator' in error
  );
}

/**
 * Creates an object with a "hidden" `[$executionContext]` property.
 *
 * @internal
 */
export function wrapExecutionContext(context: ExecutionContext) {
  return { [$executionContext]: context };
}

/**
 * Uppercase the first letter of a string.
 */
export function capitalize(str: string) {
  return (str.at(0)?.toUpperCase() || '') + str.slice(1);
}

/**
 * Accepts an `error` and returns the value of its `.cause` property if (1)
 * `error` extends `Error` and (2) the `.cause` property exists and is not
 * falsy; otherwise, `error` itself is returned. This action is performed
 * recursively (.e.g. `error.cause.cause.cause...`) until a value without a
 * non-falsy `.cause` property is encountered.
 *
 * This function can be used to extract the true cause of a `CliError` and/or
 * nested `Error`s.
 */
export function getDeepestErrorCause(error: unknown): unknown {
  return isNativeError(error) && error.cause ? getDeepestErrorCause(error.cause) : error;
}

/**
 * `expectedHelpTextRegExp` is a testing helper function that returns a regular
 * expression capable of matching standard Black Flag help text output with high
 * fidelity. Use this function to easily match the result of calling `--help` on
 * a command or otherwise examining a command's help text output, such as when
 * an error occurs that shows help text.
 *
 * You can pass `false` to `usage`, or `undefined` to
 * `commandGroups`/`optionGroups` to omit that property from the regular
 * expression entirely. You can also pass `true` to `usage`, which will add an
 * expression matching the rest of the line (including the final newline).
 *
 * Any strings given will have any regular expression characters escaped via
 * `RegExp.escape`.
 *
 * Any RegExps given will have their flags (`/.../g`, `/.../i`, etc) and other
 * properties stripped, leaving only their source. The expression returned by
 * this function will similarly use no flags.
 *
 * Newlines will be inserted between sections/groups automatically.
 */
export function expectedHelpTextRegExp({
  parentFullName,
  usage = true,
  commandGroups,
  optionGroups,
  startsWith: start = /^/,
  endsWith: end = /$/
}: {
  /**
   * The full name of the parent command as a string or regular expression. It
   * will be appended to the beginning of each child command name in
   * `commandGroups`.
   */
  parentFullName?: StringOrRegExp;
  /**
   * Accepts a usage string or regular expression, `false` to skip matching the
   * usage section entirely, or `true` to match at least one character
   * non-greedily.
   *
   * @default true
   */
  usage?: boolean | string | RegExp;
  /**
   * `commandGroups` is an mapping of command groups (e.g. `"Positionals"`,
   * `"Commands"`) to their lines and accepts an array of: strings, regular
   * expressions, or arrays of tuples of the form `[expectedName: string/RegExp,
   * expectedDescription: string/RegExp]`, each matching a line. If a line's
   * description is omitted, an expression matching to the end of the line
   * (including the final newline) will be appended.
   *
   * If `parentFullName` is given, command names will have `parentFullName + '
   * '` prepended to them.
   *
   * If `commandGroups` is undefined, no additional characters will be added to
   * the resulting regular expression.
   *
   * @default undefined
   */
  commandGroups?: Record<string, Lines>;
  /**
   * `optionGroups` is an mapping of option groups (e.g. `"Options"`) to their
   * lines and accepts an array of: strings, regular expressions, or arrays of
   * tuples of the form `[expectedName: string/RegExp, expectedDescription:
   * string/RegExp]`, each matching a line. If a line's description is omitted,
   * an expression matching to the end of the line (including the final newline)
   * will be appended.
   *
   * If `optionGroups` is undefined, no additional characters will be added to
   * the resulting regular expression.
   *
   * @default undefined
   */
  optionGroups?: Record<string, Lines>;
  /**
   * `startsWith` describes the characters that must exist at the very start of
   * the text. This can be used to make an expression that partially matches.
   *
   * Note that the assembled regular expression, before `startsWith` is
   * prepended to it, is trimmed.
   *
   * @default /^/
   */
  startsWith?: StringOrRegExp;
  /**
   * `endsWith` describes the characters that must exist at the very end of the
   * text. This can be used to make an expression that partially matches.
   *
   * Note that the assembled regular expression, before `endsWith` is appended
   * to it, is trimmed.
   *
   * @default /$/
   */
  endsWith?: StringOrRegExp;
}) {
  let regExpString = '';

  regExpString += stringOrRegExpToString(start);

  regExpString +=
    usage === true
      ? String.raw`(.|\n)+?`
      : usage === false
        ? ''
        : stringOrRegExpToString(usage);

  Object.entries(commandGroups || {}).forEach(([group, lines], index) => {
    regExpString +=
      String.raw`${index === 0 ? '\n' : ''}\n${stringOrRegExpToString(group)}:\n` +
      lines
        .map((line) => {
          return String.raw`\s+${
            parentFullName ? stringOrRegExpToString(parentFullName) : ''
          }\s+${stringOrRegExpToString(
            Array.isArray(line) ? line[0] : line
          )}\s*${Array.isArray(line) ? stringOrRegExpToString(line[1]) : ''}[^\n]*\n`;
        })
        .join('');
  });

  regExpString = regExpString.match(trimEscapedNewlinesRegExp)![1]!;

  Object.entries(optionGroups || {}).forEach(([group, lines], index) => {
    regExpString +=
      String.raw`${index === 0 ? '\n' : ''}\n${stringOrRegExpToString(group)}:\n` +
      lines
        .map((line) => {
          return String.raw`\s+${stringOrRegExpToString(
            Array.isArray(line) ? line[0] : line
          )}\s*${Array.isArray(line) ? stringOrRegExpToString(line[1]) : ''}[^\n]*\n`;
        })
        .join('');
  });

  regExpString = regExpString.match(trimEscapedNewlinesRegExp)![1]!;
  regExpString += stringOrRegExpToString(end);

  return new RegExp(regExpString);
}

function stringOrRegExpToString(stringOrRegExp: StringOrRegExp): string;
function stringOrRegExpToString(
  stringOrRegExp: StringOrRegExp | undefined
): string | undefined;
function stringOrRegExpToString(
  stringOrRegExp: StringOrRegExp | undefined
): string | undefined {
  return typeof stringOrRegExp === 'string'
    ? // @ts-expect-error: remove this comment once latest types libs are updated
      RegExp.escape(stringOrRegExp)
    : stringOrRegExp?.source;
}
