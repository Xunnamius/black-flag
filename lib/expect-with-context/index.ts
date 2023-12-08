/* eslint-disable @typescript-eslint/no-explicit-any */

// TODO: ensure this package works with jest in ESM mode where imports like the
// TODO: following might actually be required
//import { expect } from '@jest/globals';
import type { FixedLengthArray } from 'type-fest';

const ALLOWED_MATCHERS = ['toEqual', 'toStrictEqual'] as const;

/**
 * A wrapper around of `JestExpect`.
 *
 * @see https://www.npmjs.com/package/expect
 */
export interface ContextualExpect {
  <const Details extends string[]>(
    ...args:
      | [actual: any]
      | [actual: any, ...details: FixedLengthArray<any, Details['length']>]
  ): JestExpectReturnType;
}

type JestExpectReturnType = ReturnType<typeof expect>;

/**
 * This function returns a `ContextualExpect` function, which is a wrapper
 * around the `JestExpect` function (e.g. `expect(...).toBe(...)`). This wrapper
 * executes identically to the `JestExpect` version unless called with
 * additional arguments; these arguments are automatically mapped to their
 * contextual descriptions when the expectation fails. For example:
 *
 * ```typescript
 * import { fnThatLogsDifferentStuff } from '..';
 *
 * const expect = makeExpect('spy calls', [
 *   'failing test index',
 *   'parameters used',
 *   'spy type'
 * ]);
 *
 * const logSpy = jest.spyOn(console, 'log');
 * const warnSpy = jest.spyOn(console, 'warn');
 *
 * const paramsUnderTest = [[], [true], [true, 5]];
 *
 * await Promise.all(paramsUnderTest.map(async (params, index) => {
 *   await fnThatLogsDifferentStuff(...params);
 *
 *   // We expect console.log to be called once per invocation
 *   expect(logSpy.mock.calls, index, params, 'log').toStrictEqual([
 *     expect.any(Array)
 *   ]);
 *
 *   // We expect console.warn to be called twice per invocation
 *   expect(warnSpy.mock.calls, index, params, 'warn').toStrictEqual([
 *     expect.any(Array),
 *     expect.any(Array)
 *   ]);
 *
 *   logSpy.mockClear();
 *   warnSpy.mockClear();
 * });
 * ```
 *
 * The only difference in output between `JestExpect` and `ContextualExpect` is
 * when expectations fail. In the example above, if the expectation fails (e.g.
 * `console.log` wasn't called at all), the error will be reported like so:
 *
 * ```diff
 * Error: expect(received).toStrictEqual(expected) // deep equality
 *
 * - Expected  - 3
 * + Received  + 1
 *
 *   Object {
 *     "failing test index": 2,
 *     "parameters used": [true, 5],
 *     "spy type": "log",
 * -   "spy calls": Array [
 * -     Any<Array>,
 * -   ],
 * +   "spy calls": Array [],
 *   }
 * ```
 *
 * Not only do you get the familiar diff between the actual and expected
 * invocations of the spy, which you'd already get with vanilla `JestExpect`,
 * but you also get a slice of the surrounding context: the test index, the
 * params passed, the spy being a "log" spy, etc.
 */
export function makeExpect<const Details extends string[]>(
  subject: string,
  details?: Details
): ContextualExpect;
/**
 * This function returns a `ContextualExpect` function, which is a wrapper
 * around the `JestExpect` function (e.g. `expect(...).toBe(...)`). This wrapper
 * executes identically to the `JestExpect` version unless called with
 * additional arguments; these arguments are automatically mapped to their
 * contextual descriptions when the expectation fails. For example:
 *
 * ```typescript
 * import { fnThatLogsDifferentStuff } from '..';
 *
 * const expect = makeExpect('spy calls', [
 *   'failing test index',
 *   'parameters used',
 *   'spy type'
 * ]);
 *
 * const logSpy = jest.spyOn(console, 'log');
 * const warnSpy = jest.spyOn(console, 'warn');
 *
 * const paramsUnderTest = [[], [true], [true, 5]];
 *
 * await Promise.all(paramsUnderTest.map(async (params, index) => {
 *   await fnThatLogsDifferentStuff(...params);
 *
 *   // We expect console.log to be called once per invocation
 *   expect(logSpy.mock.calls, index, params, 'log').toStrictEqual([
 *     expect.any(Array)
 *   ]);
 *
 *   // We expect console.warn to be called twice per invocation
 *   expect(warnSpy.mock.calls, index, params, 'warn').toStrictEqual([
 *     expect.any(Array),
 *     expect.any(Array)
 *   ]);
 *
 *   logSpy.mockClear();
 *   warnSpy.mockClear();
 * });
 * ```
 *
 * The only difference in output between `JestExpect` and `ContextualExpect` is
 * when expectations fail. In the example above, if the expectation fails (e.g.
 * `console.log` wasn't called at all), the error will be reported like so:
 *
 * ```diff
 * Error: expect(received).toStrictEqual(expected) // deep equality
 *
 * - Expected  - 3
 * + Received  + 1
 *
 *   Object {
 *     "failing test index": 2,
 *     "parameters used": [true, 5],
 *     "spy type": "log",
 * -   "spy calls": Array [
 * -     Any<Array>,
 * -   ],
 * +   "spy calls": Array [],
 *   }
 * ```
 *
 * Not only do you get the familiar diff between the actual and expected
 * invocations of the spy, which you'd already get with vanilla `JestExpect`,
 * but you also get a slice of the surrounding context: the test index, the
 * params passed, the spy being a "log" spy, etc.
 */
export function makeExpect<const Details extends string[]>(
  details?: Details
): ContextualExpect;
export function makeExpect<const Details extends string[]>(
  ...args: [subject: string, details?: Details] | [details?: Details]
): ContextualExpect {
  const subject = typeof args[0] === 'string' ? args[0] : 'subject';
  const details = Array.isArray(args[0]) ? args[0] : args[1] || ([] as string[]);
  let counter = 0;

  return (actual, ...parameters) => {
    const runExpectNormally = !parameters.length;

    const context = Object.fromEntries(
      parameters.map((parameter, index) => [
        details[index] || `context-${++counter}`,
        parameter
      ])
    );

    return runExpectNormally
      ? expect(actual)
      : wrapJestExpect(
          expect({
            ...context,
            [subject]: actual
          })
        );

    function wrapJestExpect<
      T extends
        | JestExpectReturnType
        | JestExpectReturnType['not']
        | JestExpectReturnType['resolves']
        | JestExpectReturnType['rejects']
    >(expectation: T, lastMatcher?: 'not' | 'resolves' | 'rejects'): T {
      return new Proxy(expectation, {
        get(target, property) {
          const value: unknown =
            // @ts-expect-error: TypeScript isn't smart enough to figure this out
            target[property];

          if (
            lastMatcher !== 'not' &&
            (property === 'not' ||
              (lastMatcher !== 'resolves' &&
                lastMatcher !== 'rejects' &&
                (property === 'resolves' || property === 'rejects')))
          ) {
            return wrapJestExpect(
              (expectation as ReturnType<typeof expect>)[property],
              property
            );
          }

          if (value instanceof Function) {
            if (typeof property === 'string' && property.startsWith('to')) {
              if (ALLOWED_MATCHERS.includes(property as any)) {
                return function (expected: any) {
                  // ? "this-recovering" code
                  return value.call(target, {
                    ...context,
                    [subject]: expected
                  });
                };
              } else {
                throw new TypeError(
                  `only the following jest matchers are allowed here: ${ALLOWED_MATCHERS.join(
                    ', '
                  )}`
                );
              }
            }

            return function (...args: any[]) {
              // ? "this-recovering" code
              return value.apply(target, args);
            };
          }

          return value;
        }
      });
    }
  };
}

// TODO: Default expectation failures in jest do not allow for custom error
// TODO: messages. This lack of relevant context makes debugging harder and
// TODO: hobbles developer momentum. A failing expectation coupled with a decent
// TODO: error message, e.g. jest-expect-message, is an improvement. A failing
// TODO: expectation that provides _an entire relevant context_ without putting
// TODO: a crimp in your DX is the solution.

// TODO: Document features:

// TODO: const expect = makeExpect(W, [Y, Z]); expect(Xw) is normal even if
// TODO: the expected details are not passed as args. In such cases, they are
// TODO: dropped from consideration (shown as undefined). expect(Xw, Xy),
// TODO: expect(Xw, Xy, Xz), expect(Xw, undefined, Xz), etc all work as expected

// TODO: expect(Xw) being normal means all matchers are allowed. It's exactly
// TODO: the same as a normal JestExpect invocation. Nothing changes.

// TODO: only a handful of matchers make sense when using ContextualExpect,
// TODO: e.g. expect(Xw, Xy). Therefore, non-whitelisted matchers are not
// TODO: allowed. You won't miss them. Use async matchers instead. Whitelisted
// TODO: matchers are: toEqual, toStrictEqual, not.toEqual, not.toStrictEqual

// TODO: test works with not, resolves, rejects
// TODO: test resolves.not, rejects.not, not.not, rejects.rejects, etc fails
