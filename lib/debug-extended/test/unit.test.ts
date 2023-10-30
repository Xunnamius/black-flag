import { debug as oldDebug } from 'debug';

import {
  $instances,
  debugFactory,
  extendDebugger,
  finalizeDebugger
} from 'multiverse/debug-extended/index';

// TODO: update paths to use proper alias names
import { expectExtendedDebugger, expectUnextendableDebugger } from './helpers';

const factoryLogFn = jest.fn();
debugFactory.log = factoryLogFn;

describe('::debugFactory', () => {
  it('returns ExtendedDebugger instances', async () => {
    expect.hasAssertions();
    expectExtendedDebugger(debugFactory('namespace'));
  });
});

describe('::extendDebugger', () => {
  it('returns an extended instance with expected properties and methods', async () => {
    expect.hasAssertions();

    const debug = oldDebug('namespace');
    const extended = extendDebugger(debug);

    expectExtendedDebugger(extended);
  });
});

describe('::finalizeDebugger', () => {
  it('returns a finalized instance with expected properties and methods', async () => {
    expect.hasAssertions();

    const debug = oldDebug('namespace');
    const finalized = finalizeDebugger(debug);

    expectUnextendableDebugger(finalized);
  });
});

describe('::ExtendedDebugger', () => {
  describe('::extend', () => {
    it('returns an instance with expected properties and methods', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');
      const extended = debug.extend('extended');

      expectExtendedDebugger(extended);
    });
  });

  describe('::newline', () => {
    it('calls internal logger function with empty string', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');
      const logFn = (debug.log = jest.fn());

      debug.enabled = true;
      debug.newline();

      expect(logFn.mock.calls).toStrictEqual([['']]);
      expect(factoryLogFn.mock.calls).toStrictEqual([]);
    });

    it('calls debugFactory.log with empty string if debug.log not set', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');

      debug.enabled = true;
      debug.log = undefined;
      debug.newline();

      expect(factoryLogFn.mock.calls).toStrictEqual([['']]);
    });

    it('calls nothing if instance is not enabled', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');
      const logFn = (debug.log = jest.fn());

      debug.newline();

      expect(logFn.mock.calls).toStrictEqual([]);
      expect(factoryLogFn.mock.calls).toStrictEqual([]);
    });
  });

  describe('::[$instances] (and named convenience methods)', () => {
    it('returns all sub-instances attached to the current instance', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');
      const extended = debug.extend('namespace');
      const { $log: log, message, warn, error, ...rest } = debug[$instances];

      expect(rest).toStrictEqual({});
      expect(log).toBe(debug);

      expectUnextendableDebugger(message);
      expectUnextendableDebugger(warn);
      expectUnextendableDebugger(error);

      expectUnextendableDebugger(extended.message);
      expectUnextendableDebugger(extended.warn);
      expectUnextendableDebugger(extended.error);
    });
  });
});
