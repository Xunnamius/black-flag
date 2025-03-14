// * These tests ensure the exported interfaces under test function as expected.

import {
  BfcErrorMessage,
  checkArrayNoConflicts,
  checkArrayNotEmpty,
  checkArrayUnique,
  checkIsNotNegative,
  checkIsNotNil
} from 'universe+checks';

const argName = 'argName';

describe('::checkIsNotNegative', () => {
  it('returns true iff argument is not negative', async () => {
    expect.hasAssertions();

    const check = checkIsNotNegative(argName);

    expect(check(0)).toBeTrue();
    expect(check(1)).toBeTrue();

    expect(check(-1)).toBe(BfcErrorMessage.OptionMustBeNonNegative(argName));
    expect(check(true)).toBe(BfcErrorMessage.OptionMustBeNonNegative(argName));
    expect(check(false)).toBe(BfcErrorMessage.OptionMustBeNonNegative(argName));
    expect(check('5')).toBe(BfcErrorMessage.OptionMustBeNonNegative(argName));
  });
});

describe('::checkIsNotNil', () => {
  it('returns true iff argument is not nil', async () => {
    expect.hasAssertions();

    const check = checkIsNotNil(argName);

    expect(check(1)).toBeTrue();
    expect(check(-1)).toBeTrue();
    expect(check(true)).toBeTrue();
    expect(check('0')).toBeTrue();
    expect(check('false')).toBeTrue();
    expect(check('null')).toBeTrue();
    expect(check('undefined')).toBeTrue();
    expect(check([])).toBeTrue();

    expect(check(0)).toBe(BfcErrorMessage.OptionMustNotBeFalsy(argName));
    expect(check(false)).toBe(BfcErrorMessage.OptionMustNotBeFalsy(argName));
    expect(check('')).toBe(BfcErrorMessage.OptionMustNotBeFalsy(argName));
    expect(check(null)).toBe(BfcErrorMessage.OptionMustNotBeFalsy(argName));
    expect(check(undefined)).toBe(BfcErrorMessage.OptionMustNotBeFalsy(argName));
  });
});

describe('::checkArrayNotEmpty', () => {
  it('returns true iff argument is a non-empty array', async () => {
    expect.hasAssertions();

    const check = checkArrayNotEmpty(argName);

    expect(check([0])).toBeTrue();
    expect(check([1, 2, 3])).toBeTrue();
    expect(check([-1])).toBeTrue();
    expect(check([true])).toBeTrue();
    expect(check(['5'])).toBeTrue();

    expect(check([])).toBe(BfcErrorMessage.OptionRequiresMinArgs(argName, 'non-empty'));

    expect(check(0)).toBe(BfcErrorMessage.BadType(argName, 'array', 'number'));
    expect(check(true)).toBe(BfcErrorMessage.BadType(argName, 'array', 'boolean'));
    expect(check(false)).toBe(BfcErrorMessage.BadType(argName, 'array', 'boolean'));
    expect(check('')).toBe(BfcErrorMessage.BadType(argName, 'array', 'string'));
    expect(check(null)).toBe(BfcErrorMessage.BadType(argName, 'array', 'object'));

    expect(check(undefined)).toBe(
      BfcErrorMessage.BadType(argName, 'array', 'undefined')
    );
  });
});

describe('::checkArrayNoConflicts', () => {
  it('returns true iff argument is an array with no conflicts', async () => {
    expect.hasAssertions();

    const check = checkArrayNoConflicts(argName, [
      [1, 2],
      ['one', 'two', 'three']
    ]);

    expect(check([0])).toBeTrue();
    expect(check([-1])).toBeTrue();
    expect(check([true])).toBeTrue();
    expect(check(['5'])).toBeTrue();
    expect(check([])).toBeTrue();
    expect(check([1, 'one', 'four', 3])).toBeTrue();

    expect(check([1, 2, 3])).toStrictEqual(
      BfcErrorMessage.OptionRequiresNoConflicts(argName, [1, 2])
    );

    expect(check([1, 'one', 2, 'two'])).toStrictEqual(
      BfcErrorMessage.OptionRequiresNoConflicts(argName, [1, 2])
    );

    expect(check([1, 'one', 0, 'two'])).toStrictEqual(
      BfcErrorMessage.OptionRequiresNoConflicts(argName, ['one', 'two', 'three'])
    );

    expect(check(0)).toBe(BfcErrorMessage.BadType(argName, 'array', 'number'));
    expect(check(true)).toBe(BfcErrorMessage.BadType(argName, 'array', 'boolean'));
    expect(check(false)).toBe(BfcErrorMessage.BadType(argName, 'array', 'boolean'));
    expect(check('')).toBe(BfcErrorMessage.BadType(argName, 'array', 'string'));
    expect(check(null)).toBe(BfcErrorMessage.BadType(argName, 'array', 'object'));

    expect(check(undefined)).toBe(
      BfcErrorMessage.BadType(argName, 'array', 'undefined')
    );
  });
});

describe('::checkArrayUnique', () => {
  it('returns true iff argument is a unique array', async () => {
    expect.hasAssertions();

    const check = checkArrayUnique(argName);

    expect(check([0])).toBeTrue();
    expect(check([1, 2, 3])).toBeTrue();
    expect(check([-1])).toBeTrue();
    expect(check([true])).toBeTrue();
    expect(check(['5'])).toBeTrue();
    expect(check([])).toBeTrue();

    expect(check([true, true])).toStrictEqual(
      BfcErrorMessage.OptionRequiresUniqueArgs(argName)
    );

    expect(check([0, 0])).toStrictEqual(
      BfcErrorMessage.OptionRequiresUniqueArgs(argName)
    );

    expect(check(['bad', 'good', 'something-else', 'bad', 0])).toStrictEqual(
      BfcErrorMessage.OptionRequiresUniqueArgs(argName)
    );

    expect(check(0)).toBe(BfcErrorMessage.BadType(argName, 'array', 'number'));
    expect(check(true)).toBe(BfcErrorMessage.BadType(argName, 'array', 'boolean'));
    expect(check(false)).toBe(BfcErrorMessage.BadType(argName, 'array', 'boolean'));
    expect(check('')).toBe(BfcErrorMessage.BadType(argName, 'array', 'string'));
    expect(check(null)).toBe(BfcErrorMessage.BadType(argName, 'array', 'object'));

    expect(check(undefined)).toBe(
      BfcErrorMessage.BadType(argName, 'array', 'undefined')
    );
  });
});
