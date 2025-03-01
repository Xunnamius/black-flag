import { isNativeError } from 'node:util/types';

import { $executionContext, nullArguments$0 } from 'universe:constant.ts';

import type {
  Arguments,
  ExecutionContext,
  NullArguments,
  PreExecutionContext
} from 'universe:types/program.ts';

/**
 * Type-guard for {@link PreExecutionContext}.
 */
export function isPreExecutionContext(obj: unknown): obj is PreExecutionContext {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'execute' in obj &&
    'rootPrograms' in obj &&
    'executionContext' in obj
  );
}

/**
 * Type-guard for {@link NullArguments}.
 */
export function isNullArguments(obj: unknown): obj is NullArguments {
  return (
    isArguments(obj) &&
    obj.$0 === '<NullArguments: no parse result available due to exception>' &&
    obj._.length === 0
  );
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
    Array.isArray(obj._)
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

function assertMinimumNodeJsVersion() {
  assert(
    // ? So we don't throw in non-Nodejs runtimes
    !process ||
      !process.versions ||
      !process.versions.node ||
      satisfies(process.versions.node, packageEngines.node),
    new AssertionFailedError(
      ErrorMessage.AssertionUnsupportedNodeVersion(
        process.versions.node,
        packageEngines.node
      )
    )
  );
}
