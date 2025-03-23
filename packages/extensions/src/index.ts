import { isDeepStrictEqual } from 'node:util';
import { isNativeError } from 'node:util/types';

import { safeDeepClone } from '@-xun/js';

import {
  $executionContext,
  CliError,
  FrameworkExitCode,
  isCliError
} from '@black-flag/core';

import { CommandNotImplementedError } from '@black-flag/core/util';
import toCamelCase from 'lodash.camelcase';
import { createDebugLogger } from 'rejoinder';
// ? Black Flag will always come with its own yargs dependency
// {@symbiote/notInvalid yargs}
import makeVanillaYargs from 'yargs/yargs';

import { globalDebuggerNamespace } from 'universe+extensions:constant.ts';
import { BfeErrorMessage } from 'universe+extensions:error.ts';

import {
  $artificiallyInvoked,
  $canonical,
  $exists,
  $genesis
} from 'universe+extensions:symbols.ts';

import type { SafeDeepCloneOptions } from '@-xun/js';

import type {
  Arguments,
  Configuration,
  ImportedConfigurationModule
} from '@black-flag/core';

import type {
  EffectorProgram,
  ExecutionContext,
  FrameworkArguments,
  HelperProgram
} from '@black-flag/core/util';

import type {
  Entries,
  LiteralUnion,
  Merge,
  OmitIndexSignature,
  Promisable,
  StringKeyOf
} from 'type-fest';

// ? We use the version of yargs bundled with black flag
// {@symbiote/notInvalid yargs}
import type { ParserConfigurationOptions } from 'yargs';
import type { KeyValueEntry } from 'universe+extensions:error.ts';

/**
 * Internal metadata derived from analysis of a {@link BfeBuilderObject}.
 */
type OptionsMetadata = {
  /**
   * An array of groups of canonical option names and their expected values that
   * must always appear in argv at the same time.
   */
  required: FlattenedExtensionValue[];
  /**
   * An array of groups of canonical option names and their expected values that
   * cannot appear in argv at the same time.
   */
  conflicted: FlattenedExtensionValue[];
  /**
   * An array of groups of both canonical (under `$canonical`) and expanded
   * option names, and their expected values, that are implied by the existence
   * of some other option.
   *
   * This object contains expanded along with canonical option names because it
   * is merged into argv before it's passed to a command handler.
   */
  implied: (FlattenedExtensionValue & { [$canonical]: Record<string, unknown> })[];
  /**
   * An array of canonical option names whose implications are considered
   * loosely satisfiable (see docs for details).
   */
  implyLoosely: string[];
  /**
   * An array of canonical option names whose implications are considered
   * vacuously satisfiable (see docs for details).
   */
  implyVacuously: string[];
  /**
   * An array of groups of canonical option names and their expected values that
   * are demanded condition on the existence of some other option.
   */
  demandedIf: FlattenedExtensionValue[];
  /**
   * An array of canonical option names and their expected values that are
   * considered non-optional but that do not fall into any of the other
   * demandedX groups.
   */
  demanded: string[];
  /**
   * An array of groups of demanded disjunctive canonical option names and their
   * expected values.
   */
  demandedAtLeastOne: FlattenedExtensionValue[];
  /**
   * An array of groups of demanded mutually exclusive canonical option names
   * and their expected values.
   */
  demandedMutuallyExclusive: FlattenedExtensionValue[];
  /**
   * An array of canonical option names that are considered optional.
   */
  optional: string[];
  /**
   * A mapping of canonical option names and their expansions to their default
   * values.
   *
   * This object contains expanded along with canonical option names because it
   * is merged into argv before it's passed to a command handler.
   */
  defaults: Record<string, unknown>;
  /**
   * A mapping of canonical option names to check functions.
   */
  checks: Record<
    string,
    NonNullable<
      BfeBuilderObjectValueExtensions<Record<string, unknown>, ExecutionContext>['check']
    >
  >;
  /**
   * Since yargs-parser configuration might result in an option's canonical name
   * being stripped out of argv, we need to track a key-value mapping between
   * each valid permutations of an option's canonical name (any of which may be
   * seen in argv) and said canonical name (as seen in the builder object).
   */
  optionNamesAsSeenInArgv: { [keyPotentiallySeenInArgv: string]: string };
  /**
   * This is used to ensure option names, aliases, and their expansions are not
   * colliding with one another.
   */
  optionNames: Set<string>;
  /**
   * This is used to track which options have specified their own group
   * configurations. This is used during automatic grouping to figure out
   * which options belong to which groups.
   */
  customGroups: Record<string, string[]>;
};

/**
 * A flattened {@link BfeBuilderObjectValueExtensionObject} value type with
 * additional data (i.e. {@link $exists} values and {@link $genesis} keys).
 */
type FlattenedExtensionValue = Record<
  string,
  // ? This type is written like this for posterity
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  BfeBuilderObjectValueExtensionObject[string] | typeof $exists
> & { [$genesis]?: string };

const alphaSort = new Intl.Collator(undefined, { numeric: true });

export { $artificiallyInvoked, BfeErrorMessage };

/**
 * The function type of the `builder` export accepted by Black Flag.
 */
export type BfBuilderFunction<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = Extract<
  Configuration<CustomCliArguments, CustomExecutionContext>['builder'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Function
>;

/**
 * The object type of the `builder` export accepted by Black Flag.
 */
export type BfBuilderObject<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = Exclude<
  Configuration<CustomCliArguments, CustomExecutionContext>['builder'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Function
>;

/**
 * The object value type of a {@link BfBuilderObject}.
 *
 * Equivalent to `yargs.Options` as of yargs\@17.7.2.
 */
export type BfBuilderObjectValue<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = BfBuilderObject<CustomCliArguments, CustomExecutionContext>[string];

/**
 * The generic object value type of a {@link BfBuilderObject}.
 */
export type BfGenericBuilderObjectValue = BfBuilderObjectValue<
  Record<string, unknown>,
  ExecutionContext
>;

/**
 * A version of the object type of the `builder` export accepted by Black Flag
 * that supports BFE's additional functionality.
 */
export type BfeBuilderObject<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = {
  [key: string]: BfeBuilderObjectValue<CustomCliArguments, CustomExecutionContext>;
};

/**
 * The object value type of a {@link BfeBuilderObject}.
 */
export type BfeBuilderObjectValue<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = BfeBuilderObjectValueWithoutExtensions &
  BfeBuilderObjectValueExtensions<CustomCliArguments, CustomExecutionContext>;

/**
 * An object containing only those properties recognized by
 * BFE.
 *
 * This type + {@link BfeBuilderObjectValueWithoutExtensions} =
 * {@link BfeBuilderObjectValue}.
 */
export type BfeBuilderObjectValueExtensions<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = {
  /**
   * `requires` enables checks to ensure the specified arguments, or
   * argument-value pairs, are given conditioned on the existence of another
   * argument. For example:
   *
   * ```jsonc
   * {
   *   "x": { "requires": "y" }, // ◄ Disallows x without y
   *   "y": {}
   * }
   * ```
   *
   * Note: if an argument-value pair is specified and said argument is
   * configured as an array (`{ array: true }`), it will be searched for the
   * specified value. Otherwise, a strict deep equality check is performed.
   */
  requires?: BfeBuilderObjectValueExtensionValue;
  /**
   * `conflicts` enables checks to ensure the specified arguments, or
   * argument-value pairs, are _never_ given conditioned on the existence of
   * another argument. For example:
   *
   * ```jsonc
   * {
   *   "x": { "conflicts": "y" }, // ◄ Disallows y if x is given
   *   "y": {}
   * }
   * ```
   *
   * Note: if an argument-value pair is specified and said argument is
   * configured as an array (`{ array: true }`), it will be searched for the
   * specified value. Otherwise, a strict deep equality check is performed.
   */
  conflicts?: BfeBuilderObjectValueExtensionValue;
  /**
   * `demandThisOptionIf` enables checks to ensure an argument is given when at
   * least one of the specified groups of arguments, or argument-value pairs, is
   * also given. For example:
   *
   * ```jsonc
   * {
   *   "x": {},
   *   "y": { "demandThisOptionIf": "x" }, // ◄ Demands y if x is given
   *   "z": { "demandThisOptionIf": "x" } // ◄ Demands z if x is given
   * }
   * ```
   *
   * Note: if an argument-value pair is specified and said argument is
   * configured as an array (`{ array: true }`), it will be searched for the
   * specified value. Otherwise, a strict deep equality check is performed.
   */
  demandThisOptionIf?: BfeBuilderObjectValueExtensionValue;
  /**
   * `demandThisOption` enables checks to ensure an argument is always given.
   * This is equivalent to `demandOption` from vanilla yargs. For example:
   *
   * ```jsonc
   * {
   *   "x": { "demandThisOption": true }, // ◄ Disallows ∅, y
   *   "y": { "demandThisOption": false }
   * }
   * ```
   */
  demandThisOption?: BfGenericBuilderObjectValue['demandOption'];
  /**
   * `demandThisOptionOr` enables non-optional inclusive disjunction checks per
   * group. Put another way, `demandThisOptionOr` enforces a "logical or"
   * relation within groups of required options. For example:
   *
   * ```jsonc
   * {
   *   "x": { "demandThisOptionOr": ["y", "z"] }, // ◄ Demands x or y or z
   *   "y": { "demandThisOptionOr": ["x", "z"] },
   *   "z": { "demandThisOptionOr": ["x", "y"] }
   * }
   * ```
   *
   * Note: if an argument-value pair is specified and said argument is
   * configured as an array (`{ array: true }`), it will be searched for the
   * specified value. Otherwise, a strict deep equality check is performed.
   */
  demandThisOptionOr?: BfeBuilderObjectValueExtensionValue;
  /**
   * `demandThisOptionXor` enables non-optional exclusive disjunction checks per
   * exclusivity group. Put another way, `demandThisOptionXor` enforces mutual
   * exclusivity within groups of required options. For example:
   *
   * ```jsonc
   * {
   *   // ▼ Disallows ∅, z, w, xy, xyw, xyz, xyzw
   *   "x": { "demandThisOptionXor": ["y"] },
   *   "y": { "demandThisOptionXor": ["x"] },
   *   // ▼ Disallows ∅, x, y, zw, xzw, yzw, xyzw
   *   "z": { "demandThisOptionXor": ["w"] },
   *   "w": { "demandThisOptionXor": ["z"] }
   * }
   * ```
   *
   * Note: if an argument-value pair is specified and said argument is
   * configured as an array (`{ array: true }`), it will be searched for the
   * specified value. Otherwise, a strict deep equality check is performed.
   */
  demandThisOptionXor?: BfeBuilderObjectValueExtensionValue;
  /**
   * `implies` will set default values for the specified arguments conditioned
   * on the existence of another argument. These implied defaults will override
   * any `default` configurations of the specified arguments.
   *
   * If any of the specified arguments are explicitly given on the command line,
   * their values must match the specified argument-value pairs respectively
   * (which is the behavior of `requires`/`conflicts`). Use `looseImplications`
   * to modify this behavior.
   *
   * Hence, `implies` only accepts one or more argument-value pairs and not raw
   * strings. For example:
   *
   * ```jsonc
   * {
   *   "x": { "implies": { "y": true } }, // ◄ x is now synonymous with xy
   *   "y": {}
   * }
   * ```
   *
   * @see {@link BfeBuilderObjectValueExtensions.looseImplications}
   * @see {@link BfeBuilderObjectValueExtensions.vacuousImplications}
   */
  implies?:
    | Exclude<BfeBuilderObjectValueExtensionValue, string | unknown[]>
    | Exclude<BfeBuilderObjectValueExtensionValue, string | unknown[]>[];
  /**
   * When `looseImplications` is set to `true`, any implied arguments, when
   * explicitly given on the command line, will _override_ their configured
   * implications instead of causing an error.
   *
   * @default false
   * @see {@link BfeBuilderObjectValueExtensions.implies}
   */
  looseImplications?: boolean;
  /**
   * When `vacuousImplications` is set to `true` and the option is also
   * configured as a "boolean" type, the implications configured via `implies`
   * will still be applied to `argv` even if said option has a `false` value in
   * `argv`. In the same scenario except with `vacuousImplications` set to
   * `false`, the implications configured via `implies` are instead ignored.
   *
   * @default false
   * @see {@link BfeBuilderObjectValueExtensions.implies}
   */
  vacuousImplications?: boolean;
  /**
   * `check` is the declarative option-specific version of vanilla yargs's
   * `yargs::check()`. It also supports async and promise-returning functions.
   *
   * This function receives the `currentArgumentValue`, which you are free to
   * type as you please, and the fully parsed `argv`. If this function throws,
   * the exception will bubble. If this function returns an instance of `Error`,
   * a string, or any non-truthy value (including `undefined` or not returning
   * anything), Black Flag will throw a `CliError` on your behalf.
   *
   * You may also pass an array of check functions, each being executed after
   * the other. Note that providing an array of one or more async check
   * functions will result in them being awaited concurrently.
   *
   * Note that `check` runs _at the very end of Black Flag's second parsing
   * pass_, meaning it runs _after_ things like `coerce` and `subOptionOf`, and
   * therefore receives the _final_ version of `argv` (the one passed to a
   * command's `handler`).
   *
   * See [the
   * documentation](https://github.com/Xunnamius/black-flag/tree/main/packages/extensions/README.md#check)
   * for details.
   */
  check?:
    | BfeCheckFunction<CustomCliArguments, CustomExecutionContext>
    | BfeCheckFunction<CustomCliArguments, CustomExecutionContext>[];
  /**
   * `subOptionOf` is declarative sugar around Black Flag's support for double
   * argument parsing, allowing you to describe the relationship between options
   * and the suboptions whose configurations they determine.
   *
   * See [the
   * documentation](https://github.com/Xunnamius/black-flag/tree/main/packages/extensions/README.md#suboptionof)
   * for details.
   *
   * For describing simpler implicative relations, see `implies`.
   */
  subOptionOf?: Record<
    string,
    | BfeSubOptionOfExtensionValue<CustomCliArguments, CustomExecutionContext>
    | BfeSubOptionOfExtensionValue<CustomCliArguments, CustomExecutionContext>[]
  >;
  /**
   * `default` will set a default value for an argument. This is equivalent to
   * `default` from vanilla yargs.
   *
   * However, unlike vanilla yargs and Black Flag, this default value is applied
   * towards the end of BFE's execution, enabling its use alongside keys like
   * `conflicts`. See [the
   * documentation](https://github.com/Xunnamius/black-flag/tree/main/packages/extensions/README.md#support-for-default-with-conflictsrequiresetc)
   * for details.
   *
   * Note also that a defaulted argument will not be coerced by the `coerce`
   * setting. Only arguments given via `argv` trigger `coerce`. This is vanilla
   * yargs behavior.
   */
  default?: unknown;
  /**
   * `coerce` transforms an original `argv` value into another one. This is
   * equivalent to `coerce` from vanilla yargs.
   *
   * However, unlike vanilla yargs and Black Flag, the `coerce` function will
   * _always_ receive an array if the option was configured with `{ array: true
   * }`.
   *
   * Note that **a defaulted argument will not result in this function being
   * called.** Only arguments given via `argv` trigger `coerce`. This is vanilla
   * yargs behavior.
   */
  coerce?: BfGenericBuilderObjectValue['coerce'];
};

/**
 * The string/object/array type of a {@link BfeBuilderObjectValueExtensions}.
 *
 * This type is a superset of {@link BfeBuilderObjectValueExtensionObject}.
 */
export type BfeBuilderObjectValueExtensionValue =
  | string
  | BfeBuilderObjectValueExtensionObject
  | (string | BfeBuilderObjectValueExtensionObject)[];

/**
 * The object type of a {@link BfeBuilderObjectValueExtensions}.
 *
 * This type is a subset of {@link BfeBuilderObjectValueExtensionValue}.
 */
export type BfeBuilderObjectValueExtensionObject = Record<string, unknown>;

/**
 * An object containing a subset of only those properties recognized by
 * Black Flag (and, consequentially, vanilla yargs). Also excludes
 * properties that conflict with {@link BfeBuilderObjectValueExtensions} and/or
 * are deprecated by vanilla yargs.
 *
 * This type + {@link BfeBuilderObjectValueExtensions} =
 * {@link BfeBuilderObjectValue}.
 *
 * This type is a subset of {@link BfBuilderObjectValue}.
 */
export type BfeBuilderObjectValueWithoutExtensions = Omit<
  BfGenericBuilderObjectValue,
  | 'conflicts'
  | 'implies'
  | 'demandOption'
  | 'demand'
  | 'require'
  | 'required'
  | 'default'
  | 'coerce'
>;

/**
 * A {@link BfeBuilderObjectValue} instance with the `subOptionOf` BFE key
 * omitted.
 */
export type BfeBuilderObjectValueWithoutSubOptionOfExtension<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = Omit<
  BfeBuilderObjectValue<CustomCliArguments, CustomExecutionContext>,
  'subOptionOf'
>;

/**
 * The array element type of
 * {@link BfeBuilderObjectValueExtensions.subOptionOf}.
 */
export type BfeSubOptionOfExtensionValue<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = {
  /**
   * This function receives the `superOptionValue` of the so-called "super
   * option" (i.e. `key` in `{ subOptionOf: { key: { when: ... }}}`), which you
   * are free to type as you please, and the fully parsed `argv` (not including
   * any default values). This function must return a boolean indicating whether
   * the `update` function should run or not.
   *
   * Note that this function is only invoked if the super option is given on the
   * command line. If it is not, neither this function nor `update` will ever
   * run. Therefore, if your updater should run whenever the super option is
   * given, regardless of its value, it is acceptable to use `{ when: () => true
   * }`
   */
  when: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    superOptionValue: any,
    argv: Arguments<CustomCliArguments, CustomExecutionContext>
  ) => boolean;
  /**
   * This function receives the current configuration for this option
   * (`oldOptionConfig`) and the fully parsed `argv` (not including any default
   * values), and must return the new configuration for this option.
   *
   * This configuration will completely overwrite the old configuration. To
   * extend the old configuration instead, spread it. For example:
   *
   * ```javascript
   * return {
   *   ...oldOptionConfig,
   *   description: 'New description'
   * }
   * ```
   */
  update:
    | ((
        oldOptionConfig: BfeBuilderObjectValueWithoutSubOptionOfExtension<
          CustomCliArguments,
          CustomExecutionContext
        >,
        argv: Arguments<CustomCliArguments, CustomExecutionContext>
      ) => BfeBuilderObjectValueWithoutSubOptionOfExtension<
        CustomCliArguments,
        CustomExecutionContext
      >)
    | BfeBuilderObjectValueWithoutSubOptionOfExtension<
        CustomCliArguments,
        CustomExecutionContext
      >;
};

/**
 * This function is used to validate an argument passed to Black Flag.
 *
 * @see {@link BfeBuilderObjectValueExtensions.check}
 */
export type BfeCheckFunction<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentArgumentValue: any,
  argv: Arguments<CustomCliArguments, CustomExecutionContext>
) => Promisable<unknown>;

/**
 * This function implements several additional optionals-related units of
 * functionality. This function is meant to take the place of a command's
 * `builder` export.
 *
 * This type cannot be instantiated by direct means. Instead, it is created and
 * returned by {@link withBuilderExtensions}.
 *
 * @see {@link withBuilderExtensions}
 */
export type BfeBuilderFunction<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = (
  ...args: Parameters<BfBuilderFunction<CustomCliArguments, CustomExecutionContext>>
) => BfBuilderObject<CustomCliArguments, CustomExecutionContext>;

/**
 * A stricter version of Black Flag's
 * [Arguments](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/type-aliases/Arguments.md)
 * type that explicitly omits the fallback indexers for unrecognized arguments.
 * Even though it is the runtime equivalent of `Arguments`, using this type
 * allows intellisense to report bad/misspelled/missing arguments from `argv` in
 * various places where it otherwise couldn't.
 *
 * **This type is intended for intellisense purposes only.**
 */
export type BfeStrictArguments<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> =
  // ? Strangely, OmitIndexSignature kills our symbol-based props and has other
  // ? weird side effects. If something strange is going on with the types and
  // ? you've come this far, it's probably OmitIndexSignature's fault.
  OmitIndexSignature<Arguments<CustomCliArguments, CustomExecutionContext>> &
    FrameworkArguments<CustomExecutionContext> & { [$artificiallyInvoked]?: boolean };

/**
 * A stricter version of Black Flag's
 * [ExecutionContext](https://github.com/Xunnamius/black-flag/blob/main/docs/api/src/exports/util/type-aliases/ExecutionContext.md)
 * type that explicitly omits the fallback indexers for unrecognized properties.
 * Even though it is the runtime equivalent of `ExecutionContext`, using this
 * type allows intellisense to report bad/misspelled/missing arguments from
 * `context` in various places where it otherwise couldn't.
 *
 * **This type is intended for intellisense purposes only.**
 */
export type AsStrictExecutionContext<CustomExecutionContext extends ExecutionContext> =
  OmitIndexSignature<Exclude<CustomExecutionContext, 'state'>> &
    OmitIndexSignature<CustomExecutionContext['state']>;

/**
 * A version of Black Flag's `builder` function parameters that exclude yargs
 * methods that are not supported by BFE.
 *
 * @see {@link withBuilderExtensions}
 */
export type BfeCustomBuilderFunctionParameters<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext,
  P = Parameters<BfBuilderFunction<CustomCliArguments, CustomExecutionContext>>
> = P extends [infer R, ...infer S]
  ? S extends [infer T, ...infer _U]
    ? [
        blackFlag: R & { options: never; option: never },
        T,
        (
          | BfeStrictArguments<Partial<CustomCliArguments>, CustomExecutionContext>
          | undefined
        )
      ]
    : [blackFlag: R & { options: never; option: never }, ...S]
  : never;

/**
 * This function implements several additional optionals-related units of
 * functionality. The return value of this function is meant to take the place
 * of a command's `handler` export.
 *
 * This type cannot be instantiated by direct means. Instead, it is created and
 * returned by {@link withBuilderExtensions}.
 *
 * Note that `customHandler` provides a stricter constraint than Black Flag's
 * `handler` command export in that `customHandler`'s `argv` parameter type
 * explicitly omits the fallback indexer for unrecognized arguments. This
 * means all possible arguments must be included in {@link CustomCliArguments}.
 *
 * @see {@link withBuilderExtensions}
 */
export type WithHandlerExtensions<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = (
  customHandler?: (
    argv: BfeStrictArguments<CustomCliArguments, CustomExecutionContext>
  ) => Promisable<void>
) => Configuration<CustomCliArguments, CustomExecutionContext>['handler'];

/**
 * The array of extended exports and high-order functions returned by
 * {@link withBuilderExtensions}.
 */
export type WithBuilderExtensionsReturnType<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = [
  builder: BfeBuilderFunction<CustomCliArguments, CustomExecutionContext>,
  withHandlerExtensions: WithHandlerExtensions<
    CustomCliArguments,
    CustomExecutionContext
  >
];

/**
 * A configuration object that further configures the behavior of
 * {@link withBuilderExtensions}.
 */
export type WithBuilderExtensionsConfig<
  CustomCliArguments extends Record<string, unknown>
> = {
  /**
   * Set to `true` to disable BFE's support for automatic grouping of related
   * options.
   *
   * See [the
   * documentation](https://github.com/Xunnamius/black-flag/blob/main/packages/extensions/README.md#automatic-grouping-of-related-options)
   * for details.
   *
   * @default false
   */
  disableAutomaticGrouping?: boolean;
  /**
   * Set to `true` to enable BFE's support for automatic sorting of options.
   *
   * See [the
   * documentation](https://github.com/Xunnamius/black-flag/blob/main/packages/extensions/README.md#automatic-sorting-of-options)
   * for details.
   *
   * @default false
   */
  enableAutomaticSorting?: boolean;
  /**
   * An array of zero or more string keys of `CustomCliArguments`, with the
   * optional addition of `'help'` and `'version'`, that should be grouped under
   * _"Common Options"_ when [automatic grouping of related
   * options](https://github.com/Xunnamius/black-flag/blob/main/packages/extensions/README.md#automatic-sorting-of-options)
   * is enabled.
   *
   * This setting is ignored if `disableAutomaticGrouping === true`.
   *
   * @default ['help']
   */
  commonOptions?: readonly LiteralUnion<
    keyof CustomCliArguments | 'help' | 'version',
    string
  >[];
};

/**
 * This function enables several additional options-related units of
 * functionality via analysis of the returned options configuration object and
 * the parsed command line arguments (argv).
 *
 * @see {@link WithBuilderExtensionsReturnType}
 */
export function withBuilderExtensions<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
>(
  customBuilder?:
    | BfeBuilderObject<CustomCliArguments, CustomExecutionContext>
    | ((
        ...args: BfeCustomBuilderFunctionParameters<
          CustomCliArguments,
          CustomExecutionContext
        >
        // ? This is a valid use of "void" here
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      ) => BfeBuilderObject<CustomCliArguments, CustomExecutionContext> | void),
  {
    commonOptions = ['help'],
    disableAutomaticGrouping = false,
    enableAutomaticSorting = false
  }: WithBuilderExtensionsConfig<CustomCliArguments> = {}
): WithBuilderExtensionsReturnType<CustomCliArguments, CustomExecutionContext> {
  const xbuilderDebug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:withBuilderExtensions`
  });

  xbuilderDebug('entered withBuilderExtensions function');

  // * Defined by second-pass builder; used by handler
  let optionsMetadata: OptionsMetadata | undefined = undefined;

  // * Dealing with defaulted keys is a little tricky since we need to pass them
  // * to yargs for proper help text generation while also somehow getting yargs
  // * to ignore them when constructing argv. The solution is to unset defaulted
  // * arguments (which yargs-parser tracks) at the start of the second pass (so
  // * userland builders don't see them, subOptionOf doesn't see them, and yargs
  // * doesn't complain about them), and then do the same thing again at the
  // * start of the handler extension's execution (so requires/conflicts/implies
  // * etc do not see them), and then manually insert the defaults (and
  // * implications) into argv before running userland checks (which SHOULD see
  // * them). We need to keep the latest Program instance around to accomplish
  // * all of that, along with the latest builder object and parser
  // * configuration.
  let latestProgram: HelperProgram | EffectorProgram | undefined = undefined;
  // * These latter two must also be stored because the second pass might
  // * modify the builder object or even the parser configuration! This is
  // * important because we need to figure out all aliases and name expansions.
  let latestBfBuilderObject:
    | BfeBuilderObject<CustomCliArguments, CustomExecutionContext>
    | undefined = undefined;
  let latestBfParserConfiguration: Partial<ParserConfigurationOptions> | undefined =
    undefined;

  xbuilderDebug('exited withBuilderExtensions function');

  return [
    function builder(blackFlag, helpOrVersionSet, argv) {
      const builderDebug = xbuilderDebug.extend('builder');
      const isFirstPass = !argv;
      const isSecondPass = !isFirstPass;

      builderDebug('entered withBuilderExtensions::builder wrapper function');

      builderDebug('isFirstPass: %O', isFirstPass);
      builderDebug('isSecondPass: %O', isSecondPass);
      builderDebug('current argv: %O', argv);

      let defaultedOptions: Record<string, true> | undefined = undefined;

      if (isSecondPass) {
        defaultedOptions = (
          latestProgram as unknown as {
            parsed?: { defaulted?: Record<string, true> };
          }
        ).parsed?.defaulted;

        hardAssert(
          defaultedOptions,
          BfeErrorMessage.UnexpectedlyFalsyDetailedArguments()
        );

        // ? We delete defaulted arguments from argv so that the end developer's
        // ? custom builder doesn't see them either (includes expansions/aliases)
        deleteDefaultedArguments({ argv, defaultedOptions });
      }

      latestProgram = blackFlag as unknown as HelperProgram | EffectorProgram;

      builderDebug('calling customBuilder (if a function) and returning builder object');
      // ? We make a deep clone of whatever options object we're passed
      // ? since there's a good chance we may be committing some light mutating
      let builderObject = safeDeepClone(
        (typeof customBuilder === 'function'
          ? customBuilder(
              blackFlag as BfeCustomBuilderFunctionParameters<
                CustomCliArguments,
                CustomExecutionContext
              >[0],
              helpOrVersionSet,
              argv as BfeCustomBuilderFunctionParameters<
                CustomCliArguments,
                CustomExecutionContext
              >[2]
            )
          : customBuilder) || {}
      );

      // ? We delete undefined default properties since they cause trouble later
      // TODO: it may be possible to support them; maybe revisit this eventually
      Object.values(builderObject).forEach((builderObjectValue) => {
        if (builderObjectValue.default === undefined) {
          delete builderObjectValue.default;
        }
      });

      if (enableAutomaticSorting) {
        builderDebug(
          `commencing automatic options sorting (${isFirstPass ? 'first' : 'second'} pass)`
        );

        const keys = Object.keys(builderObject).sort((k1, k2) =>
          alphaSort.compare(k1, k2)
        );

        builderObject = Object.fromEntries(keys.map((k) => [k, builderObject[k]!]));
      }

      builderDebug(
        'builderObject (maybe auto-sorted; undefined defaults deleted): %O',
        builderObject
      );

      if (isSecondPass) {
        // * Apply the subOptionOf key per option config and then elide it
        Object.entries(builderObject).forEach(([subOption, subOptionConfig]) => {
          const { subOptionOf } = subOptionConfig;

          if (subOptionOf) {
            builderDebug('evaluating suboption configuration for %O', subOption);

            Object.entries(subOptionOf).forEach(([superOption, updaters_]) => {
              const updaters = [updaters_].flat();

              builderDebug(
                'saw entry for super-option %O (%O potential updates)',
                superOption,
                updaters.length
              );

              updaters.forEach(({ when, update }, index) => {
                if (superOption in argv && when(argv[superOption], argv)) {
                  subOptionConfig =
                    typeof update === 'function'
                      ? update(subOptionConfig, argv)
                      : update;

                  builderDebug(
                    'accepted configuration update #%o to suboption %O: %O',
                    index + 1,
                    subOption,
                    subOptionConfig
                  );
                } else {
                  builderDebug(
                    'rejected configuration update #%o to suboption %O: when() returned falsy',
                    index + 1,
                    subOption
                  );
                }
              });
            });

            builderObject[subOption] = subOptionConfig;
            builderDebug(
              'applied suboption configuration for %O',
              builderObject[subOption]
            );
          }

          delete subOptionConfig.subOptionOf;
        });
      }

      const parserConfiguration = getParserConfigurationFromBlackFlagInstance(blackFlag);
      const optionLocalMetadata = analyzeBuilderObject({
        builderObject,
        commonOptions,
        parserConfiguration
      });

      builderDebug('option local metadata: %O', optionLocalMetadata);

      // * Automatic grouping happens on both first pass and second pass
      if (!disableAutomaticGrouping) {
        builderDebug(
          `commencing automatic options grouping (${isFirstPass ? 'first' : 'second'} pass)`
        );

        const {
          demanded,
          demandedAtLeastOne,
          demandedMutuallyExclusive,
          optional,
          customGroups
        } = optionLocalMetadata;

        if (demanded.length) {
          blackFlag.group(demanded, 'Required Options:');
          builderDebug('added "Required" grouping: %O', demanded);
        }

        demandedAtLeastOne.forEach((group, index) => {
          const count = index + 1;
          const options = Object.keys(group);

          blackFlag.group(
            options,
            `Required Options ${demandedAtLeastOne.length > 1 ? `${count} ` : ''}(at least one):`
          );

          builderDebug(
            `added "Required (at least one)" grouping #%O: %O`,
            count,
            options
          );
        });

        demandedMutuallyExclusive.forEach((group, index) => {
          const count = index + 1;
          const options = Object.keys(group);

          blackFlag.group(
            options,
            `Required Options ${demandedAtLeastOne.length > 1 ? `${count} ` : ''}(mutually exclusive):`
          );

          builderDebug(
            `added "Required (mutually exclusive)" grouping #%O: %O`,
            count,
            options
          );
        });

        for (const [groupName, options] of Object.entries(customGroups)) {
          blackFlag.group(options, groupName);
          builderDebug(`added custom "${groupName}" grouping: %O`, options);
        }

        if (optional.length) {
          blackFlag.group(optional, 'Optional Options:');
          builderDebug('added "Optional" grouping: %O', optional);
        }

        if (commonOptions.length) {
          const commonOptions_ = commonOptions.map((o) => String(o));
          blackFlag.group(commonOptions_, 'Common Options:');
          builderDebug('added "Common" grouping: %O', commonOptions_);
        }
      } else {
        builderDebug(
          `automatic options grouping disabled (at ${isFirstPass ? 'first' : 'second'} pass)`
        );
      }

      if (isSecondPass) {
        optionsMetadata = optionLocalMetadata;
        builderDebug('stored option local metadata => option metadata');
      }

      latestBfBuilderObject = builderObject;
      latestBfParserConfiguration = parserConfiguration;

      builderDebug('stored latestBfBuilderObject and latestBfParserConfiguration');
      builderDebug('transmuting BFE builder to BF builder');

      const finalBuilderObject = transmuteBFEBuilderToBFBuilder({
        builderObject,
        deleteGroupProps: !disableAutomaticGrouping,
        isGeneratingSecondPassHelpText: helpOrVersionSet && isSecondPass,
        optionsMetadata,
        argv
      });

      builderDebug('final transmuted builderObject: %O', finalBuilderObject);
      builderDebug('exited withBuilderExtensions::builder wrapper function');

      return finalBuilderObject;
    },
    function withHandlerExtensions(customHandler) {
      return async function handler(realArgv) {
        const debug = createDebugLogger({
          namespace: `${globalDebuggerNamespace}:withHandlerExtensions`
        });

        debug('entered withHandlerExtensions::handler wrapper function');
        debug('option metadata: %O', optionsMetadata);

        hardAssert(optionsMetadata, BfeErrorMessage.IllegalHandlerInvocation());

        debug('real argv: %O', realArgv);

        const { [$artificiallyInvoked]: wasInvokedArtificially } =
          realArgv as BfeStrictArguments<CustomCliArguments, CustomExecutionContext>;

        debug('wasInvokedArtificially: %O', wasInvokedArtificially);

        if (wasInvokedArtificially) {
          debug.warn('skipped bfe checks due to presence of $artificiallyInvoked');
        } else {
          const defaultedOptions = (
            latestProgram as unknown as {
              parsed?: { defaulted?: Record<string, true> };
            }
          ).parsed?.defaulted;

          debug('defaultedOptions: %O', defaultedOptions);
          hardAssert(
            defaultedOptions,
            BfeErrorMessage.UnexpectedlyFalsyDetailedArguments()
          );

          deleteDefaultedArguments({ argv: realArgv, defaultedOptions });
          debug('real argv with defaults deleted: %O', realArgv);

          const canonicalArgv = deriveCanonicalArgv(optionsMetadata, realArgv);
          debug('"canonical argv" used for checks: %O', canonicalArgv);

          // * Run requires checks
          optionsMetadata.required.forEach(({ [$genesis]: requirer, ...requireds }) => {
            hardAssert(
              requirer !== undefined,
              BfeErrorMessage.MetadataInvariantViolated('requires')
            );

            if (canonicalArgv.has(requirer)) {
              const missingRequiredKeyValues: Entries<typeof requireds> = [];

              Object.entries(requireds).forEach((required) => {
                const [requiredKey, requiredValue] = required;
                const givenValue = canonicalArgv.get(requiredKey);
                const givenValueIsArray = Array.isArray(givenValue);

                if (
                  !canonicalArgv.has(requiredKey) ||
                  (requiredValue !== $exists &&
                    ((givenValueIsArray &&
                      !givenValue.some((value) =>
                        isDeepStrictEqual(value, requiredValue)
                      )) ||
                      (!givenValueIsArray &&
                        !isDeepStrictEqual(givenValue, requiredValue))))
                ) {
                  missingRequiredKeyValues.push(required);
                }
              });

              softAssert(
                !missingRequiredKeyValues.length,
                BfeErrorMessage.RequiresViolation(requirer, missingRequiredKeyValues)
              );
            }
          });

          // * Run conflicts checks
          optionsMetadata.conflicted.forEach(
            ({ [$genesis]: conflicter, ...conflicteds }) => {
              hardAssert(
                conflicter !== undefined,
                BfeErrorMessage.MetadataInvariantViolated('conflicts')
              );

              if (canonicalArgv.has(conflicter)) {
                const seenConflictingKeyValues: Entries<typeof conflicteds> = [];

                Object.entries(conflicteds).forEach((keyValue) => {
                  const [conflictedKey, conflictedValue] = keyValue;
                  const givenValue = canonicalArgv.get(conflictedKey);
                  const givenValueIsArray = Array.isArray(givenValue);

                  if (
                    canonicalArgv.has(conflictedKey) &&
                    (conflictedValue === $exists ||
                      (givenValueIsArray &&
                        givenValue.some((value) =>
                          isDeepStrictEqual(value, conflictedValue)
                        )) ||
                      (!givenValueIsArray &&
                        isDeepStrictEqual(givenValue, conflictedValue)))
                  ) {
                    seenConflictingKeyValues.push(keyValue);
                  }
                });

                softAssert(
                  !seenConflictingKeyValues.length,
                  BfeErrorMessage.ConflictsViolation(
                    conflicter,
                    seenConflictingKeyValues
                  )
                );
              }
            }
          );

          // * Run demandThisOptionIf checks
          optionsMetadata.demandedIf.forEach(
            ({ [$genesis]: demanded, ...demanders }) => {
              hardAssert(
                demanded !== undefined,
                BfeErrorMessage.MetadataInvariantViolated('demandThisOptionIf')
              );

              const sawDemanded = canonicalArgv.has(demanded);

              Object.entries(demanders).forEach((demander) => {
                const [demanderKey, demanderValue] = demander;
                const givenValue = canonicalArgv.get(demanderKey);
                const givenValueIsArray = Array.isArray(givenValue);

                const sawADemander =
                  canonicalArgv.has(demanderKey) &&
                  (demanderValue === $exists ||
                    (givenValueIsArray &&
                      givenValue.some((value) =>
                        isDeepStrictEqual(value, demanderValue)
                      )) ||
                    (!givenValueIsArray &&
                      isDeepStrictEqual(givenValue, demanderValue)));

                softAssert(
                  !sawADemander || sawDemanded,
                  BfeErrorMessage.DemandIfViolation(demanded, demander)
                );
              });
            }
          );

          // * Run demandThisOptionOr checks
          optionsMetadata.demandedAtLeastOne.forEach((group) => {
            const groupEntries = Object.entries(group);
            const sawAtLeastOne = groupEntries.some((keyValue) => {
              const [key, value] = keyValue;
              const givenValue = canonicalArgv.get(key);
              const givenValueIsArray = Array.isArray(givenValue);

              return (
                canonicalArgv.has(key) &&
                (value === $exists ||
                  (givenValueIsArray &&
                    givenValue.some((value_) => isDeepStrictEqual(value_, value))) ||
                  (!givenValueIsArray && isDeepStrictEqual(givenValue, value)))
              );
            });

            softAssert(sawAtLeastOne, BfeErrorMessage.DemandOrViolation(groupEntries));
          });

          // * Run demandThisOptionXor checks
          optionsMetadata.demandedMutuallyExclusive.forEach((group) => {
            const groupEntries = Object.entries(group);
            let sawAtLeastOne: KeyValueEntry | undefined = undefined;

            groupEntries.forEach((keyValue) => {
              const [key, value] = keyValue;
              const givenValue = canonicalArgv.get(key);
              const givenValueIsArray = Array.isArray(givenValue);

              if (
                canonicalArgv.has(key) &&
                (value === $exists ||
                  (givenValueIsArray &&
                    givenValue.some((value_) => isDeepStrictEqual(value_, value))) ||
                  (!givenValueIsArray && isDeepStrictEqual(givenValue, value)))
              ) {
                if (sawAtLeastOne !== undefined) {
                  softAssert(
                    false,
                    BfeErrorMessage.DemandSpecificXorViolation(sawAtLeastOne, keyValue)
                  );
                }

                sawAtLeastOne = keyValue;
              }
            });

            softAssert(
              sawAtLeastOne,
              BfeErrorMessage.DemandGenericXorViolation(groupEntries)
            );
          });

          // ? Take advantage of our loop through optionsMetadata.implied to
          // ? keep track of this information for later
          const impliedKeyValues: Record<string, unknown> = {};

          // * Run implies checks
          optionsMetadata.implied.forEach(
            ({
              [$genesis]: implier,
              [$canonical]: canonicalImplications,
              ...expandedImplications
            }) => {
              hardAssert(
                implier !== undefined,
                BfeErrorMessage.MetadataInvariantViolated('implies')
              );

              if (
                canonicalArgv.has(implier) &&
                (optionsMetadata!.implyVacuously.includes(implier) ||
                  canonicalArgv.get(implier) !== false)
              ) {
                Object.assign(impliedKeyValues, expandedImplications);

                if (!optionsMetadata!.implyLoosely.includes(implier)) {
                  const seenConflictingKeyValues: Entries<typeof canonicalImplications> =
                    [];

                  Object.entries(canonicalImplications).forEach((keyValue) => {
                    const [key, value] = keyValue;

                    if (
                      canonicalArgv.has(key) &&
                      !isDeepStrictEqual(canonicalArgv.get(key), value)
                    ) {
                      seenConflictingKeyValues.push([key, canonicalArgv.get(key)]);
                    }
                  });

                  softAssert(
                    !seenConflictingKeyValues.length,
                    BfeErrorMessage.ImpliesViolation(implier, seenConflictingKeyValues)
                  );
                }
              }
            }
          );

          Object.assign(
            realArgv,
            // ? given overrides implied > overrides defaults > merged into argv
            {
              ...optionsMetadata.defaults,
              ...impliedKeyValues,
              ...realArgv
            }
          );

          debug('final argv (defaults and implies merged): %O', realArgv);

          // ? We want to run the check functions sequentially and in definition
          // ? order since that's what the documentation promises
          // * Run custom checks on final argv
          for (const [currentArgument, checkFunctions_] of Object.entries(
            optionsMetadata.checks
          )) {
            if (currentArgument in realArgv) {
              const checkFunctions = [checkFunctions_].flat();

              // ? When we receive an array of normal functions, this construct
              // ? should be synchronous due to the rules of JavaScript!
              // eslint-disable-next-line no-await-in-loop
              await Promise.all(
                checkFunctions.map(async (checkFn) => {
                  let result;

                  try {
                    // ! check functions might return a promise, so WATCH OUT!
                    result = await checkFn(realArgv[currentArgument], realArgv);
                  } catch (error) {
                    result = error;
                  }

                  if (!result || typeof result === 'string' || isNativeError(result)) {
                    throw isCliError(result)
                      ? result
                      : new CliError(
                          (result as string | Error | false) ||
                            BfeErrorMessage.CheckFailed(currentArgument)
                        );
                  }
                })
              );
            }
          }
        }

        debug('invoking customHandler (or defaultHandler if undefined)');

        await (customHandler ?? defaultHandler)(
          // ? customHandler is more strict from an intellisense perspective,
          // ? but it still meets the Black Flag handler's argv constraints even
          // ? if TypeScript isn't yet smart enough to understand it
          realArgv as Parameters<NonNullable<typeof customHandler>>[0]
        );

        debug('exited withHandlerExtensions::handler wrapper function');
      };
    }
  ];

  function deleteDefaultedArguments({
    argv,
    defaultedOptions
  }: {
    argv: Arguments<CustomCliArguments, CustomExecutionContext>;
    defaultedOptions: Record<string, true>;
  }): void {
    hardAssert(latestBfBuilderObject, BfeErrorMessage.GuruMeditation());
    hardAssert(latestBfParserConfiguration, BfeErrorMessage.GuruMeditation());

    Object.keys(defaultedOptions).forEach((defaultedOption) => {
      expandOptionNameAndAliasesWithRespectToParserConfiguration({
        option: defaultedOption,
        // ? We know these are defined due to the hard assert above
        aliases: latestBfBuilderObject![defaultedOption]!.alias,
        parserConfiguration: latestBfParserConfiguration!
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      }).forEach((expandedName) => delete argv[expandedName]);
    });

    latestBfBuilderObject = undefined;
    latestBfParserConfiguration = undefined;
  }
}

/**
 * Generate command usage text consistently yet flexibly.
 *
 * Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
 * `$1.`
 */
export function withUsageExtensions(
  altDescription = '$1.',
  {
    trim = true,
    appendPeriod = true,
    prependNewlines = true,
    includeOptions = prependNewlines
  }: {
    /**
     * Whether `altDescription` will be `trim()`'d or not.
     *
     * @default true
     */
    trim?: boolean;
    /**
     * Whether a period will be appended to the resultant string or not. A
     * period is only appended if one is not already appended.
     *
     * @default true
     */
    appendPeriod?: boolean;
    /**
     * Whether newlines will be prepended to `altDescription` or not.
     *
     * @default true
     */
    prependNewlines?: boolean;
    /**
     * Whether the string `' [...options]'` will be appended to the first line of usage text
     *
     * @default options.prependNewlines
     */
    includeOptions?: boolean;
  } = {}
) {
  return `Usage: $000${includeOptions ? ' [...options]' : ''}${
    prependNewlines ? '\n\n' : ''
  }${altDescription[trim ? 'trim' : 'toString']()}${
    appendPeriod && !altDescription.endsWith('.') ? '.' : ''
  }`;
}

/**
 * This function returns a version of `maybeCommand`'s handler function that is
 * ready to invoke immediately. It can be used with both BFE and normal Black
 * Flag command exports.
 *
 * It returns a handler that expects to be passed a "reified argv," i.e. the
 * object normally given to the command handler after all checks have passed and
 * all updates to argv have been applied (including `subOptionOf` and BFE's
 * `implies`).
 *
 * For this reason, invoking the returned handler will not run any BF or BFE
 * builder configurations on the given argv object. **Whatever you pass the
 * returned handler function will be (safely) deep cloned and then re-gifted to
 * the command's handler _without_ any correctness checks.**
 *
 * Use `CustomCliArguments` (and `CustomExecutionContext`) to assert the
 * expected shape of the "reified argv".
 *
 * Note that, like the `argv` passed to the returned handler function, the
 * `context` argument passed to this function will be (safely) deep cloned,
 * meaning any context changes effected by the handler will not persist outside
 * of that handler's scope.
 *
 * Also note that the `$executionContext` key, if included in `argv`, will be
 * ignored.
 *
 * See [the
 * documentation](https://github.com/Xunnamius/black-flag/blob/main/packages/extensions/README.md#getinvocableextendedhandler)
 * for more details.
 */
export async function getInvocableExtendedHandler<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext & {
    state: { extensions?: SafeDeepCloneOptions };
  }
>(
  maybeCommand: Promisable<
    | ImportedConfigurationModule<CustomCliArguments, CustomExecutionContext>
    | ImportedConfigurationModule<
        CustomCliArguments,
        AsStrictExecutionContext<CustomExecutionContext>
      >
  >,
  context: CustomExecutionContext
) {
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:getInvocableExtendedHandler`
  });

  debug('safely deep cloning context argument');
  context = safeDeepClone(context, context.state.extensions);

  debug('resolving maybePromisedCommand');

  let command;

  try {
    command = (await maybeCommand) as ImportedConfigurationModule<
      CustomCliArguments,
      CustomExecutionContext
    >;
  } catch (error) {
    // ? We do this instead of a hard assert because we want to track the cause
    throw new CliError(
      BfeErrorMessage.FrameworkError(BfeErrorMessage.FalsyCommandExport()),
      {
        cause: error,
        suggestedExitCode: FrameworkExitCode.AssertionFailed
      }
    );
  }

  hardAssert(command, BfeErrorMessage.FalsyCommandExport());

  // ? ESM <=> CJS interop. If there's a default property, we'll use it.
  if (command.default !== undefined) {
    command = command.default;
  }

  // ? ESM <=> CJS interop, again. See: @black-flag/core/src/discover.ts
  // ! We cannot trust the type of command.default yet, hence the next line:
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (command?.default !== undefined) {
    command = command.default;
  }

  let config: Partial<Configuration<CustomCliArguments, CustomExecutionContext>>;

  if (typeof command === 'function') {
    config = await command(context);
  } else {
    // ! We cannot trust the type of command if we've reached this point
    hardAssert(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      command && typeof command === 'object',
      BfeErrorMessage.FalsyCommandExport()
    );

    // * Now we can trust its type :)
    config = command;
  }

  const { builder, handler } = config;
  hardAssert(handler, BfeErrorMessage.CommandHandlerNotAFunction());

  debug('returned immediately invocable handler function');

  /**
   * An immediately invocable handler function that expects to be passed a
   * "reified argv," i.e. the object normally given to the command handler after
   * all checks have passed and all updates to `argv` have been applied
   * (including `subOptionOf` and BFE's `implies`).
   *
   * For this reason, invoking this function will not run any BF or BFE builder
   * configurations on the given `argv` object. **Whatever you pass this
   * function will be (safely) deep cloned and then re-gifted to the command's
   * handler _without_ any correctness checks.**
   *
   * Note that the `$executionContext` key, if included in `argv`, will be
   * ignored.
   */
  return async function (
    /**
     * This is the `argv` passed to the invocable command handler.
     *
     * Note that `argv` will be (safely) deep cloned, and that the
     * `$executionContext` key, if included, will be ignored.
     */
    argv: Merge<
      BfeStrictArguments<CustomCliArguments, CustomExecutionContext>,
      {
        /**
         * Do not manually provide this key. It will be included in `argv`
         * automatically.
         */
        [$executionContext]?: unknown;
        /**
         * The script name or node command that, when omitted from the `argv`
         * passed to a handler returned by `getInvocableExtendedHandler`,
         * defaults to the `name` value exported from the command's module file
         * (or `"<unknown name>"` if no name was exported).
         *
         * **Note that this default value IS LIKELY DIFFERENT THAN the _full
         * name_ to which Black Flag sets `$0`!** If this is an issue, manually
         * provide a value for `$0` in `argv`.
         */
        $0?: string;
        /**
         * Non-option arguments that, when omitted from the `argv` passed to a
         * handler returned by `getInvocableExtendedHandler`, defaults to an
         * empty array (`[]`).
         */
        _?: BfeStrictArguments<CustomCliArguments, CustomExecutionContext>['_'];
      }
    >
  ) {
    const fakeYargsWarning =
      '<this is a pseudo-yargs instance passed around by getInvocableExtendedHandler>';

    const argv_ = safeDeepClone(
      {
        [$artificiallyInvoked]: true,
        $0: config.name || '<unknown name>',
        _: [],
        ...argv,
        [$executionContext]: context
      } as unknown as Arguments<CustomCliArguments, CustomExecutionContext>,
      context.state.extensions
    );

    if (typeof builder === 'function') {
      const dummyYargs = makeVanillaYargs();
      const fakeBlackFlag = dummyYargs as unknown as Parameters<typeof builder>[0];

      dummyYargs.parsed = {
        '//': fakeYargsWarning,
        argv: argv_,
        defaulted: {},
        aliases: {},
        configuration: new Proxy(
          {} as Exclude<typeof dummyYargs.parsed, boolean>['configuration'],
          {
            /* istanbul ignore next */
            get() {
              return true;
            }
          }
        ),
        error: null,
        // eslint-disable-next-line unicorn/no-keyword-prefix
        newAliases: {}
      } as typeof dummyYargs.parsed;

      debug('invoking builder (for the first time)');
      builder(fakeBlackFlag, false, undefined);

      debug('invoking builder (for the second time)');
      builder(fakeBlackFlag, false, { '//': fakeYargsWarning, ...argv_ });
    } else {
      debug('warning: no callable builder function was returned!');
    }

    debug('invoking handler');
    return handler(argv_);
  };
}

function transmuteBFEBuilderToBFBuilder<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
>({
  builderObject,
  deleteGroupProps,
  isGeneratingSecondPassHelpText,
  optionsMetadata,
  argv
}: {
  builderObject: BfeBuilderObject<CustomCliArguments, CustomExecutionContext>;
  deleteGroupProps: boolean;
  /**
   * When we're generating help text on the second pass, `handler` is never
   * going to be called. Instead, the user is going to get some help text. When
   * transmuting the BFE builder to a BF builder, we should resolve any
   * implications to make this text more helpful!
   */
  isGeneratingSecondPassHelpText: boolean;
  /**
   * Only defined/meaningful when `isGeneratingSecondPassHelpText` is `true`.
   */
  optionsMetadata: OptionsMetadata | undefined;
  /**
   * Only defined/meaningful when `isGeneratingSecondPassHelpText` is `true`.
   */
  argv: Arguments<CustomCliArguments, CustomExecutionContext> | undefined;
}): BfBuilderObject<CustomCliArguments, CustomExecutionContext> {
  const vanillaYargsBuilderObject: BfBuilderObject<
    CustomCliArguments,
    CustomExecutionContext
  > = {};

  for (const [option, builderObjectValue] of Object.entries(builderObject)) {
    const [bfeBuilderObjectValue, vanillaYargsBuilderObjectValue] =
      separateExtensionsFromBuilderObjectValue({ builderObjectValue });

    const { demandThisOption } = bfeBuilderObjectValue;
    const genericVanillaYargsBuilderObjectValue =
      vanillaYargsBuilderObjectValue as BfGenericBuilderObjectValue;

    if (demandThisOption !== undefined) {
      genericVanillaYargsBuilderObjectValue.demandOption = demandThisOption;
    }

    // ? We add it back here so that vanilla yargs will include it in help text
    if (bfeBuilderObjectValue.default !== undefined) {
      genericVanillaYargsBuilderObjectValue.default = bfeBuilderObjectValue.default;
    }

    if (genericVanillaYargsBuilderObjectValue.coerce !== undefined) {
      const coercer = genericVanillaYargsBuilderObjectValue.coerce;
      genericVanillaYargsBuilderObjectValue.coerce = (parameter) => {
        return coercer(
          vanillaYargsBuilderObjectValue.array ? [parameter].flat() : parameter
        );
      };
    }

    if (deleteGroupProps) {
      delete vanillaYargsBuilderObjectValue.group;
    }

    vanillaYargsBuilderObject[option] = vanillaYargsBuilderObjectValue;
  }

  if (isGeneratingSecondPassHelpText) {
    hardAssert(optionsMetadata && argv, BfeErrorMessage.GuruMeditation());

    const canonicalArgv = deriveCanonicalArgv(optionsMetadata, argv);

    // * Overwrite defaults with resolved implications
    optionsMetadata.implied.forEach(
      ({ [$genesis]: implier, [$canonical]: canonicalImplications }) => {
        hardAssert(
          implier !== undefined,
          BfeErrorMessage.MetadataInvariantViolated('implies')
        );

        if (
          canonicalArgv.has(implier) &&
          (optionsMetadata.implyVacuously.includes(implier) ||
            canonicalArgv.get(implier) !== false)
        ) {
          Object.entries(canonicalImplications).forEach(([impliedArg, impliedValue]) => {
            // ? We know impliedArg is in vanillaYargsBuilderObject because the
            // ? analysis step that created optionsMetadata will error on
            // ? implications for non-existent options
            vanillaYargsBuilderObject[impliedArg]!.default = impliedValue;
          });
        }
      }
    );
  }

  return vanillaYargsBuilderObject;
}

function analyzeBuilderObject<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
>({
  builderObject,
  commonOptions,
  parserConfiguration
}: {
  builderObject: BfeBuilderObject<CustomCliArguments, CustomExecutionContext>;
  commonOptions: NonNullable<
    WithBuilderExtensionsConfig<CustomCliArguments>['commonOptions']
  >;
  parserConfiguration: Partial<ParserConfigurationOptions>;
}) {
  const metadata: OptionsMetadata = {
    required: [],
    conflicted: [],
    implied: [],
    implyLoosely: [],
    implyVacuously: [],
    demandedIf: [],
    demanded: [],
    demandedAtLeastOne: [],
    demandedMutuallyExclusive: [],
    optional: [],
    defaults: {},
    checks: {},
    optionNames: new Set<string>(),
    optionNamesAsSeenInArgv: {},
    customGroups: {}
  };

  // ? This first loop resolves all groupings except "optional options"
  for (const [option, builderObjectValue] of Object.entries(builderObject)) {
    const [
      {
        requires,
        conflicts,
        check,
        // ? eslint does not like "default" as a variable name for some reason
        default: default_,
        implies,
        looseImplications,
        vacuousImplications,
        demandThisOptionIf,
        demandThisOption,
        demandThisOptionOr,
        demandThisOptionXor
      },
      { alias: optionAliases }
    ] = separateExtensionsFromBuilderObjectValue({ builderObjectValue });

    const allPossibleOptionNamesAndAliasesSet =
      expandOptionNameAndAliasesWithRespectToParserConfiguration({
        option,
        aliases: optionAliases,
        parserConfiguration
      });

    const conflictingNamesSet = metadata.optionNames.intersection(
      allPossibleOptionNamesAndAliasesSet
    );

    hardAssert(
      conflictingNamesSet.size === 0,
      BfeErrorMessage.DuplicateOptionName(
        getFirstValueFromNonEmptySet(conflictingNamesSet)
      )
    );

    metadata.optionNames = metadata.optionNames.union(
      allPossibleOptionNamesAndAliasesSet
    );

    // ? Keep track of the keys we can reference to get this option's value
    // ? from argv. We have to do this because argv might strip out an
    // ? option's canonical name depending on yargs-parser configuration
    allPossibleOptionNamesAndAliasesSet.forEach((expandedName) => {
      metadata.optionNamesAsSeenInArgv[expandedName] = option;
    });

    if (requires !== undefined) {
      const normalizedOption = validateAndFlattenExtensionValue(
        requires,
        builderObject,
        option
      );

      addToSet(metadata.required, { ...normalizedOption, [$genesis]: option });
    }

    if (conflicts !== undefined) {
      const normalizedOption = validateAndFlattenExtensionValue(
        conflicts,
        builderObject,
        option
      );

      addToSet(metadata.conflicted, { ...normalizedOption, [$genesis]: option });
    }

    if (check !== undefined) {
      // ? Assert bivariance
      metadata.checks[option] = check as (typeof metadata.checks)[string];
    }

    if (default_ !== undefined) {
      // ? Unlike the others, defaults and implies contain their expansions too
      allPossibleOptionNamesAndAliasesSet.forEach((expandedName) => {
        metadata.defaults[expandedName] = default_;
      });
    }

    if (implies !== undefined) {
      const canonicalNormalizedImplications = validateAndFlattenExtensionValue(
        implies,
        builderObject,
        option
      );

      const expandedNormalizedImplications: Record<string, unknown> = {};

      Object.entries(canonicalNormalizedImplications).forEach(
        ([impliedOption, impliedValue]) => {
          const { alias: impliedOptionAliases } = builderObject[impliedOption]!;

          // ? Unlike the others, defaults and implies contain their expansions
          expandOptionNameAndAliasesWithRespectToParserConfiguration({
            option: impliedOption,
            aliases: impliedOptionAliases,
            parserConfiguration
          }).forEach((expandedName) => {
            expandedNormalizedImplications[expandedName] = impliedValue;
          });
        }
      );

      addToSet(metadata.implied, {
        ...expandedNormalizedImplications,
        [$canonical]: canonicalNormalizedImplications,
        [$genesis]: option
      });
    }

    if (looseImplications) {
      metadata.implyLoosely.push(option);
    }

    if (vacuousImplications) {
      metadata.implyVacuously.push(option);
    }

    if (demandThisOption !== undefined) {
      metadata.demanded.push(option);
    }

    if (demandThisOptionIf !== undefined) {
      const normalizedOption = validateAndFlattenExtensionValue(
        demandThisOptionIf,
        builderObject,
        option
      );

      addToSet(metadata.demandedIf, { ...normalizedOption, [$genesis]: option });
    }

    if (demandThisOptionOr !== undefined) {
      const normalizedOption = validateAndFlattenExtensionValue(
        demandThisOptionOr,
        builderObject,
        option
      );

      addToSet(metadata.demandedAtLeastOne, { ...normalizedOption, [option]: $exists });
    }

    if (demandThisOptionXor !== undefined) {
      const normalizedOption = validateAndFlattenExtensionValue(
        demandThisOptionXor,
        builderObject,
        option
      );

      addToSet(metadata.demandedMutuallyExclusive, {
        ...normalizedOption,
        [option]: $exists
      });
    }
  }

  // ? This second loop lets us see which options are actually optional after
  // ? all the groupings have been resolved. We also apply any overrides here.
  for (const [option, { group: groupOverride }] of Object.entries(builderObject)) {
    const isExplicitlyDemanded = !!(
      metadata.demanded.includes(option) ||
      metadata.demandedAtLeastOne.some((record) => option in record) ||
      metadata.demandedMutuallyExclusive.some((record) => option in record)
    );

    const hasExplicitGroupOverride = !!groupOverride;
    const commonOptionsIncludesOption = commonOptions.includes(option);

    if (hasExplicitGroupOverride) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (metadata.customGroups[groupOverride] ||= []).push(option);
    } else {
      // ? An option cannot be in both common options and optional options
      if (!isExplicitlyDemanded && !commonOptionsIncludesOption) {
        metadata.optional.push(option);
      }
    }
  }

  return metadata;
}

/**
 * Take a canonical option name (i.e. the option key in the returned builder
 * object) and, depending on the value of yargs-parser configuration, expand it
 * into itself, its aliases, and all potential camel-case alternatives.
 */

function expandOptionNameAndAliasesWithRespectToParserConfiguration({
  option,
  aliases,
  parserConfiguration
}: {
  option: string;
  aliases: string | readonly string[] | undefined;
  parserConfiguration: Partial<ParserConfigurationOptions>;
}): Set<string> {
  const {
    'camel-case-expansion': camelCaseExpansion,
    'strip-aliased': stripAliased,
    'strip-dashed': stripDashed
  } = {
    // * These defaults were taken from yargs on July 03 2024
    'camel-case-expansion': true,
    'strip-aliased': false,
    'strip-dashed': false,
    ...parserConfiguration
  };

  const targetNames = [option, stripAliased ? [] : (aliases ?? [])].flat();
  const expandedNamesSet = new Set<string>();

  targetNames.forEach((name) => {
    if (camelCaseExpansion) {
      const camelCasedName = toCamelCase(name);

      // ? Prioritize adding the real canonical name first if possible
      if (camelCasedName !== name && (!stripDashed || !name.includes('-'))) {
        add(name);
      }

      add(camelCasedName);
    } else {
      add(name);
    }
  });

  return expandedNamesSet;

  function add(name: string) {
    hardAssert(!expandedNamesSet.has(name), BfeErrorMessage.DuplicateOptionName(name));
    expandedNamesSet.add(name);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getParserConfigurationFromBlackFlagInstance(blackFlag: any) {
  hardAssert(
    typeof blackFlag.getInternalMethods === 'function',
    BfeErrorMessage.UnexpectedValueFromInternalYargsMethod()
  );

  const yargsInternalMethods = blackFlag.getInternalMethods();

  hardAssert(
    typeof yargsInternalMethods.getParserConfiguration === 'function',
    BfeErrorMessage.UnexpectedValueFromInternalYargsMethod()
  );

  const parserConfiguration: Partial<ParserConfigurationOptions> =
    yargsInternalMethods.getParserConfiguration();

  hardAssert(
    // ! We cannot trust the type of parserConfiguration, hence the next line:
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    parserConfiguration && typeof parserConfiguration === 'object',
    BfeErrorMessage.UnexpectedValueFromInternalYargsMethod()
  );

  return parserConfiguration;
}

/**
 * This function returns an array where the first element is a
 * {@link BfeBuilderObjectValueExtensions} instance with all properties defined
 * and the second element is a {@link BfeBuilderObjectValueWithoutExtensions}
 * instance.
 */
function separateExtensionsFromBuilderObjectValue<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
>({
  builderObjectValue: builderObjectValue
}: {
  builderObjectValue: BfeBuilderObject<
    CustomCliArguments,
    CustomExecutionContext
  >[string];
}): [
  {
    // ? Ensure bfeConfig always has all of BFE's properties
    [Key in StringKeyOf<
      BfeBuilderObjectValueExtensions<CustomCliArguments, CustomExecutionContext>
    >]:
      | BfeBuilderObjectValueExtensions<CustomCliArguments, CustomExecutionContext>[Key]
      | undefined;
  },
  BfeBuilderObjectValueWithoutExtensions
] {
  const {
    check,
    conflicts,
    // ? eslint does not like "default" as a variable name for some reason
    default: default_,
    demandThisOption,
    demandThisOptionIf,
    demandThisOptionOr,
    demandThisOptionXor,
    implies,
    looseImplications,
    vacuousImplications,
    requires,
    subOptionOf,
    ...vanillaYargsConfig
  } = builderObjectValue;

  const bfeConfig = {
    check,
    conflicts,
    demandThisOption,
    demandThisOptionIf,
    demandThisOptionOr,
    demandThisOptionXor,
    implies,
    looseImplications,
    vacuousImplications,
    requires,
    subOptionOf
  };

  // ? Undefined defaults should be deleted in the builder long before this
  // ? function is ever invoked
  hardAssert(
    !('default' in builderObjectValue) || default_ !== undefined,
    BfeErrorMessage.GuruMeditation()
  );

  return [
    {
      ...bfeConfig,
      default: default_,
      // ? This is actually ignored by BFE except when transmuting back to BF
      coerce: undefined
    },
    vanillaYargsConfig
  ];
}

function validateAndFlattenExtensionValue(
  extendedOption: BfeBuilderObjectValueExtensionValue,
  builderObject: Record<string, unknown>,
  optionName: string
): FlattenedExtensionValue {
  const mergedConfig: FlattenedExtensionValue = {};

  if (Array.isArray(extendedOption)) {
    extendedOption.forEach((option) => {
      mergeInto(option);
    });
  } else {
    mergeInto(extendedOption);
  }

  Object.keys(mergedConfig).forEach((referredOptionName) => {
    hardAssert(
      referredOptionName in builderObject,
      BfeErrorMessage.ReferencedNonExistentOption(optionName, referredOptionName)
    );
  });

  return mergedConfig;

  function mergeInto(option: Exclude<BfeBuilderObjectValueExtensionValue, unknown[]>) {
    if (typeof option === 'string') {
      mergedConfig[option] = $exists;
    } else {
      Object.assign(mergedConfig, option);
    }
  }
}

/**
 * Returns a `Map` between canonical names and their value as seen in `argv`.
 */
function deriveCanonicalArgv(optionsMetadata: OptionsMetadata, argv: Arguments) {
  const canonicalArgv = new Map<string, unknown>();

  Object.entries(optionsMetadata.optionNamesAsSeenInArgv).forEach(
    ([maybeNameInRealArgv, canonicalName]) => {
      const valueInRealArgv = argv[maybeNameInRealArgv];
      if (valueInRealArgv !== undefined) {
        canonicalArgv.set(canonicalName, valueInRealArgv);
      }
    }
  );

  return canonicalArgv;
}

// ? We use this instead of ES6 Sets since we need a more complex equality check
function addToSet(arrayAsSet: unknown[], element: unknown) {
  const hasElement = arrayAsSet.find((item) => isDeepStrictEqual(item, element));

  if (!hasElement) {
    arrayAsSet.push(element);
  }
}

function defaultHandler() {
  throw new CommandNotImplementedError();
}

function getFirstValueFromNonEmptySet<T extends Set<unknown>>(
  set: T
): Parameters<T['add']>[0] {
  return set.values().next().value;
}

/**
 * Copied over from cli-utils to break a dependency cycle.
 * @internal
 */
function softAssert(valueOrMessage: unknown, message?: string): asserts valueOrMessage {
  let shouldThrow = true;

  /* istanbul ignore next*/
  if (typeof message === 'string') {
    const value = valueOrMessage;
    shouldThrow = !value;
  } else {
    message = String(valueOrMessage);
  }

  if (shouldThrow) {
    throw new CliError(message, { suggestedExitCode: FrameworkExitCode.DefaultError });
  }
}

/**
 * Copied over from cli-utils to break a dependency cycle.
 * @internal
 */
function hardAssert(valueOrMessage: unknown, message?: string): asserts valueOrMessage {
  let shouldThrow = true;

  /* istanbul ignore next*/
  if (typeof message === 'string') {
    const value = valueOrMessage;
    shouldThrow = !value;
  } else {
    message = String(valueOrMessage);
  }

  if (shouldThrow) {
    throw new CliError(BfeErrorMessage.FrameworkError(message), {
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}
