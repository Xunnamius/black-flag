/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable unicorn/prefer-regexp-test */
// TODO: replace this with the actual rejoinder and vice-versa!

import {
  $instances,
  debugFactory,
  type DebuggerExtension,
  type ExtendedDebugger,
  type InstanceKey,
  type UnextendableInternalDebugger
} from 'multiverse/debug-extended';

// ! NOTE THAT THIS LESSER VERSION OF REJOINDER IS MISSING THE LISTR2 FUNCTIONS!
// ! USE THE REAL VERSION THAT IS IN A DIFFERENT LIB DIR

import overwriteDescriptors from 'merge-descriptors';

export { debugFactory as extendedDebugFactory, type ExtendedDebugger };

/**
 * @internal
 */
export type WithExtendedParameters<
  T extends (...args: unknown[]) => unknown,
  Optional = true
> = Optional extends true
  ? [tags?: string[], ...Parameters<T>]
  : [tags: string[], ...Parameters<T>];

/**
 * @internal
 */
export type WithTagSupport<
  T extends (...args: unknown[]) => unknown,
  Optional = true
> = ((...args: WithExtendedParameters<T, Optional>) => ReturnType<T> | undefined) & {
  [P in keyof T]: T[P];
};

/**
 * @internal
 */
export type ExtendedLoggerParameters = WithExtendedParameters<ExtendedDebugger, false>;

/**
 * A wrapper around {@link ExtendedDebugger } representing the extension from
 * mere "debug" logger to general purpose "logger".
 */
export interface ExtendedLogger extends _ExtendedLogger<ExtendedLogger> {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<ExtendedDebugger>): ReturnType<ExtendedDebugger>;
  /**
   * Send a tagged optionally-formatted message to output.
   */
  (...args: ExtendedLoggerParameters): ReturnType<ExtendedDebugger>;
  newline: (
    ...args: WithExtendedParameters<ExtendedDebugger['newline']>
  ) => ReturnType<ExtendedDebugger['newline']>;
  extend: (...args: Parameters<ExtendedDebugger['extend']>) => ExtendedLogger;
}
type _ExtendedLogger<T> = Omit<ExtendedDebugger, keyof DebuggerExtension> &
  DebuggerExtension<WithTagSupport<UnextendableInternalDebugger>, T>;

/**
 * Keeps track of our various "logger" (i.e. debug) instances and their
 * associated metadata. Also keeps track of those tags for which we disable
 * output.
 */
const metadata = {
  stdout: [] as ExtendedLogger[],
  debug: [] as ExtendedDebugger[],
  blacklist: new Set<string>()
};

/**
 * A string of spaces representing a CLI "tab".
 */
export const TAB = '    ';

/**
 * Create and return new set of logger instances.
 */
export function createGenericLogger({
  namespace
}: {
  /**
   * The namespace of the logger. The namespace must be a valid [`debug`
   * namespace](https://npm.im/debug#namespace-colors).
   *
   * @see https://npm.im/debug#namespace-colors
   */
  namespace: string;
}) {
  const logger = makeExtendedLogger(debugFactory(namespace), {
    log(...args) {
      console.log(...args);
    }
  });

  metadata.stdout.push(logger);
  return logger;
}

/**
 * Create a new debug logger instance.
 */
export function createDebugLogger({
  namespace
}: {
  /**
   * The namespace of the logger. The namespace must be a valid [`debug`
   * namespace](https://npm.im/debug#namespace-colors).
   *
   * @see https://npm.im/debug#namespace-colors
   */
  namespace: string;
}) {
  const debug = debugFactory(namespace);
  metadata.debug.push(debug);
  return debug;
}

/**
 * Return an array of all known loggers of a specific type: either `stdout`,
 * `debug`, or both (`all`).
 */
export function getLoggersByType({
  type
}: {
  /**
   * The type of loggers to return. Valid values are one of:
   *
   * - `stdout` returns loggers created via `createGenericLogger`
   *
   * - `debug` returns loggers created via `createDebugLogger`
   *
   * - `all` returns all loggers
   */
  type: 'all' | 'stdout' | 'debug';
}) {
  const instances = [];

  if (type === 'all' || type === 'stdout') {
    instances.push(...metadata.stdout);
  }

  if (type === 'all' || type === 'debug') {
    instances.push(...metadata.debug);
  }

  return instances;
}

/**
 * Disable all logger instances (coarse-grain).
 */
export function disableLoggers({
  type,
  filter
}: {
  /**
   * The type of logging to disable. Valid values are one of:
   *
   * - `stdout` disables loggers created via `createGenericLogger`
   *
   * - `debug` disables loggers created via `createDebugLogger`
   *
   * - `all` disables all loggers
   */
  type: 'all' | 'stdout' | 'debug';

  /**
   * Optionally filter the loggers to be disabled. If `filter` is a string, only
   * loggers with namespaces equal to `filter` will be disabled. If `filter` is
   * a regular expression, only loggers with namespaces matching the expression
   * will be disabled.
   */
  filter?: string | RegExp;
}) {
  const instances = getLoggersByType({ type }).flatMap((l) =>
    Object.values(l[$instances])
  );

  for (const instance of instances) {
    if (
      !filter ||
      (typeof filter === 'string' && instance.namespace === filter) ||
      !!instance.namespace.match(filter)
    ) {
      instance.enabled = false;
    }
  }
}

/**
 * Enable all logger instances (coarse-grain).
 */
export function enableLoggers({
  type,
  filter
}: {
  /**
   * The type of logging to enable. Valid values are one of:
   *
   * - `stdout` enables loggers created via `createGenericLogger`
   *
   * - `debug` enables loggers created via `createDebugLogger`
   *
   * - `all` enables all loggers
   */
  type: 'all' | 'stdout' | 'debug';

  /**
   * Optionally filter the loggers to be enabled. If `filter` is a string, only
   * loggers with namespaces equal to `filter` will be enabled. If `filter` is a
   * regular expression, only loggers with namespaces matching the expression
   * will be enabled.
   */
  filter?: string | RegExp;
}) {
  const instances = getLoggersByType({ type }).flatMap((l) =>
    Object.values(l[$instances])
  );

  for (const instance of instances) {
    if (
      !filter ||
      (typeof filter === 'string' && instance.namespace === filter) ||
      !!instance.namespace.match(filter)
    ) {
      instance.enabled = true;
    }
  }
}

/**
 * Prevents logs with the specified tags from being sent to output.
 */
export function disableLoggingByTag({
  tags
}: {
  /**
   * The tags of messages that will no longer be sent to output.
   */
  tags: string[];
}) {
  tags.forEach((tag) => metadata.blacklist.add(tag));
}

/**
 * Allows logs with the specified tags to resume being sent to output. Only relevant as the inverse function of {@link disableLoggingByTag}.
 */
export function enableLoggingByTag({
  tags
}: {
  /**
   * The tags of messages that will resume being sent to output.
   */
  tags: string[];
}) {
  tags.forEach((tag) => metadata.blacklist.delete(tag));
}

/**
 * A function that resets the internal logger cache. Essentially, calling this
 * function causes rejoinder to forget any disabled tags or loggers created
 * prior.
 */
export function resetInternalState() {
  metadata.debug.length = 0;
  metadata.stdout.length = 0;
  metadata.blacklist.clear();
}

/**
 * Transforms an {@link ExtendedDebugger} into an {@link ExtendedLogger}.
 */
function makeExtendedLogger(
  extendedDebugger: ExtendedDebugger,
  /**
   * The property descriptors of `overrides` will overwrite matching properties
   * in `extendedDebugger`. Note that function overrides should try to avoid
   * using `this`.
   */
  overrides: Partial<UnextendableInternalDebugger> = {}
): ExtendedLogger {
  const extendedLogger = patchInstance('$log', extendedDebugger);
  // TODO: fork merge-descriptors to make @xunnamius/merge-descriptors that
  // TODO: fixes this.
  // ! merge-descriptors does not copy over symbols!
  extendedLogger[$instances] = extendedDebugger[$instances];

  const extend = extendedDebugger.extend.bind(extendedDebugger);
  extendedLogger.extend = (...args) => makeExtendedLogger(extend(...args), overrides);

  extendedLogger.newline = decorateWithTagSupport(extendedDebugger.newline, 1);

  Object.entries(extendedLogger[$instances])
    // eslint-disable-next-line unicorn/no-array-callback-reference
    .filter((o): o is [Exclude<InstanceKey, '$log'>, (typeof o)[1]] => o[0] !== '$log')
    .forEach(([key, instance]) => patchInstance(key, instance));

  return extendedLogger;

  function patchInstance<T extends ExtendedDebugger | UnextendableInternalDebugger>(
    key: InstanceKey,
    instance: T
  ) {
    instance.enabled = true;
    overwriteDescriptors(instance, overrides);

    // @ts-expect-error: TS isn't smart enough to figure this out just yet
    const patchedInstance = ((extendedDebugger as ExtendedLogger)[$instances][key] =
      // ? Ensure TS errors aren't swallowed
      // prettier-ignore
      decorateWithTagSupport(instance, 2));

    return patchedInstance;
  }
}

/**
 * Allows logging to be disabled via tags at the fine-grain message level. Set
 * `trapdoorArgLength` to the number of params necessary to trigger
 * blacklisting.
 */
function decorateWithTagSupport<T extends (...args: unknown[]) => unknown>(
  fn: T,
  trapdoorArgsMinLength: number
): WithTagSupport<T> {
  // * Note that this does NOT rebind fn's methods!
  return overwriteDescriptors((...args: unknown[]) => {
    if (args.length >= trapdoorArgsMinLength && Array.isArray(args[0])) {
      if (args[0].some((tag) => metadata.blacklist.has(tag))) {
        return undefined;
      }

      return fn(...args.slice(1)) as ReturnType<T>;
    }

    return fn(...args) as ReturnType<T>;
  }, fn) as WithTagSupport<T>;
}
