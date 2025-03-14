import { BfcErrorMessage } from 'universe+checks:error.ts';

export { BfcErrorMessage };

/**
 * A Black Flag check that passes when an argument value is a non-negative
 * number.
 */
export function checkIsNotNegative(argName: string) {
  return function (currentArg: unknown) {
    return (
      (typeof currentArg === 'number' && currentArg >= 0) ||
      BfcErrorMessage.OptionMustBeNonNegative(argName)
    );
  };
}

/**
 * A Black Flag check that passes when an argument value is not falsy.
 */
export function checkIsNotNil(argName: string) {
  return function (currentArg: unknown) {
    return !!currentArg || BfcErrorMessage.OptionMustNotBeFalsy(argName);
  };
}

/**
 * A Black Flag check that passes when each member of an array-type argument
 * is a non-empty non-nullish value and the array itself is non-empty.
 */
export function checkArrayNotEmpty(argName: string, adjective = 'non-empty') {
  return function (currentArg: unknown) {
    if (!Array.isArray(currentArg)) {
      return BfcErrorMessage.BadType(argName, 'array', typeof currentArg);
    }

    const satisfies = currentArg.every(
      (subArg) =>
        (typeof subArg !== 'string' && subArg !== null && subArg !== undefined) ||
        (typeof subArg === 'string' && subArg.length > 0)
    );

    return (
      (currentArg.length > 0 && satisfies) ||
      BfcErrorMessage.OptionRequiresMinArgs(argName, adjective)
    );
  };
}

/**
 * A Black Flag check that passes when at most only one element from each
 * `conflict` tuple is present in the array.
 */
export function checkArrayNoConflicts(argName: string, conflicts: unknown[][]) {
  return function (currentArg: unknown) {
    if (!Array.isArray(currentArg)) {
      return BfcErrorMessage.BadType(argName, 'array', typeof currentArg);
    }

    let conflictingTuple: unknown[] = [];

    return (
      conflicts.every((tuple) => {
        let includesOne = false;

        return tuple.every((element) => {
          if (currentArg.includes(element)) {
            if (includesOne) {
              conflictingTuple = tuple;
              return false;
            }

            includesOne = true;
          }

          return true;
        });
      }) || BfcErrorMessage.OptionRequiresNoConflicts(argName, conflictingTuple)
    );
  };
}

/**
 * A Black Flag check that passes when each element in the array is unique.
 */
export function checkArrayUnique(argName: string) {
  return function (currentArg: unknown) {
    if (!Array.isArray(currentArg)) {
      return BfcErrorMessage.BadType(argName, 'array', typeof currentArg);
    }

    const satisfies_ = Array.from(new Set(currentArg)).length === currentArg.length;

    return satisfies_ || BfcErrorMessage.OptionRequiresUniqueArgs(argName);
  };
}
