/* eslint-disable no-console */
import getDebugger, { type Debug as _Debug, type Debugger as _Debugger } from 'debug';
import overwriteDescriptors from 'merge-descriptors';

import type { Merge } from 'type-fest';

type _InternalDebuggerNoExtends = Omit<InternalDebugger, 'extend'>;

/**
 * Represents a property on a "root" {@link ExtendedDebugger} instance that
 * returns an array of its {@link UnextendableInternalDebugger} sub-instances
 * (e.g. "error", "warn", etc). The array will also include the root
 * {@link ExtendedDebugger} instance.
 */
export const $instances = Symbol('debug-extended-builtin-sub-instances');

/**
 * A type representing the property names of the sub-instances made available
 * by {@link $instances}.
 *
 * @internal
 */
export type InstanceKey = keyof ExtendedDebugger[typeof $instances];

/**
 * The base `Debug` interface coming from the [debug](https://npm.im/debug)
 * package.
 *
 * @internal
 */
export interface InternalDebug extends _Debug {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<_Debug>): InternalDebugger;
}

/**
 * The base `Debugger` interface coming from the [debug](https://npm.im/debug)
 * package.
 *
 * @internal
 */
export interface InternalDebugger extends __Debugger {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<_Debugger>): void;
}
type __Debugger = Omit<_Debugger, 'log'> & { log?: _Debugger['log'] };

/**
 * An instance of {@link InternalDebugger} that cannot be extended via
 * {@link InternalDebugger.extend}.
 */
export interface UnextendableInternalDebugger extends InternalDebugger {
  extend: (...args: Parameters<InternalDebugger['extend']>) => never;
}

/**
 * An {@link InternalDebug} factory interface that returns
 * {@link ExtendedDebugger} instances.
 */
export interface ExtendedDebug extends InternalDebug {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<InternalDebug>): ExtendedDebugger;
  // ? Fix an error in the official debug package types
  disable: (namespace?: string) => ReturnType<InternalDebug['disable']>;
}

/**
 * A {@link InternalDebugger} interface extended with convenience methods.
 */
export interface ExtendedDebugger extends _InternalDebuggerNoExtends, DebuggerExtension {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<InternalDebugger>): ReturnType<InternalDebugger>;
  /**
   * Creates a new instance by appending `namespace` to the current logger's
   * namespace.
   */
  extend: (...args: Parameters<InternalDebugger['extend']>) => ExtendedDebugger;
  /**
   * Send a blank newline to output.
   */
  newline: () => void;
}

/**
 * The shape of the new keys that are added to the {@link InternalDebugger}
 * object. {@link InternalDebugger} + {@link DebuggerExtension} =
 * {@link ExtendedDebugger}.
 *
 * @internal
 */
export type DebuggerExtension<
  T = UnextendableInternalDebugger,
  U = ExtendedDebugger
> = _DebuggerExtension<T> & {
  /**
   * An array of sub-instances (e.g. "error", "warn", etc), including the root
   * instance.
   */
  [$instances]: Merge<
    _DebuggerExtension<T>,
    {
      /**
       * A cyclical reference to the current logger.
       */
      $log: U;
    }
  >;
};

/**
 * The single source of truth for the keys and types of the convenience various
 * sub-instances (e.g. "error", "warn", etc).
 */
type _DebuggerExtension<T = UnextendableInternalDebugger> = {
  /**
   * A sub-instance for outputting messages to the attention of the reader.
   */
  message: T;
  /**
   * A sub-instance for outputting error messages.
   */
  error: T;
  /**
   * A sub-instance for outputting warning messages.
   */
  warn: T;
};

/**
 * An `ExtendedDebug` instance that returns an {@link ExtendedDebugger} instance
 * via {@link extendDebugger}.
 */
const debugFactory = ((...args: Parameters<InternalDebug>) => {
  return extendDebugger(getDebugger(...args));
}) as ExtendedDebug;

// * Note that this does NOT rebind getDebugger's methods!
overwriteDescriptors(debugFactory, getDebugger);

export { debugFactory };

/**
 * Extends a {@link InternalDebugger} instance with several convenience methods,
 * returning an {@link ExtendedDebugger} instance.
 */
export function extendDebugger(instance: InternalDebugger) {
  const extend = instance.extend.bind(instance);
  const finalInstance = instance as unknown as ExtendedDebugger;

  finalInstance[$instances] = Object.create(null);
  finalInstance[$instances].$log = finalInstance;
  finalInstance[$instances].error = finalizeDebugger(extend('<error>'));
  finalInstance[$instances].message = finalizeDebugger(extend('<message>'));
  finalInstance[$instances].warn = finalizeDebugger(extend('<warn>'));

  Object.defineProperties(finalInstance, {
    error: {
      configurable: true,
      enumerable: true,
      get: () => finalInstance[$instances].error
    },
    message: {
      configurable: true,
      enumerable: true,
      get: () => finalInstance[$instances].message
    },
    warn: {
      configurable: true,
      enumerable: true,
      get: () => finalInstance[$instances].warn
    }
  });

  finalInstance.extend = (...args) => extendDebugger(extend(...args));

  finalInstance.newline = () => {
    if (finalInstance.enabled) {
      if (finalInstance.log) {
        finalInstance.log('');
      } else {
        debugFactory.log('');
      }
    }
  };

  return finalInstance;
}

/**
 * Replace the `extend` method of an {@link InternalDebugger} instance with a
 * function that always throws.
 */
export function finalizeDebugger(
  instance: InternalDebugger
): UnextendableInternalDebugger {
  const unextendable = instance as UnextendableInternalDebugger;

  unextendable.extend = () => {
    throw new Error('instance is not extendable');
  };

  return unextendable;
}
